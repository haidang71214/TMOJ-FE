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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề Premium */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900">Premium</h1>
          <p className="mt-4 text-xl text-gray-600">
            Get started with a LeetCode Subscription that works for you.
          </p>
        </div>
        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Monthly Plan */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-col items-start">
              <h2 className="text-2xl font-bold">Monthly</h2>
              <p className="text-sm text-gray-500">billed monthly</p>
              <Spacer y={4} />
              <p className="text-gray-600">
                Our monthly plan grants access to all premium features, the best
                plan for short-term subscribers.
              </p>
            </CardHeader>
            <CardBody>
              <div className="text-5xl font-bold">
                $36
                <span className="text-xl font-normal text-gray-500">/mo</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Prices are marked in USD
              </p>
            </CardBody>
            <CardFooter>
              <Button
                size="lg"
                color="default"
                variant="bordered"
                className="w-full text-lg font-medium"
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan - Nổi bật nhất */}
          <Card className="border-2 border-orange-300 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-500 text-white px-8 py-1 rotate-12 translate-x-6 translate-y-2 text-sm font-medium">
              Most popular
            </div>
            <CardHeader className="flex flex-col items-start">
              <h2 className="text-2xl font-bold">Yearly</h2>
              <p className="text-sm text-gray-500">billed yearly ($179)</p>
              <Spacer y={4} />
              <p className="text-gray-700">
                Our most popular plan previously sold for $299 and is now only{" "}
                <strong>$14.92/month</strong>.
                <br />
                This plan saves you over 62% in comparison to the monthly plan.
              </p>
            </CardHeader>
            <CardBody>
              <div className="text-5xl font-bold">
                $36,36
                <span className="text-xl font-normal text-gray-500">/mo</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Prices are marked in USD
              </p>
            </CardBody>
            <CardFooter>
              <Button
                size="lg"
                color="primary"
                className="w-full text-lg font-medium bg-black hover:bg-gray-800"
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Grid lợi ích - 2 cột trên desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20m mt-20">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="text-4xl flex-shrink-0">{feature.icon}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  {feature.badge && (
                    <Badge color="warning" variant="flat">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Divider className="my-20" />
      </div>
    </div>
  );
}
