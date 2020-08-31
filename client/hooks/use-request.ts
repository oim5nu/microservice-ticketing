import axios from 'axios';
import { useState } from 'react';
//import { FormStatus } from '../common/common-types';

const useRequest = ({ url, method, body, onSuccess, onFailure }) => {
  const [errors, setErrors] = useState(null);
  const [status, setStatus] = useState(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
        setStatus(response.status);
      }

      return response.data;
    } catch (error) {
      setErrors(error.response.data.errors);
      setStatus(error.response.status);
      if (onFailure) {
        onFailure(error.response.data.errors);
      }
    }
  };

  return { doRequest, errors, status };
};

export default useRequest;
