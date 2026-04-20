"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Pagination,
  useDisclosure,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Heart,
  Bookmark,
  Lock,
  Globe,
  ArrowUpDown,
  Filter as FilterIcon,
} from "lucide-react";
import CreateListModal from "./CreateListModal";
import DeleteModal from "./../../components/DeleteModal";
import { useGetCollectionsQuery, useDeleteCollectionMutation, useUpdateCollectionMutation } from "@/store/queries/collections";
import { useGetFavoriteProblemsQuery, useGetFavoriteContestsQuery } from "@/store/queries/favorites";
import { toast } from "sonner";
import { CollectionItem } from "@/types";

export default function MyListsPage() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const deleteModal = useDisclosure();

  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortKey, setSortKey] = useState("newest");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const { data: collectionsResponse, isLoading } = useGetCollectionsQuery();
  const { data: favoriteProblems } = useGetFavoriteProblemsQuery({ page: 1, pageSize: 1 });
  const { data: favoriteContests } = useGetFavoriteContestsQuery({ page: 1, pageSize: 1 });

  const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();
  const [updateCollection] = useUpdateCollectionMutation();

  const rawCollections: any = collectionsResponse?.data;
  const collectionsData = Array.isArray(rawCollections)
    ? rawCollections
    : rawCollections?.data || rawCollections?.items || [];

  // FILTER & SORT LOGIC
  const processedData = useMemo(() => {
    let result = [...collectionsData];

    // 1. Filter
    if (searchQuery) {
      result = result.filter((item: any) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (visibilityFilter !== "all") {
      result = result.filter(
        (item) => item.isVisibility === (visibilityFilter === "public")
      );
    }

    // 2. Sort 4 chiều
    return result.sort((a, b) => {
      const countA = a.items?.length || 0;
      const countB = b.items?.length || 0;

      switch (sortKey) {
        case "abc":
          return a.name.localeCompare(b.name); // A -> Z
        case "zyx":
          return b.name.localeCompare(a.name); // Z -> A
        case "count-desc":
          return countB - countA; // Nhiều -> Ít
        case "count-asc":
          return countA - countB; // Ít -> Nhiều
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });
  }, [searchQuery, visibilityFilter, sortKey, collectionsData]);

  const pages = Math.ceil(processedData.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [page, processedData]);

  // Hàm helper để hiển thị label cho nút Sort
  const getSortLabel = () => {
    switch (sortKey) {
      case "newest":
        return "Newest";
      case "oldest":
        return "Oldest";
      case "abc":
        return "A - Z";
      case "zyx":
        return "Z - A";
      case "count-desc":
        return "Most Problems";
      case "count-asc":
        return "Least Problems";
      default:
        return "Sort";
    }
  };

  const handleEdit = (e: React.MouseEvent, item: CollectionItem) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsEditMode(true);
    onOpen();
  };

  const handleDeleteOpen = (e: React.MouseEvent, item: CollectionItem) => {
    e.stopPropagation();
    setSelectedItem(item);
    deleteModal.onOpen();
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      try {
        await deleteCollection(selectedItem.id).unwrap();
        toast.success("Collection deleted successfully");
        deleteModal.onClose();
        setSelectedItem(null);
      } catch (err: any) {
        toast.error("Failed to delete collection");
      }
    }
  };

  const toggleVisibility = async (e: React.MouseEvent, item: CollectionItem) => {
    e.stopPropagation();
    try {
      await updateCollection({
        id: item.id,
        body: {
          name: item.name,
          description: item.description,
          isVisibility: !item.isVisibility
        }
      }).unwrap();
      toast.success(`Collection is now ${!item.isVisibility ? 'public' : 'private'}`);
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] transition-colors duration-300">
      <div className="max-w-[1000px] mx-auto p-6 md:p-12 flex flex-col gap-8 pb-24">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-end border-b border-divider dark:border-white/5 pb-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-[1000] uppercase italic tracking-tighter leading-none text-[#071739] dark:text-white">
              MY <span className="text-[#FF5C00]">COLLECTIONS</span>
            </h1>
          </div>
          <Button
            onPress={() => {
              setIsEditMode(false);
              setSelectedItem(null);
              onOpen();
            }}
            startContent={<Plus size={18} strokeWidth={3} />}
            className="bg-[#071739] dark:bg-[#FF5C00] text-white font-black h-12 px-6 rounded-2xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
          >
            CREATE NEW
          </Button>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onValueChange={(val) => {
              setSearchQuery(val);
              setPage(1);
            }}
            startContent={<Search size={18} className="text-slate-400" />}
            classNames={{
              inputWrapper:
                "bg-white dark:bg-[#111c35] rounded-xl h-11 border border-divider dark:border-white/5 shadow-none focus-within:!border-[#FF5C00]",
              input:
                "dark:text-white font-bold italic placeholder:text-slate-500 text-sm",
            }}
            className="max-w-xs"
          />

          <Dropdown className="dark:bg-[#111c35] rounded-2xl border dark:border-white/10">
            <DropdownTrigger>
              <Button
                variant="flat"
                startContent={<FilterIcon size={16} />}
                className="bg-white dark:bg-[#111c35] font-black uppercase italic text-[10px] h-11 rounded-xl dark:text-white"
              >
                {visibilityFilter === "all" ? "Visibility" : visibilityFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                setVisibilityFilter(key.toString());
                setPage(1);
              }}
            >
              <DropdownItem
                key="all"
                className="font-bold uppercase italic text-[10px]"
              >
                All
              </DropdownItem>
              <DropdownItem
                key="public"
                startContent={<Globe size={14} />}
                className="font-bold uppercase italic text-[10px]"
              >
                Public
              </DropdownItem>
              <DropdownItem
                key="private"
                startContent={<Lock size={14} />}
                className="font-bold uppercase italic text-[10px]"
              >
                Private
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown className="dark:bg-[#111c35] rounded-2xl border dark:border-white/10">
            <DropdownTrigger>
              <Button
                variant="flat"
                startContent={<ArrowUpDown size={16} />}
                className="bg-white dark:bg-[#111c35] font-black uppercase italic text-[10px] h-11 rounded-xl dark:text-white"
              >
                {getSortLabel()}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(key) => {
                setSortKey(key.toString());
                setPage(1);
              }}
            >
              <DropdownItem
                key="newest"
                textValue="Newest First"
                className="font-bold uppercase italic text-[10px]"
              >
                Newest First
              </DropdownItem>
              <DropdownItem
                key="oldest"
                textValue="Oldest First"
                className="font-bold uppercase italic text-[10px]"
              >
                Oldest First
              </DropdownItem>
              <DropdownItem
                key="abc"
                textValue="Alphabetical (A - Z)"
                className="font-bold uppercase italic text-[10px]"
              >
                Alphabetical (A - Z)
              </DropdownItem>
              <DropdownItem
                key="zyx"
                textValue="Alphabetical (Z - A)"
                className="font-bold uppercase italic text-[10px]"
              >
                Alphabetical (Z - A)
              </DropdownItem>
              <DropdownItem
                key="count-desc"
                textValue="Most Problems"
                className="font-bold uppercase italic text-[10px]"
              >
                Most Problems
              </DropdownItem>
              <DropdownItem
                key="count-asc"
                textValue="Least Problems"
                className="font-bold uppercase italic text-[10px]"
              >
                Least Problems
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* LIST VIEW */}
        {isLoading ? (
          <div className="flex justify-center p-12 text-slate-400 italic">Loading collections...</div>
        ) : (
          <div className="flex flex-col gap-3 min-h-[350px]">
            {items.map((item: any) => (
              <div
                key={item.id}
                onClick={() => router.push((item as any).route || `/Problems/MyLists/${item.id}`)}
                className="group flex items-center gap-6 p-4 px-6 bg-white dark:bg-[#111c35] border-2 border-transparent dark:border-white/5 rounded-3xl transition-all cursor-pointer shadow-sm 
                         hover:bg-blue-50 dark:hover:bg-transparent hover:border-blue-600 dark:hover:border-[#00FF41]"
              >
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-[#FF5C00] group-hover:bg-white/20">
                  {item.type?.toLowerCase() === "heart" || item.type?.toLowerCase() === "problem_favorite" ? (
                    <Heart size={20} fill="currentColor" />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-[1000] text-lg uppercase italic text-[#071739] dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#00FF41] truncate">
                      {item.name}
                    </h3>
                    {!item.isVisibility ? (
                      <Lock
                        size={12}
                        className="opacity-40 group-hover:text-blue-600 dark:group-hover:text-[#00FF41]"
                      />
                    ) : (
                      <Globe
                        size={12}
                        className="opacity-40 group-hover:text-blue-600 dark:group-hover:text-[#00FF41]"
                      />
                    )}
                  </div>
                  <div className="text-[10px] font-black text-slate-400 uppercase italic group-hover:text-blue-400 dark:group-hover:text-[#00FF41]/60">
                    {item.items?.length || 0} Items &bull; Updated: {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!(item as any).isSpecial && (
                    <>
                      <Tooltip content={!item.isVisibility ? "Make Public" : "Make Private"}>
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          className={`rounded-xl ${!item.isVisibility ? "text-slate-400 hover:text-emerald-500" : "text-emerald-500 hover:text-slate-400"}`}
                          onClick={(e) => toggleVisibility(e, item)}
                        >
                          {!item.isVisibility ? <Lock size={16} /> : <Globe size={16} />}
                        </Button>
                      </Tooltip>

                      <Tooltip content="Edit">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          className="rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-black"
                          onClick={(e) => handleEdit(e, item)}
                        >
                          <Edit3 size={16} />
                        </Button>
                      </Tooltip>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="rounded-xl text-slate-400 hover:text-red-500 dark:hover:text-black"
                        onClick={(e) => handleDeleteOpen(e, item)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-center p-8 text-slate-500 italic">No collections found.</div>}
          </div>
        )}
        <div className="flex justify-center mt-10 w-full">
          <Pagination
            total={Math.max(1, pages)}
            page={page}
            onChange={setPage}
            showControls
            classNames={{
              cursor:
                "bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] italic shadow-lg shadow-orange-500/20",
            }}
          />
        </div>
      </div>

      <CreateListModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        editData={selectedItem}
        isEdit={isEditMode}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        userName={selectedItem?.name}
        type="collection"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
