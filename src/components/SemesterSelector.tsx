"use client";

import React, { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection } from "@heroui/react";
import { Filter, ChevronDown } from "lucide-react";
import { useCurrentSemester } from "@/hooks/useCurrentSemester";
import { SemesterItem } from "@/types";

interface SemesterSelectorProps {
  selectedSemesterId?: string;
  onSemesterChange: (semesterId: string | undefined) => void;
}

export default function SemesterSelector({ selectedSemesterId, onSemesterChange }: SemesterSelectorProps) {
  const { currentSemester, semesters, isLoading } = useCurrentSemester();

  // Mặc định chọn kì hiện tại nếu chưa có lựa chọn nào và đã load xong
  React.useEffect(() => {
    if (!selectedSemesterId && currentSemester) {
      onSemesterChange(currentSemester.semesterId);
    }
  }, [currentSemester, selectedSemesterId, onSemesterChange]);

  const selectedSemester = semesters.find(s => s.semesterId === selectedSemesterId) || currentSemester;
  const displayName = selectedSemester ? selectedSemester.name : "All Semesters";

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="flat"
          className="h-11 rounded-lg bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider min-w-[160px]"
          startContent={<Filter size={16} />}
          endContent={<ChevronDown size={14} />}
          isLoading={isLoading}
        >
          {displayName}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Select Semester" variant="flat">
        <DropdownSection showDivider>
          <DropdownItem
            key="all"
            className="uppercase font-medium text-blue-600"
            onPress={() => onSemesterChange(undefined)}
          >
            All Semesters
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          {semesters.map((semester: SemesterItem) => (
            <DropdownItem
              key={semester.semesterId}
              className="uppercase font-medium"
              onPress={() => onSemesterChange(semester.semesterId)}
              endContent={semester.isActive ? <span className="text-[9px] text-green-500 font-bold ml-2">ACTIVE</span> : null}
            >
              {semester.name}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
