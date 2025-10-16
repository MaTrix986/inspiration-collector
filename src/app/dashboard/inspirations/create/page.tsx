'use client';

import InspirationForm from '@/components/inspiration-form';

export default function CreateInspirationPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <InspirationForm />
        </div>
      </div>
    </div>
  );
}