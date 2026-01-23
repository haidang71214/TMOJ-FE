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
import { useRouter, usePathname } from "next/navigation"; // Thêm usePathname để active link
import ThemeToggle from "./ThemeToggle";
import { ChevronDown, Search as SearchIcon } from "lucide-react";
import InformationInNavbar from "./InformationInNavbar";
import RegisterModal from "@/app/Modal/RegisterModal";
import LoginModal from "@/app/Modal/LoginModal";
import { useModal } from "./ModalProvider";
import NotificationInNavbar from "./Notification";

export default function NavbarProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const [isUser, setIsUser] = React.useState(false);

  React.useEffect(() => {
    setIsUser(localStorage.getItem("user") === "true");
  }, []);

  const { openModal } = useModal();
  const hihi = () => {
    localStorage.setItem("user", "true");
    addToast({
      title: "Login Success",
      color: "success",
    });
    router.refresh(); // re-render navbar
  };

  const handleLink = (link: string) => router.push(link);
const AcmeLogo = () => (
  <div className="relative drop-shadow-[0_2px_4px_rgba(255,98,0,0.4)] transition-transform group-hover:scale-110">
    <svg
      fill="none"
      height="32"
      viewBox="0 0 32 32"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Curly braces icon - left { and right } */}
      <path
        d="M8 6 C6 8, 6 12, 10 14 L10 18 C6 20, 6 24, 8 26"
        stroke="url(#logo-gradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 6 C26 8, 26 12, 22 14 L22 18 C26 20, 26 24, 24 26"
        stroke="url(#logo-gradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Optional: small code snippet line inside for more "code" feel */}
      <path
        d="M12 16 L20 16"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <defs>
        <linearGradient
          id="logo-gradient"
          x1="6"
          y1="6"
          x2="26"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6200" /> {/* cam đậm, neon code vibe */}
          <stop offset="1" stopColor="#FFB74D" /> {/* cam sáng hơn */}
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
          {[
            "Explore",
            "Problems",
            "Contest",
            "Discuss",
            "Class",
            "Ranking",
            "Management",
            "Coin"
          ].map((item) => {
            // Logic điều hướng đặc biệt cho các tab
            let link = `/${item}`;
            if (item === "Problems") link = "/Problems/Library";
            if (item === "Class") link = "/Class";
            if (item === "Ranking") link = "/Ranking";
            if (item === "Management") link = "/Management/Contest";
            if (item === "Coin") link = "/Coin";
            
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
          })}

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
          <div className="flex"><InformationInNavbar />
          <NotificationInNavbar/>
</div>
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
                <div
                  onClick={() => {
                    hihi();
                  }}
                >
                  a
                </div>
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
}
