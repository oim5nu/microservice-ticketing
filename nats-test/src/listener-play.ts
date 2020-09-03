import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listner connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    // Acknowledge if the process is success or failure
    // Make sure msg.act() is called if set true, otherwise the server
    // would timeout it and resend the msg
    .setManualAckMode(true)
    // Redeliver all events when restarting listener
    .setDeliverAllAvailable()
    // make sure not to erronoeously reprocess events which has been delivered
    .setDurableName('order-service');

  const subscription = stan.subscribe(
    'ticket:created',
    // make sure even if we temporarily disconnect
    // with all subscriptions with this durable name
    // it will not dump the entire durable subscription
    'orders-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data == 'string') {
      console.log(
        `Received event #${msg.getSequence()}, with data: ${JSON.stringify(
          JSON.parse(data),
          null,
          2
        )}`
      );
    }

    msg.ack();
  });
});

// restart process or CTRL-C
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
