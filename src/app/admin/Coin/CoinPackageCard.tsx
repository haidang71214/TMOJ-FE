"use client";

import { Button, Image, Chip } from "@heroui/react";
import { Pencil, Trash, Coins } from "lucide-react";
import { CoinPackage } from "./CoinPackageModal";

export default function CoinPackageCard({
  data,
  onEdit,
  onDelete,
}: {
  data: CoinPackage;
  onEdit: () => void;
  onDelete: () => void;
}) {
  // Xác định trạng thái Active/Inactive dựa trên startAt/endAt
  const now = new Date();
  const start = data.startAt ? new Date(data.startAt) : null;
  const end = data.endAt ? new Date(data.endAt) : null;

  const isActive =
    (!start || start <= now) && (!end || end >= now);

  return (
    <div className="rounded-2xl bg-white dark:bg-black/40 p-4 border dark:border-white/10 shadow-sm hover:shadow-md transition-all">
      {/* Image */}
      {data.image && (
        <Image
          src={data.image}
          alt={data.name}
          className="rounded-xl h-32 w-full object-cover"
        />
      )}

      {/* Name & Status */}
      <div className="flex items-start justify-between mt-3">
        <h3 className="font-bold text-lg">{data.name}</h3>
        <Chip
          size="sm"
          variant="flat"
          color={isActive ? "success" : "danger"}
          className="text-xs font-black uppercase"
        >
          {isActive ? "ACTIVE" : "INACTIVE"}
        </Chip>
      </div>

      {/* Coins nhận được & Giá mua (coins) */}
      <div className="mt-2 space-y-1">
        <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1">
          <Coins size={14} className="text-yellow-500" />
          Nhận: <span className="font-bold text-green-600 dark:text-green-400">{data.coins.toLocaleString('vi-VN')} coins</span>
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1">
          <Coins size={14} className="text-amber-500" />
          Giá: <span className="font-bold text-amber-600 dark:text-amber-400">{data.price.toLocaleString('vi-VN')} coins</span>
        </p>
      </div>

      {/* Date Range */}
      {(data.startAt || data.endAt) && (
        <p className="text-xs text-indigo-400 dark:text-indigo-500 mt-2">
          {data.startAt ? new Date(data.startAt).toLocaleDateString('vi-VN') : "∞"}{" "}
          →{" "}
          {data.endAt ? new Date(data.endAt).toLocaleDateString('vi-VN') : "∞"}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <Button size="sm" isIconOnly variant="light" onPress={onEdit}>
          <Pencil size={16} />
        </Button>
        <Button size="sm" isIconOnly color="danger" onPress={onDelete}>
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
}