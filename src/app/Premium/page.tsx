"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Badge,
  Spacer,
} from "@heroui/react";

export default function PremiumPage() {
  const features = [
    {
      icon: "🚀",
      title: "Ask Leet",
      badge: "New",
      description:
        "Your coding agent — brainstorm solutions, optimize code, generate test cases, and debug. Premium members get 500 extra monthly credits to unlock the most advanced models.",
    },
    {
      icon: "⚡",
      title: "Lightning Judge",
      description:
        "Premium gives you priority judging — up to 10× faster during peak hours — so you can stay ahead in your interview prep.",
    },
    {
      icon: "</>",
      title: "Autocomplete",
      description:
        "Get smart code autocompletion based on your language and code — no memorization needed.",
    },
    {
      icon: "🎭",
      title: "Interview Simulations",
      description:
        "Practice under pressure with mock assessments. Choose a company, get a timed question, and test your skills.",
    },
    {
      icon: "∞",
      title: "Unlimited Playgrounds",
      description:
        "No more limits — create unlimited Playgrounds and keep them organized.",
    },
    {
      icon: "📊",
      title: "Company-Specific Interview Questions",
      description:
        "Practice smarter with real questions from top companies. Sort by role, time, or frequency to focus on what matters most for your prep.",
    },
    {
      icon: "🔒",
      title: "Access to Premium Content",
      description:
        "Gain exclusive access to our ever-growing collection of premium content, such as questions, Explore cards, and premium solutions like this.",
    },
    {
      icon: "🐛",
      title: "Debugger",
      description:
        "Done with print debugging? Set breakpoints and debug interactively in our editor.",
    },
    {
      icon: "☁️",
      title: "Cloud Storage",
      description:
        "Code and layouts are instantly saved to the cloud, ensuring you can learn across devices at ease.",
    },
    {
      icon: "💎",
      title: "Additional Discounts",
      description: "Enjoy significant discounts on select items/content.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#071739] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-[#071739] dark:text-white uppercase tracking-tighter">
            Premium<span className="text-[#FFB800]">.</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 font-medium">
            Get started with a TMOJ Subscription that works for you.
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-24">
          {/* Monthly Plan */}
          <Card className="border border-gray-100 dark:border-[#474F5D] shadow-sm bg-white dark:bg-[#282E3A] rounded-[2rem]">
            <CardHeader className="flex flex-col items-start p-8">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">
                Monthly
              </h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                billed monthly
              </p>
              <Spacer y={4} />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Our monthly plan grants access to all premium features, the best
                plan for short-term subscribers.
              </p>
            </CardHeader>
            <CardBody className="px-8 py-0">
              <div className="text-6xl font-black dark:text-white tracking-tighter">
                $36
                <span className="text-xl font-bold text-gray-400">/mo</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">
                Prices are marked in USD
              </p>
            </CardBody>
            <CardFooter className="p-8">
              <Button
                size="lg"
                variant="bordered"
                className="w-full text-sm font-black uppercase tracking-widest rounded-2xl border-2 border-[#071739] dark:border-[#FFB800] text-[#071739] dark:text-[#FFB800] hover:bg-[#071739] hover:text-white dark:hover:bg-[#FFB800] dark:hover:text-[#071739] transition-all"
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan - Most Popular */}
          <Card className="border-none shadow-2xl bg-white dark:bg-[#282E3A] relative overflow-hidden rounded-[2rem] ring-4 ring-[#FFB800]/20">
            <div className="absolute top-0 right-0 bg-[#FFB800] text-[#071739] px-10 py-1.5 rotate-12 translate-x-8 translate-y-4 text-[10px] font-black uppercase tracking-[0.2em] z-10">
              Most popular
            </div>
            <CardHeader className="flex flex-col items-start p-8">
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight">
                Yearly
              </h2>
              <p className="text-sm font-bold text-[#FFB800] uppercase tracking-widest">
                billed yearly ($179)
              </p>
              <Spacer y={4} />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Our most popular plan previously sold for $299 and is giờ đây
                chỉ còn{" "}
                <strong className="text-[#071739] dark:text-white">
                  $14.92/month
                </strong>
                .
                <br />
                Save over 62% in comparison to the monthly plan.
              </p>
            </CardHeader>
            <CardBody className="px-8 py-0">
              <div className="text-6xl font-black dark:text-white tracking-tighter">
                $159
                <span className="text-xl font-bold text-[#FFB800]">/yr</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">
                Prices are marked in USD
              </p>
            </CardBody>
            <CardFooter className="p-8">
              <Button
                size="lg"
                className="w-full text-sm font-black uppercase tracking-widest rounded-2xl bg-[#071739] dark:bg-[#FFB800] text-white dark:text-[#071739] shadow-xl dark:shadow-[#FFB800]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-24">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-6 group">
              <div className="text-5xl flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300">
                {feature.icon}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-[#071739] dark:text-white uppercase tracking-tight group-hover:text-[#FFB800] transition-colors">
                    {feature.title}
                  </h3>
                  {feature.badge && (
                    <Badge className="bg-[#FFB800] text-[#071739] border-none font-black text-[9px] uppercase px-2 py-0.5">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Divider className="my-20 dark:bg-[#474F5D]/50" />
      </div>
    </div>
  );
}
