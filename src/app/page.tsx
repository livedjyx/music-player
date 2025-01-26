'use client';

import dynamic from 'next/dynamic';

const ClientPage = dynamic(
  () => import('@/components/ClientPage').then((mod) => mod.default),
  { ssr: false }
);

export default function Home() {
  return <ClientPage />;
}