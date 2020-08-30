import buildClient from '../api/build-client';
import { NextPageContext } from 'next';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context: NextPageContext) => {
  console.log('LandingPage');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  console.log('data in LandingPage', data);
  return data;
};

export default LandingPage;
