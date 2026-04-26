"use client";

import React, { useState, useMemo } from "react";
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
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
} from "@heroui/react";
import { Edit, Trash2, Plus, Download, Search, ShoppingCart, Package as PackageIcon } from "lucide-react";
import { useModal } from "@/Provider/ModalProvider";
import CoinItemModal from "./CoinItemModal";
import { CoinItem, ProductPurchaseHistory } from "@/types";

const MOCK_ITEMS: CoinItem[] = [
  {
    id: 1,
    name: "Áo Polo FPT Cam",
    description: "Đồng phục Polo FPT màu cam năng động, chất liệu thoáng mát.",
    price: 80000,
    image: "https://dongphuchaianh.vn/wp-content/uploads/2022/07/trang-phuc-ao-thun-polo-dong-phuc-3.jpg",
    category: "Fashion",
    stock: 100,
    sales: 45,
    createdAt: "2026-01-10",
    active: true,
  },
  {
    id: 2,
    name: "Áo Polo FPT Trắng Phối Cam",
    description: "Áo Polo FPT màu trắng phối cam thanh lịch.",
    price: 90000,
    image: "https://dongphuccati.com/images/products/2020/05/18/original/2-1.jpg",
    category: "Fashion",
    stock: 80,
    sales: 32,
    createdAt: "2026-01-12",
    active: true,
  },
  {
    id: 3,
    name: "Balo FPT Software",
    description: "Balo laptop FPT Software cao cấp, chống nước.",
    price: 250000,
    image: "https://bizweb.dktcdn.net/100/390/135/products/balo-fpt-software.png?v=1681977970063",
    category: "Accessories",
    stock: 50,
    sales: 120,
    createdAt: "2026-02-05",
    active: true,
  },
  {
    id: 4,
    name: "Cặp FPT",
    description: "Cặp FPT thời trang, bền đẹp.",
    price: 300000,
    image: "https://5.imimg.com/data5/ANDROID/Default/2022/8/ND/IF/PO/22020579/product-jpeg-500x500.jpg",
    category: "Accessories",
    stock: 500,
    sales: 230,
    createdAt: "2026-01-05",
    active: true,
  },
  {
    id: 5,
    name: "Bút FPT Excellence",
    description: "Bút vinh danh dành cho sinh viên xuất sắc.",
    price: 30000,
    image: "https://tse1.mm.bing.net/th/id/OIP.6s4XuaMBVNzZBi9C_Rl_CQHaFj?w=700&h=525&rs=1&pid=ImgDetMain&o=7&rm=3",
    category: "Collection",
    stock: 20,
    sales: 5,
    createdAt: "2026-03-20",
    active: true,
  },
];

const MOCK_HISTORY: ProductPurchaseHistory[] = [
  {
    id: "ORD-001",
    itemName: "Áo Polo FPT Cam",
    itemImage: "https://dongphuchaianh.vn/wp-content/uploads/2022/07/trang-phuc-ao-thun-polo-dong-phuc-3.jpg",
    buyerName: "Nguyễn Văn A",
    buyerEmail: "anv@fpt.edu.vn",
    price: 500,
    purchaseDate: "2026-04-20 10:30",
    status: "Completed",
  },
  {
    id: "ORD-002",
    itemName: "Balo FPT Software",
    itemImage: "https://bizweb.dktcdn.net/100/390/135/products/balo-fpt-software.png?v=1681977970063",
    buyerName: "Trần Thị B",
    buyerEmail: "bt@fpt.edu.vn",
    price: 1200,
    purchaseDate: "2026-04-21 14:15",
    status: "Shipped",
  },
  {
    id: "ORD-003",
    itemName: "Dây đeo thẻ FPT",
    itemImage: "https://5.imimg.com/data5/ANDROID/Default/2022/8/ND/IF/PO/22020579/product-jpeg-500x500.jpg",
    buyerName: "Lê Văn C",
    buyerEmail: "clv@fpt.edu.vn",
    price: 100,
    purchaseDate: "2026-04-22 09:00",
    status: "Pending",
  },
];

const formatVND = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function CoinManagerPage() {
  const [items, setItems] = useState<CoinItem[]>(MOCK_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState<CoinItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CoinItem | null>(null);
  const [activeTab, setActiveTab] = useState("items");

  const { openModal } = useModal();

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const openDeleteModal = (item: CoinItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const removeItem = () => {
    if (!itemToDelete) return;
    setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">
            Coin Item <span className="text-[#FF5C00]">Management</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Manage FPT products and purchase history
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            className="bg-slate-100 dark:bg-white/5 text-[#071739] dark:text-white font-black border border-slate-200 dark:border-white/10"
            startContent={<Download size={16} />}
            onPress={() => alert("Sales Report Downloaded")}
          >
            Export Sales Report
          </Button>
          <Button
            className="bg-[#FF5C00] text-white font-black"
            startContent={<Plus size={16} />}
            onClick={() =>
              openModal({
                content: <CoinItemModal />,
              })
            }
          >
            Add New Item
          </Button>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        variant="underlined"
        classNames={{
          cursor: "bg-[#FF5C00]",
          tab: "font-black uppercase tracking-wider",
        }}
      >
        <Tab
          key="items"
          title={
            <div className="flex items-center gap-2">
              <PackageIcon size={18} />
              <span>Items Management</span>
            </div>
          }
        >
          <div className="mt-6 space-y-6">
            {/* SEARCH */}
            <div className="max-w-md">
              <Input
                placeholder="Search products..."
                startContent={<Search size={18} className="text-slate-400" />}
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="font-bold"
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl shadow-lg hover:-translate-y-1 transition-all"
                >
                  <CardBody className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <Chip size="sm" className="bg-blue-500/10 text-blue-500 font-black text-[10px] uppercase mb-1">
                            {item.category}
                          </Chip>
                          <h3 className="font-black text-lg text-[#071739] dark:text-white leading-tight">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                      <Chip
                        size="sm"
                        className={`font-black text-[9px] tracking-widest ${item.active ? "bg-emerald-500/15 text-emerald-400" : "bg-gray-500/15 text-gray-400"}`}
                      >
                        {item.active ? "ACTIVE" : "DISABLED"}
                      </Chip>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-end border-t border-slate-100 dark:border-white/5 pt-4">
                      <div>
                        <p className="text-[10px] uppercase text-slate-400 tracking-widest">
                          Price
                        </p>
                        <p className="text-2xl font-black text-[#FF5C00]">
                          {formatVND(item.price)} <span className="text-xs uppercase">Coins</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase text-slate-400 tracking-widest">
                          Stock
                        </p>
                        <p className="font-black text-slate-700 dark:text-slate-200">
                          {item.stock} Left
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        isIconOnly
                        size="sm"
                        className="bg-blue-600 text-white"
                        onClick={() => setEditing(item)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        className="bg-red-600 text-white"
                        onClick={() => openDeleteModal(item)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </Tab>

        <Tab
          key="history"
          title={
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              <span>Purchase History</span>
            </div>
          }
        >
          <div className="mt-6">
            <Table aria-label="Purchase history table">
              <TableHeader>
                <TableColumn className="font-black">PRODUCT</TableColumn>
                <TableColumn className="font-black">BUYER</TableColumn>
                <TableColumn className="font-black">PRICE</TableColumn>
                <TableColumn className="font-black">DATE</TableColumn>
                <TableColumn className="font-black">STATUS</TableColumn>
              </TableHeader>
              <TableBody>
                {MOCK_HISTORY.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={row.itemImage}
                          alt={row.itemName}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-bold">{row.itemName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold">{row.buyerName}</span>
                        <span className="text-xs text-slate-500">{row.buyerEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-[#FF5C00]">
                      {row.price} Coins
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {row.purchaseDate}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          row.status === "Completed" ? "success" :
                            row.status === "Pending" ? "warning" :
                              row.status === "Shipped" ? "primary" : "danger"
                        }
                        className="font-black uppercase text-[10px]"
                      >
                        {row.status}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      {/* EDIT MODAL */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)}>
        <ModalContent>
          <ModalHeader className="font-black">Edit Coin Item</ModalHeader>
          <ModalBody className="space-y-4">
            <Input
              label="Item Name"
              defaultValue={editing?.name}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
            />
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
            <Input
              label="Stock"
              type="number"
              defaultValue={editing?.stock?.toString()}
              onChange={(e) =>
                setEditing((prev) =>
                  prev
                    ? { ...prev, stock: Number(e.target.value) || 0 }
                    : null
                )
              }
            />
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5">
              <span className="font-bold text-sm">Active Status</span>
              <Switch
                isSelected={editing?.active ?? true}
                onValueChange={(value) => {
                  setEditing((prev) =>
                    prev ? { ...prev, active: value } : null
                  );
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              className="bg-[#FF5C00] text-white font-black"
              onPress={() => {
                if (editing) {
                  setItems((prev) =>
                    prev.map((i) =>
                      i.id === editing.id ? { ...i, ...editing } : i
                    )
                  );
                }
                setEditing(null);
              }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="text-red-600 font-black">
            Remove Item?
          </ModalHeader>
          <ModalBody>
            <p className="text-sm">
              Are you sure you want to remove{" "}
              <span className="font-bold">{itemToDelete?.name}</span>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => {
                if (itemToDelete) removeItem();
                setDeleteModalOpen(false);
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