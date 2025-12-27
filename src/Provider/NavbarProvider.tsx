"use client";
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
  addToast,
  User,
} from "@heroui/react";
import { useModal } from "./ModalProvider";
import LoginModal from "../app/Modal/LoginModal";
import RegisterModal from "../app/Modal/RegisterModal";
import ProfileUser from "./ProfileUser";
import { useRouter } from "next/navigation";
import webStorageClient from "@/utils/webStorageClient";
import { useGetUserInformationQuery } from "@/store/queries/usersProfile";
import ThemeToggle from "./ThemeToggle";

export default function NavbarProvider() {
  const { openModal } = useModal();
  const router = useRouter();

  const handleOpenLogin = () =>
    openModal({ title: "Đăng nhập", content: <LoginModal /> });
  const handleOpenRegister = () =>
    openModal({ title: "Đăng kí", content: <RegisterModal /> });
  const ProfileUserssOpen = () =>
    openModal({ title: "Profile", content: <ProfileUser /> });
  const handleLogout = () => {
    webStorageClient.logout();
    addToast({ title: "Đăng xuất thành công" });
    router.push("/");
  };
  const handleLink = (link: string) => {
    router.push(`${link}`);
  };
  const { data: user, isLoading } = useGetUserInformationQuery();

  const AcmeLogo = () => (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );

  const FEATURES = [
    {
      key: "autoscaling",
      label: "Autoscaling",
      description: "ACME scales apps based on demand and load",
    },
    {
      key: "usage_metrics",
      label: "Usage Metrics",
      description: "Real-time metrics to debug issues",
    },
    {
      key: "production_ready",
      label: "Production Ready",
      description: "ACME runs on ACME, join us at web scale",
    },
    {
      key: "99_uptime",
      label: "+99% Uptime",
      description: "High availability and uptime guarantees",
    },
    {
      key: "supreme_support",
      label: "363636",
      description: "Support team ready to respond",
    },
  ];
  const STORE = [
    {
      key: "autoscaling",
      label: "Package",
      description: "Find Your limited package",
    },
    {
      key: "/Premium",
      label: "premium",
      description: "Get started with a DMOJ Subscription that works for you.",
    },
  ];
  return (
    <Navbar maxWidth="full" className="px-6">
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">TMOJ</p>
      </NavbarBrand>

      <NavbarContent className="gap-6" justify="start">
        <NavbarItem>
          <Link color="danger" href="/Explore">
            Explore
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="danger" href="/Problems/Library">
            Problems
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="danger" href="/Contest">
            Contest
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="danger" href="/Discuss">
            Discuss
          </Link>
        </NavbarItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button disableRipple variant="light">
                Interview
              </Button>
            </DropdownTrigger>
          </NavbarItem>

          <DropdownMenu
            aria-label="ACME features"
            itemClasses={{
              base: "gap-4",
            }}
          >
            {FEATURES.map((item) => (
              <DropdownItem key={item.key} description={item.description}>
                {item.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button disableRipple variant="light">
                Store
              </Button>
            </DropdownTrigger>
          </NavbarItem>

          <DropdownMenu
            aria-label="ACME features"
            itemClasses={{
              base: "gap-4",
            }}
          >
            {STORE.map((item) => (
              <DropdownItem
                key={item.key}
                description={item.description}
                onClick={() => handleLink(item.key)}
              >
                {item.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

        {isLoading ? (
          <NavbarItem>
            <p>Loading...</p>
          </NavbarItem>
        ) : user ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src:
                      user.imagesUrl || "https://i.pravatar.cc/150?u=default",
                  }}
                  className="transition-transform"
                  description={user.email}
                  name={user.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu actions">
                <DropdownItem key="Role">
                  <p className="font-bold">{user.role}</p>
                </DropdownItem>
                <DropdownItem onPress={ProfileUserssOpen} key="profile">
                  Hồ sơ
                </DropdownItem>
                <DropdownItem key="settings">Cài đặt</DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  onPress={handleLogout}
                >
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <Button
                color="primary"
                variant="bordered"
                onPress={handleOpenLogin}
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                color="danger"
                variant="flat"
                onPress={handleOpenRegister}
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
