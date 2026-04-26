"use client";
import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Pagination,
  Tooltip,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { Plus, Edit, Trash2, Search, RefreshCw, Tag as TagIcon, icons } from "lucide-react";
import { useGetTagsQuery } from "@/store/queries/Tags";
import CreateTagsModal from "./createTagsModal";
import { ErrorForm } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import { ADMIN_H1, ADMIN_SUBTITLE } from "../../{admin}/adminTable";

const getIconComponent = (iconName?: string | null) => {
  if (!iconName) return TagIcon;
  const pascalName = iconName.replace(/(^\w|-\w)/g, (str) => str.replace(/-/, '').toUpperCase());
  return (icons as any)[pascalName] || TagIcon;
};

export default function TagsManagementPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const { data: apiResponse, isLoading, isError, error, refetch } = useGetTagsQuery();
  const { t, language } = useTranslation();
  const createModal = useDisclosure();

  const allTags = useMemo(() => {
    let tags = apiResponse || [];
    if (searchTerm) {
      tags = tags.filter(
        (t) =>
          t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return tags;
  }, [apiResponse, searchTerm]);

  const totalItems = allTags.length;
  const pages = Math.ceil(totalItems / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return allTags.slice(start, end);
  }, [page, allTags]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[500px]">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-white/40 font-bold uppercase tracking-widest text-[10px] italic">
          {language === 'vi' ? "Đang tải danh sách nhãn..." : "Loading tags repository..."}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8 min-h-[500px]">
        <div className="text-red-500 text-2xl mb-4 font-black uppercase tracking-tighter italic">
          {language === 'vi' ? "Đã có lỗi xảy ra" : "Error occurred"}
        </div>
        <p className="text-white/30 mb-6 font-medium italic">
          {(error as ErrorForm)?.data?.data?.message || (language === 'vi' ? "Không thể tải danh sách nhãn." : "Unable to load tags list.")}
        </p>
        <Button
          className="bg-[#3B5BFF] text-white font-black px-10 rounded-xl uppercase text-[10px] tracking-widest"
          onPress={refetch}
        >
          {language === 'vi' ? "Thử lại" : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div>
          <h1 className={ADMIN_H1}>
            {language === 'vi' ? "Tags " : "Tags "} <span style={{ color: "#3B5BFF" }}>{language === 'vi' ? "Repository" : "Repository"}</span>
          </h1>
          <p className={ADMIN_SUBTITLE}>
            {language === 'vi' ? "Quản lý nhãn bài tập hệ thống" : "Manage system problem tags"}
          </p>
        </div>
        <Button
          startContent={<Plus size={20} strokeWidth={3} />}
          onPress={createModal.onOpen}
          className="bg-[#3B5BFF] text-white font-black h-11 px-8 rounded-xl shadow-xl uppercase text-[10px] tracking-widest active:scale-95 transition-all"
          style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 4px 15px rgba(59, 91, 255, 0.3)" }}
        >
          {language === 'vi' ? "TẠO NHÃN MỚI" : "CREATE NEW TAG"}
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative group flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#3B5BFF] transition-colors" size={16} />
          <input
            placeholder={language === 'vi' ? "Tìm theo tên hoặc đường dẫn..." : "Search by name or slug..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-[#3B5BFF] transition-all bg-[#1E2B42] border border-white/10"
          />
        </div>

        <Button
          isIconOnly
          variant="flat"
          className="h-11 w-11 rounded-xl bg-white/5 text-white/30 hover:bg-white/10 hover:text-white transition-all ml-auto"
          onPress={refetch}
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE */}
      <div className="rounded-[2.5rem] overflow-hidden border border-white/5" style={{ background: "#162035", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        <Table
          aria-label="Tags Management Table"
          removeWrapper
          classNames={{
            th: "bg-[#1E2B42] text-white/40 text-[11px] font-black uppercase tracking-widest border-b border-white/[0.08] py-5 px-6",
            td: "py-5 px-6 text-sm border-b border-white/[0.05] text-white/80",
            tr: "hover:bg-white/[0.03] transition-colors group/row",
          }}
        >
          <TableHeader>
            <TableColumn>{language === 'vi' ? "MÃ" : "ID"}</TableColumn>
            <TableColumn className="w-[30%]">{language === 'vi' ? "TÊN NHÃN" : "TAG NAME"}</TableColumn>
            <TableColumn>{language === 'vi' ? "ĐƯỜNG DẪN" : "SLUG"}</TableColumn>
            <TableColumn align="center">{language === 'vi' ? "TRẠNG THÁI" : "STATUS"}</TableColumn>
            <TableColumn align="end">{language === 'vi' ? "THAO TÁC" : "OPERATIONS"}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={language === 'vi' ? "Không tìm thấy nhãn nào" : "No tags found in registry"}>
            {items.map((tag, index) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <span className="text-white/30 font-black italic text-xs tracking-tighter">#{tag.id.substring(0, 8)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg border border-white/5"
                      style={{ backgroundColor: tag.color ? `${tag.color}15` : 'rgba(16, 185, 129, 0.1)', color: tag.color || '#10B981' }}
                    >
                      {React.createElement(getIconComponent(tag.icon), { size: 18 })}
                    </div>
                    <span
                      className="text-base font-black uppercase italic tracking-tight group-hover/row:scale-105 transition-transform origin-left"
                      style={{ color: tag.color || undefined }}
                    >
                      {tag.name || "UNNAMED"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className="text-[10px] font-black px-3 py-1.5 rounded-lg lowercase border border-white/5 tracking-wider bg-white/5 text-white/50"
                  >
                    {tag.slug || "none"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {tag.isActive === false ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                        <span className="text-[10px] font-black uppercase text-red-500">Disabled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-emerald-500">Active</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip content="Edit Tag" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-white/5 hover:bg-[#3B5BFF]/20 text-white/30 hover:text-[#7B9FFF] rounded-xl h-9 w-9 transition-all"
                      >
                        <Edit size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete Tag" className="font-bold text-[10px]" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-500 rounded-xl h-9 w-9 transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalItems > 0 && (
          <div className="flex w-full justify-center py-8 border-t border-white/5">
            <Pagination
              showControls
              showShadow
              color="primary"
              variant="faded"
              page={page}
              total={pages}
              onChange={setPage}
              classNames={{
                cursor: "bg-[#3B5BFF] text-white font-black",
                wrapper: "gap-2",
                item: "text-white/60 hover:text-white hover:bg-white/10",
              }}
            />
          </div>
        )}
      </div>

      <CreateTagsModal isOpen={createModal.isOpen} onOpenChange={createModal.onOpenChange} />
    </div>
  );
}
