"use client";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Spinner,
  DropdownSection,
} from "@heroui/react";
import {
  Search,
  Plus,
  RefreshCw,
  ArrowRight,
  Filter,
  ChevronDown,
  SortAsc,
  BookOpen,
  Users,
  CalendarPlus,
  UserCog,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useGetClassesQuery, useExportClassTemplateMutation } from "@/store/queries/Class";
import CreateSlotForm from "./CreateClassSlotModal";
import CreateClassModal from "./components/CreateClassModal";
import CreateTeacherModal from "@/app/{admin}/Class/CreateTeacherModal";
import { useModal } from "@/Provider/ModalProvider";
import UpdateTeacherModal from "./UpdateTeacherModal";
import { useGetALLSemestersQuery } from "@/store/queries/Semester";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { ClassItem, SemesterItem } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";



export default function ClassListPage() {
  const { t, language } = useTranslation();
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const { data: userProfile } = useGetUserInformationQuery();
  const isManagerOrAdmin = userProfile?.role?.toLowerCase() === "manager" || userProfile?.role?.toLowerCase() === "admin";
  const [exportClassTemplate] = useExportClassTemplateMutation();
  const [selectedSemesterName, setSelectedSemesterName] = useState<string | undefined>(undefined);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const { openModal } = useModal();
  const { data: semestersData } = useGetALLSemestersQuery();
  const semesters = semestersData?.data?.items || [];
  
  const { data, isLoading, refetch } = useGetClassesQuery({
    semesterId: selectedSemesterId,
    page: 1,
    pageSize: 1000,
  });
  
  const allFetchedClasses: ClassItem[] = data?.data?.items ?? [];

  const filteredClasses = useMemo(() => {
    let filtered = [...allFetchedClasses];
    
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(c => c.classCode.toLowerCase().includes(q));
    }
    
    // Sort
    if (sortBy === "name") {
      filtered.sort((a,b) => a.classCode.localeCompare(b.classCode));
    } else if (sortBy === "students") {
      filtered.sort((a,b) => (b.totalMemberCount || 0) - (a.totalMemberCount || 0));
    }
    
    return filtered;
  }, [allFetchedClasses, searchTerm, sortBy]);

  const pages = Math.ceil(filteredClasses.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredClasses.slice(start, end);
  }, [page, filteredClasses, rowsPerPage]);

  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedSemesterId, sortBy]);

  // Stats
  const statsData = [
    { label: t('class_management.total_classes') || "Total Classes", value: filteredClasses.length.toString(), color: "text-blue-500" },
    { 
      label: t('class_management.total_students') || "Total Students", 
      value: filteredClasses.reduce((sum, c) => sum + (c.totalMemberCount || 0), 0).toString(), 
      color: "text-[#FF5C00]" 
    },
    { 
      label: t('class_management.active_classes') || "Active Classes", 
      value: filteredClasses.filter(c => c.isActive).length.toString(), 
      color: "text-emerald-500" 
    },
  ];

  const getDisplayName = (semester: SemesterItem) => {
    return `${semester.name}`.trim();
  };

  const openCreateSlotModal = (semesterId: string) => {
    openModal({
      content: <CreateSlotForm semesterId={semesterId} />,
    });
  };
  const filter = ()=> {
    if(selectedSemesterName == "All semesters" || selectedSemesterName == null){
      return null;
    }else{
      return <Chip
                          variant="flat"
                          size="sm"
                          className="font-black bg-slate-100 dark:bg-gray-800 tsizeslate-500 dark:text-gray-400 uppercase italic text-[9px] h-5 relative z-20"
                        >
                           {selectedSemesterName }
                        </Chip>;
    }
  }
  const openUpdateTeacherForClass = (classId: string, currentTeacherId?: string) => {
    openModal({
      content: (
        <UpdateTeacherModal
          classId={classId}
          currentTeacherId={currentTeacherId}
        />
      ),
    });
  };

  if (userProfile && !isManagerOrAdmin) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 min-h-[400px]">
        <h2 className="text-2xl font-black text-red-500 mb-2">Access Denied</h2>
        <p className="text-slate-500 font-bold">You do not have permission to view this page.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[400px]">
        <Spinner size="lg" color="secondary" />
        <p className="text-sm text-slate-500 animate-pulse mt-3 font-semibold tracking-wide">
          {t('class_management.loading') || "Loading classes..."}
        </p>
      </div>
    );
  }
const handleExportTemplateClass = async()=>{
    try {
    const blob = await exportClassTemplate().unwrap();
      console.log(blob);
      
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class-template.xlsx"; // tên file muốn tải
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
  }
  }
  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-tight">
            {language === 'vi' ? 'QUẢN LÝ ' : `${t('class_management.title1') || 'CLASS'} `} 
            <span className="text-[#FF5C00]">
              {language === 'vi' ? 'LỚP HỌC' : (t('class_management.title2') || 'MANAGEMENT')}
            </span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            {t('class_management.subtitle') || "Organize and monitor your courses"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-[#22C55E] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active-bump animate-fade-in-right"
            startContent={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            }
            onPress={() => openModal({ content: <CreateTeacherModal /> })}
          >
            CREATE TEACHER
          </Button>
          <Button
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active-bump animate-fade-in-right delay-75"
            startContent={<Plus size={16} strokeWidth={3} />}
            onPress={() => openModal({ content: <CreateClassModal onCreated={() => refetch()} /> })}
          >
            {t('class_management.create_button') || "CREATE NEW CLASS"}
          </Button>
          <Button
            startContent={<Download size={16} strokeWidth={3} />}
            size="lg"
            color="success"
            variant="flat"
            onPress={handleExportTemplateClass}
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active-bump animate-fade-in-right delay-100"
          >
            {t('class_management.export_button') || "EXPORT TEMPLATE IMPORT"}
          </Button>
        </div>
      </div>

      {/* MINIMAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        {statsData.map((stat, i) => (
          <Card
            key={i}
            className={`bg-white dark:bg-[#111c35] border-none rounded-2xl shadow-sm animate-zoom-in active-bump`}
            style={{ animationFillMode: "both", animationDelay: `${i * 100}ms` }}
          >
            <CardBody className="p-4 flex flex-col justify-center">
              <p className="text-[9px] font-black text-[#A4B5C4] uppercase tracking-widest mb-1 italic">
                {stat.label}
              </p>
              <p className={`text-2xl font-black ${stat.color}`}>
                {stat.value}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder={t('class_management.search_placeholder') || "Search class by code..."}
          value={searchTerm}
          onValueChange={setSearchTerm}
          startContent={<Search size={18} className="text-[#A4B5C4]" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:border-blue-500/50 transition-colors",
          }}
          className="max-w-xs font-medium"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider"
              startContent={<Filter size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              {selectedSemesterName || t('class_management.all_semesters') || "All Semester"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Select Semester" variant="flat">
             <DropdownSection showDivider>
    <DropdownItem
      key="all"
      className="uppercase font-medium text-blue-600"
      onClick={() => {
        setSelectedSemesterId("");
        setSelectedSemesterName(t('class_management.all_semesters') || "All semesters");
      }}
    >
      {t('class_management.all_semesters') || "All semesters"}
    </DropdownItem>
  </DropdownSection>
  <DropdownSection>
            {semesters.length > 0 ? (
              semesters.map((semester: SemesterItem) => (
                <DropdownItem 
                  key={ semester.semesterId}  
                  className="uppercase font-medium"
                  onClick={()=>{setSelectedSemesterId(semester.semesterId)
                    setSelectedSemesterName(semester.name)
                  }}
                >
                  {getDisplayName(semester)}
                </DropdownItem> 
              ))
            ) : (
              <DropdownItem key="no-data" isReadOnly className="opacity-60">
                {t('class_management.no_semesters') || "No semesters available"}
              </DropdownItem>
            )}
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-slate-200 dark:border-white/5 font-bold text-[11px] uppercase tracking-wider"
              startContent={<SortAsc size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              {t('class_management.sort_by') || "Sort By"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Sort options"
            selectionMode="single"
            selectedKeys={new Set([sortBy])}
            onSelectionChange={(keys) => setSortBy((Array.from(keys)[0] as string) || "name")}
          >
            <DropdownItem key="students">{t('class_management.sort_students') || "Student Count"}</DropdownItem>
            <DropdownItem key="name">{t('class_management.sort_name') || "Class Code A-Z"}</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          onPress={() => refetch()}
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors active-bump animate-fade-in-left"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* GRID SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-6">
          {items.map((cls: ClassItem, index: number) => {
            // Lấy instance đầu tiên để hiển thị (có thể có nhiều instance)
            const instance = cls.instances[0];

            return (
              <Link
                key={cls.classId}
                href={`/Management/Class/${cls.classId}`}
                className="block h-full relative group cursor-pointer animate-fade-in-up hover:-translate-y-1 transition-transform duration-300"
                style={{ animationFillMode: "both", animationDelay: `${index * 40}ms` }}
              >

                <Card className="bg-white dark:bg-[#111c35] border-none rounded-2xl transition-all shadow-sm h-[200px] border-b-4 border-transparent hover:shadow-lg group-hover:border-blue-600 dark:group-hover:border-[#22C55E]">
                  <CardBody className="p-5 flex flex-col justify-between h-full relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none" />
                    
                    <div className="space-y-4 relative z-10 w-full">
                      {/* Header row: Class Code & Semester */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-[#071739] dark:text-white uppercase drop-shadow-sm group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors">
                            {cls.classCode}
                          </span>
                          {filter() || <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{instance?.semesterCode || "N/A Semester"}</span>}
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={cls.isActive ? "success" : "default"}
                          className="font-bold border-none h-6 px-2 text-[10px]"
                        >
                          {cls.isActive ? t('class_management.active') || "ACTIVE" : t('class_management.inactive') || "INACTIVE"}
                        </Chip>
                      </div>

                      {/* Details row */}
                      <div className="flex flex-col justify-center h-full pt-2">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 shadow-sm">
                            <CalendarPlus size={16} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-[#071739] dark:text-white">
                              {cls.instances?.length || 0}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {t('class_management.semesters') || "Semesters"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Info Row */}
                    <div className="flex items-center justify-end pt-3 mt-2 border-t border-slate-100 dark:border-white/5 relative z-10">
                      
                      <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-[#1a2542] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <ArrowRight size={12} className="text-slate-400 group-hover:text-white" />
                      </div>
                    </div>
                    
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredClasses.length === 0 && !isLoading && (
          <div className="p-10 text-center text-slate-500 font-medium italic">
            {t('class_management.no_classes') || "No classes found."}
          </div>
        )}

        {/* PAGINATION */}
        {filteredClasses.length > 0 && (
          <div className="flex w-full justify-center py-4">
            <Pagination
              isCompact
              showControls
              showShadow
              page={page}
              total={pages}
              onChange={(p) => setPage(p)}
              classNames={{
                cursor: "bg-[#071739] dark:bg-[#FF5C00] text-white font-bold",
              }}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}