import createClient from './client.ts';

const api = createClient(`${process.env.NEXT_PUBLIC_IDP_URL}`);

const login = (username: string, password: string, nonceId: string) =>
  api.post(
    '/login',
    {
      username,
      password,
    },
    {
      headers: {
        nonceId: nonceId,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

const authApis = {
  login,
};

export default authApis;
