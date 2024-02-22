'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { status } = useSession();

  console.log(status);

  return (
    <div>
      {status}
      <Link href="/edu/admin/home">Admin</Link>
      <Link href="/edu/member">Member</Link>
    </div>
  );
}
