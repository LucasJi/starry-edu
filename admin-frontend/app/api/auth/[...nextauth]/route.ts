import { CustomSession } from '@types';
import NextAuth from 'next-auth';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const handler = NextAuth({
  debug: true,
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    {
      id: 'starry',
      name: 'starry-client',
      type: 'oauth',
      client: {
        client_id: process.env.STARRY_CLIENT_ID,
        client_secret: process.env.STARRY_CLIENT_SECRET,
        token_endpoint_auth_method: 'client_secret_post',
      },
      wellKnown:
        process.env.NEXT_PUBLIC_IDP_URL + '/.well-known/openid-configuration',
      authorization: { params: { scope: 'openid userinfo' } },
      idToken: true,
      checks: ['pkce'],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  cookies: {
    pkceCodeVerifier: {
      name: 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
  callbacks: {
    // Custom jwt to add access_token from idp
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at,
          refreshToken: account.refresh_token,
          user,
        };
      }

      const now = Date.now();
      const accessTokenExpires = token.accessTokenExpires as number;

      if (now < accessTokenExpires * 1000) {
        console.log(
          'not expires, now:',
          now,
          'accessTokenExpires:',
          accessTokenExpires
        );
        return token;
      }

      // console.log('expires', now, accessTokenExpires);
      return {
        ...token,
        error: 'TokenExpiredError',
      };
    },
    // Since jwt is customized, session should be customized too.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    async session({ session, token }): Promise<CustomSession> {
      if (token) {
        return {
          ...session,
          user: token.user,
          accessToken: token.accessToken,
        } as CustomSession;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
