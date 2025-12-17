import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Code2, AtSign, X } from "lucide-react";

interface Props {
  placeholder?: string;
  targetUser?: string;
  onCancel?: () => void;
  isReply?: boolean;
}

export const CommentInput = ({
  placeholder,
  targetUser,
  onCancel,
  isReply,
}: Props) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm focus-within:border-gray-400 transition-all ${
      isReply ? "bg-gray-50 mt-4" : "mb-8"
    }`}
  >
    {isReply && (
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase">
          Reply to {targetUser}
        </span>
        <X
          size={14}
          className="cursor-pointer text-gray-400 hover:text-black"
          onClick={onCancel}
        />
      </div>
    )}
    <textarea
      placeholder={placeholder || "Type comment here..."}
      className="w-full text-sm outline-none min-h-[60px] resize-none border-none focus:ring-0 p-0 bg-transparent"
    />
    <div className="flex justify-between items-center mt-2 border-t pt-3">
      <div className="flex gap-4 text-gray-400 items-center">
        <Tooltip content="Code">
          <Code2 size={16} className="cursor-pointer hover:text-black" />
        </Tooltip>
        <Tooltip content="Mention">
          <AtSign size={16} className="cursor-pointer hover:text-black" />
        </Tooltip>
      </div>
      <div className="flex gap-2">
        {isReply && (
          <Button
            size="sm"
            variant="light"
            className="h-7 text-[11px]"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          className="bg-[#2cbb5d] text-white font-bold px-6 rounded-lg h-7"
        >
          {isReply ? "Reply" : "Comment"}
        </Button>
      </div>
    </div>
  </div>
);
