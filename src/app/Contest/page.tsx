'use client';

import React from 'react';
import UpcomingContests from './UpcomingContests';

export default function ContestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="text-8xl mb-6">🏆</div>
            <h1 className="text-5xl font-bold mb-4">DMOJ Contest</h1>
            <p className="text-xl text-gray-400">Contest every week. Compete and see your ranking!</p>
          </div>
          <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-full text-sm font-medium transition">
            🎁 Unbox surprise
          </button>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid  gap-12">
          {/* Left: Upcoming + Past */}
          <div className="lg:col-span-2">
            <UpcomingContests />
          </div>

        </div>
      </div>
    </div>
  );
}