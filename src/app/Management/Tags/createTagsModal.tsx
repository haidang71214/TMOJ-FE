"use client";
import React, { useState, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  Tooltip,
} from "@heroui/react";
import { toast } from "sonner";
import { useCreateTagMutation } from "@/store/queries/Tags";
import { ErrorForm } from "@/types";
import { icons } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTagsModal({ isOpen, onOpenChange }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("");

  const { t, language } = useTranslation();

  const iconList = useMemo(() => {
    return Object.keys(icons)
      .filter((key) => key[0] === key[0].toUpperCase() && key !== "Icons") // Filter out non-components if any
      .map((key) => {
        const kebabCase = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return { label: kebabCase, value: kebabCase, iconName: key };
      });
  }, []);
  
  const [createTag, { isLoading }] = useCreateTagMutation();

  const handleCreate = async (onClose: () => void) => {
    try {
      if (!name.trim() || !slug.trim() || !description.trim() || !color.trim() || !icon.trim()) {
        toast.error(t('tags.all_required') || (language === 'vi' ? "Vui lòng nhập đầy đủ các trường" : "All fields are required"));
        return;
      }
      
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        color: color.trim(),
        icon: icon.trim(),
      };

      const a = await createTag(payload).unwrap();
      console.log(a);
      
      toast.success(t('tags.created_success') || (language === 'vi' ? "Tạo nhãn thành công" : "Tag created successfully"));
      setName("");
      setSlug("");
      setDescription("");
      setColor("");
      setIcon("");
      onClose();
    } catch (error) {
      toast.error((error as ErrorForm)?.data?.data?.message || t('tags.create_failed') || (language === 'vi' ? "Tạo nhãn thất bại" : "Failed to create tag"));
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent className="bg-white dark:bg-[#111c35]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pt-6 px-6">
              <h2 className="text-2xl font-black text-[#071739] dark:text-white uppercase italic tracking-tighter">
                {language === 'vi' ? "TẠO NHÃN " : "CREATE NEW "} <span className="text-[#FF5C00]">{language === 'vi' ? "MỚI" : "TAG"}</span>
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                {language === 'vi' ? "Thêm một nhãn bài tập mới vào hệ thống" : "Add a new problem tag to the system"}
              </p>
            </ModalHeader>
            <ModalBody className="px-6 py-4">
              <div className="space-y-4">
                <Tooltip content={language === 'vi' ? "Nhập tên duy nhất cho nhãn" : "Enter a unique name for the tag"} placement="top-start" className="font-bold text-xs" delay={500}>
                  <div className="w-full">
                    <Input
                      isRequired
                      label={language === 'vi' ? "Tên Nhãn" : "Tag Name"}
                      placeholder={language === 'vi' ? "VD: Quy hoạch động" : "e.g. Dynamic Programming"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      classNames={{
                        inputWrapper:
                          "bg-slate-50 dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 shadow-sm",
                        label: "font-bold text-sm",
                      }}
                      autoFocus
                    />
                  </div>
                </Tooltip>
                
                <Tooltip content={language === 'vi' ? "Định danh thân thiện với URL" : "URL-friendly identifier"} placement="top-start" className="font-bold text-xs" delay={500}>
                  <div className="w-full">
                    <Input
                      isRequired
                      label={language === 'vi' ? "Đường dẫn" : "Slug"}
                      placeholder="e.g. dynamic-programming"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      classNames={{
                        inputWrapper:
                          "bg-slate-50 dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 shadow-sm",
                        label: "font-bold text-sm",
                      }}
                    />
                  </div>
                </Tooltip>

                <Tooltip content={language === 'vi' ? "Giải thích ngắn gọn nhãn này dùng để làm gì" : "Brief explanation of what this tag is for"} placement="top-start" className="font-bold text-xs" delay={500}>
                  <div className="w-full">
                    <Input
                      isRequired
                      label={language === 'vi' ? "Mô tả" : "Description"}
                      placeholder={language === 'vi' ? "VD: các bài toán liên quan đến qhd" : "e.g. problems related to dp"}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      classNames={{
                        inputWrapper:
                          "bg-slate-50 dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 shadow-sm",
                        label: "font-bold text-sm",
                      }}
                    />
                  </div>
                </Tooltip>

                <div className="flex gap-4">
                  <Tooltip content={language === 'vi' ? "Chọn màu nổi bật cho nhãn" : "Choose a highlight color for the tag"} placement="top-start" className="font-bold text-xs" delay={500}>
                    <div className="flex-1">
                      <Input
                        isRequired
                        label={language === 'vi' ? "Màu sắc" : "Color"}
                        placeholder="e.g. #2563eb"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        classNames={{
                          inputWrapper:
                            "bg-slate-50 dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 shadow-sm",
                          label: "font-bold text-sm",
                        }}
                        className="w-full"
                        endContent={
                          <div 
                            className="relative w-6 h-6 rounded-md overflow-hidden cursor-pointer border border-slate-200 dark:border-white/10 shadow-inner flex-shrink-0"
                            style={{ backgroundColor: color || "#2563eb" }}
                          >
                            <input
                              type="color"
                              value={color || "#2563eb"}
                              onChange={(e) => setColor(e.target.value)}
                              className="absolute w-8 h-8 -top-1 -left-1 cursor-pointer opacity-0"
                            />
                          </div>
                        }
                      />
                    </div>
                  </Tooltip>

                  <Tooltip content={language === 'vi' ? "Chọn biểu tượng đại diện cho nhãn" : "Select an icon representing this tag"} placement="top-start" className="font-bold text-xs" delay={500}>
                    <div className="flex-1">
                      <Autocomplete
                        isRequired
                        label={language === 'vi' ? "Biểu tượng" : "Icon"}
                        placeholder={language === 'vi' ? "Tìm VD: brain" : "Search e.g. brain"}
                        defaultItems={iconList}
                        inputValue={icon}
                        onInputChange={(val) => setIcon(val)}
                        allowsCustomValue
                        className="w-full"
                        inputProps={{
                          classNames: {
                            inputWrapper:
                              "bg-slate-50 dark:bg-[#1C2737] border border-slate-200 dark:border-white/5 shadow-sm",
                            label: "font-bold text-sm",
                          },
                        }}
                      >
                        {(item) => {
                          const IconComponent = (icons as any)[item.iconName];
                          return (
                            <AutocompleteItem key={item.value} textValue={item.value}>
                              <div className="flex items-center gap-3">
                                {IconComponent && (typeof IconComponent === "object" || typeof IconComponent === "function") 
                                  ? React.createElement(IconComponent, { className: "w-5 h-5 text-slate-500" }) 
                                  : <div className="w-5 h-5 bg-slate-200 rounded-sm" />}
                                <span className="text-sm font-medium">{item.value}</span>
                              </div>
                            </AutocompleteItem>
                          );
                        }}
                      </Autocomplete>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="px-6 pb-6 mt-4">
              <Button color="danger" variant="light" onPress={onClose} className="font-bold uppercase tracking-wider text-xs">
                {language === 'vi' ? "Hủy" : "Cancel"}
              </Button>
              <Button
                color="primary"
                onPress={() => handleCreate(onClose)}
                isLoading={isLoading}
                className="bg-[#071739] dark:bg-[#FF5C00] font-black text-white shadow-lg uppercase tracking-wider text-xs active-bump"
              >
                {language === 'vi' ? "Tạo Nhãn" : "Create Tag"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
