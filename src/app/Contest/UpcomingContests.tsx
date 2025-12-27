'use client';
import React, { useState } from 'react';
import { Card, CardBody, Button, Badge, Divider, Tabs, Tab } from '@heroui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const upcomingContests = [
  {
    title: 'Weekly Contest 481',
    time: 'Sunday 9:30 AM GMT+7',
    countdown: 'Starts in 4d 3h 57m 28s',
    image: 'https://assets.leetcode.com/contest-config/weekly-contest-482/contest_detail/card_img_e222.png',
  },
  {
    title: 'Biweekly Contest 172',
    time: 'Saturday 9:30 PM GMT+7',
    countdown: 'Starts in 3d 15h 57m 28s',
    image: 'https://assets.leetcode.com/contest-config/weekly-contest-482/contest_detail/card_img_e222.png',
  },
];

const pastContests = [
  { title: 'Weekly Contest 480', date: 'Dec 14, 2025 9:30 AM GMT+7', virtual: true },
  { title: 'Weekly Contest 479', date: 'Dec 7, 2025 9:30 AM GMT+7', virtual: true },
  { title: 'Biweekly Contest 171', date: 'Dec 6, 2025 9:30 PM GMT+7', virtual: true },
  { title: 'Weekly Contest 478', date: 'Nov 30, 2025 9:30 AM GMT+7', virtual: true },
  { title: 'Weekly Contest 477', date: 'Nov 23, 2025 9:30 AM GMT+7', virtual: true },
];

const globalRanking = [
  { rank: 1, name: 'Miruu', rating: 3703, attended: 26, crown: 'gold' },
  { rank: 2, name: 'Neal Wu us', rating: 3686, attended: 51, crown: 'silver' },
  { rank: 3, name: 'Yawn_Sean', rating: 3645, attended: 84, crown: 'bronze' },
  { rank: 4, name: '小羊肖恩 CN', rating: 3611, attended: 107 },
  { rank: 5, name: '何迦 CN', rating: 3599, attended: 146 },
  { rank: 6, name: 'Joshua Chen AU', rating: 3589, attended: 100 },
  { rank: 7, name: 'Rohin Garg', rating: 3506, attended: 88 },
];

export default function ContestsPage() {
  const [selectedTab, setSelectedTab] = useState('my');
const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* Upcoming Contests */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingContests.map((contest) => (
                <Card key={contest.title} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="relative">
                    <Image
                      src={contest.image}
                      alt={contest.title}
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                      {contest.countdown}
                    </div>
                  </div>
                  <CardBody className="pt-4">
                    <h3 className="text-lg font-bold text-gray-900">{contest.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{contest.time}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <Divider className="bg-gray-300" />

          {/* Tabs My Contests / Past Contests - Đã sửa style cho đẹp hơn, giống LeetCode thật */}
          <div>
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              aria-label="Contest tabs"
              radius="full"
              classNames={{
                cursor: "bg-white shadow-md",
                tab: "px-6 py-2 font-medium text-gray-700 data-[selected=true]:text-gray-900 data-[hover-unselected=true]:bg-gray-200/50",
                tabContent: "group-data-[selected=true]:font-bold",
              }}
            >
              <Tab key="my" title="My Contests">
                <div className="mt-6">
                  <Card className="border border-gray-200">
                    <CardBody className="text-center py-16">
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Join LeetCode Contests</h3>
                        <p className="text-gray-600 text-sm">
                          Register or log in to view your personalized contest information
                        </p>
                      </div>
                      <Button color="success" size="lg" className="font-medium">
                        Register or Log in
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="past" title="Past Contests">
  <div className="mt-6 space-y-4">
    {pastContests.map((contest) => (
      <Card
        key={contest.title}
        className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      >
        <CardBody>
          <div className="flex items-center">
            {/* Left: Image with dark overlay logo */}
            <div className="relative h-32">
            
              <Image
                src="https://assets.leetcode.com/contest-config/weekly-contest-482/contest_detail/card_img_e222.png"
                alt={contest.title}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-l-lg"
              />
            </div>

            {/* Right: Info */}
            <div className="flex-1 px-6 py-8">
              <h4 className="text-lg font-semibold text-gray-900">
                {contest.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {contest.date}
              </p>
              {contest.virtual && (
                <div onClick={() => router.push(`/Contest/weekly-contest-482`)} className="mt-4">
                  <Badge color="secondary" variant="flat">
                    Click to test link
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    ))}
  </div>
</Tab>
            </Tabs>
          </div>
        </div>

        {/* Right Column: Global Ranking */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardBody className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Global Ranking
              </h2>

              <div className="space-y-5">
                {globalRanking.map((user) => (
                  <div key={user.rank} className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-500 w-8">{user.rank}</div>
                    <div className="relative w-12 h-12">
                      <div className="w-full h-full bg-gray-200 rounded-full border-2 border-white shadow-md" />
                      {user.crown === 'gold' && <div className="absolute -top-2 -right-2 text-2xl">👑</div>}
                      {user.crown === 'silver' && <div className="absolute -top-2 -right-2 text-2xl">🥈</div>}
                      {user.crown === 'bronze' && <div className="absolute -top-2 -right-2 text-2xl">🥉</div>}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">
                        Rating: {user.rating} | Attended: {user.attended}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}