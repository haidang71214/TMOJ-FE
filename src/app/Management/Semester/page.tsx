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
  Chip,
  Pagination,
  Spinner,
  Tooltip,
  useDisclosure,
  addToast,
} from "@heroui/react";
import {
  Plus,
  Edit,
  Eye,
  EyeOff,
  Search,
  RefreshCw,
  Calendar,
} from "lucide-react";
import {
  useGetALLSemestersQuery,
  useUpdateSemesterMutation,
} from "@/store/queries/Semester";
import CreateUpdateSemester from "./CreateUpdateSemester";
import { CreateSemesterRequest, ErrorForm } from "@/types";
import SemesterImportExport from "@/Provider/ImportExportSemesterButton";

export default function SemesterPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { data, isLoading, isError, error, refetch } = useGetALLSemestersQuery();
  console.log(data);
  const [updateSemester] = useUpdateSemesterMutation();

  const semesters = data?.data?.items ?? [];

  const totalItems = semesters.length;
  const pages = Math.ceil(totalItems / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return semesters.slice(start, end);
  }, [page, semesters]);

  const createModal = useDisclosure();
  const [editingSemester, setEditingSemester] = useState<CreateSemesterRequest|null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const handleOpenCreate = () => {
    setEditingSemester(null);
    createModal.onOpen();
  };

  const handleOpenEdit = (sem: CreateSemesterRequest) => {
    setEditingSemester(sem);
    createModal.onOpen();
  };

  // Toggle active/inactive (PUT)
  const handleToggleActive = async (
  semesterId: string,
  code :string,
  name: string,
  currentActive: boolean,
  startAt : string, 
  endAt:string
) => {
  const actionText = currentActive ? "hide" : "show";
  const newActive = !currentActive;

  setTogglingId(semesterId);

  try {
await updateSemester({
  id: semesterId,
  data: {
    code,
    name,
    startAt,
    endAt,
    isActive: newActive,
  },
}).unwrap();

    addToast({
      title: "Success",
      description: `Semester "${name}" has been ${actionText}n`,
      color: "success",
      timeout: 4000,
    });

    // refetch(); // nếu cần reload list
  } catch (err: unknown) {
  console.error("Toggle failed:", err);

  const error = err as ErrorForm;

  addToast({
    title: "Error",
    description: error?.data?.data?.message || `Failed to ${actionText} semester`,
    color: "danger",
    timeout: 6000,
  });
  } finally {
    setTogglingId(null);
  }
};

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Spinner size="lg" color="primary" />
        <p className="mt-4 text-slate-500">Loading semesters...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8">
        <div className="text-red-500 text-2xl mb-4">An error occurred</div>
        <p className="text-slate-400 mb-6">
       {(error as ErrorForm)?.data?.data?.message || "Unable to load semester list"}
        </p>
        <Button color="primary" onPress={refetch}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            SEMESTER <span className="text-[#FF5C00]">MANAGEMENT</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Manage and monitor all academic semesters
          </p>
        </div>
       <div className="flex gap-3">
  <SemesterImportExport />

  <Button
    startContent={<Plus size={20} strokeWidth={3} />}
    onPress={handleOpenCreate}
    className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
  >
    CREATE NEW SEMESTER
  </Button>
</div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search by name or code..."
          startContent={<Search size={18} className="text-slate-400" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 shadow-sm border border-slate-200 dark:border-white/5 focus-within:!border-blue-600 dark:focus-within:!border-[#22C55E] transition-colors",
          }}
          className="max-w-xs font-medium"
        />

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-90 ml-auto"
          onPress={refetch}
        >
          <RefreshCw size={18} />
        </Button>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Table
          aria-label="Semester Management Table"
          removeWrapper
          classNames={{
            base: "bg-white dark:bg-[#111c35] rounded-[2.5rem] p-4 shadow-sm border border-transparent dark:border-white/5",
            th: "bg-transparent text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-white/5 pb-4 px-6",
            td: "py-6 font-bold text-[#071739] dark:text-slate-200 border-b border-slate-50 dark:border-white/5 last:border-none px-6",
          }}
        >
          <TableHeader>
            <TableColumn>CODE</TableColumn>
            <TableColumn>SEMESTER NAME</TableColumn>
            <TableColumn>PERIOD</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>IS ACTIVE</TableColumn>
            <TableColumn className="text-right">OPERATIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No semesters found">
            {items.map((sem) => (
              <TableRow
                key={sem.semesterId}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell>
                 <Chip size="sm" className="text-[10px] text-blue-600 bg-blue-500/10 px-2">
  {sem.code}
</Chip>
                </TableCell>
                <TableCell className="max-w-[100px]">
                <span className="block truncate text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#22C55E] transition-colors leading-none">
                  {sem.name}
                </span>
              </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="font-medium">
                      {sem.startAt} → {sem.endAt}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    size="sm"
                    className={`font-black uppercase text-[9px] px-3 ${
                      new Date(sem.endAt) < new Date()
                        ? "bg-gray-500/10 text-gray-500"
                        : new Date(sem.startAt) > new Date()
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {new Date(sem.endAt) < new Date()
                      ? "ENDED"
                      : new Date(sem.startAt) > new Date()
                      ? "UPCOMING"
                      : "ACTIVE"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    size="sm"
                    className={`font-black uppercase text-[9px] px-3 ${
                      sem.isActive
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {sem.isActive ? "ACTIVE" : "INACTIVE"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-3">
                    <Tooltip content="Edit Semester" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onClick={() => handleOpenEdit(sem)}
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Edit size={16} />
                      </Button>
                    </Tooltip>

                    {/* Toggle active button (eye icon) */}
                    <Tooltip
                      content={sem.isActive ? "Hide Semester" : "Show Semester"}
                      className="font-bold text-[10px]"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        isLoading={togglingId === sem.semesterId}
                        onPress={() => handleToggleActive(sem.semesterId,sem.code ,sem.name, sem.isActive,sem.startAt, sem.endAt)}
                        className={`transition-all rounded-lg h-9 w-9 ${
                          sem.isActive
                            ? "text-emerald-500 hover:text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30"
                            : "text-gray-500 hover:text-emerald-500 bg-gray-100 dark:bg-gray-800/50"
                        }`}
                        disabled={togglingId === sem.semesterId}
                      >
                        {sem.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
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

      <CreateUpdateSemester
        open={createModal.isOpen}
        setOpen={createModal.onOpenChange}
        semester={editingSemester}
      />
    </div>
  );
}