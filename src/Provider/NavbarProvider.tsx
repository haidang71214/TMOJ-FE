'use client';
import { Navbar, NavbarContent, NavbarItem, Link, Button, NavbarBrand, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, addToast, User } from "@heroui/react";
import { useModal } from './ModalProvider';
import LoginModal from '../app/Modal/LoginModal';
import RegisterModal from '../app/Modal/RegisterModal';
import ProfileUser from './ProfileUser';
import { useRouter } from 'next/navigation';
import webStorageClient from '@/utils/webStorageClient';
import { useGetUserInformationQuery } from '@/store/queries/usersProfile';
import ThemeToggle from './ThemeToggle';

export default function NavbarProvider() {
  const { openModal } = useModal();
  const router = useRouter();




  const handleOpenLogin = () => openModal({ title: "Đăng nhập", content: <LoginModal /> });
  const handleOpenRegister = () => openModal({ title: "Đăng kí", content: <RegisterModal /> });
  const ProfileUserssOpen = () => openModal({ title: "Profile", content: <ProfileUser /> });
  const handleLogout = () => {
    webStorageClient.logout();
    addToast({ title: "Đăng xuất thành công" });
    router.push("/");
  };

  const { data: user, isLoading } = useGetUserInformationQuery();

  const AcmeLogo = () => (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path clipRule="evenodd" d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z" fill="currentColor" fillRule="evenodd"/>
    </svg>
  );

  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">TDL</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem><Link color="danger" href="/item1">Item 1</Link></NavbarItem>
        <NavbarItem><Link color="foreground" href="/item2">Item 2</Link></NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeToggle/>
        </NavbarItem>

        {isLoading ? (
          <NavbarItem><p>Loading...</p></NavbarItem>
        ) : user ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{ isBordered: true, src: user.imagesUrl || "https://i.pravatar.cc/150?u=default" }}
                  className="transition-transform"
                  description={user.email}
                  name={user.name}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu actions">
                <DropdownItem key="Role"><p className="font-bold">{user.role}</p></DropdownItem>
                <DropdownItem onPress={ProfileUserssOpen} key="profile">Hồ sơ</DropdownItem>
                <DropdownItem key="settings">Cài đặt</DropdownItem>
                <DropdownItem key="logout" className="text-danger" color="danger" onPress={handleLogout}>Đăng xuất</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem><Button color="primary" variant='bordered' onPress={handleOpenLogin}>Login</Button></NavbarItem>
            <NavbarItem><Button color="danger" variant="flat" onPress={handleOpenRegister}>Sign Up</Button></NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
