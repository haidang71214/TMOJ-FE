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
  Switch,
  Tooltip,
  Input,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "../../components/DeleteModal";
import { Subject } from "@/types";

const MOCK_SUBJECTS: Subject[] = [
  {
    id: "SDN302",
    name: "NodeJS & Express Development",
    department: "Software Engineering",
    credits: 3,
    totalProblems: 120,
    visible: true,
    createdAt: "2025-01-01",
  },
  {
    id: "PRN231",
    name: "Cross-platform with .NET",
    department: "Software Engineering",
    credits: 3,
    totalProblems: 85,
    visible: true,
    createdAt: "2025-01-02",
  },
  {
    id: "DBI202",
    name: "Database Introduction",
    department: "Information System",
    credits: 3,
    totalProblems: 200,
    visible: false,
    createdAt: "2025-01-03",
  },
];

const DEPARTMENTS = [
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Information System", value: "Information System" },
  { label: "Artificial Intelligence", value: "Artificial Intelligence" },
];

export default function SubjectListPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const createModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pages = Math.ceil(MOCK_SUBJECTS.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return MOCK_SUBJECTS.slice(start, start + rowsPerPage);
  }, [page]);

  const handleSubmit = async (onClose: () => void) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(isEditMode ? "Subject Updated!" : "Subject Created!", {
      description: isEditMode
        ? "The changes have been saved successfully."
        : "New subject has been added to the system.",
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleOpenEdit = (subject: Subject) => {
    setIsEditMode(true);
    setSelectedSubject(subject);
    createModal.onOpen();
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedSubject(null);
    createModal.onOpen();
  };

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            SUBJECT <span className="text-[#FF5C00]">CURRICULUM</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Manage academic subjects and repositories
          </p>
        </div>
        <Button
          onPress={handleOpenCreate}
          startContent={<Plus size={20} strokeWidth={3} />}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
        >
          CREATE NEW SUBJECT
        </Button>
      </div>

      {/* FILTER & SEARCH SECTION */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search code or name..."
          startContent={<Search size={18} className="text-[#A4B5C4]" />}
          classNames={{
            inputWrapper:
              "bg-white dark:bg-[#111c35] rounded-xl h-12 border border-slate-200 dark:border-white/5 shadow-none focus-within:!border-[#FF5C00]",
          }}
          className="max-w-xs font-bold italic"
        />

        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="flat"
              className="h-12 rounded-xl bg-white dark:bg-[#111c35] border border-divider font-[1000] text-[10px] uppercase italic text-[#071739] dark:text-white"
              startContent={<Filter size={16} />}
              endContent={<ChevronDown size={14} />}
            >
              Department
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Filter Dept">
            {DEPARTMENTS.map((dept) => (
              <DropdownItem
                key={dept.value}
                className="font-bold uppercase text-[10px] italic"
              >
                {dept.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <Button
          isIconOnly
          className="h-12 w-12 rounded-xl bg-blue-600 text-white shadow-md transition-transform hover:scale-105"
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
            <TableColumn>CODE</TableColumn>
            <TableColumn>SUBJECT NAME</TableColumn>
            <TableColumn>DEPARTMENT</TableColumn>
            <TableColumn className="text-center">CREDITS</TableColumn>
            <TableColumn className="text-center">VISIBLE</TableColumn>
            <TableColumn className="text-right">OPERATIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((s) => (
              <TableRow
                key={s.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <span className="font-[1000] italic text-blue-600 dark:text-[#FF5C00] uppercase tracking-tighter">
                    {s.id}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-[1000] uppercase italic tracking-tight">
                    {s.name}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="flat"
                    size="sm"
                    className="font-black uppercase text-[9px] px-2 bg-blue-500/10 text-blue-500 border-none"
                  >
                    {s.department}
                  </Chip>
                </TableCell>
                <TableCell className="text-center font-black italic">
                  {s.credits}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    defaultSelected={s.visible}
                    size="sm"
                    color="success"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip content="Edit Subject">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleOpenEdit(s)}
                        className="text-blue-600"
                      >
                        <Edit3 size={18} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete Subject" color="danger">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => {
                          setSelectedSubject(s);
                          deleteModal.onOpen();
                        }}
                        className="text-danger"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </Tooltip>
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

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={createModal.isOpen}
        onOpenChange={createModal.onOpenChange}
        backdrop="blur"
        classNames={{ base: "rounded-[2.5rem] dark:bg-[#111c35] p-2" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="uppercase font-[1000] italic text-xl">
                {isEditMode ? "Update" : "New"}{" "}
                <span className="text-[#FF5C00]">Subject</span>
              </ModalHeader>
              <ModalBody className="gap-6">
                <Input
                  label="Subject Code"
                  placeholder="e.g. SDN302"
                  defaultValue={selectedSubject?.id}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    label:
                      "font-black text-[10px] uppercase italic text-slate-400",
                  }}
                />
                <Input
                  label="Subject Name"
                  placeholder="e.g. Node JS"
                  defaultValue={selectedSubject?.name}
                  variant="bordered"
                  labelPlacement="outside"
                  classNames={{
                    label:
                      "font-black text-[10px] uppercase italic text-slate-400",
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Credits"
                    type="number"
                    defaultValue={selectedSubject?.credits.toString()}
                    variant="bordered"
                    labelPlacement="outside"
                    classNames={{
                      label:
                        "font-black text-[10px] uppercase italic text-slate-400",
                    }}
                  />

                  <Autocomplete
                    label={
                      <span className="font-black text-[10px] uppercase italic text-slate-400">
                        Department
                      </span>
                    }
                    placeholder="Select or type new"
                    variant="bordered"
                    labelPlacement="outside"
                    allowsCustomValue
                    defaultSelectedKey={selectedSubject?.department}
                    classNames={{
                      base: "max-w-full",
                      popoverContent: "bg-[#111c35] border border-divider",
                    }}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <AutocompleteItem
                        key={dept.value}
                        className="font-bold uppercase text-[10px] italic"
                      >
                        {dept.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="font-black text-[10px] uppercase italic"
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#FF5C00] text-white font-black text-[10px] uppercase italic shadow-lg"
                  isLoading={isSubmitting}
                  onPress={() => handleSubmit(onClose)}
                  startContent={!isSubmitting && <Save size={16} />}
                >
                  {isEditMode ? "Save Changes" : "Create Subject"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        userName={selectedSubject?.id}
        type="student" // Bạn có thể thêm case 'subject' vào DeleteModal sau
      />

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
