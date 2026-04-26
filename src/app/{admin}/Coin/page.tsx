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
  Tooltip,
} from "@heroui/react";
import { Edit, Trash2, Plus, Download, Search, ShoppingCart, Package as PackageIcon, TrendingUp, History, User, Coins, Clock } from "lucide-react";
import { useModal } from "@/Provider/ModalProvider";
import CoinItemModal from "./CoinItemModal";
import { CoinItem, ProductPurchaseHistory } from "@/types";
import { ADMIN_H1, ADMIN_SUBTITLE } from "../adminTable";

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
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <div>
          <h1 className={ADMIN_H1}>
            Coin <span style={{ color: "#3B5BFF" }}>Items</span>
          </h1>
          <p className={ADMIN_SUBTITLE}>Manage virtual goods, physical products and sales audit</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="flat"
            className="font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
            onPress={() => alert("Sales Report Downloaded")}
            startContent={<Download size={16} />}
          >
            Export Report
          </Button>
          <Button
            className="font-black uppercase text-[10px] tracking-widest px-8 h-11 rounded-xl text-white shadow-xl active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #3B5BFF 0%, #6B3BFF 100%)", boxShadow: "0 4px 15px rgba(59, 91, 255, 0.3)" }}
            startContent={<Plus size={18} strokeWidth={3} />}
            onPress={() => openModal({ content: <CoinItemModal /> })}
          >
            Add New Item
          </Button>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-10 pb-2 border-b border-white/5",
          tab: "h-12 text-[11px] font-black uppercase tracking-[0.2em] text-white/30 data-[selected=true]:text-[#3B5BFF]",
          cursor: "h-0.5 rounded-full bg-[#3B5BFF] shadow-[0_0_12px_rgba(59,91,255,0.8)]",
          tabContent: "group-data-[selected=true]:text-[#3B5BFF]",
        }}
      >
        <Tab
          key="items"
          title={
            <div className="flex items-center gap-2">
              <PackageIcon size={16} />
              <span>Items Management</span>
            </div>
          }
        >
          <div className="mt-8 space-y-8 animate-in fade-in duration-500">
            {/* SEARCH */}
            <div className="relative group max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#3B5BFF] transition-colors" size={16} />
              <input
                placeholder="Search inventory items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl pl-10 pr-3 py-2.5 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-[#3B5BFF] transition-all bg-[#1E2B42] border border-white/10"
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-[#162035] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#3B5BFF]/30 transition-all group shadow-2xl"
                >
                  <CardBody className="p-0">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        removeWrapper
                      />
                      <div className="absolute top-4 right-4 z-10">
                        <Chip
                          size="sm"
                          className={`font-black text-[9px] border-none shadow-xl ${item.active ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
                        >
                          {item.active ? "ACTIVE" : "DISABLED"}
                        </Chip>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#162035] to-transparent" />
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <Chip size="sm" variant="flat" className="bg-[#3B5BFF]/10 text-[#7B9FFF] font-black text-[9px] uppercase mb-2 border-none">
                          {item.category}
                        </Chip>
                        <h3 className="font-black text-xl text-white italic tracking-tight leading-tight">
                          {item.name}
                        </h3>
                      </div>

                      <p className="text-xs text-white/40 line-clamp-2 italic font-medium leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-end pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">
                            Market Price
                          </p>
                          <div className="flex items-center gap-1.5">
                            <Coins size={16} className="text-[#3B5BFF]" />
                            <p className="text-2xl font-black text-white italic">
                              {formatVND(item.price)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">
                            Inventory
                          </p>
                          <p className="font-black text-white/80">
                            {item.stock} <span className="text-[10px] text-white/30 uppercase">Units</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Tooltip content="Edit Item" className="font-bold text-[10px]">
                          <Button
                            isIconOnly
                            size="sm"
                            className="bg-white/5 hover:bg-[#3B5BFF]/20 text-white/30 hover:text-[#7B9FFF] rounded-xl h-9 w-9 transition-all"
                            onClick={() => setEditing(item)}
                          >
                            <Edit size={16} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Delete" className="font-bold text-[10px]" color="danger">
                          <Button
                            isIconOnly
                            size="sm"
                            className="bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-500 rounded-xl h-9 w-9 transition-all"
                            onClick={() => openDeleteModal(item)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </Tooltip>
                      </div>
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
              <History size={16} />
              <span>Purchase History</span>
            </div>
          }
        >
          <div className="mt-8 rounded-[2.5rem] overflow-hidden border border-white/5 animate-in fade-in duration-500" style={{ background: "#162035", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <Table
              aria-label="Purchase history table"
              removeWrapper
              classNames={{
                th: "bg-[#1E2B42] text-white/40 text-[11px] font-black uppercase tracking-widest border-b border-white/[0.08] py-5 px-6",
                td: "py-5 px-6 text-sm border-b border-white/[0.05] text-white/80",
                tr: "hover:bg-white/[0.03] transition-colors group/row",
              }}
            >
              <TableHeader>
                <TableColumn className="w-[35%]">PRODUCT & ASSET</TableColumn>
                <TableColumn>BUYER PROFILE</TableColumn>
                <TableColumn align="center">TRANSACTION</TableColumn>
                <TableColumn align="center">TIMELINE</TableColumn>
                <TableColumn align="center">ORDER STATUS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No purchase history found in logs">
                {MOCK_HISTORY.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Image
                          src={row.itemImage}
                          alt={row.itemName}
                          className="w-12 h-12 rounded-xl object-cover shadow-lg"
                          removeWrapper
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover/row:text-[#3B5BFF] transition-colors">{row.itemName}</span>
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter italic">{row.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B5BFF] to-[#6B3BFF] flex items-center justify-center text-xs font-black text-white">
                          {row.buyerName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white/90">{row.buyerName}</span>
                          <span className="text-[10px] text-white/30 italic">{row.buyerEmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-[#3B5BFF]">
                          <Coins size={14} />
                          <span className="text-base font-black italic">{row.price}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-white/20 tracking-tighter">Gold Coins</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1.5 text-white/50 text-[11px] font-bold">
                          <Clock size={12} /> {row.purchaseDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Chip
                          size="sm"
                          variant="flat"
                          className="font-black uppercase text-[9px] border-none italic px-4"
                          color={
                            row.status === "Completed" ? "success" :
                              row.status === "Pending" ? "warning" :
                                row.status === "Shipped" ? "primary" : "danger"
                          }
                        >
                          {row.status}
                        </Chip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      {/* EDIT MODAL */}
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} classNames={{ base: "dark bg-[#0E1420] text-white border border-white/10" }}>
        <ModalContent>
          <ModalHeader className="font-black uppercase tracking-tighter text-2xl italic border-b border-white/5 pb-4">Edit <span className="text-[#3B5BFF] ml-2">Market Item</span></ModalHeader>
          <ModalBody className="space-y-6 pt-6">
            <Input
              label="Item Display Name"
              labelPlacement="outside"
              placeholder="e.g. FPT Hoodie Special Edition"
              defaultValue={editing?.name}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              classNames={{ inputWrapper: "bg-white/5 border border-white/10 h-12 rounded-xl focus-within:!border-[#3B5BFF]", label: "text-white/40 font-black uppercase text-[10px] tracking-widest", input: "text-white font-bold" }}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price (Coins)"
                type="number"
                labelPlacement="outside"
                defaultValue={editing?.price?.toString()}
                startContent={<Coins size={16} className="text-[#3B5BFF]" />}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev
                      ? { ...prev, price: Number(e.target.value) || 0 }
                      : null
                  )
                }
                classNames={{ inputWrapper: "bg-white/5 border border-white/10 h-12 rounded-xl focus-within:!border-[#3B5BFF]", label: "text-white/40 font-black uppercase text-[10px] tracking-widest", input: "text-white font-bold" }}
              />
              <Input
                label="Stock Units"
                type="number"
                labelPlacement="outside"
                defaultValue={editing?.stock?.toString()}
                startContent={<PackageIcon size={16} className="text-[#3B5BFF]" />}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev
                      ? { ...prev, stock: Number(e.target.value) || 0 }
                      : null
                  )
                }
                classNames={{ inputWrapper: "bg-white/5 border border-white/10 h-12 rounded-xl focus-within:!border-[#3B5BFF]", label: "text-white/40 font-black uppercase text-[10px] tracking-widest", input: "text-white font-bold" }}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex flex-col">
                <span className="font-black uppercase text-[10px] tracking-widest text-white/80">Marketplace Visibility</span>
                <span className="text-[10px] text-white/30 italic">Hide or show item in user shop</span>
              </div>
              <Switch
                isSelected={editing?.active ?? true}
                onValueChange={(value) => {
                  setEditing((prev) =>
                    prev ? { ...prev, active: value } : null
                  );
                }}
                classNames={{ wrapper: "group-data-[selected=true]:bg-[#3B5BFF]" }}
              />
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-white/5 mt-4">
            <Button variant="flat" className="bg-white/5 text-white/50 font-bold uppercase text-[10px]" onClick={() => setEditing(null)}>
              Discard
            </Button>
            <Button
              className="bg-[#3B5BFF] text-white font-black rounded-xl h-12 px-10 uppercase text-[10px] tracking-widest"
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
              Update Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} classNames={{ base: "dark bg-[#0E1420] text-white border border-white/10" }}>
        <ModalContent>
          <ModalHeader className="text-red-500 font-black uppercase tracking-tighter text-2xl italic">
            Terminate <span className="text-white ml-2">Listing?</span>
          </ModalHeader>
          <ModalBody>
            <p className="text-white/60">
              Are you sure you want to permanently remove this item from the market? This action cannot be undone.
            </p>
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mt-2">
              <p className="text-xs font-black uppercase text-red-500 italic">{itemToDelete?.name}</p>
            </div>
          </ModalBody>
          <ModalFooter className="mt-4">
            <Button variant="flat" className="bg-white/5 text-white/50" onClick={() => setDeleteModalOpen(false)}>
              Back
            </Button>
            <Button
              className="bg-red-500 text-white font-black rounded-xl h-12 px-10 uppercase text-[10px] tracking-widest"
              onPress={() => {
                if (itemToDelete) removeItem();
                setDeleteModalOpen(false);
              }}
            >
              Delete Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}