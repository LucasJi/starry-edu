'use client';

import { LoadingOutlinedSpin } from '@component';
import { CustomSession } from '@types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const session = data as CustomSession;
      const { user } = session;

      if (user?.role === 'admin') {
        router.push('/edu/admin/home');
      } else {
        router.push('/edu/member');
      }
    }
  }, [status, data]);

  return (
    <div className="w-full h-screen flex">
      <LoadingOutlinedSpin />
    </div>
  );
}
