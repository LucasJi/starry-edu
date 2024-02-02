'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { status } = useSession();

  console.log(status);

  return (
    <>
      {status}
      <Link href="/edu/home" />
    </>
  );
}
