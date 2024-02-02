import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server.js';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { token } = req.nextauth;

    if (token?.error) {
      console.log('token error in middleware');
    } else {
      console.log('middleware withAuth:', req.url);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
    callbacks: {
      authorized: ({ token }) => {
        if (token === null) {
          return false;
        }

        const authorized = !token.error;
        console.log('authorized:', token, authorized);
        return authorized;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico).*)'],
};
