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
  ChevronLeft,
  ChevronRight,
  Trash2,
  MoreHorizontal,
  Pencil,
  Plus,
  Check,
  Search,
  RotateCcw,
  ArrowUpToLine,
  ArrowDownToLine,
  AlertCircle,
  GripVertical,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Reorder } from "framer-motion";
import ProblemsSidebar from "../../Sidebar";
import { ListControls } from "../ListControls";
import AddQuestionsToCollectionModal from "../../components/AddQuestionsToCollectionModal";
import { toast } from "sonner";
import { useGetCollectionDetailQuery, useDeleteCollectionItemMutation, useUpdateCollectionMutation, useDeleteCollectionMutation, useReorderCollectionItemsMutation } from "@/store/queries/collections";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import { useGetFavoriteProblemsQuery } from "@/store/queries/favorites";
import { useTranslation } from "@/hooks/useTranslation";



export default function MyListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const currentId = params.id as string;
  const { t, language } = useTranslation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: user } = useGetUserInformationQuery();

  // Real data fetching - Standard Collection
  const { data: collectionDetail, isLoading: isCollLoading } = useGetCollectionDetailQuery(currentId, { skip: currentId === "Favorite" });

  // Real data fetching - System Favorite Problems
  const { data: favoriteProblems, isLoading: isFavLoading } = useGetFavoriteProblemsQuery({ page: 1, pageSize: 100 }, { skip: currentId !== "Favorite" });

  const [deleteItem] = useDeleteCollectionItemMutation();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [reorderItems] = useReorderCollectionItemsMutation();

  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [updateCollection, { isLoading: isUpdating }] = useUpdateCollectionMutation();

  const isFavoritePage = currentId === "Favorite" || collectionDetail?.data?.type === "problem_favorite";

  const rawDetail: any = collectionDetail?.data || collectionDetail;
  const rawFav: any = favoriteProblems?.data || favoriteProblems;

  // Robust items extraction logic
  const getItems = (src: any) => {
    if (!src) return [];
    if (Array.isArray(src)) return src;
    if (src.items && Array.isArray(src.items)) return src.items;
    if (src.data) return getItems(src.data); // Recursively dig into 'data'
    return [];
  };

  const getMeta = (src: any) => {
    if (!src) return null;
    if (src.name || src.description) return src;
    if (src.data) return getMeta(src.data);
    return null;
  };

  const items = React.useMemo(
    () => (isFavoritePage ? getItems(rawFav) : getItems(rawDetail)),
    [isFavoritePage, rawFav, rawDetail]
  );

  React.useEffect(() => {
    if (items) {
      setOrderedItems(items);
    }
  }, [items]);

  const handleReorder = async (newOrder: any[]) => {
    setOrderedItems(newOrder);
    try {
      const payload = {
        items: newOrder.map((item, index) => ({
          itemId: item.id,
          orderIndex: index + 1
        }))
      };
      console.log("Reorder Payload:", payload);
      await reorderItems({ id: currentId, body: payload }).unwrap();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to sync order");
    }
  };
  const activeMeta = isFavoritePage ? null : getMeta(rawDetail);
  console.log("Collection items structure:", { currentId, isFavoritePage, rawDetail, rawFav, items, activeMeta });

  // States for Editing
  const [listTitle, setListTitle] = useState(currentId === "Favorite" ? "Favorite Problems" : "Loading...");
  const [listDesc, setListDesc] = useState("Your collections");
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    if (isFavoritePage) {
      setListTitle("Favorite Problems");
      setListDesc("Your favorited problems");
    } else if (activeMeta?.name) {
      setListTitle(activeMeta.name);
      setListDesc(activeMeta.description || "Collection items");
      setIsVisible(!!activeMeta.isVisibility);
    }
  }, [activeMeta, isFavoritePage]);

  // Modal control
  const removeModal = useDisclosure();
  const deleteListModal = useDisclosure();
  const editModal = useDisclosure();
  const addQuestionsModal = useDisclosure();
  const resetProgressModal = useDisclosure();

  const [clearCodeChecked, setClearCodeChecked] = useState(false);
  const [problemToRemoveId, setProblemToRemoveId] = useState<string | null>(null);

  const isLoading = currentId === "Favorite" ? isFavLoading : isCollLoading;

  const handleProblemAction = async (key: React.Key, itemId: string) => {
    if (key === "delete") {
      setProblemToRemoveId(itemId);
      removeModal.onOpen();
    } else if (key === "move-top") {
      const itemIndex = orderedItems.findIndex(i => i.id === itemId);
      if (itemIndex > 0) {
        const newOrder = [...orderedItems];
        const [movedItem] = newOrder.splice(itemIndex, 1);
        newOrder.unshift(movedItem);
        handleReorder(newOrder);
      }
    } else if (key === "move-bot") {
      const itemIndex = orderedItems.findIndex(i => i.id === itemId);
      if (itemIndex < orderedItems.length - 1) {
        const newOrder = [...orderedItems];
        const [movedItem] = newOrder.splice(itemIndex, 1);
        newOrder.push(movedItem);
        handleReorder(newOrder);
      }
    } else if (key === "move-up") {
      const itemIndex = orderedItems.findIndex(i => i.id === itemId);
      if (itemIndex > 0) {
        const newOrder = [...orderedItems];
        const [movedItem] = newOrder.splice(itemIndex, 1);
        newOrder.splice(itemIndex - 1, 0, movedItem);
        handleReorder(newOrder);
      }
    } else if (key === "move-down") {
      const itemIndex = orderedItems.findIndex(i => i.id === itemId);
      if (itemIndex < orderedItems.length - 1) {
        const newOrder = [...orderedItems];
        const [movedItem] = newOrder.splice(itemIndex, 1);
        newOrder.splice(itemIndex + 1, 0, movedItem);
        handleReorder(newOrder);
      }
    }
  };

  const confirmResetProgress = () => {
    toast.success("Feature under development");
    resetProgressModal.onClose();
  };

  const confirmRemoveItem = async () => {
    if (!problemToRemoveId) return;
    try {
      await deleteItem({ id: currentId, itemId: problemToRemoveId }).unwrap();
      toast.success("Problem removed from list");
      removeModal.onClose();
      setProblemToRemoveId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove problem");
    }
  };

  const handleDeleteCollection = async () => {
    try {
      await deleteCollection(currentId).unwrap();
      toast.success("Collection deleted successfully");
      router.push("/Problems/MyLists");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete collection");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateCollection({
        id: currentId,
        body: {
          name: listTitle,
          description: listDesc,
          isVisibility: isVisible
        }
      }).unwrap();
      toast.success("Collection updated successfully!");
      editModal.onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update collection");
    }
  };


  return (
    <main className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] font-sans flex relative overflow-hidden transition-colors duration-500">
      <aside
        className={`transition-all duration-300 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#1C2737] sticky top-0 h-screen overflow-hidden shrink-0 z-40 shadow-xl ${isSidebarOpen ? "w-[260px]" : "w-0"
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
                  {items.length} QUESTIONS
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full items-center">
              <div className="flex gap-2 justify-center w-full flex-wrap">
                <Button
                  className="bg-linear-to-r from-[#071739] to-[#1a2a4b] dark:from-[#FF5C00] dark:to-[#ff8c4d] text-white dark:text-[#071739] font-black h-12 px-8 rounded-2xl shadow-xl shadow-blue-900/20 dark:shadow-orange-500/40 uppercase text-[12px] tracking-[0.15em] active:scale-95 transition-all hover:-translate-y-0.5"
                  startContent={<Play size={18} fill="currentColor" />}
                  onPress={() => {
                    if (orderedItems.length > 0) {
                      const firstItem = orderedItems[0];
                      const targetId = firstItem.problemId || firstItem.contestId || firstItem.id;
                      const isProblem = !!firstItem.problemId;
                      router.push(isProblem ? `/Problems/${targetId}` : `/Contests/${targetId}`);
                    } else {
                      toast.error("No items to practice!");
                    }
                  }}
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
                <Tooltip content="Share list">
                  <Button
                    isIconOnly
                    variant="flat"
                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 h-11 w-11 rounded-xl shadow-sm hover:border-[#FF5C00] dark:hover:border-[#FF5C00] transition-all"
                    onPress={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    <Share2 size={18} className="text-slate-500 dark:text-slate-400 group-hover:text-[#FF5C00]" />
                  </Button>
                </Tooltip>
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
                      key="reset"
                      startContent={<RotateCcw size={16} />}
                      onPress={resetProgressModal.onOpen}
                    >
                      Reset progress
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      startContent={<Trash2 size={16} />}
                      onPress={deleteListModal.onOpen}
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
              </div>
              <div className="relative flex items-center justify-center">
                <CircularProgress
                  classNames={{
                    svg: "w-32 h-32",
                    indicator: "stroke-blue-600 dark:stroke-[#00FF41]",
                    track: "stroke-slate-200/50 dark:stroke-white/5",
                  }}
                  value={0}
                  maxValue={Math.max(1, items.length)}
                  strokeWidth={3}
                />
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-[#071739] dark:text-white">
                    0
                    <span className="text-slate-300 text-sm ml-1">
                      /{items.length}
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
              <Reorder.Group
                axis="y"
                values={orderedItems}
                onReorder={handleReorder}
                className="flex flex-col mt-4 min-w-[500px]"
              >
                {orderedItems.map((item: any, idx: number) => {
                  const isProblem = !!item.problemId;
                  const title = item.problemTitle || item.contestTitle || item.name || item.title || "Untitled";
                  const targetId = item.problemId || item.contestId || item.id;
                  const route = isProblem ? `/Problems/${targetId}` : `/Contests/${targetId}`;

                  if (idx === 0) console.log("First item sample:", item);

                  return (
                    <Reorder.Item
                      key={item.id}
                      value={item}
                      id={item.id}
                    >
                      <div
                        onClick={() => router.push(route)}
                        className="grid grid-cols-[1fr_120px_100px_80px] px-6 py-5 items-center cursor-pointer transition-all border-b border-slate-50 dark:border-white/5 group hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl active:cursor-grabbing bg-white dark:bg-[#1C2737]"
                      >
                        <div className="flex gap-4 items-center overflow-hidden">
                          <div className="text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing p-1 hover:text-blue-500 transition-colors shrink-0">
                            <GripVertical size={16} />
                          </div>
                          <span className="text-slate-300 dark:text-slate-500 font-black text-[10px] w-6 text-right shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                            {idx + 1}
                          </span>
                          <div className="flex items-center gap-3 truncate font-bold text-[#071739] dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#00FF41] transition-colors uppercase tracking-tight">
                            {title}
                          </div>
                        </div>
                        <div className="text-right flex justify-end">
                          <span className="text-[13px] text-slate-400 font-bold tabular-nums">
                            {(() => {
                              // Ưu tiên acceptancePercent theo Response 1 từ F12
                              const acc = item.acceptancePercent ?? item.acceptanceRate ?? item.problem?.acceptancePercent ?? item.problem?.acceptanceRate ?? item.problemAcceptanceRate;
                              return (acc !== undefined && acc !== null) ? `${Number(acc).toFixed(1)}%` : "--";
                            })()}
                          </span>
                        </div>
                        <div className="text-right flex justify-end">
                          <span
                            className={`text-[11px] font-black uppercase tracking-wider ${(() => {
                              // Kiểm tra difficulty theo Response 1 từ F12
                              const diff = (item.difficulty || item.problem?.difficulty || item.problemDifficulty || "").toLowerCase();
                              if (diff === "easy") return "text-teal-500";
                              if (diff === "medium" || diff === "med.") return "text-amber-500";
                              if (diff === "hard") return "text-rose-500";
                              return "text-slate-400/50 lowercase font-normal";
                            })()}`}
                          >
                            {/* Hiển thị difficulty hoặc dấu gạch ngang nếu API không trả về (như trong Response 2) */}
                            {item.difficulty || item.problem?.difficulty || item.problemDifficulty || (isProblem ? "—" : "Contest")}
                          </span>
                        </div>
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <Dropdown
                            placement="bottom-end"
                            className="dark:bg-[#1C2737]"
                          >
                            <DropdownTrigger>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                className="bg-slate-100 dark:bg-white/10 text-slate-400 group-hover:text-[#071739] dark:group-hover:text-white"
                              >
                                <MoreHorizontal size={18} />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Item Actions"
                              onAction={(k) => handleProblemAction(k, item.id)}
                            >
                              <DropdownItem
                                key="move-top"
                                startContent={<ArrowUpToLine size={16} />}
                              >
                                {t("workspace.move_to_top") || "Move to Top"}
                              </DropdownItem>
                              <DropdownItem
                                key="move-up"
                                startContent={<ChevronUp size={16} />}
                              >
                                {t("workspace.move_up") || "Move Up"}
                              </DropdownItem>
                              <DropdownItem
                                key="move-down"
                                startContent={<ChevronDown size={16} />}
                              >
                                {t("workspace.move_down") || "Move Down"}
                              </DropdownItem>
                              <DropdownItem
                                key="move-bot"
                                startContent={<ArrowDownToLine size={16} />}
                              >
                                {t("workspace.move_to_bottom") || "Move to Bottom"}
                              </DropdownItem>
                              <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                startContent={<Trash2 size={16} />}
                              >
                                {t("common.remove") || "Remove from list"}
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
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


      {/* ADD QUESTIONS MODAL */}
      <AddQuestionsToCollectionModal
        isOpen={addQuestionsModal.isOpen}
        onOpenChange={addQuestionsModal.onOpenChange}
        collectionId={currentId}
        existingItems={items}
      />

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
                <div className="flex items-center justify-between px-1">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Public visibility</p>
                    <p className="text-[10px] text-slate-400">Anyone can find and view this list</p>
                  </div>
                  <Checkbox
                    isSelected={isVisible}
                    onValueChange={setIsVisible}
                    color="primary"
                  />
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
                  isLoading={isUpdating}
                  onPress={handleSaveEdit}
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
                  Are you sure you want to remove this problem from the list?
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
                  className="font-black uppercase text-[11px] rounded-xl px-6"
                  onPress={confirmRemoveItem}
                >
                  Remove Item
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* DELETE COLLECTION MODAL */}
      <Modal
        isOpen={deleteListModal.isOpen}
        onOpenChange={deleteListModal.onOpenChange}
        size="sm"
        classNames={{ base: "dark:bg-[#1C2737] rounded-[2rem]" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-black uppercase text-rose-600 italic">
                Delete Collection?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm font-bold text-slate-500">
                  This will permanently delete "{listTitle}" and all its bookmarks. This action cannot be undone.
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
                  className="font-black uppercase text-[11px] rounded-xl px-6"
                  onPress={handleDeleteCollection}
                >
                  Delete Collection
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
