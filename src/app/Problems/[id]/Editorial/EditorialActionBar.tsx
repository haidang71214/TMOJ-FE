"use client";
import React, { useState } from "react";
import {
  Button,
  Divider,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@heroui/react";
import {
  MessageSquare,
  ArrowBigUp,
  ArrowBigDown,
  MoreHorizontal,
  Share2,
  Flag,
  Pencil,
  Trash2,
} from "lucide-react";
// import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditorialActionBarProps {
  initialUpvotes?: number;
  initialComments?: string;
  commentSectionRef: React.RefObject<HTMLDivElement | null>;
  isMine?: boolean; // Xác định quyền sở hữu bài viết
  onEdit?: () => void;
}

export const EditorialActionBar = ({
  initialUpvotes = 4900,
  initialComments = "2.7K",
  commentSectionRef,
  isMine = false,
  onEdit,
}: EditorialActionBarProps) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  // Modal disclosures
  const reportModal = useDisclosure();
  const deleteModal = useDisclosure();

  const [reportReason, setReportReason] = useState("");

  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num;
  };

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleAction = (key: React.Key) => {
    if (key === "report") reportModal.onOpen();
    if (key === "edit" && onEdit) {
      onEdit();
    }
    if (key === "delete") deleteModal.onOpen();
  };

  return (
    <>
      <div className="shrink-0 border-t border-gray-100 dark:border-[#334155] bg-white dark:bg-[#162130] px-4 py-2 flex items-center shadow-[0_-4px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center gap-2">
          {/* Cụm Vote */}
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className={`min-w-0 w-9 h-8 transition-all ${
                hasUpvoted
                  ? "text-[#FF5C00]"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onPress={() => {
                if (hasUpvoted) {
                  setUpvotes((prev) => prev - 1);
                  setHasUpvoted(false);
                } else {
                  setUpvotes((prev) => prev + (hasDownvoted ? 2 : 1));
                  setHasUpvoted(true);
                  setHasDownvoted(false);
                }
              }}
            >
              <ArrowBigUp
                size={20}
                fill={hasUpvoted ? "currentColor" : "none"}
              />
            </Button>

            <span
              className={`text-xs font-black px-1 min-w-[30px] text-center ${
                hasUpvoted
                  ? "text-[#FF5C00]"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {formatNumber(upvotes)}
            </span>

            <Button
              isIconOnly
              size="sm"
              variant="light"
              className={`min-w-0 w-9 h-8 transition-all ${
                hasDownvoted
                  ? "text-blue-500"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onPress={() => {
                if (hasDownvoted) {
                  setHasDownvoted(false);
                } else {
                  if (hasUpvoted) setUpvotes((prev) => prev - 1);
                  setHasDownvoted(true);
                  setHasUpvoted(false);
                }
              }}
            >
              <ArrowBigDown
                size={20}
                fill={hasDownvoted ? "currentColor" : "none"}
              />
            </Button>
          </div>

          <Button
            size="sm"
            variant="light"
            onPress={scrollToComments}
            className="text-slate-500 dark:text-slate-400 font-bold gap-2 px-3 h-9 rounded-lg"
          >
            <MessageSquare size={18} strokeWidth={2.5} />
            <span className="text-xs">{initialComments}</span>
          </Button>

          <Divider
            orientation="vertical"
            className="h-5 bg-gray-200 dark:bg-slate-700 mx-1"
          />

          <div className="flex items-center gap-1">
            <Tooltip content="Share">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-slate-500 dark:text-slate-400 w-9 h-9 rounded-lg"
              >
                <Share2 size={18} strokeWidth={2.5} />
              </Button>
            </Tooltip>

            {/* DROPDOWN DẤU BA CHẤM */}
            <Dropdown
              placement="top-end"
              className="dark:bg-[#1C2737] border dark:border-white/10"
            >
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-slate-500 dark:text-slate-400 w-9 h-9 rounded-lg"
                >
                  <MoreHorizontal size={18} strokeWidth={2.5} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Actions" onAction={handleAction}>
                {isMine ? (
                  [
                    <DropdownItem
                      key="edit"
                      startContent={<Pencil size={16} />}
                      className="font-bold"
                    >
                      Edit Solution
                    </DropdownItem>,
                    <DropdownItem
                      key="delete"
                      color="danger"
                      startContent={<Trash2 size={16} />}
                      className="text-danger font-bold"
                    >
                      Delete Solution
                    </DropdownItem>,
                  ]
                ) : (
                  <DropdownItem
                    key="report"
                    color="danger"
                    startContent={<Flag size={16} />}
                    className="text-danger font-bold"
                  >
                    Report Content
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* MODAL REPORT (Theo ảnh) */}
      <Modal
        isOpen={reportModal.isOpen}
        onOpenChange={reportModal.onOpenChange}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-bold">
                Report this content
              </ModalHeader>
              <ModalBody className="pb-6">
                <RadioGroup
                  value={reportReason}
                  onValueChange={setReportReason}
                  color="success"
                >
                  {[
                    "Spam advertising",
                    "Sexual content",
                    "Violent content",
                    "Promotes terrorism",
                    "Illegal content",
                    "Abuse others",
                    "Non English content",
                    "Others",
                  ].map((reason) => (
                    <Radio
                      key={reason}
                      value={reason}
                      className="py-2 border-b last:border-none border-gray-100 dark:border-white/5 w-full max-w-full"
                    >
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {reason}
                      </span>
                    </Radio>
                  ))}
                </RadioGroup>
              </ModalBody>
              <ModalFooter className="gap-3">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-bold rounded-xl px-8 h-12"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#94E2B3] text-white font-bold rounded-xl px-10 h-12"
                  onPress={() => {
                    toast.success("Report submitted");
                    onClose();
                  }}
                  isDisabled={!reportReason}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL DELETE CONFIRM */}
      <Modal
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        size="sm"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-black uppercase italic text-danger">
                Delete Solution?
              </ModalHeader>
              <ModalBody className="text-sm font-bold text-slate-500 italic">
                This action cannot be undone. All upvotes and comments will be
                permanently lost.
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  className="font-black uppercase text-[10px]"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  className="font-black uppercase text-[10px] rounded-xl"
                  onPress={() => {
                    toast.error("Solution deleted");
                    onClose();
                  }}
                >
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
