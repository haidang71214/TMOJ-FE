'use client';

import React from 'react';
import { Card, CardBody, Button, Badge, Divider } from '@heroui/react';
import Image from 'next/image';

const upcomingContests = [
  {
    title: 'Weekly Contest 481',
    time: 'Sunday 9:30 AM GMT+7',
    countdown: 'Starts in 4d 3h 57m 28s',
    image: '/contest-weekly.png',
    type: 'weekly',
  },
  {
    title: 'Biweekly Contest 172',
    time: 'Saturday 9:30 PM GMT+7',
    countdown: 'Starts in 3d 15h 57m 28s',
    image: '/contest-biweekly.png',
    type: 'biweekly',
  },
];

const pastContests = [
  { title: 'Weekly Contest 480', date: 'Dec 14, 2025 9:30 AM GMT+7', virtual: true },
  { title: 'Weekly Contest 479', date: 'Dec 7, 2025 9:30 AM GMT+7', virtual: true },
  { title: 'Biweekly Contest 171', date: 'Dec 6, 2025 9:30 PM GMT+7', virtual: true },
  { title: 'Weekly Contest 478', date: 'Nov 30, 2025 9:30 AM GMT+7', virtual: true },
  { title: 'Weekly Contest 477', date: 'Nov 23, 2025 9:30 AM GMT+7', virtual: true },
];

export default function UpcomingContests() {
  return (
    <div className="space-y-12">
      {/* Upcoming Contests - 2 cột grid */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingContests.map((contest) => (
            <Card key={contest.title} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <Image
                  src={contest.image}
                  alt={contest.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover" // Giảm chiều cao ảnh xuống còn h-48 (trước là ~300px)
                />
                <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm">
                  <span className="text-xl">⏰</span>
                  <span className="font-medium">{contest.countdown}</span>
                </div>
              </div>
              <CardBody className="pt-4 bg-white">
                <h3 className="text-lg font-bold text-gray-900">{contest.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{contest.time}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <Divider className="bg-gray-300" />

      {/* Past Contests - Nằm dọc */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Past Contests</h2>
          <Button variant="light" size="sm">
            Sponsor a Contest
          </Button>
        </div>

        <div className="space-y-4">
          {pastContests.map((contest) => (
            <Card key={contest.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardBody className="flex items-center gap-4 py-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={contest.title.includes('Biweekly') ? '/contest-biweekly.png' : '/contest-weekly.png'}
                    alt={contest.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{contest.title}</h4>
                  <p className="text-sm text-gray-600">{contest.date}</p>
                </div>
                {contest.virtual && (
                  <Badge color="secondary" variant="flat">
                    Virtual
                  </Badge>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}