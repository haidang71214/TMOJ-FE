"use client";

import { Button, Image } from "@heroui/react";
import { Pencil, Trash } from "lucide-react";
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
  return (
    <div className="rounded-2xl bg-white dark:bg-black/40 p-4 border dark:border-white/10">
      {data.image && (
        <Image
          src={data.image}
          alt={data.name}
          className="rounded-xl h-32 w-full object-cover"
        />
      )}

      <h3 className="font-bold mt-3">{data.name}</h3>
      <p className="text-sm text-slate-500">
        {data.coins} coins – ${data.price}
      </p>

      {(data.startAt || data.endAt) && (
        <p className="text-xs text-indigo-400 mt-1">
          {data.startAt || "∞"} → {data.endAt || "∞"}
        </p>
      )}

      <div className="flex justify-end gap-2 mt-3">
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
