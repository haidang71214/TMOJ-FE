"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Image,
  Chip,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import {
  Coins,
  ArrowLeft,
  ShoppingBag,
  History,
  CheckCircle2,
  Package,
  ChevronRight,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

/* Mock data - Tương ứng với SHOP_ITEMS */
const SHOP_ITEMS = [
  {
    id: 1,
    name: "Áo Polo FPT Cam",
    price: 80000,
    category: "Fashion",
    img: "https://dongphuchaianh.vn/wp-content/uploads/2022/07/trang-phuc-ao-thun-polo-dong-phuc-3.jpg",
    sales: 120,
    stock: 50,
    description: "Áo Polo FPT màu cam truyền thống, chất liệu vải cá sấu cao cấp, thoáng mát, thấm hút mồ hôi tốt. Phù hợp cho các hoạt động ngoại khóa và sự kiện trường.",
    specs: ["Chất liệu: Cotton 100%", "Màu sắc: Cam FPT", "Size: S, M, L, XL, XXL", "Công nghệ in: Thêu logo sắc nét"]
  },
  {
    id: 2,
    name: "Áo Polo FPT Trắng Phối Cam",
    price: 90000,
    category: "Fashion",
    img: "https://dongphuccati.com/images/products/2020/05/18/original/2-1.jpg",
    sales: 85,
    stock: 30,
    description: "Phiên bản Polo FPT màu trắng phối cam thanh lịch. Thiết kế hiện đại, tôn dáng, phù hợp cho cả nam và nữ.",
    specs: ["Chất liệu: Vải Poly Thái", "Màu sắc: Trắng phối Cam", "Kiểu dáng: Slim fit", "Đặc điểm: Không nhăn, không xù"]
  },
  {
    id: 3,
    name: "Balo FPT Software",
    price: 250000,
    category: "Gear",
    img: "https://bizweb.dktcdn.net/100/390/135/products/balo-fpt-software.png?v=1681977970063",
    sales: 300,
    stock: 15,
    description: "Balo FPT Software chuyên dụng cho sinh viên IT. Ngăn chứa laptop riêng biệt, lớp đệm chống sốc dày dặn, nhiều ngăn phụ tiện dụng.",
    specs: ["Kích thước: 45 x 30 x 15 cm", "Chất liệu: Polyester chống nước", "Ngăn Laptop: Lên đến 15.6 inch", "Quai đeo: Đệm êm ái, trợ lực tốt"]
  },
  {
    id: 4,
    name: "Cặp FPT",
    price: 300000,
    category: "Accessories",
    img: "https://5.imimg.com/data5/ANDROID/Default/2022/8/ND/IF/PO/22020579/product-jpeg-500x500.jpg",
    sales: 450,
    stock: 100,
    description: "Cặp đeo chéo FPT phong cách trẻ trung. Tiện lợi cho việc mang theo giáo trình và phụ kiện cá nhân hàng ngày.",
    specs: ["Loại: Cặp đeo chéo", "Màu sắc: Cam - Đen", "Ngăn chứa: 1 ngăn chính, 2 ngăn phụ", "Khóa kéo: YKK bền bỉ"]
  },
  {
    id: 5,
    name: "Bút FPT Excellence",
    price: 30000,
    category: "Collection",
    img: "https://tse1.mm.bing.net/th/id/OIP.6s4XuaMBVNzZBi9C_Rl_CQHaFj?w=700&h=525&rs=1&pid=ImgDetMain&o=7&rm=3",
    sales: 150,
    stock: 200,
    description: "Bút ký cao cấp FPT Excellence. Món quà ý nghĩa dành cho những cá nhân có thành tích xuất sắc, mang đậm bản sắc tinh thần FPT.",
    specs: ["Loại bút: Bút bi mực gel", "Vỏ bút: Kim loại sơn tĩnh điện", "Màu mực: Xanh/Đen", "Hộp đựng: Sang trọng kèm theo"]
  },
];

export default function ProductDetailPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const PRODUCT_DATA_FOUND = SHOP_ITEMS.find((item) => item.id === Number(id));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!PRODUCT_DATA_FOUND) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black italic uppercase">Product Not Found</h1>
        <Button onPress={() => router.push("/Coin")}>Back to Store</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] p-8 transition-colors duration-300 custom-scrollbar">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        {/* TOP NAVIGATION */}
        <div className="flex items-center justify-between">
          <Button
            variant="light"
            onPress={() => router.push("/Coin")}
            className="font-[1000] uppercase italic text-[10px] text-slate-500 hover:text-blue-600 dark:hover:text-[#00FF41] p-0 h-auto min-w-0 transition-colors"
            startContent={<ArrowLeft size={14} />}
          >
            Back to Store .
          </Button>

          <Breadcrumbs
            size="sm"
            classNames={{ list: "font-[1000] italic uppercase text-[10px]" }}
          >
            <BreadcrumbItem href="/Coin">Store</BreadcrumbItem>
            <BreadcrumbItem>{PRODUCT_DATA_FOUND.category} Detail #{id}</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        {/* MAIN DETAIL CARD */}
        <Card className="bg-white dark:bg-[#111c35] border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardBody className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Image Section */}
              <div className="p-6 bg-slate-50 dark:bg-black/20 flex items-center justify-center">
                <div className="relative group w-full aspect-square rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-[#111c35]">
                  <Image
                    src={PRODUCT_DATA_FOUND.img}
                    alt="Product"
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
              </div>

              {/* Right: Info Section */}
              <div className="p-8 flex flex-col justify-between gap-6">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <Chip
                      variant="flat"
                      size="sm"
                      className="font-[1000] uppercase italic text-[8px] text-blue-600 dark:text-[#00FF41] border-none bg-blue-50 dark:bg-green-500/10"
                    >
                      {PRODUCT_DATA_FOUND.category}
                    </Chip>
                    <h1 className="text-3xl font-[1000] italic uppercase tracking-tighter text-[#071739] dark:text-white leading-none">
                      {PRODUCT_DATA_FOUND.name}
                    </h1>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-black uppercase italic text-slate-400">
                    <span>{PRODUCT_DATA_FOUND.sales.toLocaleString()} Sold</span>
                    <Divider orientation="vertical" className="h-3" />
                    <span className="text-emerald-500">
                      {PRODUCT_DATA_FOUND.stock} In Stock
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                    {PRODUCT_DATA_FOUND.description}
                  </p>

                  <div className="space-y-2">
                    {PRODUCT_DATA_FOUND.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-[9px] font-[1000] uppercase italic text-[#071739] dark:text-slate-300"
                      >
                        <CheckCircle2
                          size={12}
                          className="text-blue-600 dark:text-[#00FF41]"
                        />{" "}
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-baseline gap-2">
                    <Coins
                      size={24}
                      className="text-[#FFB800]"
                      strokeWidth={3}
                    />
                    <span className="text-4xl font-[1000] italic text-[#FFB800]">
                      {PRODUCT_DATA_FOUND.price.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    className="w-full bg-[#071739] dark:bg-[#FF5C00] text-white font-[1000] uppercase italic h-14 rounded-2xl shadow-xl 
                                hover:bg-blue-600 dark:hover:bg-[#00FF41] dark:hover:text-[#071739] transition-all text-md"
                    startContent={<ShoppingBag size={20} />}
                  >
                    Redeem Now
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* BOTTOM QUICK LINKS */}
        <div className="flex gap-4 justify-center pb-10">
          <Button
            variant="flat"
            onPress={() => router.push("/Coin")}
            className="w-40 h-12 bg-white dark:bg-[#111c35] rounded-full border-none shadow-sm px-6 group hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Package
                  size={18}
                  className="text-blue-600 dark:text-[#00FF41]"
                />
                <span className="text-[10px] font-[1000] uppercase italic text-[#071739] dark:text-white">
                  Store
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Button>

          <Button
            variant="flat"
            onPress={() => router.push("/Coin?tab=purchases")}
            className="w-40 h-12 bg-white dark:bg-[#111c35] rounded-full border-none shadow-sm px-6 group hover:scale-105 transition-all"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <History size={18} className="text-emerald-500" />
                <span className="text-[10px] font-[1000] uppercase italic text-[#071739] dark:text-white">
                  Orders
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Button>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5c00;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
