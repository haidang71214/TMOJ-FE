import { Card, CardBody, Avatar, Button } from "@heroui/react";
import { MessageSquare, Heart } from "lucide-react";

export const DiscussionList = () => {
  const posts = [
    {
      title: "How to master Dynamic Programming?",
      author: "CodeNinja",
      likes: 142,
      replies: 45,
    },
    {
      title: "Google Interview Experience 2025",
      author: "TechGuru",
      likes: 890,
      replies: 120,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-2xl font-black flex items-center gap-3">
          <MessageSquare className="text-[#A68868]" /> Community Discuss
        </h3>
        <Button variant="light" className="font-bold text-[#4B6382]">
          View All
        </Button>
      </div>
      {posts.map((post, i) => (
        <Card
          key={i}
          className="bg-white border-none rounded-[24px] shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <CardBody className="flex flex-row gap-5 p-4">
            <Avatar
              name={post.author}
              className="bg-[#CDD5DB] text-[#071739] font-bold"
            />
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-lg">{post.title}</h4>
              <span className="text-xs text-[#A68868]">@{post.author}</span>
              <div className="flex gap-4 mt-2 text-[#4B6382] text-xs font-bold">
                <span className="flex items-center gap-1">
                  <Heart size={14} /> {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={14} /> {post.replies}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
