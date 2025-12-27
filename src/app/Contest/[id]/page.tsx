'use client';

import React from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Contest } from '@/types';

// Dữ liệu giả lập - sau này có thể fetch từ API dựa trên id
const contestData: Record<string, Contest> = {
  'weekly-contest-482': {
    title: 'Weekly Contest 482',
    date: 'Sun, Dec 28, 09:30 GMT+07:00',
    countdown: 'Starts in 16:56:04',
    description: 'Welcome to the 482nd LeetCode Weekly Contest\n\nThis LeetCode contest is sponsored by LeetCode.',
    prizes: [
      'Contestants ranked 1st - 3rd will win a LeetCode Backpack',
      'Contestants ranked 4th - 10th will win a LeetCode Water Bottle',
      'Contestants ranked 82nd, 482nd, 1024th, 1377th, and 2048th will win a LeetCode Big O Notebook',
    ],
    eligibility: 'Only LCUS (leetcode.com) accounts are eligible for the bonus rewards. After the ranking is finalized, a LeetCode team member will reach out to you through email regarding the gift.',
    bannerImage: 'https://assets.leetcode.com/contest-config/weekly-contest-482/contest_detail/card_img_e222.png', // thay bằng ảnh thật nếu có
  },
  // Thêm các contest khác nếu cần
};

export default function ContestDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const contest = contestData[id] || contestData['weekly-contest-482']; // fallback nếu id không tồn tại

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-orange-500 mb-4">
            {contest.title}
          </h1>
          <p className="text-xl text-gray-600">
            {contest.date} <span className="text-green-600">• {contest.countdown}</span>
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              size="lg"
              className="bg-orange-100 text-orange-600 font-medium rounded-full px-8 py-3 hover:bg-orange-200"
            >
              Register
            </Button>
            <Button size="lg" variant="light" isIconOnly className="rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Button>
            <Button size="lg" variant="light" isIconOnly className="rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Banner Image (nếu có) */}
        {contest.bannerImage && (
          <div className="my-12 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={contest.bannerImage}
              alt={contest.title}
              width={1200}
              height={400}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Description */}
        <Card className="mb-12">
          <CardBody className="prose max-w-none text-gray-700">
            {contest.description.split('\n').map((line: string, i: number) => (
              <p key={i} className={line ? 'mb-4' : 'mb-8'}>
                {line || <br />}
              </p>
            ))}
          </CardBody>
        </Card>

        {/* Bonus Prizes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-3xl">⭐</span> Bonus Prizes
          </h2>
          <ul className="space-y-4 text-gray-700">
            {contest.prizes.map((prize: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 mt-1">•</span>
                <span>{prize}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 mt-8 italic">
            {contest.eligibility}
          </p>
        </div>
      </div>
    </div>
  );
}