"use client";
import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarBrand,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  addToast,
} from "@heroui/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation"; // Thêm usePathname để active link
import ThemeToggle from "./ThemeToggle";
import { ChevronDown, Search as SearchIcon } from "lucide-react";
import InformationInNavbar from "./InformationInNavbar";
import RegisterModal from "@/app/Modal/RegisterModal";
import LoginModal from "@/app/Modal/LoginModal";
import { useModal } from "./ModalProvider";

export default function NavbarProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isUser : boolean = searchParams.get("user") === "true";
    const { openModal } = useModal();
  const hihi = () =>{
    router.push("/?user=true");
        addToast({
        title: "Login Success",
        color: "success",
      });
  }
  
  const handleLink = (link: string) => router.push(link);

  const AcmeLogo = () => (
    <div className="relative drop-shadow-[0_2px_4px_rgba(255,137,4,0.3)] transition-transform group-hover:scale-110">
      <svg fill="none" height="32" viewBox="0 0 32 32" width="32">
        <path
          clipRule="evenodd"
          d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
          fill="url(#logo-gradient)"
          fillRule="evenodd"
        />
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="7"
            y1="7"
            x2="25"
            y2="23"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ff8904" />
            <stop offset="1" stopColor="#ffb347" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  return (
    <Navbar
      maxWidth="full"
      className="h-16 bg-white dark:bg-[#282E3A] border-b border-[#CDD5DB] dark:border-[#3F4755] sticky top-0 z-[100] transition-colors duration-500"
    >
      {/* 1. LOGO & NAV LINKS */}
      <NavbarContent justify="start" className="gap-8">
        <NavbarBrand className="max-w-fit mr-2">
          <div
            onClick={() => handleLink("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <AcmeLogo />
            <p className="font-black text-xl tracking-tighter text-[#071739] dark:text-white">
              TMOJ<span className="text-[#ff8904]">.</span>
            </p>
          </div>
        </NavbarBrand>

        <div className="hidden lg:flex gap-6 items-center">
          {/* Cập nhật danh sách Tabs ở đây */}
          {["Explore", "Problems", "Contest", "Discuss", "Management"].map(
            (item) => {
              // Logic điều hướng đặc biệt cho các tab
              let link = `/${item}`;
              if (item === "Problems") link = "/Problems/Library";
              if (item === "Management") link = "/Management/Contest";

              const isActive = pathname.startsWith(`/${item}`);

              return (
                <NavbarItem key={item}>
                  <Link
                    onClick={() => handleLink(link)}
                    className={`font-black text-[13px] cursor-pointer transition-colors ${
                      isActive
                        ? "text-[#ff8904]"
                        : "text-[#4B6382] dark:text-[#A0AEC0] hover:text-[#071739] dark:hover:text-[#ff8904]"
                    }`}
                  >
                    {item}
                  </Link>
                </NavbarItem>
              );
            }
          )}

          <NavbarItem>
            <Dropdown className="dark:bg-[#282E3A] border dark:border-[#3F4755]">
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent text-[#4B6382] dark:text-[#A0AEC0] font-black text-[13px] hover:text-[#071739] dark:hover:text-[#ff8904]"
                  endContent={<ChevronDown size={14} />}
                  variant="light"
                >
                  More
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="More options"
                className="dark:text-white"
              >
                <DropdownItem
                  key="interview"
                  onClick={() => handleLink("/Interview")}
                >
                  Interview Prep
                </DropdownItem>
                <DropdownItem
                  key="store"
                  onClick={() => handleLink("/Premium")}
                >
                  Store
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </div>
      </NavbarContent>

      {/* 2. SEARCH & USER */}
      <NavbarContent justify="end" className="gap-4">
        <NavbarItem className="hidden md:flex">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[200px] lg:max-w-[280px] h-9",
              mainWrapper: "h-full",
              input:
                "text-[12px] font-bold placeholder:text-[#A4B5C4] dark:text-white",
              inputWrapper:
                "h-full bg-[#CDD5DB]/25 dark:bg-[#333A45] border border-[#CDD5DB] dark:border-[#3F4755] hover:border-[#A4B5C4] focus-within:!border-[#ff8904] rounded-full transition-all px-4 shadow-inner",
            }}
            placeholder="Search problems..."
            size="sm"
            startContent={
              <SearchIcon
                size={15}
                className="text-[#A4B5C4] dark:text-[#667085] mr-1"
              />
            }
            type="search"
          />
        </NavbarItem>

        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

         {isUser ? (
  <InformationInNavbar />
) : (
  <div className="flex gap-2">
    <NavbarItem>
      <Button
        size="sm"
        variant="light"
        onClick={() =>
          openModal({ title: "Đăng nhập", content: <LoginModal /> })
        }
        className="text-[#071739] dark:text-white font-black rounded-full"
      >
        Sign In
      </Button>
    </NavbarItem>

    <NavbarItem>
      <Button
        size="sm"
        onClick={() =>
          openModal({ title: "Đăng kí", content: <RegisterModal /> })
        }
        style={{ backgroundColor: "#ff8904" }}
        className="text-white font-black rounded-full shadow-lg shadow-[#ff8904]/20 hover:brightness-110 active:scale-95 transition-all"
      >
        Sign Up
        <div onClick={()=>{hihi()}}>a</div>
      </Button>
      
    </NavbarItem>
  </div>
)}

      </NavbarContent>
    </Navbar>
  );
}
