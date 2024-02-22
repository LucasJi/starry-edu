'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { status } = useSession();

  console.log(status);

  return (
    <div>
      {status}
      <br />
      <Link href="/edu/admin/home">Admin</Link>
      <br />
      <Link href="/edu/member">Member</Link>
    </div>
  );
}
