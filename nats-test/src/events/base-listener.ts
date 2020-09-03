import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  // Name of the channel this listener is going to listen to
  abstract subject: T['subject'];
  // Name of the queue group this listener will join
  abstract queueGroupName: string;
  // Function to run when a message is received
  abstract onMessage(data: T['data'], msg: Message): void;
  // Pre-initialized NATS client
  private client: Stan;

  // Number of seconds this listener has to ack a message
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  // Default subscription options
  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // Acknowledge if the process is success or failure
        // Make sure msg.act() is called if set true, otherwise the server
        // would timeout it and resend the msg
        .setManualAckMode(true)
        // Redeliver all events when restarting listener
        .setDeliverAllAvailable()
        // make sure not to erronoeously reprocess events which has been delivered
        .setDurableName(this.queueGroupName)
        .setAckWait(this.ackWait)
    );
  }

  // set up the subscription
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      // make sure even if we temporarily disconnect
      // with all subscriptions with this durable name
      // it will not dump the entire durable subscription
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `#${msg.getSequence()} Message Received:  ${this.subject} / ${
          this.queueGroupName
        }`
      );
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  // Helper function to parse a message
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
