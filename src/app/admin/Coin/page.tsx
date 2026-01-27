"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Switch,
} from "@heroui/react";
import { Edit, Trash2, Calendar, Plus } from "lucide-react";
import { useModal } from "@/Provider/ModalProvider";
import CoinPackageModal from "./CoinPackageModal";

type CoinPackage = {
  id: number;
  name: string;
  coins: number;
  price: number;
  bonus: number;
  image: string;
  startAt: string;
  endAt: string;
  active?: boolean;
};

const MOCK_PACKAGES: CoinPackage[] = [
  {
    id: 1,
    name: "Starter Pack",
    coins: 100,
    price: 49000,
    bonus: 0,
    image: "https://cdn-icons-png.flaticon.com/512/272/272525.png",
    startAt: "2026-01-01",
    endAt: "2026-12-31",
    active: true,
  },
  {
    id: 2,
    name: "Pro Pack",
    coins: 500,
    price: 219000,
    bonus: 10,
    image: "https://cdn-icons-png.flaticon.com/512/138/138292.png",
    startAt: "2026-02-01",
    endAt: "2026-03-01",
    active: false,
  },
  {
    id: 3,
    name: "Mega Pack",
    coins: 1200,
    price: 499000,
    bonus: 20,
    image: "https://cdn-icons-png.flaticon.com/512/2649/2649421.png",
    startAt: "2025-10-01",
    endAt: "2025-12-01",
    active: true,
  },
];

const getStatus = (start: string, end: string, active?: boolean) => {
  const now = new Date();
  if (active === false) return "DISABLED";
  if (now < new Date(start)) return "UPCOMING";
  if (now > new Date(end)) return "EXPIRED";
  return "ACTIVE";
};

const formatVND = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function CoinManagerPage() {
  const [packages, setPackages] = useState(MOCK_PACKAGES);
  const [editing, setEditing] = useState<CoinPackage | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<CoinPackage | null>(null);

  const { openModal } = useModal();

  const openDeleteModal = (pkg: CoinPackage) => {
    setPackageToDelete(pkg);
    setDeleteModalOpen(true);
  };

  const removePackage = () => {
    if (!packageToDelete) return;
    setPackages((prev) => prev.filter((p) => p.id !== packageToDelete.id));
    setDeleteModalOpen(false);
    setPackageToDelete(null);
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">
            Coin Package <span className="text-[#FF5C00]">Management</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Create, edit and monitor coin packages
          </p>
        </div>

        <Button
          className="bg-[#FF5C00] text-white font-black"
          startContent={<Plus size={16} />}
          onClick={() =>
            openModal({
              content: <CoinPackageModal />,
            })
          }
        >
          Create Package
        </Button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const status = getStatus(pkg.startAt, pkg.endAt, pkg.active);

          return (
            <Card
              key={pkg.id}
              className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl shadow-lg hover:-translate-y-1 transition-all"
            >
              <CardBody className="p-6 space-y-5">
                {/* TOP */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={pkg.image}
                      className="w-14 h-14 rounded-xl bg-slate-100 p-2"
                    />
                    <div>
                      <h3 className="font-black text-lg text-[#071739] dark:text-white">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {pkg.coins} Coins
                      </p>
                    </div>
                  </div>

                  <Chip
                    size="sm"
                    className={`
                      font-black text-[9px] tracking-widest
                      ${status === "ACTIVE" && "bg-emerald-500/15 text-emerald-400"}
                      ${status === "UPCOMING" && "bg-blue-500/15 text-blue-400"}
                      ${status === "EXPIRED" && "bg-red-500/15 text-red-400"}
                      ${status === "DISABLED" && "bg-gray-500/15 text-gray-400"}
                    `}
                  >
                    {status}
                  </Chip>
                </div>

                {/* PRICE */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs uppercase text-slate-400 tracking-widest">
                      Price
                    </p>
                    <p className="text-2xl font-black text-[#FF5C00]">
                      {formatVND(pkg.price)} coins
                    </p>
                  </div>

                  {pkg.bonus > 0 && (
                    <Chip
                      size="sm"
                      className="bg-yellow-400/15 text-yellow-500 font-black text-[10px]"
                    >
                      +{pkg.bonus}% BONUS
                    </Chip>
                  )}
                </div>

                {/* TIME */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Calendar size={14} />
                  {pkg.startAt} → {pkg.endAt}
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 pt-3">
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-blue-600 text-white"
                    onClick={() => setEditing(pkg)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    className="bg-red-600 text-white"
                    onClick={() => openDeleteModal(pkg)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)}>
        <ModalContent>
          <ModalHeader>Edit Coin Package</ModalHeader>
          <ModalBody className="space-y-4">
            {/* Package Name */}
            <Input
              label="Package Name"
              defaultValue={editing?.name}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
            />

            {/* Coins */}
            <Input
              label="Coins"
              type="number"
              defaultValue={editing?.coins?.toString()}
              onChange={(e) =>
                setEditing((prev) =>
                  prev
                    ? { ...prev, coins: Number(e.target.value) || 0 }
                    : null
                )
              }
            />

            {/* Price */}
            <Input
              label="Price (coins)"
              type="number"
              defaultValue={editing?.price?.toString()}
              onChange={(e) =>
                setEditing((prev) =>
                  prev
                    ? { ...prev, price: Number(e.target.value) || 0 }
                    : null
                )
              }
            />

            {/* Start Date */}
            <Input
              label="Start Date"
              type="date"
              defaultValue={editing?.startAt}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, startAt: e.target.value } : null
                )
              }
            />

            {/* End Date */}
            <Input
              label="End Date"
              type="date"
              defaultValue={editing?.endAt}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, endAt: e.target.value } : null
                )
              }
            />

            {/* Active Status - Switch + Nút chủ động */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Active Status</span>
                <Switch
                  isSelected={editing?.active ?? true}
                  onValueChange={(value) => {
                    setEditing((prev) =>
                      prev ? { ...prev, active: value } : null
                    );
                  }}
                  classNames={{
                    wrapper: "group-data-[selected=true]:bg-green-600",
                  }}
                />
              </div>

              {/* Nút chủ động Enable/Disable */}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="flat"
                  color={editing?.active ? "danger" : "success"}
                  onPress={() => {
                    setEditing((prev) =>
                      prev ? { ...prev, active: !prev.active } : null
                    );
                  }}
                >
                  {editing?.active ? "Disable Package" : "Enable Package"}
                </Button>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              className="bg-[#FF5C00] text-white font-black"
              onPress={() => {
                // Logic save (cập nhật state packages)
                if (editing) {
                  setPackages((prev) =>
                    prev.map((p) =>
                      p.id === editing.id ? { ...p, ...editing } : p
                    )
                  );
                }
                setEditing(null);
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* CONFIRM REMOVE MODAL */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="text-red-600 font-black">
            Remove Coin Package?
          </ModalHeader>
          <ModalBody>
            <p className="text-sm">
              Are you sure you want to remove{" "}
              <span className="font-bold">{packageToDelete?.name}</span>?
            </p>
            <p className="text-xs text-slate-500 mt-2">
              This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => {
                if (packageToDelete) removePackage();
                setDeleteModalOpen(false);
                setPackageToDelete(null);
              }}
            >
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}