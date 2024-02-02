'use client';
import { useRouter } from 'next/navigation';
import { FC, useLayoutEffect } from 'react';

const Home: FC = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.push('/edu/admin/home');
  }, []);

  return (
    <div>
      <div className="bg-amber-200">This is member page</div>
    </div>
  );
};

export default Home;
