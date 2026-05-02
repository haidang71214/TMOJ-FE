"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
  Spinner,
  addToast,
  Chip,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import {
  Save,
  Type,
  AlignLeft,
  DollarSign,
  Image as ImageIcon,
  Edit,
  Plus,
  Trash2,
  FileCode,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  useGetStudyPlanDetailQuery,
  useUpdateStudyPlanMutation,
  useUploadStudyPlanImageMutation,
  useAddProblemToStudyPlanMutation,
  useRemoveProblemFromPlanMutation,
} from "@/store/queries/StudyPlan";
import { AddProblemModal } from "@/app/components/AddProblemModal";
import { StudyPlan, ErrorForm } from "@/types";

interface EditStudyPlanModalProps {
  plan: StudyPlan;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditStudyPlanModal({
  plan,
  isOpen,
  onOpenChange,
  onSuccess,
}: EditStudyPlanModalProps) {
  const { data: detailResponse, isLoading: isFetching, refetch } =
    useGetStudyPlanDetailQuery(plan.id, { skip: !isOpen });

  const [updateStudyPlan, { isLoading: isUpdating }] =
    useUpdateStudyPlanMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadStudyPlanImageMutation();
  const [addProblem] = useAddProblemToStudyPlanMutation();
  const [removeProblem] = useRemoveProblemFromPlanMutation();

  const {
    isOpen: isAddProblemOpen,
    onOpen: onAddProblemOpen,
    onOpenChange: onAddProblemOpenChange,
  } = useDisclosure();

  const [title, setTitle] = useState(plan.title || "");
  const [description, setDescription] = useState(plan.description || "");
  const [isPaid, setIsPaid] = useState(plan.isPaid || false);
  const [price, setPrice] = useState(plan.price || 0);
  const [imageUrl, setImageUrl] = useState(plan.imageUrl || "");

  // Sync khi detail response về
  useEffect(() => {
    if (detailResponse?.data) {
      const d = detailResponse.data;
      setTitle(d.title || "");
      setDescription(d.description || "");
      setIsPaid(!!d.isPaid);
      setPrice(d.price || 0);
      setImageUrl(d.imageUrl || "");
    }
  }, [detailResponse]);

  const items = detailResponse?.data?.items || [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await uploadImage(formData).unwrap();
      if (result.data?.imageUrl) {
        setImageUrl(result.data.imageUrl);
        addToast({ title: "Tải ảnh lên thành công", color: "success" });
      }
    } catch {
      addToast({ title: "Lỗi tải ảnh", description: "Không thể tải ảnh lên máy chủ", color: "danger" });
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      addToast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề", color: "danger" });
      return;
    }
    try {
      await updateStudyPlan({
        id: plan.id,
        title,
        description,
        isPaid,
        price: isPaid ? price : 0,
        imageUrl: imageUrl.trim() || null,
      }).unwrap();
      addToast({
        title: "Thành công",
        description: `Đã cập nhật lộ trình "${title}"`,
        color: "success",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      const err = error as ErrorForm;
      addToast({
        title: "Lỗi",
        description: err?.data?.data?.message || "Không thể cập nhật lộ trình",
        color: "danger",
      });
    }
  };

  const handleAddProblems = async (selectedWithConfigs: any[]) => {
    try {
      await Promise.all(
        selectedWithConfigs.map((item) =>
          addProblem({ planId: plan.id, problemId: item.problemId }).unwrap()
        )
      );
      addToast({
        title: "Thành công",
        description: `Đã thêm ${selectedWithConfigs.length} bài tập vào lộ trình`,
        color: "success",
      });
      refetch();
    } catch (error) {
      const err = error as ErrorForm;
      addToast({
        title: "Lỗi",
        description: err?.data?.data?.message || "Không thể thêm bài tập",
        color: "danger",
      });
    }
  };

  const handleRemoveProblem = async (problemId: string) => {
    if (!confirm("Xóa bài tập này khỏi lộ trình?")) return;
    try {
      await removeProblem({ planId: plan.id, problemId }).unwrap();
      addToast({ title: "Đã xóa bài tập", color: "success" });
      refetch();
    } catch {
      addToast({ title: "Lỗi", description: "Không thể xóa bài tập", color: "danger" });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          wrapper: "z-[9999]",
          backdrop: "z-[9998] bg-black/60 backdrop-blur-md",
          base: "dark bg-[#0E1420] border border-white/10 rounded-[2rem] shadow-2xl",
          header: "border-b border-white/5 px-8 py-5",
          body: "p-0",
          footer: "border-t border-white/5 px-8 py-5",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Edit className="text-[#3B5BFF]" size={20} strokeWidth={3} />
                  </div>
                  <h2 className="text-2xl font-black italic uppercase text-white">
                    EDIT <span className="text-[#3B5BFF]">STUDY PLAN</span>
                  </h2>
                </div>
                <p className="text-xs text-white/30 font-medium normal-case truncate">
                  {plan.title} · ID: {plan.id.substring(0, 12)}...
                </p>
              </ModalHeader>

              <ModalBody>
                {isFetching ? (
                  <div className="flex items-center justify-center py-16">
                    <Spinner size="lg" color="primary" />
                  </div>
                ) : (
                  <Tabs
                    variant="underlined"
                    classNames={{
                      base: "w-full px-8 pt-4 border-b border-white/5",
                      tabList: "gap-6 p-0",
                      tab: "font-black uppercase text-[10px] tracking-widest h-10 px-0 text-white/30 data-[selected=true]:text-white",
                      cursor: "bg-[#3B5BFF] h-[2px]",
                      panel: "p-8 pt-6",
                    }}
                  >
                    {/* ── TAB 1: THÔNG TIN ── */}
                    <Tab key="info" title="Thông tin">
                      <div className="flex flex-col gap-6">
                        {/* Title */}
                        <Input
                          label="Tiêu đề"
                          placeholder="Nhập tiêu đề lộ trình..."
                          value={title}
                          onValueChange={setTitle}
                          isRequired
                          labelPlacement="outside"
                          startContent={<Type size={18} className="text-white/30 mr-2" />}
                          classNames={{
                            label: "text-sm font-bold text-white uppercase tracking-widest",
                            inputWrapper:
                              "h-14 bg-white/5 border border-white/10 hover:border-[#3B5BFF]/50 focus-within:!border-[#3B5BFF] shadow-none transition-all rounded-2xl px-4",
                            input: "text-base font-medium !text-white placeholder:!text-white/30",
                            innerWrapper: "bg-transparent",
                          }}
                        />

                        {/* Image */}
                        <div className="flex flex-col gap-2">
                          <p className="text-sm font-bold text-white uppercase tracking-widest mb-1">
                            Hình ảnh
                          </p>
                          <div className="flex gap-4 items-start">
                            <div className="relative group w-36 h-24 rounded-2xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center hover:border-[#3B5BFF]/50 transition-all shrink-0">
                              {imageUrl ? (
                                <>
                                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <label className="cursor-pointer p-2 bg-white/20 rounded-full text-white">
                                      <ImageIcon size={18} />
                                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                  </div>
                                </>
                              ) : (
                                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white/30 hover:text-[#3B5BFF] transition-colors">
                                  {isUploading ? <Spinner size="sm" color="primary" /> : <ImageIcon size={24} />}
                                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Upload</span>
                                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                              )}
                            </div>
                            <div className="flex-1">
                              <Input
                                placeholder="https://example.com/image.png"
                                value={imageUrl}
                                onValueChange={setImageUrl}
                                size="sm"
                                label="Hoặc dán URL ảnh"
                                labelPlacement="outside"
                                classNames={{
                                  inputWrapper: "h-11 bg-white/5 border border-white/10 rounded-xl",
                                  label: "text-[10px] font-black uppercase text-white/50 mb-1",
                                  input: "!text-white placeholder:!text-white/30",
                                  innerWrapper: "bg-transparent",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <Textarea
                          label="Mô tả"
                          placeholder="Nhập mô tả lộ trình..."
                          value={description}
                          onValueChange={setDescription}
                          labelPlacement="outside"
                          classNames={{
                            label: "text-sm font-bold text-white uppercase tracking-widest",
                            inputWrapper:
                              "bg-white/5 border border-white/10 hover:border-[#3B5BFF]/50 focus-within:!border-[#3B5BFF] shadow-none transition-all rounded-2xl px-4 py-3",
                            input: "text-base font-medium !text-white placeholder:!text-white/30",
                            innerWrapper: "bg-transparent",
                          }}
                        />

                        {/* Paid toggle */}
                        <div className="flex gap-8 p-4 rounded-xl bg-white/5 border border-white/10 items-center">
                          <Switch isSelected={isPaid} onValueChange={setIsPaid} color="warning" size="sm">
                            <span className="font-black text-sm text-white uppercase tracking-wider">Paid Plan</span>
                          </Switch>
                          {isPaid && (
                            <div className="flex-1 max-w-xs">
                              <Input
                                type="number"
                                label="Giá (COINS)"
                                value={price.toString()}
                                onValueChange={(v) => setPrice(Number(v))}
                                size="sm"
                                startContent={<DollarSign size={16} className="text-amber-400" />}
                                classNames={{
                                  inputWrapper:
                                    "h-11 bg-amber-500/10 border border-amber-500/30 focus-within:!border-amber-500 rounded-xl",
                                  input: "!text-amber-400 font-medium",
                                  innerWrapper: "bg-transparent",
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Save button inline */}
                        <div className="flex justify-end">
                          <Button
                            className="bg-[#3B5BFF] text-white font-black rounded-xl px-8 h-12 shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all"
                            onPress={handleUpdate}
                            isLoading={isUpdating}
                            startContent={!isUpdating && <Save size={18} strokeWidth={3} />}
                          >
                            Lưu thay đổi
                          </Button>
                        </div>
                      </div>
                    </Tab>

                    {/* ── TAB 2: BÀI TẬP ── */}
                    <Tab
                      key="problems"
                      title={
                        <span className="flex items-center gap-2">
                          Bài tập
                          <Chip size="sm" className="bg-[#3B5BFF]/20 text-[#3B5BFF] font-black text-[9px] h-4 min-w-4">
                            {items.length}
                          </Chip>
                        </span>
                      }
                    >
                      <div className="flex flex-col gap-4">
                        {/* Add button */}
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-white/40 font-semibold uppercase tracking-widest">
                            {items.length} bài tập trong lộ trình
                          </p>
                          <Button
                            size="sm"
                            className="bg-[#3B5BFF] text-white font-black uppercase text-[10px] tracking-widest rounded-xl"
                            startContent={<Plus size={14} strokeWidth={3} />}
                            onPress={onAddProblemOpen}
                          >
                            Thêm bài tập
                          </Button>
                        </div>

                        {/* List */}
                        {items.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 gap-4 border-2 border-dashed border-white/10 rounded-2xl">
                            <FileCode size={40} className="text-white/10" />
                            <p className="text-white/30 font-semibold text-sm">Chưa có bài tập nào</p>
                            <Button
                              size="sm"
                              className="bg-[#3B5BFF]/20 text-[#3B5BFF] font-black uppercase text-[10px] tracking-widest rounded-xl"
                              startContent={<Plus size={14} />}
                              onPress={onAddProblemOpen}
                            >
                              Thêm ngay
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {items.map((item: any, index: number) => (
                              <div
                                key={item.studyPlanItemId || index}
                                className="group flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-[#3B5BFF]/30 hover:bg-white/8 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-white/40">
                                    {item.order}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-sm group-hover:text-[#3B5BFF] transition-colors">
                                      {item.problemTitle || `Problem #${item.problemId?.substring(0, 8)}`}
                                    </p>
                                    <p className="text-[10px] text-white/30 font-mono">
                                      {item.problemSlug || item.problemId?.substring(0, 12)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {item.isCompleted ? (
                                    <Chip startContent={<CheckCircle2 size={10} />} size="sm" color="success" variant="flat" className="font-bold text-[9px]">Done</Chip>
                                  ) : (
                                    <Chip size="sm" color="default" variant="flat" className="font-bold text-[9px] text-white/30">Pending</Chip>
                                  )}
                                  {!item.isUnlocked && (
                                    <Chip startContent={<Lock size={9} />} size="sm" color="warning" variant="flat" className="font-bold text-[9px]">Locked</Chip>
                                  )}
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    color="danger"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                    onPress={() => handleRemoveProblem(item.problemId)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                )}
              </ModalBody>

              <ModalFooter className="flex justify-end gap-3">
                <Button
                  variant="light"
                  onPress={onClose}
                  className="font-bold text-white/50 hover:text-white rounded-xl px-6 h-12"
                >
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Problem Modal */}
      <AddProblemModal
        isOpen={isAddProblemOpen}
        onOpenChange={onAddProblemOpenChange}
        onConfirm={handleAddProblems}
        isStudyPlan={true}
      />
    </>
  );
}
