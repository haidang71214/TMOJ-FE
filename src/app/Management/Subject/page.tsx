"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Input,
  Chip,
  Pagination,
  Spinner,
} from "@heroui/react";
import {
  Plus,
  Edit3,
  Search,
  Filter,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import { useGetAllSubjectQueryQuery, useGetImportTemplateMutation, useImportClassMutation } from "@/store/queries/Subject";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { useModal } from "@/Provider/ModalProvider";
import CreateSubjectModal from "./CreateSubjectModal";
import EditSubjectModal from "./EditSubjectModal";
import { SubjectResponseForm } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

export default function SubjectListPage() {
  const { t, language } = useTranslation();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const { openModal } = useModal();
  const { data: userProfile } = useGetUserInformationQuery();
  const isManagerOrAdmin = userProfile?.role?.toLowerCase() === "manager" || userProfile?.role?.toLowerCase() === "admin";

  const { data, isLoading } = useGetAllSubjectQueryQuery();
  const [getImportTemplate] = useGetImportTemplateMutation();
  const [importClass] = useImportClassMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  const subjects = data?.data?.items ?? [];

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const q = searchQuery.toLowerCase();
    return subjects.filter((s: SubjectResponseForm) => {
      const code = (s.code || "").toLowerCase();
      const name = (s.name || "").toLowerCase();
      return code.includes(q) || name.includes(q);
    });
  }, [subjects, searchQuery]);

  const pages = Math.ceil(filteredSubjects.length / rowsPerPage) || 1;
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredSubjects.slice(start, start + rowsPerPage);
  }, [page, filteredSubjects]);

  const handleDownloadTemplate = async () => {
    try {
      const blob = await getImportTemplate().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Class_Import_Template.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download template", error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await importClass(formData).unwrap();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to import class", error);
    }
  };

  const handleOpenEdit = (subject: SubjectResponseForm) => {
    openModal({
      content: <EditSubjectModal subject={subject} />,
    });
  };

  const handleOpenCreate = () => {
    openModal({
      content: <CreateSubjectModal />,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-tight">
            {language === 'vi' ? 'QUẢN LÝ ' : `${t('subject_management.subject') || 'SUBJECT'} `} 
            <span className="text-[#FF5C00]">
              {language === 'vi' ? 'MÔN HỌC' : (t('subject_management.curriculum') || 'CURRICULUM')}
            </span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            {t('subject_management.desc') || (language === 'vi' ? 'Quản lý môn học và kho học liệu' : 'Manage academic subjects and repositories')}
            </p>
          </div>
          {isManagerOrAdmin && (
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleImport}
              />
              <Button
                startContent={<Download size={16} strokeWidth={3} />}
                onPress={handleDownloadTemplate}
                className="bg-blue-600 text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95 active-bump"
              >
                {t('common.template') || (language === 'vi' ? 'BIỂU MẪU' : 'TEMPLATE')}
              </Button>
              <Button
                startContent={<Upload size={16} strokeWidth={3} />}
                onPress={() => fileInputRef.current?.click()}
                className="bg-purple-600 text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95 active-bump"
              >
                {t('common.import') || (language === 'vi' ? 'NHẬP' : 'IMPORT')}
              </Button>
              <Button
                onPress={handleOpenCreate}
                startContent={<Plus size={20} strokeWidth={3} />}
                className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95 active-bump"
              >
                {t('subject_management.create_new') || (language === 'vi' ? 'TẠO MÔN HỌC MỚI' : 'CREATE NEW SUBJECT')}
              </Button>
            </div>
          )}
        </div>
        
        {/* FILTER & SEARCH SECTION */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder={t('subject_management.search_placeholder') || (language === 'vi' ? 'Tìm kiếm mã hoặc tên...' : 'Search code or name...')}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={18} className="text-[#A4B5C4]" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 border border-slate-200 dark:border-white/5 shadow-none focus-within:!border-[#FF5C00]",
          }}
          className="max-w-xs font-bold italic"
        />

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-[#111c35] text-slate-500 dark:text-white shadow-sm transition-transform hover:scale-105 active-bump"
        >
          <Filter size={18} />
        </Button>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md transition-transform hover:scale-105 active-bump"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Table
          aria-label="Subject Management Table"
          removeWrapper
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
          }}
        >
          <TableHeader>
            <TableColumn>{t('subject_management.code') || (language === 'vi' ? 'MÃ MÔN' : 'CODE')}</TableColumn>
            <TableColumn>{t('subject_management.name') || (language === 'vi' ? 'TÊN MÔN' : 'SUBJECT NAME')}</TableColumn>
            <TableColumn>{t('subject_management.description') || (language === 'vi' ? 'MÔ TẢ' : 'DESCRIPTION')}</TableColumn>
            <TableColumn className="text-center">{t('common.status') || (language === 'vi' ? 'TRẠNG THÁI' : 'STATUS')}</TableColumn>
            <TableColumn className="text-right">{t('common.operations') || (language === 'vi' ? 'THAO TÁC' : 'OPERATIONS')}</TableColumn>
          </TableHeader>
          <TableBody emptyContent={t('common.no_data') || (language === 'vi' ? 'Không có môn học nào.' : 'No subjects found.')}>
            {items.map((s, index) => (
              <TableRow
                key={s.subjectId}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors animate-fade-in-right"
                style={{ animationFillMode: 'both', animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <span className="font-[1000] italic text-blue-600 dark:text-[#FF5C00] uppercase tracking-tighter">
                    {s.code}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-[1000] uppercase italic tracking-tight">
                    {s.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500 max-w-[200px] truncate block">
                    {s.description || "—"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Chip
                    variant="flat"
                    size="sm"
                    className="font-black uppercase text-[9px] px-2"
                    color={s.isActive ? "success" : "default"}
                  >
                    {s.isActive ? (t('common.active') || (language === 'vi' ? 'HOẠT ĐỘNG' : 'ACTIVE')) : (t('common.inactive') || (language === 'vi' ? 'KÉM HOẠT ĐỘNG' : 'INACTIVE'))}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    {isManagerOrAdmin ? (
                      <Tooltip content={t('subject_management.edit') || (language === 'vi' ? 'Sửa môn học' : 'Edit Subject')} className="font-bold text-[10px]" placement="top">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleOpenEdit(s as any)}
                          className="text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-500/20 animate-fade-in-up"
                          style={{ animationFillMode: 'both', animationDelay: `${index * 50 + 100}ms` }}
                        >
                          <Edit3 size={18} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <span className="text-xs text-slate-400 italic">—</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex w-full justify-center py-8">
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={setPage}
            classNames={{
              cursor:
                "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic shadow-lg",
            }}
          />
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
