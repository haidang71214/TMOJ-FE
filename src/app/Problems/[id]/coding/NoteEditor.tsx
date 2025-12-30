"use client";

import React from "react";
import {
  Bold,
  Italic,
  Type,
  Code2,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import { Tooltip } from "@heroui/react";

export const NoteEditor = () => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#1C2737] transition-colors duration-500">
      {/* 1. Thanh công cụ định dạng (Markdown Toolbar) */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 dark:border-[#334155] bg-white dark:bg-[#162130] shrink-0">
        <Tooltip
          content="Heading"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors">
            <Type size={16} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#334155] mx-1" />

        <Tooltip
          content="Bold"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors">
            <Bold size={16} />
          </button>
        </Tooltip>

        <Tooltip
          content="Italic"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors italic">
            <Italic size={16} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#334155] mx-1" />

        <Tooltip
          content="Bullet List"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors">
            <List size={16} />
          </button>
        </Tooltip>

        <Tooltip
          content="Numbered List"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors">
            <ListOrdered size={16} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#334155] mx-1" />

        <Tooltip
          content="Blockquote"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors">
            <Quote size={16} />
          </button>
        </Tooltip>

        <Tooltip
          content="Code Block"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors">
            <Code2 size={16} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#334155] mx-1" />

        <Tooltip
          content="Add Link"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors">
            <LinkIcon size={16} />
          </button>
        </Tooltip>

        <Tooltip
          content="Add Image"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-500 dark:text-[#94A3B8] transition-colors">
            <ImageIcon size={16} />
          </button>
        </Tooltip>

        <div className="flex-1" />

        <Tooltip
          content="Preview"
          size="sm"
          className="dark:bg-[#101828] dark:text-white"
        >
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#334155] rounded text-gray-400 dark:text-[#4B6382] transition-colors">
            <Eye size={16} />
          </button>
        </Tooltip>
      </div>

      {/* 2. Vùng nhập liệu */}
      <div className="flex-1 p-6 relative">
        <textarea
          className="w-full h-full outline-none text-[14px] text-gray-700 dark:text-[#F9FAFB] leading-relaxed resize-none bg-transparent placeholder:text-gray-300 dark:placeholder:text-[#475569] no-scrollbar"
          placeholder="Type here...(Markdown is enabled)"
          spellCheck={false}
        />

        {/* Chỉ báo trạng thái ở góc dưới */}
        <div className="absolute bottom-4 right-6 text-[10px] text-gray-300 dark:text-[#475569] font-bold uppercase tracking-widest pointer-events-none select-none">
          Markdown Supported
        </div>
      </div>
    </div>
  );
};
