"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from "@heroui/react";
import { Search, ArrowUpDown, Filter, RotateCcw, Plus } from "lucide-react";

export function ListControls() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        size="sm"
        placeholder="Search questions"
        startContent={<Search size={16} className="text-gray-400" />}
        className="max-w-[200px]"
        variant="flat"
      />

      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-gray-500 bg-gray-100"
          >
            <ArrowUpDown size={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Sort options">
          <DropdownItem key="custom">Custom</DropdownItem>
          <DropdownItem key="difficulty">Difficulty</DropdownItem>
          <DropdownItem key="acceptance">Acceptance</DropdownItem>
          <DropdownItem key="id">Question ID</DropdownItem>
          <DropdownItem key="time">Last Submitted Time</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-gray-500 bg-gray-100"
          >
            <Filter size={16} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Filter" className="w-[350px]">
          <DropdownItem key="filter-panel" textValue="filter-form" isReadOnly>
            <div className="p-2 space-y-4">
              <div className="flex items-center justify-between text-[13px] font-medium text-gray-700">
                <div className="flex items-center gap-1">
                  Match
                  <select className="border rounded px-1 py-0.5 bg-gray-50 text-xs font-bold">
                    <option>All</option>
                    <option>Any</option>
                  </select>
                  of the following filters:
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <Checkbox defaultSelected size="sm" className="opacity-40" />
                  <span className="w-16 text-gray-500">Status</span>
                  <select className="border rounded px-1 py-0.5 w-16 bg-gray-50">
                    <option>is</option>
                  </select>
                  <Input size="sm" variant="bordered" className="flex-1" />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Checkbox size="sm" className="opacity-40" />
                  <span className="w-16 text-gray-500">Difficulty</span>
                  <select className="border rounded px-1 py-0.5 w-16 bg-gray-50">
                    <option>is</option>
                  </select>
                  <Input size="sm" variant="bordered" className="flex-1" />
                </div>
                <Button
                  size="sm"
                  variant="light"
                  isIconOnly
                  className="text-gray-400"
                >
                  <Plus size={16} />
                </Button>
              </div>

              <div className="flex items-center gap-2 justify-center pt-2 border-t">
                <Button
                  size="sm"
                  variant="light"
                  startContent={<RotateCcw size={14} />}
                  className="font-bold text-gray-500"
                >
                  Reset
                </Button>
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

// Cần thêm Checkbox vào import HeroUI nếu dùng
import { Checkbox } from "@heroui/react";
