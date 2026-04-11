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
import { Plus, Edit, Trash2, Search, RefreshCw, Tag as TagIcon } from "lucide-react";
import { useGetTagsQuery } from "@/store/queries/Tags";
import CreateTagsModal from "./createTagsModal";
import { ErrorForm } from "@/types";

export default function TagsManagementPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const { data: apiResponse, isLoading, isError, error, refetch } = useGetTagsQuery();
  console.log(apiResponse);
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
        <p className="mt-4 text-slate-500 font-medium">Loading tags repository...</p>
      </div>
    );
  }

//   if (isError) {
//     return (
//       <div className="flex flex-col h-full items-center justify-center text-center p-8 min-h-[500px]">
//         <div className="text-red-500 text-2xl mb-4 font-black">Error occurred</div>
//         <p className="text-slate-400 mb-6 font-medium">
//           {(error as ErrorForm)?.data?.data?.message || "Unable to load tags list."}
//         </p>
//         <Button color="primary" onPress={refetch} className="font-bold">
//           Retry
//         </Button>
//       </div>
//     );
//   }

  return (
    <div className="flex flex-col h-full gap-8 p-2">
      <div className="flex justify-between items-center shrink-0 border-b border-slate-200 dark:border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
            TAGS <span className="text-[#FF5C00]">REPOSITORY</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">
            Manage system problem tags
          </p>
        </div>
        <Button
          startContent={<Plus size={20} strokeWidth={3} />}
          onPress={createModal.onOpen}
          className="bg-[#071739] dark:bg-[#FF5C00] text-white dark:text-[#071739] font-black h-11 px-6 rounded-xl shadow-lg uppercase text-[10px] tracking-wider transition-all active:scale-95"
        >
          CREATE NEW TAG
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Input
          placeholder="Search by name or slug..."
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

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
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
            <TableColumn>ID</TableColumn>
            <TableColumn>TAG NAME</TableColumn>
            <TableColumn>SLUG</TableColumn>
            <TableColumn className="text-right">OPERATIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No tags found">
            {items.map((tag) => (
              <TableRow
                key={tag.id}
                className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <TableCell>
                  <span className="text-slate-400 font-bold italic text-xs">#{tag.id.substring(0, 8)}...</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center p-2 rounded-lg bg-emerald-100 dark:bg-[#22C55E]/10 text-emerald-600 dark:text-[#22C55E]">
                      <TagIcon size={16} />
                    </div>
                    <span className="text-base font-black uppercase italic tracking-tight text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#FF5C00] transition-colors leading-none">
                      {tag.name || "UNNAMED"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-md lowercase">
                    {tag.slug || "none"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Tooltip content="Edit Tag (Coming Soon)" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-blue-600 dark:hover:text-[#22C55E] transition-all rounded-lg h-9 w-9"
                      >
                        <Edit size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Delete Tag (Coming Soon)" className="font-bold text-[10px]">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        className="bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-red-500 transition-all rounded-lg h-9 w-9"
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
