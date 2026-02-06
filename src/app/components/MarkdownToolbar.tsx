"use client";

import React from "react";
import { Button, Divider, Tooltip } from "@heroui/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  Type,
  Info,
} from "lucide-react";

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  content: string;
  setContent: (value: string) => void;
}

export const MarkdownToolbar = ({
  textareaRef,
  content,
  setContent,
}: MarkdownToolbarProps) => {
  const handleToolbarAction = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newText =
      content.substring(0, start) +
      prefix +
      (selectedText || "text") +
      suffix +
      content.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length + (selectedText ? 0 : 4)
      );
    }, 0);
  };

  return (
    <div className="flex items-center gap-1">
      <ToolbarButton
        icon={<Type size={16} />}
        onClick={() => handleToolbarAction("### ", "")}
        tooltip="Heading"
      />
      <ToolbarButton
        icon={<Bold size={16} />}
        onClick={() => handleToolbarAction("**", "**")}
        tooltip="Bold (Ctrl+B)"
      />
      <ToolbarButton
        icon={<Italic size={16} />}
        onClick={() => handleToolbarAction("*", "*")}
        tooltip="Italic (Ctrl+I)"
      />
      <ToolbarButton
        icon={<Underline size={16} />}
        onClick={() => handleToolbarAction("<u>", "</u>")}
        tooltip="Underline (Ctrl+U)"
      />

      <Divider orientation="vertical" className="h-4 mx-1" />

      <ToolbarButton
        icon={<List size={16} />}
        onClick={() => handleToolbarAction("- ", "")}
        tooltip="Bullet List"
      />
      <ToolbarButton
        icon={<ListOrdered size={16} />}
        onClick={() => handleToolbarAction("1. ", "")}
        tooltip="Numbered List"
      />
      <ToolbarButton
        icon={<Quote size={16} />}
        onClick={() => handleToolbarAction("> ", "")}
        tooltip="Quote"
      />

      <Divider orientation="vertical" className="h-4 mx-1" />

      <ToolbarButton
        icon={<Code size={16} />}
        onClick={() => handleToolbarAction("```cpp\n", "\n```")}
        tooltip="Insert Code"
      />
      <ToolbarButton
        icon={<ImageIcon size={16} />}
        onClick={() => handleToolbarAction("![alt](", ")")}
        tooltip="Insert Image"
      />
      <ToolbarButton
        icon={<LinkIcon size={16} />}
        onClick={() => handleToolbarAction("[link](", ")")}
        tooltip="Insert Link"
      />

      <div className="ml-auto">
        <div className="p-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-500 cursor-help">
          <Info size={16} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({
  icon,
  onClick,
  tooltip,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}) => (
  <Tooltip content={tooltip} className="font-bold text-[10px]" closeDelay={0}>
    <Button
      isIconOnly
      variant="light"
      size="sm"
      onPress={onClick}
      className="text-slate-500 hover:text-[#FF5C00] dark:text-slate-400 dark:hover:text-white transition-colors min-w-0 w-8 h-8 rounded-lg"
    >
      {icon}
    </Button>
  </Tooltip>
);
