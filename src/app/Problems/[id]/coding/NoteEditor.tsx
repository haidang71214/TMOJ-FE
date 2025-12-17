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
    <div className="h-full flex flex-col bg-white">
      {/* 1. Thanh công cụ định dạng (Markdown Toolbar) */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 bg-white shrink-0">
        <Tooltip content="Heading" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <Type size={16} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-gray-200 mx-1" />

        <Tooltip content="Bold" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <Bold size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Italic" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors italic">
            <Italic size={16} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-gray-200 mx-1" />

        <Tooltip content="Bullet List" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <List size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Numbered List" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <ListOrdered size={16} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-gray-200 mx-1" />

        <Tooltip content="Blockquote" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <Quote size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Code Block" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <Code2 size={16} />
          </button>
        </Tooltip>

        <div className="w-[1px] h-4 bg-gray-200 mx-1" />

        <Tooltip content="Add Link" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <LinkIcon size={16} />
          </button>
        </Tooltip>

        <Tooltip content="Add Image" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
            <ImageIcon size={16} />
          </button>
        </Tooltip>

        <div className="flex-1" />

        <Tooltip content="Preview" size="sm">
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 transition-colors">
            <Eye size={16} />
          </button>
        </Tooltip>
      </div>

      {/* 2. Vùng nhập liệu */}
      <div className="flex-1 p-6 relative">
        <textarea
          className="w-full h-full outline-none text-[14px] text-gray-700 leading-relaxed resize-none bg-transparent placeholder:text-gray-300 no-scrollbar"
          placeholder="Type here...(Markdown is enabled)"
          spellCheck={false}
        />

        {/* Chỉ báo trạng thái ở góc dưới */}
        <div className="absolute bottom-4 right-6 text-[10px] text-gray-300 font-medium pointer-events-none select-none">
          Markdown Supported
        </div>
      </div>
    </div>
  );
};
