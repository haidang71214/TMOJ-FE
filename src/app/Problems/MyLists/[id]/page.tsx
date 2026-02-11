"use client";

import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CircularProgress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Checkbox,
  Textarea,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import {
  Play,
  Share2,
  RotateCcw,
  Lock,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Check,
  ArrowUpToLine,
  ArrowDownToLine,
  AlertCircle, // Icon cho Reset Modal
} from "lucide-react";
import { useParams } from "next/navigation";
import ProblemsSidebar from "../../Sidebar";
import { ListControls } from "../ListControls";
import { toast } from "sonner";

const MY_LIST_PROBLEMS = [
  {
    id: "1",
    title: "Two Sum",
    acceptance: "56.7%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "8",
    title: "String to Integer (atoi)",
    acceptance: "20.2%",
    difficulty: "Med.",
    isLocked: true,
  },
  {
    id: "15",
    title: "3Sum",
    acceptance: "34.1%",
    difficulty: "Med.",
    isLocked: false,
  },
  {
    id: "20",
    title: "Valid Parentheses",
    acceptance: "41.5%",
    difficulty: "Easy",
    isLocked: false,
  },
  {
    id: "42",
    title: "Trapping Rain Water",
    acceptance: "62.3%",
    difficulty: "Hard",
    isLocked: true,
  },
  {
    id: "70",
    title: "Climbing Stairs",
    acceptance: "53.1%",
    difficulty: "Easy",
    isLocked: false,
  },
];

export default function MyListDetailPage() {
  const params = useParams();
  const currentId = params.id as string;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [myList, setMyList] = useState(MY_LIST_PROBLEMS);

  // Disclosure quản lý Modal
  const removeModal = useDisclosure();
  const editModal = useDisclosure();
  const addQuestionsModal = useDisclosure();
  const resetProgressModal = useDisclosure(); // Modal mới

  const [problemToRemoveId, setProblemToRemoveId] = useState<string | null>(
    null
  );
  const [listTitle, setListTitle] = useState(currentId || "My Favorite");
  const [listDesc, setListDesc] = useState(
    "Keep track of the most challenging algorithm problems."
  );
  const [clearCodeChecked, setClearCodeChecked] = useState(false);

  // Logic Xử lý vị trí và xóa bài tập
  const handleProblemAction = (key: React.Key, probId: string) => {
    const index = myList.findIndex((p) => p.id === probId);
    if (index === -1) return;
    const newList = [...myList];
    const [item] = newList.splice(index, 1);

    if (key === "move-top") {
      newList.unshift(item);
      setMyList(newList);
      toast.success("Moved to top");
    } else if (key === "move-bot") {
      newList.push(item);
      setMyList(newList);
      toast.success("Moved to bottom");
    } else if (key === "delete") {
      setProblemToRemoveId(probId);
      removeModal.onOpen();
    }
  };
  const confirmRemoveProblem = () => {
    if (!problemToRemoveId) return; // Sử dụng giá trị để kiểm tra
    setMyList((prev) => prev.filter((p) => p.id !== problemToRemoveId));
    toast.error("Removed from list");
    setProblemToRemoveId(null); // Reset sau khi dùng xong
    removeModal.onClose();
  };

  const confirmResetProgress = () => {
    toast.success("Progress has been reset", {
      description: clearCodeChecked
        ? "All progress and saved codes cleared."
        : "Questions moved back to incomplete.",
    });
    resetProgressModal.onClose();
  };

  return (
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans flex relative overflow-hidden transition-colors duration-500">
      <aside
        className={`transition-all duration-300 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden shrink-0 z-40 shadow-xl ${
          isSidebarOpen ? "w-[260px]" : "w-0"
        }`}
      >
        <div className="w-[260px] p-6 pr-2">
          <ProblemsSidebar />
        </div>
      </aside>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ left: isSidebarOpen ? "244px" : "12px" }}
        className="fixed top-24 z-50 w-8 h-8 bg-white dark:bg-[#1C2737] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-xl text-slate-400 hover:text-[#FF5C00] transition-all cursor-pointer"
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="flex-1 flex flex-col relative min-w-0 h-screen overflow-hidden">
        <div className="flex flex-1 overflow-y-auto p-8 lg:p-12 gap-8 lg:flex-row flex-col custom-scrollbar">
          {/* CỘT TRÁI */}
          <div className="w-full lg:w-[340px] bg-white dark:bg-[#1C2737] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 flex flex-col items-center text-center gap-6 shadow-sm h-fit sticky top-0">
            <div className="w-24 h-24 bg-slate-50 dark:bg-black/20 rounded-[2rem] flex items-center justify-center border shadow-inner text-5xl">
              {currentId === "Favorite" ? "⭐" : "🗒️"}
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-[1000] uppercase text-[#071739] dark:text-white tracking-tighter">
                {listTitle}
              </h1>
              <div className="flex items-center gap-2 justify-center">
                <div className="h-1 w-8 bg-blue-600 dark:bg-[#00FF41] rounded-full" />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  {myList.length} QUESTIONS
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full items-center">
              <div className="flex gap-2 justify-center w-full flex-wrap">
                <Button
                  className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[11px] tracking-widest active:scale-95 transition-all"
                  startContent={<Play size={16} fill="currentColor" />}
                >
                  Practice
                </Button>
                <Tooltip content="Add Questions">
                  <Button
                    isIconOnly
                    variant="flat"
                    className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 h-11 w-11 rounded-xl border border-blue-200 dark:border-blue-500/30"
                    onPress={addQuestionsModal.onOpen}
                  >
                    <Plus size={20} strokeWidth={3} />
                  </Button>
                </Tooltip>
                <Button
                  isIconOnly
                  variant="flat"
                  className="bg-slate-100 dark:bg-white/5 h-11 w-11 rounded-xl"
                >
                  <Share2 size={18} />
                </Button>
                <Dropdown placement="bottom-end" className="dark:bg-[#1C2737]">
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      variant="flat"
                      className="bg-slate-100 dark:bg-white/5 h-11 w-11 rounded-xl"
                    >
                      <MoreHorizontal size={18} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="List Actions">
                    <DropdownItem
                      key="edit"
                      startContent={<Pencil size={16} />}
                      onPress={editModal.onOpen}
                    >
                      Edit list info
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Trash2 size={16} />}
                      onPress={removeModal.onOpen}
                    >
                      Delete collection
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <p className="text-[13px] font-bold text-slate-500 italic dark:text-slate-400 px-4 leading-relaxed">
                &ldquo;{listDesc}&rdquo;
              </p>
            </div>

            <div className="w-full p-6 border border-slate-100 dark:border-white/5 rounded-[2rem] bg-slate-50/50 dark:bg-black/20 text-left mt-2">
              <div className="flex justify-between items-center text-[10px] font-black mb-6 uppercase text-slate-400 tracking-[0.2em]">
                <span>Stats</span>
                {/* BẤM VÀO ĐÂY ĐỂ RESET */}
                <Tooltip content="Reset Progress">
                  <RotateCcw
                    size={14}
                    className="cursor-pointer hover:rotate-180 transition-all duration-500 text-slate-400 hover:text-rose-500"
                    onClick={resetProgressModal.onOpen}
                  />
                </Tooltip>
              </div>
              <div className="relative flex items-center justify-center">
                <CircularProgress
                  classNames={{
                    svg: "w-32 h-32",
                    indicator: "stroke-blue-600 dark:stroke-[#00FF41]",
                    track: "stroke-slate-200/50 dark:stroke-white/5",
                  }}
                  value={0}
                  maxValue={myList.length}
                  strokeWidth={3}
                />
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-[#071739] dark:text-white">
                    0
                    <span className="text-slate-300 text-sm ml-1">
                      /{myList.length}
                    </span>
                  </span>
                  <span className="text-[8px] text-slate-400 font-black uppercase">
                    Solved
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="flex-1 bg-white dark:bg-[#1C2737] rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 shadow-sm h-fit">
            <ListControls />
            <div className="mt-8 overflow-x-auto">
              <div className="grid grid-cols-[1fr_120px_100px_80px] px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5 min-w-[500px]">
                <span>Question Title</span>
                <span className="text-right">Acceptance</span>
                <span className="text-right">Difficulty</span>
                <span className="text-center">Action</span>
              </div>
              <div className="flex flex-col mt-4 min-w-[500px]">
                {myList.map((prob) => (
                  <div
                    key={prob.id}
                    className="grid grid-cols-[1fr_120px_100px_80px] px-6 py-5 items-center cursor-pointer transition-all border-b border-slate-50 dark:border-white/5 group hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl"
                  >
                    <div className="flex gap-5 items-center overflow-hidden">
                      <span className="text-slate-300 dark:text-slate-600 font-black text-xs w-8 text-right shrink-0">
                        {prob.id}
                      </span>
                      <div className="flex items-center gap-3 truncate font-bold text-[#071739] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors">
                        {prob.title}{" "}
                        {prob.isLocked && (
                          <Lock
                            size={14}
                            className="text-[#FF5C00]"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-right text-[13px] text-slate-400 font-bold">
                      {prob.acceptance}
                    </span>
                    <span
                      className={`text-right text-[11px] font-black uppercase tracking-wider ${
                        prob.difficulty === "Easy"
                          ? "text-teal-500"
                          : prob.difficulty === "Med."
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                    <div className="flex justify-center">
                      <Dropdown
                        placement="bottom-end"
                        className="dark:bg-[#1C2737]"
                      >
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="text-slate-400 group-hover:text-[#071739] dark:group-hover:text-white"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Problem Actions"
                          onAction={(k) => handleProblemAction(k, prob.id)}
                        >
                          <DropdownItem
                            key="move-top"
                            startContent={<ArrowUpToLine size={16} />}
                          >
                            Move to Top
                          </DropdownItem>
                          <DropdownItem
                            key="move-bot"
                            startContent={<ArrowDownToLine size={16} />}
                          >
                            Move to Bottom
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash2 size={16} />}
                          >
                            Remove from list
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <Modal
        isOpen={resetProgressModal.isOpen}
        onOpenChange={resetProgressModal.onOpenChange}
        size="lg"
        backdrop="blur"
        classNames={{ base: "dark:bg-[#1C2737] rounded-[2rem]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-full text-rose-600">
                  <AlertCircle size={24} strokeWidth={3} />
                </div>
                <span className="text-xl font-black uppercase italic">
                  Reset progress
                </span>
              </ModalHeader>
              <ModalBody className="py-2">
                <p className="text-sm font-bold text-slate-500 leading-relaxed mb-4">
                  Resetting progress will move all questions back to incomplete.
                  This action cannot be undone.
                </p>
                <Checkbox
                  size="sm"
                  isSelected={clearCodeChecked}
                  onValueChange={setClearCodeChecked}
                  color="danger"
                  classNames={{
                    label: "font-bold text-slate-600 dark:text-slate-300",
                  }}
                >
                  Clear codes saved in code editor
                </Checkbox>
              </ModalBody>
              <ModalFooter className="mt-4">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-bold rounded-xl px-8 h-12"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="font-black uppercase tracking-widest rounded-xl px-10 h-12 shadow-lg shadow-rose-500/20"
                  onPress={confirmResetProgress}
                >
                  Reset
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={removeModal.isOpen}
        onOpenChange={removeModal.onOpenChange}
        size="sm"
        classNames={{ base: "dark:bg-[#1C2737] rounded-[2rem]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase text-rose-600 italic">
                Remove from list?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm font-bold text-slate-500 italic">
                  Are you sure you want to remove this problem from your
                  collection?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="font-black uppercase text-[11px] rounded-xl"
                  onPress={confirmRemoveProblem}
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ADD QUESTIONS MODAL */}
      <Modal
        isOpen={addQuestionsModal.isOpen}
        onOpenChange={addQuestionsModal.onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        classNames={{ base: "dark:bg-[#1C2737] rounded-[2rem]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-black uppercase italic">
                Add Questions to List
              </ModalHeader>
              <ModalBody className="py-6 gap-6">
                <Input
                  placeholder="Search questions"
                  startContent={<Search size={18} className="text-slate-400" />}
                  variant="bordered"
                  className="font-bold"
                />
                <div className="flex flex-col gap-2">
                  {["Two Sum", "Add Two Numbers", "Longest Substring"].map(
                    (q, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-black/20 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <Check
                            size={18}
                            className={
                              i === 0 ? "text-green-500" : "text-transparent"
                            }
                          />
                          <span className="font-bold text-sm text-slate-600 dark:text-slate-300">
                            {i + 1}. {q}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-[10px] font-black uppercase ${
                              i % 2 === 0 ? "text-teal-500" : "text-amber-500"
                            }`}
                          >
                            {i % 2 === 0 ? "Easy" : "Med."}
                          </span>
                          <Checkbox />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" className="font-bold" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-[#071739] dark:bg-white text-white dark:text-black font-black rounded-xl"
                  onPress={() => {
                    toast.success("Added!");
                    onClose();
                  }}
                >
                  Add to List
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        size="md"
        classNames={{ base: "dark:bg-[#1C2737] rounded-[2rem]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-black uppercase italic">
                Edit list info
              </ModalHeader>
              <ModalBody className="gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Title
                  </p>
                  <Input
                    variant="bordered"
                    value={listTitle}
                    onValueChange={setListTitle}
                    endContent={
                      <span className="text-[10px] text-slate-300">
                        {listTitle.length}/30
                      </span>
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Description
                  </p>
                  <Textarea
                    variant="bordered"
                    value={listDesc}
                    onValueChange={setListDesc}
                    minRows={3}
                  />
                  <p className="text-right text-[10px] text-slate-300">
                    {listDesc.length}/150
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  className="font-bold rounded-xl"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#071739] dark:bg-white text-white dark:text-black font-black rounded-xl px-8"
                  onPress={() => {
                    toast.success("Saved!");
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* REMOVE PROBLEM MODAL */}
      <Modal
        isOpen={removeModal.isOpen}
        onOpenChange={removeModal.onOpenChange}
        size="sm"
        classNames={{ base: "dark:bg-[#1C2737] rounded-[2rem]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase text-rose-600 italic">
                Remove from list?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm font-bold text-slate-500">
                  Are you sure you want to remove this problem? This list will
                  be updated.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-bold rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="font-black uppercase text-[11px] rounded-xl"
                  onPress={confirmResetProgress}
                >
                  Remove
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
