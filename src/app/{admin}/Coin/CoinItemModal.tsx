"use client";

import { Input, Button, Image, Switch, Select, SelectItem, Textarea } from "@heroui/react";
import { useState } from "react";
import { StoreItem, ItemType } from "@/types/store";
import { useCreateStoreItemMutation, useUpdateStoreItemMutation } from "@/store/queries/store";
import { toast } from "sonner";
import { useModal } from "@/Provider/ModalProvider";

export default function CoinItemModal({
  initialData,
}: {
  initialData?: StoreItem;
}) {
  const { closeModal } = useModal();
  const [createItem, { isLoading: isCreating }] = useCreateStoreItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateStoreItemMutation();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.imageUrl || "");

  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    itemType: initialData?.itemType || ItemType.PHYSICAL_ITEM,
    priceCoin: initialData?.priceCoin || 0,
    durationDays: initialData?.durationDays || null,
    stockQuantity: initialData?.stockQuantity || 0,
    metaJson: initialData?.metaJson || { specs: [] },
    isActive: initialData?.isActive ?? true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!form.name?.trim()) return toast.error("Item name is required");
    if (form.priceCoin < 0) return toast.error("Price cannot be negative");

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("itemType", form.itemType);
      formData.append("priceCoin", String(form.priceCoin));
      formData.append("durationDays", form.durationDays === null ? "" : String(form.durationDays));
      formData.append("stockQuantity", String(form.stockQuantity));
      formData.append("isActive", String(form.isActive));
      formData.append("metaJson", JSON.stringify(form.metaJson));

      if (initialData) {
        await updateItem({ itemId: initialData.itemId, body: formData }).unwrap();
        toast.success("Item updated successfully");
      } else {
        await createItem(formData).unwrap();
        toast.success("Item created successfully");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save item");
    }
  };

  const itemTypes = Object.values(ItemType);

  return (
    <div className="w-[520px] rounded-2xl bg-white dark:bg-[#0B0F1A] p-6 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-black italic uppercase">
        {initialData ? "Edit Coin Item" : "Add New Coin Item"}
      </h2>

      <div className="space-y-4">
        <Input
          label="Item Name"
          placeholder="e.g. Áo Polo FPT"
          value={form.name}
          onValueChange={(val) => setForm({ ...form, name: val })}
          className="font-bold"
        />

        <Textarea
          label="Description"
          placeholder="Enter item description..."
          value={form.description}
          onValueChange={(val) => setForm({ ...form, description: val })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Item Type"
            selectedKeys={[form.itemType]}
            onSelectionChange={(keys) => setForm({ ...form, itemType: Array.from(keys)[0] as ItemType })}
          >
            {itemTypes.map((type) => (
              <SelectItem key={type} className="capitalize">
                {type.replace("_", " ")}
              </SelectItem>
            ))}
          </Select>
          <Input
            label="Duration (Days)"
            placeholder="Null for permanent"
            type="number"
            value={form.durationDays === null ? "" : String(form.durationDays)}
            onValueChange={(val) => setForm({ ...form, durationDays: val === "" ? null : Number(val) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (Coins)"
            type="number"
            value={String(form.priceCoin)}
            onValueChange={(val) => setForm({ ...form, priceCoin: Number(val) || 0 })}
          />
          <Input
            label="Stock Quantity"
            type="number"
            value={String(form.stockQuantity)}
            onValueChange={(val) => setForm({ ...form, stockQuantity: Number(val) || 0 })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold block">Item Image</label>
          <div className="flex flex-col gap-3">
            {previewUrl && (
              <div className="relative group">
                <Image
                  src={previewUrl}
                  alt="preview"
                  className="rounded-xl h-40 w-full object-cover border border-slate-200 dark:border-white/10"
                />
              </div>
            )}
            <Button
              as="label"
              htmlFor="file-upload"
              className="w-full bg-slate-100 dark:bg-white/5 font-bold cursor-pointer"
            >
              {file ? "Change Image" : "Upload Image"}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-divider">
          <div className="flex flex-col">
            <span className="font-bold text-sm">Active Status</span>
            <span className="text-[10px] text-slate-400">Visible in shop</span>
          </div>
          <Switch
            isSelected={form.isActive}
            onValueChange={(val) => setForm({ ...form, isActive: val })}
          />
        </div>

        {/* Specs Input (Part of metaJson) */}
        <div className="space-y-2">
          <span className="text-sm font-bold">Specs (JSON)</span>
          <Textarea
            placeholder='{"specs": ["Material: Cotton", "Color: Orange"]}'
            value={JSON.stringify(form.metaJson, null, 2)}
            onValueChange={(val) => {
              try {
                const parsed = JSON.parse(val);
                setForm({ ...form, metaJson: parsed });
              } catch (e) {
                // Keep typing
              }
            }}
            className="font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-divider">
        <Button variant="light" onPress={closeModal} className="font-bold">
          Cancel
        </Button>
        <Button
          isLoading={isCreating || isUpdating}
          className="bg-[#FF5C00] text-white font-black uppercase italic"
          onPress={handleSave}
        >
          {initialData ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </div>
  );
}
