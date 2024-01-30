import { CustomSession } from '@types';
import axios, { AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

const createClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    timeout: 3000,
  });

  let lastSession: CustomSession | null = null;

  client.interceptors.request.use(
    async request => {
      if (lastSession == null || Date.now() > Date.parse(lastSession.expires)) {
        lastSession = await getSession();
      }

      if (lastSession) {
        request.headers.Authorization = `Bearer ${lastSession.accessToken}`;
      } else {
        request.headers.Authorization = undefined;
      }

      return request;
    },
    error => {
      console.error('Api request error:', error);
      throw error;
    }
  );

  client.interceptors.response.use(
    response => {
      return response;
    },
    (error: AxiosError) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        // window.location.href = '/';
      }
      console.log('Api response error:', error);
    }
  );

  return client;
};

export default createClient;
