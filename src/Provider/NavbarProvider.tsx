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
import {  Search as SearchIcon, Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import ThemeToggle from "./ThemeToggle";
import InformationInNavbar from "./InformationInNavbar";
import RegisterModal from "@/app/Modal/RegisterModal";
import LoginModal from "@/app/Modal/LoginModal";
import { useModal } from "./ModalProvider";
import NotificationInNavbar from "./Notification";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";

export default function NavbarProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user } = useGetUserInformationQuery();
  const { t, language, setLanguage } = useTranslation();
  console.log(user);
  
  const { openModal } = useModal();

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
            "Problems",
            "Contest",
            "Class",
            "Ranking",
            "Management",
            "Coin",
          ].map((item, index) => {
            // Logic điều hướng đặc biệt cho các tab
            let link = `/${item}`;
         if (item === "Problems") link = "/Problems/Library";
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
                  style={{marginRight:20}}
                  className={`font-black text-[16px] cursor-pointer transition-colors relative after:content-[''] after:absolute after:w-0 after:h-[3px] after:bg-[#ff8904] after:left-1/2 after:-translate-x-1/2 after:-bottom-[20px] hover:after:w-full after:transition-all after:duration-300 ${
                    isActive
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
          <div className="flex">
           <InformationInNavbar  />
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
