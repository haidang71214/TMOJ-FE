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
import { useGetClassesQuery } from "@/store/queries/Class";
import CreateSlotForm from "./CreateClassSlotModal";
import { useModal } from "@/Provider/ModalProvider";
import UpdateTeacherModal from "./UpdateTeacherModal";
import { useGetALLSemestersQuery } from "@/store/queries/Semester";
import { ClassItem, SemesterItem } from "@/types";



export default function ClassListPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
    const [selectedSemesterName, setSelectedSemesterName] = useState<string | undefined>(undefined);
 
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | undefined>(undefined);
  const { openModal } = useModal();
  const { data: semestersData } = useGetALLSemestersQuery();
  const semesters = semestersData?.data?.items || [];
  console.log("aaaaaaaa",semesters);
  
 const { data, isLoading, refetch } = useGetClassesQuery({
  semesterId: selectedSemesterId,
  // search: searchTerm,   // sau này thêm nếu có
  page: page,
  pageSize: rowsPerPage,
});
  const classes: ClassItem[] = data?.data?.items ?? [];

  console.log("Classes data:", data);

  const pages = Math.ceil(classes.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return classes.slice(start, end);
  }, [page, classes]);

  // Stats
  const statsData = [
    { label: "Total Classes", value: classes.length.toString(), color: "text-blue-500" },
    { 
      label: "Total Students", 
      value: classes.reduce((sum, c) => sum + (c.totalMemberCount || 0), 0).toString(), 
      color: "text-[#FF5C00]" 
    },
    { 
      label: "Active Classes", 
      value: classes.filter(c => c.isActive).length.toString(), 
      color: "text-emerald-500" 
    },
  ];

  const getDisplayName = (semester: SemesterItem) => {
    return `${semester.name}`.trim();
  };

  const openCreateSlotModal = (classId: string) => {
    openModal({
      content: <CreateSlotForm classId={classId} />,
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center min-h-[400px]">
        <Spinner size="lg" color="secondary" />
        <p className="text-sm text-slate-500 animate-pulse mt-3 font-semibold tracking-wide">
          Loading classes...
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
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            CLASS <span className="text-[#FF5C00]">MANAGEMENT</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Organize and monitor your courses
          </p>
        </div>
        <Link href="/Management/Class/create">
          <Button
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all"
            startContent={<Plus size={16} />}
          >
            CREATE NEW CLASS
          </Button>
          
                    <Button
                      startContent={<Download size={16} strokeWidth={3} />}
                      size="lg"
                      color="success"
                      variant="flat"
                      onPress={handleExportTemplateClass}
                    className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all"
            >
                      EXPORT TEMPLATE IMPORT
                    </Button>
        </Link>
      </div>

      {/* MINIMAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        {statsData.map((stat, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-[#111c35] border-none rounded-2xl shadow-sm"
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
          placeholder="Search class..."
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
              {selectedSemesterName || "All Semester"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Select Semester" variant="flat">
             <DropdownSection showDivider>
    <DropdownItem
      key="all"
      className="uppercase font-medium text-blue-600"
      onClick={() => {
        setSelectedSemesterId("");
        setSelectedSemesterName("All semesters");
      }}
    >
      All semesters
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
                No semesters available
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
              Sort By
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Sort">
            <DropdownItem key="students">Student Count</DropdownItem>
            <DropdownItem key="name">Class Code</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          onPress={() => refetch()}
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* GRID SECTION */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-6">
          {items.map((cls: ClassItem) => {
            // Lấy instance đầu tiên để hiển thị (có thể có nhiều instance)
            const instance = cls.instances[0];

            return (
              <div
                key={cls.classId}
                className="h-full relative group cursor-pointer"
              >
                <Link 
                  href={`/Management/Class/${cls.classId}`} 
                  className="absolute inset-0 z-10 rounded-2xl"
                />

                <Card className="bg-white dark:bg-[#111c35] border-none rounded-2xl transition-all p-3 shadow-sm h-full border-b-4 border-transparent group-hover:border-blue-600 dark:group-hover:border-[#22C55E]">
                  <CardBody className="p-2 flex flex-col justify-between h-full gap-5">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                       
                      {filter()}
                       
                        <div className="flex items-center gap-0.5">
                          <span className="text-[10px] font-black text-[#071739] dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors uppercase italic break-all text-right">
                            {cls.classCode}
                          </span>
                          <ArrowRight size={14} className="text-[#A4B5C4] dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-transform group-hover:translate-x-0.5 duration-300" />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Users size={12} className="text-blue-500" />
                          <p className="text-[10px] font-bold italic tracking-tight">
                            {cls.totalMemberCount || 0}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <BookOpen size={12} className={cls.isActive ? "text-emerald-500" : "text-red-500"} />
                          <p className="text-[10px] font-bold italic tracking-tight">
                            {cls.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center w-full">
                      <div className="relative z-20 flex flex-1 h-[34px] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111c35]">
                        
                        {/* Nền đỏ bên trái */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-[#f43f5e] to-[#e11d48] w-full h-full pointer-events-none" 
                          style={{ clipPath: 'polygon(0 0, 52% 0, 46% 100%, 0% 100%)' }} 
                        />
                        
                        {/* Nền vàng bên phải */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-br from-[#f59e0b] to-[#d97706] w-full h-full pointer-events-none" 
                          style={{ clipPath: 'polygon(54% 0, 100% 0, 100% 100%, 48% 100%)' }} 
                        />

                        <Button
                          variant="light"
                          className="flex-1 h-full rounded-none relative z-10 text-white bg-transparent hover:!bg-transparent data-[hover=true]:!bg-transparent font-semibold tracking-wide group/btn1 px-1 min-w-0"
                          startContent={<CalendarPlus size={15} strokeWidth={2.5} className="group-hover/btn1:scale-125 group-active/btn1:scale-95 transition-transform duration-300 drop-shadow-md" />}
                          onPress={() => openCreateSlotModal(cls.classId)}
                        >
                          <span className="text-[11px] group-hover/btn1:opacity-80 transition-opacity drop-shadow-md truncate">Add Slot</span>
                        </Button>

                        <Button
                          variant="light"
                          className="flex-1 h-full rounded-none relative z-10 text-white bg-transparent hover:!bg-transparent data-[hover=true]:!bg-transparent font-semibold tracking-wide group/btn2 px-1 min-w-0"
                          startContent={<UserCog size={15} strokeWidth={2.5} className="group-hover/btn2:scale-125 group-active/btn2:scale-95 transition-transform duration-300 drop-shadow-md" />}
                          onPress={() =>
                            openUpdateTeacherForClass(
                              cls.classId,
                              instance?.teacher?.userId
                            )
                          }
                        >
                          <span className="text-[11px] group-hover/btn2:opacity-80 transition-opacity drop-shadow-md truncate">Update Teacher</span>
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>

        {classes.length === 0 && !isLoading && (
          <div className="p-10 text-center text-slate-500 font-medium">
            No classes found. Create one to get started!
          </div>
        )}

        {/* PAGINATION */}
        {classes.length > 0 && (
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