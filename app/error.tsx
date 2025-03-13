'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Server Error",
  description: "An unexpected error occurred on the server.",
};

const Error500 = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
    <Image
      src="/error500.png"
      className="w-48 sm:w-64 h-auto"
      draggable={false}
      alt="Server Error"
      loading="lazy"
      width={200}
      height={200}
    />
    <div className="mt-6 flex flex-col items-center gap-6">
      <h1
        className="text-4xl font-semibold text-slate-800"
        aria-label="Error 500 - Server Issue"
      >
       Service Unavailable!
      </h1>
      <Link href="/">
        <Button className=" px-4 flex items-center gap-2"> <ChevronLeft className="w-3" /> Back To Home</Button>
      </Link>
    </div>
  </main>
  );
};

export default Error500;
