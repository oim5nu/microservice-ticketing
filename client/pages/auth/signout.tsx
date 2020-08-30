import { useEffect } from 'react';
import router from 'next/router';
import useRequest from '../../hooks/use-request';

export default function Signout() {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/'),
    onFailure: () => {},
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing you out...</div>;
}
