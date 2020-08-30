import axios from 'axios';
import { useState } from 'react';
//import { FormStatus } from '../common/common-types';

export default function useRequest({ url, method, body, onSuccess, onFailure } ) {
  const [errors, setErrors] = useState(null);

  const doRequest = async () =>  {
    try {
      const response = await axios[method](url, body);
      
      if(onSuccess) {
        onSuccess(response.data);
      }

      return response.data;

    } catch(error) {
      setErrors(error.response.data.errors);
      if(onFailure) {
        onFailure(error.response.data.errors);
      }
    }
  };

  return { doRequest, errors };
}