'use client';

import Navbar from '@/app/components/layout/Navbar';

export default function TestNavbarPage() {
  return (
    <div>
      <Navbar />
      <div className="mt-20 p-6">
        <h1 className="text-2xl font-bold">صفحة تجريب Navbar فقط</h1>
      </div>
    </div>
  );
}
