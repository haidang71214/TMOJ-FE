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
    className={`bg-white dark:bg-[#1C2737] border border-gray-200 dark:border-[#334155] rounded-xl p-4 shadow-sm focus-within:border-gray-400 dark:focus-within:border-[#4B6382] transition-all ${
      isReply ? "bg-gray-50 dark:bg-[#101828]/60 mt-4" : "mb-8"
    }`}
  >
    {isReply && (
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-gray-400 dark:text-[#94A3B8] uppercase">
          Reply to{" "}
          <span className="text-blue-500 dark:text-[#E3C39D]">
            {targetUser}
          </span>
        </span>
        <X
          size={14}
          className="cursor-pointer text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          onClick={onCancel}
        />
      </div>
    )}

    <textarea
      placeholder={placeholder || "Type comment here..."}
      className="w-full text-sm outline-none min-h-[60px] resize-none border-none focus:ring-0 p-0 bg-transparent text-gray-900 dark:text-[#F9FAFB] placeholder:text-gray-400 dark:placeholder:text-[#475569]"
    />

    <div className="flex justify-between items-center mt-2 border-t border-gray-100 dark:border-[#334155] pt-3">
      <div className="flex gap-4 text-gray-400 dark:text-[#94A3B8] items-center">
        <Tooltip content="Code" className="dark:bg-[#101828] dark:text-white">
          <Code2
            size={16}
            className="cursor-pointer hover:text-black dark:hover:text-[#E3C39D] transition-colors"
          />
        </Tooltip>
        <Tooltip
          content="Mention"
          className="dark:bg-[#101828] dark:text-white"
        >
          <AtSign
            size={16}
            className="cursor-pointer hover:text-black dark:hover:text-[#E3C39D] transition-colors"
          />
        </Tooltip>
      </div>

      <div className="flex gap-2">
        {isReply && (
          <Button
            size="sm"
            variant="light"
            className="h-7 text-[11px] font-bold dark:text-[#94A3B8] dark:hover:bg-[#101828]"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          className="bg-[#2cbb5d] text-white font-bold px-6 rounded-lg h-7 shadow-lg shadow-green-500/10 active:scale-95 transition-all"
        >
          {isReply ? "Reply" : "Comment"}
        </Button>
      </div>
    </div>
  </div>
);
