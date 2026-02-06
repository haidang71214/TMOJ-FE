"use client";
import React, { useState } from "react";
import BookmarkListModal from "./BookmarkListModal";
import CreateListModal from "./../../MyLists/CreateListModal";
import {
  Button,
  Divider,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Textarea,
} from "@heroui/react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
  Share2,
  CircleHelp,
} from "lucide-react";

interface DescriptionActionBarProps {
  initialUpvotes?: number;
  initialComments?: string;
  onCommentClick: () => void;
}

export const DescriptionActionBar = ({
  initialUpvotes = 67300,
  initialComments = "1.8K",
  onCommentClick,
}: DescriptionActionBarProps) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasDownvoted, setHasDownvoted] = useState(false);

  // 1. SỬA LỖI: Dùng chung một Disclosure cho Feedback
  const feedbackModal = useDisclosure();

  // 2. Disclosure cho Danh sách Bookmark
  const listDisclosure = useDisclosure();

  // 3. Disclosure cho Tạo mới Bookmark
  const createDisclosure = useDisclosure();

  // 4. Trạng thái Star (Dùng isStarred để đổi màu icon)
  const [isStarred] = useState(true);

  const formatNumber = (num: number) => {
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num;
  };

  return (
    <>
      <div className="shrink-0 border-t border-gray-100 dark:border-[#334155] bg-white dark:bg-[#162130] px-4 py-2 flex items-center shadow-[0_-4px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center gap-2">
          {/* Cụm Vote Like/Dislike */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
            <Button
              size="sm"
              variant="light"
              className={`min-w-0 px-3 h-8 gap-2 font-black transition-all ${
                hasUpvoted
                  ? "text-[#FF5C00]"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onPress={() => {
                setHasUpvoted(!hasUpvoted);
                setUpvotes((prev) => (hasUpvoted ? prev - 1 : prev + 1));
                setHasDownvoted(false);
              }}
            >
              <ThumbsUp size={16} fill={hasUpvoted ? "currentColor" : "none"} />
              <span className="text-xs">{formatNumber(upvotes)}</span>
            </Button>

            <Divider
              orientation="vertical"
              className="h-4 bg-gray-300 dark:bg-slate-600"
            />

            <Button
              isIconOnly
              size="sm"
              variant="light"
              className={`min-w-0 w-8 h-8 transition-all ${
                hasDownvoted
                  ? "text-blue-500"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onPress={() => {
                setHasDownvoted(!hasDownvoted);
                if (hasUpvoted) setUpvotes((prev) => prev - 1);
                setHasUpvoted(false);
              }}
            >
              <ThumbsDown
                size={16}
                fill={hasDownvoted ? "currentColor" : "none"}
              />
            </Button>
          </div>

          <Button
            size="sm"
            variant="light"
            onPress={onCommentClick}
            className="text-slate-500 dark:text-slate-400 font-bold gap-2 px-3 h-9 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <MessageSquare size={18} />
            <span className="text-xs">{initialComments}</span>
          </Button>

          <Divider
            orientation="vertical"
            className="h-5 bg-gray-200 dark:bg-slate-700 mx-1"
          />

          <div className="flex items-center gap-1">
            <Tooltip content="Star">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={listDisclosure.onOpen} // Mở list bookmark
                className={`w-9 h-9 rounded-lg ${
                  isStarred
                    ? "text-yellow-500"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Star size={18} fill={isStarred ? "currentColor" : "none"} />
              </Button>
            </Tooltip>

            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-slate-500 dark:text-slate-400 w-9 h-9"
            >
              <Share2 size={18} />
            </Button>

            <Tooltip content="Feedback">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={feedbackModal.onOpen} // Dùng đúng biến feedbackModal
                className="text-slate-500 dark:text-slate-400 w-9 h-9"
              >
                <CircleHelp size={18} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* 1. MODAL DANH SÁCH BOOKMARK */}
      <BookmarkListModal
        isOpen={listDisclosure.isOpen}
        onOpenChange={listDisclosure.onOpenChange}
        onCreateNew={() => {
          listDisclosure.onClose();
          createDisclosure.onOpen();
        }}
      />

      {/* 2. MODAL TẠO MỚI BOOKMARK */}
      <CreateListModal
        isOpen={createDisclosure.isOpen}
        onOpenChange={createDisclosure.onOpenChange}
        isEdit={false}
      />

      {/* 3. MODAL FEEDBACK */}
      <Modal
        isOpen={feedbackModal.isOpen} // Dùng đồng nhất feedbackModal
        onOpenChange={feedbackModal.onOpenChange}
        placement="center"
        backdrop="blur"
        className="dark:bg-[#1C2737]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">
                Feedback
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">
                      Problem:
                    </p>
                    <p className="font-bold">Two Sum</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-slate-500">
                      <span className="text-rose-500">*</span> Issues
                      Encountered:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <Checkbox size="sm">
                        Description or examples are unclear or incorrect
                      </Checkbox>
                      <Checkbox size="sm">Difficulty is inaccurate</Checkbox>
                      <Checkbox size="sm">
                        Testcases are missing or incorrect
                      </Checkbox>
                      <Checkbox size="sm">Runtime is too strict</Checkbox>
                      <Checkbox size="sm">Other</Checkbox>
                    </div>
                  </div>
                  <Textarea
                    label="Additional Feedback:"
                    placeholder="Tell us more about the issue..."
                    labelPlacement="outside"
                    variant="bordered"
                    className="mt-2"
                  />
                </div>
              </ModalBody>
              <ModalFooter className="justify-between items-center border-t dark:border-slate-700 mt-4">
                <p className="text-[10px] text-slate-400">
                  You may also{" "}
                  <span className="text-blue-500 cursor-pointer">
                    submit via Github
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="flat"
                    onPress={onClose}
                    className="font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#2cbb5d] text-white font-bold"
                    onPress={onClose}
                  >
                    Submit
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
