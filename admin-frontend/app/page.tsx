'use client';

import { Button } from 'antd';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation.js';
import { useLayoutEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // if (status === 'loading') {
  //   return <div>Loading...Please refresh...</div>;
  // }

  // if (session?.user) {
  //   router.push('/edu/home');
  // }

  // TODO: User can choose which system to use
  useLayoutEffect(() => {
    if (session?.user) {
      router.push('/edu/home');
    }
  }, [session]);

  return (
    <>
      Not signed in <br />
      <Button onClick={() => signIn('starry')}>
        Sign In with Starry Account
      </Button>
    </>
  );
}
