import React from "react";
import { Button, Tooltip } from "@heroui/react";
import { Code2, Link as LinkIcon, AtSign, X } from "lucide-react";

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
    className={`bg-white dark:bg-[#1C2737] border border-gray-200 dark:border-[#334155] rounded-2xl p-4 shadow-sm focus-within:border-gray-400 dark:focus-within:border-[#4B6382] transition-all duration-500 ${
      isReply ? "bg-gray-50 dark:bg-[#101828]/60 mt-4" : "mb-10"
    }`}
  >
    {isReply && (
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-gray-400 dark:text-[#94A3B8] uppercase tracking-widest">
          Reply to{" "}
          <span className="text-blue-500 dark:text-[#E3C39D]">
            @{targetUser}
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
      className="w-full text-sm outline-none min-h-[80px] resize-none border-none focus:ring-0 p-0 bg-transparent text-[#262626] dark:text-[#F9FAFB] placeholder:text-gray-400 dark:placeholder:text-[#475569]"
    />

    <div className="flex justify-between items-center mt-2 border-t border-gray-100 dark:border-[#334155] pt-3">
      <div className="flex gap-4 text-gray-400 dark:text-[#94A3B8] items-center">
        <Tooltip
          content="Code"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <Code2
            size={16}
            className="cursor-pointer hover:text-black dark:hover:text-[#E3C39D] transition-colors"
          />
        </Tooltip>
        <Tooltip
          content="Link"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <LinkIcon
            size={16}
            className="cursor-pointer hover:text-black dark:hover:text-[#E3C39D] transition-colors"
          />
        </Tooltip>
        <Tooltip
          content="Mention"
          size="sm"
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
            variant="flat"
            className="h-8 text-[11px] font-bold dark:bg-[#101828] dark:text-[#94A3B8] rounded-xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          className="bg-[#2cbb5d] dark:bg-[#2cbb5d] text-white font-black px-6 rounded-xl h-8 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
        >
          {isReply ? "Reply" : "Comment"}
        </Button>
      </div>
    </div>
  </div>
);
