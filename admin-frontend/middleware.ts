import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server.js';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { token } = req.nextauth;

    if (token?.error) {
      console.log('token error in middleware');
    } else {
      console.log('middleware withAuth:', req);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token?.error) {
          console.log('token error:', token);
          return false;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/edu/:path*'],
};
