"use client";
import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarBrand,
  Input,
} from "@heroui/react";
import { useRouter, usePathname } from "next/navigation"; // Thêm usePathname để active link
import { Search as SearchIcon, Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import ThemeToggle from "./ThemeToggle";
import InformationInNavbar from "./InformationInNavbar";
import RegisterModal from "@/app/Modal/RegisterModal";
import LoginModal from "@/app/Modal/LoginModal";
import { useModal } from "./ModalProvider";
import NotificationInNavbar from "./Notification";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import CartInNavbar from "./CartInNavbar";
import CoinBalanceInNavbar from "./CoinBalanceInNavbar";

export default function NavbarProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useGetUserInformationQuery();
  const { t, language, setLanguage } = useTranslation();
  console.log(user);

  const { openModal } = useModal();

  const handleLink = (link: string) => router.push(link);
  const AcmeLogo = () => (
    <div className="relative drop-shadow-[0_2px_8px_rgba(255,98,0,0.3)] transition-all group-hover:scale-110">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cột trụ chính */}
        <path
          d="M16 6V26M10 26H22"
          stroke="url(#logo-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Thanh cân bằng ngang */}
        <path
          d="M5 11L16 8L27 11"
          stroke="url(#logo-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Đĩa cân trái */}
        <path
          d="M5 11L2 19C2 19 3.5 21 6.5 21C9.5 21 11 19 11 19L8 11"
          stroke="url(#logo-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Đĩa cân phải */}
        <path
          d="M27 11L30 19C30 19 28.5 21 25.5 21C22.5 21 21 19 21 19L24 11"
          stroke="url(#logo-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="5"
            y1="8"
            x2="27"
            y2="26"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF6200" />
            <stop offset="1" stopColor="#FFB74D" />
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
            className="flex items-center gap-3 cursor-pointer group"
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
            "Problems",
            "StudyPlan",
            "Contest",
            "Class",
            "Ranking",
            "Management",
            "Coin",
          ].map((item, index) => {
            // Logic điều hướng đặc biệt cho các tab
            let link = `/${item}`;
            if (item === "Problems") link = "/Problems/Library";
            if (item === "StudyPlan") link = "/StudyPlan";
            if (item === "Class") {
              if (!user || user?.role?.includes("manager") || user?.role?.includes("admin")) return null;
              link = "/Class";
            }
            if (item === "Ranking") link = "/Ranking";
            if (item === "Management") {
              if (user?.role?.toLowerCase() === "teacher") {
                link = "/Management/Contest";
              } else if (
                user?.role?.toLowerCase() === "manager" ||
                user?.role?.toLowerCase() === "admin"
              ) {
                link = "/Management/Problem";
              } else {
                return null;
              }
            }
            if (item === "Coin") link = "/Coin";

            const isActive = pathname.startsWith(`/${item}`);

            return (
              <NavbarItem
                key={item}
                className="animate-fade-in-up"
                style={{ animationFillMode: "both", animationDelay: `${index * 100}ms` }}
              >
                <Link
                  onClick={() => handleLink(link)}
                  style={{ marginRight: 20 }}
                  className={`font-black text-[16px] cursor-pointer transition-colors relative after:content-[''] after:absolute after:w-0 after:h-[3px] after:bg-[#ff8904] after:left-1/2 after:-translate-x-1/2 after:-bottom-[20px] hover:after:w-full after:transition-all after:duration-300 ${isActive
                    ? "text-[#ff8904] after:w-full"
                    : "text-[#4B6382] dark:text-[#A0AEC0] hover:text-[#071739] dark:hover:text-[#ff8904]"
                    }`}
                >
                  {t(item.toLowerCase()) || item}
                </Link>
              </NavbarItem>
            );
          })}
        </div>
      </NavbarContent>

      {/* 2. USER & LANGUAGE */}
      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>
        <NavbarItem>
          <Button
            size="sm"
            variant="light"
            className="text-[#4B6382] dark:text-[#A0AEC0] hover:text-[#ff8904] font-black min-w-unit-0 px-2"
            onPress={() => setLanguage(language === "en" ? "vi" : "en")}
            startContent={<Globe size={16} />}
          >
            {language.toUpperCase()}
          </Button>
        </NavbarItem>

        {user ? (
          <div className="flex items-center gap-1">
            <CoinBalanceInNavbar />
            <CartInNavbar />
            <InformationInNavbar />
            <NotificationInNavbar />
          </div>
        ) : (
          <div className="flex gap-2">
            <NavbarItem
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: "100ms", animationFillMode: "both" }}
            >
              <Button
                size="sm"
                variant="light"
                onClick={() =>
                  openModal({ title: "Đăng nhập", content: <LoginModal /> })
                }
                className="text-[#071739] dark:text-white font-black rounded-full transition-transform active-bump"
              >
                {t('nav.signin') || (language === 'vi' ? 'Đăng nhập' : 'Sign In')}
              </Button>
            </NavbarItem>

            <NavbarItem
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
              <Button
                size="sm"
                onClick={() =>
                  openModal({ title: "Đăng kí", content: <RegisterModal /> })
                }
                style={{ backgroundColor: "#ff8904" }}
                className="text-white font-black rounded-full shadow-lg shadow-[#ff8904]/20 hover:brightness-110 transition-transform active-bump"
              >
                {t('nav.signup') || (language === 'vi' ? 'Đăng ký' : 'Sign Up')}
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  );
}
