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
  console.log(apiResponse);
  
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
        <p className="mt-4 text-slate-500 font-medium">{language === 'vi' ? "Đang tải danh sách nhãn..." : "Loading tags repository..."}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8 min-h-[500px]">
        <div className="text-red-500 text-2xl mb-4 font-black">{language === 'vi' ? "Đã có lỗi xảy ra" : "Error occurred"}</div>
        <p className="text-slate-400 mb-6 font-medium">
          {(error as ErrorForm)?.data?.data?.message || (language === 'vi' ? "Không thể tải danh sách nhãn." : "Unable to load tags list.")}
        </p>
        <Button color="primary" onPress={refetch} className="font-bold">
          {language === 'vi' ? "Thử lại" : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div 
        className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8 opacity-0 animate-fade-in-up"
        style={{ animationFillMode: 'both', animationDelay: '100ms' }}
      >
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            {language === 'vi' ? "KHO " : "TAGS "} <span className="text-[#FF5C00]">{language === 'vi' ? "NHÃN" : "REPOSITORY"}</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            {language === 'vi' ? "Quản lý nhãn bài tập hệ thống" : "Manage system problem tags"}
          </p>
        </div>
        <Button
          startContent={<Plus size={20} strokeWidth={3} />}
          onPress={createModal.onOpen}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
        >
          {language === 'vi' ? "TẠO NHÃN MỚI" : "CREATE NEW TAG"}
        </Button>
      </div>

      <div 
        className="flex flex-wrap items-center gap-3 shrink-0 opacity-0 animate-fade-in-up"
        style={{ animationFillMode: 'both', animationDelay: '150ms' }}
      >
        <Input
          placeholder={language === 'vi' ? "Tìm theo tên hoặc đường dẫn..." : "Search by name or slug..."}
          value={searchTerm}
          onValueChange={setSearchTerm}
          startContent={<Search size={18} className="text-slate-400" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:!border-blue-600 dark:focus-within:!border-[#FF5C00] transition-colors w-full sm:w-[300px]",
          }}
          className="font-medium"
        />

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 dark:bg-[#FF5C00] text-white shadow-lg hover:opacity-80 transition-all active:scale-90 ml-auto"
          onPress={refetch}
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      <div 
        className="flex-1 overflow-auto pr-2 custom-scrollbar opacity-0 animate-fade-in-up"
        style={{ animationFillMode: 'both', animationDelay: '200ms' }}
      >
        <Table
          aria-label="Tags Table"
          removeWrapper
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
          }}
        >
          <TableHeader>
            <TableColumn>{language === 'vi' ? "MÃ" : "ID"}</TableColumn>
            <TableColumn>{language === 'vi' ? "TÊN NHÃN" : "TAG NAME"}</TableColumn>
            <TableColumn>{language === 'vi' ? "ĐƯỜNG DẪN" : "SLUG"}</TableColumn>
            <TableColumn>{language === 'vi' ? "TRẠNG THÁI" : "STATUS"}</TableColumn>
            <TableColumn className="text-right">{language === 'vi' ? "THAO TÁC" : "OPERATIONS"}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={language === 'vi' ? "Không tìm thấy nhãn nào" : "No tags found"}>
            {items.map((tag, index) => (
              <TableRow
                key={tag.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors opacity-0 animate-fade-in-up"
                style={{ animationFillMode: "both", animationDelay: `${index * 50 + 200}ms` }}
              >
                <TableCell>
                  <span className="text-slate-400 font-bold italic text-xs">#{tag.id.substring(0, 8)}...</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div 
                      className={`flex items-center justify-center p-2 rounded-lg shadow-sm border border-transparent dark:border-white/5 ${!tag.color ? 'bg-emerald-100 dark:bg-[#22C55E]/10 text-emerald-600 dark:text-[#22C55E]' : ''}`}
                      style={tag.color ? { backgroundColor: `${tag.color}25`, color: tag.color } : {}}
                    >
                      {React.createElement(getIconComponent(tag.icon), { size: 16 })}
                    </div>
                    <span 
                      className="text-base font-black uppercase italic tracking-tight transition-colors leading-none"
                      style={{ color: tag.color || undefined }}
                    >
                      {tag.name || (language === 'vi' ? "CHƯA ĐẶT TÊN" : "UNNAMED")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span 
                    className="text-sm font-medium px-3 py-1 rounded-md lowercase border shadow-sm"
                    style={tag.color ? { 
                      backgroundColor: `${tag.color}10`, 
                      color: tag.color,
                      borderColor: `${tag.color}30` 
                    } : {
                      backgroundColor: 'rgb(241 245 249)',
                      color: 'rgb(100 116 139)'
                    }}
                  >
                    {tag.slug || (language === 'vi' ? "không có" : "none")}
                  </span>
                </TableCell>
                <TableCell>
                  {tag.isActive === false ? (
                    <span className="px-2 py-1 bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 font-bold text-[10px] uppercase rounded-md">
                      {language === 'vi' ? "KHÔNG HOẠT ĐỘNG" : "INACTIVE"}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold text-[10px] uppercase rounded-md">
                      {language === 'vi' ? "HOẠT ĐỘNG" : "ACTIVE"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Tooltip content={language === 'vi' ? "Chỉnh sửa Nhãn (Sắp ra mắt)" : "Edit Tag (Coming Soon)"} className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9 active-bump"
                      >
                        <Edit size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content={language === 'vi' ? "Xóa Nhãn (Sắp ra mắt)" : "Delete Tag (Coming Soon)"} className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all rounded-lg h-9 w-9 active-bump"
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
          <div className="flex w-full justify-center py-8">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(p) => setPage(p)}
              classNames={{
                cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-bold italic shadow-lg",
              }}
            />
          </div>
        )}
      </div>

      <CreateTagsModal isOpen={createModal.isOpen} onOpenChange={createModal.onOpenChange} />
    </div>
  );
}
