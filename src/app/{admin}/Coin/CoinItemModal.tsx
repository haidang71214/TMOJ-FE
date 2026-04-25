"use client";

import { useModal } from "@/Provider/ModalProvider";
import { Input, Button, Image, Switch, Select, SelectItem, Textarea } from "@heroui/react";
import { useState } from "react";
import { CoinItem } from "@/types";

export default function CoinItemModal({
  initialData,
}: {
  initialData?: CoinItem;
}) {
  const { closeModal } = useModal();

  const [form, setForm] = useState<Partial<CoinItem>>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    image: initialData?.image || "",
    category: initialData?.category || "Fashion",
    stock: initialData?.stock || 0,
    active: initialData?.active ?? true,
  });

  const handleSave = () => {
    if (!form.name?.trim()) return alert("Item name is required");
    if ((form.price ?? 0) < 0) return alert("Price cannot be negative");

    // Logic save (mock)
    console.log("Saving item:", form);
    closeModal();
  };

  const categories = ["Fashion", "Accessories", "Gear", "Collection"];

  return (
    <div className="w-[480px] rounded-2xl bg-white dark:bg-[#0B0F1A] p-6 space-y-5">
      <h2 className="text-xl font-black">
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
          <Input
            label="Price (Coins)"
            type="number"
            value={String(form.price)}
            onValueChange={(val) => setForm({ ...form, price: Number(val) || 0 })}
          />
          <Input
            label="Stock Quantity"
            type="number"
            value={String(form.stock)}
            onValueChange={(val) => setForm({ ...form, stock: Number(val) || 0 })}
          />
        </div>

        <Select
          label="Category"
          selectedKeys={[form.category || "Fashion"]}
          onSelectionChange={(keys) => setForm({ ...form, category: Array.from(keys)[0] as string })}
        >
          {categories.map((cat) => (
            <SelectItem key={cat}>
              {cat}
            </SelectItem>
          ))}
        </Select>

        <Input
          label="Image URL"
          placeholder="https://..."
          value={form.image}
          onValueChange={(val) => setForm({ ...form, image: val })}
        />

        {form.image && (
          <div className="relative group">
            <Image
              src={form.image}
              alt="preview"
              className="rounded-xl h-40 w-full object-cover border border-slate-200 dark:border-white/10"
            />
          </div>
        )}

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
          <span className="font-bold text-sm">Active Status</span>
          <Switch
            isSelected={form.active}
            onValueChange={(val) => setForm({ ...form, active: val })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="light" onPress={closeModal} className="font-bold">
          Cancel
        </Button>
        <Button className="bg-[#FF5C00] text-white font-black" onPress={handleSave}>
          {initialData ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </div>
  );
}