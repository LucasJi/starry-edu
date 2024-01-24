import { CustomSession } from '@types';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  try {
    const url =
      process.env.STARRY_TOKEN_URL +
      '?' +
      new URLSearchParams({
        client_id: process.env.STARRY_CLIENT_ID as string,
        client_secret: process.env.STARRY_CLIENT_SECRET as string,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      });

    console.log('try to refresh access token', url);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    if (response.status !== 200) {
      console.log('refresh access token failed', await response.text());
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }

    const refreshedTokens = await response.json();

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log('error occurs when refreshing access token:', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const handler = NextAuth({
  debug: true,
  pages: {
    signIn: '/',
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
      // wellKnown: 'http://49.234.53.94:31000/.well-known/openid-configuration',
      authorization: { params: { scope: 'openid userinfo edu' } },
      idToken: true,
      checks: ['pkce'],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
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
    // @ts-expect-error
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
    // @ts-expect-error
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
