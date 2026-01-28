"use client";

import { NavbarItem } from "@heroui/navbar";
import {
  addToast,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import webStorageClient from "@/utils/webStorageClient";
import { useRouter } from "next/navigation";
import {
  List,
  BookOpen,
  BarChart2,
  Coins,
  Sparkles,
  ShoppingBag,
  Settings as SettingsIcon,
  Palette,
  LogOut,
  User2Icon,
} from "lucide-react";
import React from "react";

export default function InformationInNavbar() {
  const router = useRouter();
  const handleLogout = () => {
    webStorageClient.logout();
    addToast({ title: "Logout successfull!", color: "success" });
    router.push("/");
    localStorage.removeItem("user");
  };
  React.useEffect(() => {}, [handleLogout]);
  const handleLink = (link: string) => router.push(link);

  // Giả sử bạn có dữ liệu user (tạm comment như code cũ)
  // const { data: user } = useGetUserInformationQuery();
  const user = {
    name: "Đăng Hải",
    imagesUrl: "https://i.pravatar.cc/150?u=haidang",
  }; // demo

  return (
    <NavbarItem>
      <Dropdown
        placement="bottom-end"
        className="dark:bg-[#1C2737] bg-white border border-[#A4B5C4] dark:border-[#344054] rounded-2xl shadow-xl min-w-[220px] overflow-hidden"
      >
        <DropdownTrigger>
          <div className="flex items-center gap-2.5 p-1.5 pr-4 bg-[#CDD5DB]/20 dark:bg-[#333A45]/60 rounded-full hover:bg-[#CDD5DB]/35 dark:hover:bg-[#3F4755] transition-all cursor-pointer border border-[#A4B5C4]/40 dark:border-[#3F4755]/70">
            <User
              as="button"
              avatarProps={{
                size: "sm",
                src: user?.imagesUrl || "https://i.pravatar.cc/150?u=default",
                className:
                  "border-2 border-white/80 dark:border-[#071739]/80 shadow-md",
              }}
              name=""
            />
            <span className="text-[11px] font-black tracking-tight text-[#071739] dark:text-[#FFB800]">
              {user?.name || "Đăng Hải"}
            </span>
          </div>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="User Menu"
          className="dark:text-[#F9FAFB] text-[#071739] py-2"
          itemClasses={{
            base: "gap-3 rounded-xl data-[hover=true]:bg-[#A68868]/10 dark:data-[hover=true]:bg-[#FFB800]/15 transition-colors",
          }}
        >
          <DropdownItem
            key="mylists"
            startContent={
              <List size={18} className="text-[#4B6382] dark:text-[#98A2B3]" />
            }
            onClick={() => handleLink("/Lists")}
          >
            <span className="font-bold text-sm">My Lists</span>
          </DropdownItem>

          <DropdownItem
            key="bookmark"
            startContent={
              <BookOpen
                size={18}
                className="text-[#4B6382] dark:text-[#98A2B3]"
              />
            }
            onClick={() => handleLink("/Problems/MyLists")}
          >
            <span className="font-bold text-sm">Bookmarks</span>
          </DropdownItem>

          <DropdownItem
            key="progress"
            startContent={
              <BarChart2
                size={18}
                className="text-[#4B6382] dark:text-[#98A2B3]"
              />
            }
            onClick={() => handleLink("/Progress")}
          >
            <span className="font-bold text-sm">Progress</span>
          </DropdownItem>

          <DropdownItem
            key="Coin"
            startContent={
              <Coins size={18} className="text-[#A68868] dark:text-[#FFB800]" />
            }
            onClick={() => handleLink("/Coin")}
          >
            <span className="font-black text-sm bg-gradient-to-r from-[#A68868] to-[#071739] dark:from-[#FFB800] dark:to-[#E3C39D] bg-clip-text text-transparent">
              Coin
            </span>
          </DropdownItem>

          <DropdownItem
            key="try-new"
            startContent={
              <Sparkles
                size={18}
                className="text-[#A68868] dark:text-[#FFB800]"
              />
            }
            onClick={() => handleLink("/New-features")}
          >
            Try New Features
          </DropdownItem>

          <DropdownItem
            key="orders"
            startContent={
              <ShoppingBag
                size={18}
                className="text-[#4B6382] dark:text-[#98A2B3]"
              />
            }
            onClick={() => handleLink("/Crders")}
          >
            Orders
          </DropdownItem>

          <DropdownItem
            key="setting"
            startContent={
              <SettingsIcon
                size={18}
                className="text-[#4B6382] dark:text-[#98A2B3]"
              />
            }
            onClick={() => handleLink("/Settings")}
          >
            Setting
          </DropdownItem>
          <DropdownItem
            key="profile"
            startContent={
              <User2Icon className="w-[18px] h-[18px] text-[#4B6382] dark:text-[#98A2B3]" />
            }
            onClick={() => handleLink("/Profile")}
          >
            Profile
          </DropdownItem>

          <DropdownItem
            key="appearance"
            startContent={
              <Palette
                size={18}
                className="text-[#4B6382] dark:text-[#98A2B3]"
              />
            }
            onClick={() => handleLink("/Appearance")}
          >
            Appearance
          </DropdownItem>

          <DropdownItem
            key="logout"
            color="danger"
            startContent={<LogOut size={18} />}
            className="text-danger font-black data-[hover=true]:bg-danger/10 rounded-xl mt-2 border-t border-[#A4B5C4]/30 dark:border-[#344054]/70 pt-3"
            onClick={handleLogout}
          >
            Sign Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarItem>
  );
}
