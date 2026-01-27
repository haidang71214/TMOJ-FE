"use client";

import { useModal } from "@/Provider/ModalProvider";
import { Input, Button, Image, Switch, Tooltip } from "@heroui/react";
import { useState, useEffect } from "react";

export interface CoinPackage {
  id?: string;
  name: string;
  coins: number;
  price: number;
  image?: string;
  startAt?: string;
  endAt?: string;
  active?: boolean; // true = active, false = disabled
}

export default function CoinPackageModal({
  initialData,
}: {
  initialData?: CoinPackage;
}) {
  const { closeModal } = useModal();

  const [form, setForm] = useState<CoinPackage>({
    name: initialData?.name || "",
    coins: initialData?.coins || 0,
    price: initialData?.price || 0,
    image: initialData?.image || "",
    startAt: initialData?.startAt || "",
    endAt: initialData?.endAt || "",
    active: initialData?.active ?? true, // Mặc định active
  });

  // Tự động gợi ý active dựa trên ngày khi edit
  useEffect(() => {
    if (!initialData) return;

    const now = new Date();
    const start = initialData.startAt ? new Date(initialData.startAt) : null;
    const end = initialData.endAt ? new Date(initialData.endAt) : null;

    const isInDateRange = (!start || start <= now) && (!end || end >= now);
    setForm(prev => ({
      ...prev,
      active: initialData.active ?? isInDateRange, // ưu tiên active từ data, fallback tính từ ngày
    }));
  }, [initialData]);

  const handleSave = () => {
    if (!form.name.trim()) return alert("Package name is required");
    if (form.coins <= 0) return alert("Coins must be greater than 0");
    if (form.price < 0) return alert("Price cannot be negative");

    // Logic save (gọi API hoặc onSave prop nếu có)
    console.log("Saving package:", form);
    closeModal();
  };

  // Kiểm tra nếu package hết hạn (dùng để disable switch)
  const now = new Date();
  const end = form.endAt ? new Date(form.endAt) : null;
  const isExpired = end && end < now;

  return (
    <div className="w-[420px] rounded-2xl bg-white dark:bg-[#0B0F1A] p-6 space-y-4">
      <h2 className="text-lg font-bold">
        {initialData ? "Edit Coin Package" : "Create Coin Package"}
      </h2>

      {/* Name */}
      <Input
        label="Package Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* Coins */}
      <Input
        label="Coins"
        type="number"
        value={String(form.coins)}
        onChange={(e) => setForm({ ...form, coins: Number(e.target.value) || 0 })}
      />

      {/* Price */}
      <Input
        label="Price (coins)"
        type="number"
        value={String(form.price)}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
      />

      {/* Image */}
      <Input
        label="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />
      {form.image && (
        <Image
          src={form.image}
          alt="preview"
          className="rounded-xl h-32 object-cover"
        />
      )}

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          type="date"
          value={form.startAt}
          onChange={(e) => setForm({ ...form, startAt: e.target.value })}
        />
        <Input
          label="End Date"
          type="date"
          value={form.endAt}
          onChange={(e) => setForm({ ...form, endAt: e.target.value })}
        />
      </div>

      {/* Active Switch - Cho phép chủ động thay đổi */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium">Active Status</span>
          {isExpired && (
            <span className="text-xs text-red-500">Package expired</span>
          )}
        </div>

        <Tooltip
          content={isExpired ? "Cannot activate expired package" : "Toggle package active/inactive"}
          isDisabled={!isExpired}
        >
          <Switch
            isSelected={form.active}
            onValueChange={(value) => {
              if (isExpired && value) return; // Không cho bật nếu hết hạn
              setForm({ ...form, active: value });
            }}
            classNames={{
              wrapper: "group-data-[selected=true]:bg-green-600",
              startContent: "text-red-500",
              endContent: "text-green-500",
            }}
          />
        </Tooltip>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="light" onPress={closeModal}>
          Cancel
        </Button>
        <Button color="primary" onPress={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}