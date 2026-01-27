"use client";

import { useModal } from "@/Provider/ModalProvider";
import { Input, Button, Image } from "@heroui/react";

import { useState } from "react";

export interface CoinPackage {
  id?: string;
  name: string;
  coins: number;
  price: number;
  image?: string;
  startAt?: string;
  endAt?: string;
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
  });

  return (
    <div className="w-[420px] rounded-2xl bg-white dark:bg-[#0B0F1A] p-6 space-y-4">
      <h2 className="text-lg font-bold">
        {initialData ? "Edit Coin Package" : "Create Coin Package"}
      </h2>

      <Input
        label="Package Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        label="Coins"
        type="number"
        value={String(form.coins)}
        onChange={(e) =>
          setForm({ ...form, coins: Number(e.target.value) })
        }
      />

      <Input
        label="Price ($)"
        type="number"
        value={String(form.price)}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />

      <Input
        label="Image URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

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

      {form.image && (
        <Image
          src={form.image}
          alt="preview"
          className="rounded-xl h-32 object-cover"
        />
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="light" onPress={closeModal}>
          Cancel
        </Button>
        <Button
          color="primary"
          onPress={() => {
            closeModal();
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
