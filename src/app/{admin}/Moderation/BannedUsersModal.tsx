import { useState, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Pagination,
  Tabs,
  Tab,
  Spinner,
  User as UserComponent
} from "@heroui/react";
import { Lock, Unlock, Search, ShieldAlert } from "lucide-react";
import { 
  useGetLockedUsersQuery, 
  useGetUnlockedUsersQuery, 
  useLockUserMutation, 
  useUnlockUserMutation 
} from "@/store/queries/user";
import { toast } from "sonner";
import { Users } from "@/types";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BannedUsersModal({ isOpen, onOpenChange }: Props) {
  const [selectedTab, setSelectedTab] = useState("locked");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: lockedRes, isLoading: isLoadingLocked } = useGetLockedUsersQuery();
  const { data: unlockedRes, isLoading: isLoadingUnlocked } = useGetUnlockedUsersQuery();
  
  const [lockUser, { isLoading: isLocking }] = useLockUserMutation();
  const [unlockUser, { isLoading: isUnlocking }] = useUnlockUserMutation();

  const handleTabChange = (key: any) => {
    setSelectedTab(key);
    setSearchQuery("");
    setPage(1);
  };

  const currentUsers: Users[] = useMemo(() => {
    if (selectedTab === "locked") return lockedRes?.data || [];
    return unlockedRes?.data || [];
  }, [selectedTab, lockedRes, unlockedRes]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return currentUsers;
    const q = searchQuery.toLowerCase();
    return currentUsers.filter(u => 
      u.email?.toLowerCase().includes(q) || 
      u.displayName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.userId?.toLowerCase().includes(q)
    );
  }, [currentUsers, searchQuery]);

  const rowsPerPage = 10;
  const pages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, filteredUsers]);

  const handleAction = async (user: Users, action: "lock" | "unlock") => {
    try {
      if (action === "lock") {
        await lockUser(user.userId).unwrap();
        toast.success(`Đã lock thành công ${user.email}`);
      } else {
        await unlockUser(user.userId).unwrap();
        toast.success(`Đã unlock thành công ${user.email}`);
      }
    } catch (e: any) {
      toast.error(`Thao tác thất bại: ${e?.data?.message || e?.message}`);
    }
  };

  const renderCell = (user: Users, columnKey: string) => {
    switch (columnKey) {
      case "user":
        return (
          <UserComponent
            avatarProps={{ radius: "lg", src: user.avatarUrl || undefined }}
            description={user.email}
            name={user.displayName || user.username || "Unknown"}
          >
            {user.email}
          </UserComponent>
        );
      case "role":
        return (
          <Chip size="sm" variant="flat" color="primary">
            {user.role || "STUDENT"}
          </Chip>
        );
      case "actions":
        if (selectedTab === "locked") {
          return (
            <Button 
              size="sm" 
              color="success" 
              variant="flat" 
              startContent={<Unlock size={14} />}
              onPress={() => handleAction(user, "unlock")}
              isLoading={isUnlocking}
            >
              Unlock
            </Button>
          );
        } else {
          return (
            <Button 
              size="sm" 
              color="danger" 
              variant="flat" 
              startContent={<Lock size={14} />}
              onPress={() => handleAction(user, "lock")}
              isLoading={isLocking}
            >
              Lock
            </Button>
          );
        }
      default:
        return "-";
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[2.5rem] dark:bg-[#1C2737] border border-gray-100 dark:border-[#334155]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex gap-2 items-center text-xl tracking-tighter font-black uppercase text-danger">
                <ShieldAlert size={22} strokeWidth={2.5} />
                Manage User Access
              </div>
              <p className="text-xs text-slate-500 tracking-wider">
                Xem danh sách người dùng đang bị lock và unlock.
              </p>
            </ModalHeader>
            <ModalBody className="py-2 flex flex-col gap-4">
              <div className="flex justify-between items-center bg-slate-50/50 dark:bg-black/20 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Tabs 
                  aria-label="User Status Tabs" 
                  selectedKey={selectedTab} 
                  onSelectionChange={handleTabChange}
                  color="danger"
                  variant="light"
                  classNames={{
                    tabList: "gap-6 relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-danger",
                    tab: "max-w-fit px-0 h-10",
                    tabContent: "group-data-[selected=true]:text-danger font-bold uppercase text-xs tracking-widest"
                  }}
                >
                  <Tab
                    key="locked"
                    title={
                      <div className="flex items-center space-x-2">
                        <Lock size={14} />
                        <span>LOCKED ({lockedRes?.data?.length || 0})</span>
                      </div>
                    }
                  />
                  <Tab
                    key="unlocked"
                    title={
                      <div className="flex items-center space-x-2">
                        <Unlock size={14} />
                        <span>UNLOCKED ({unlockedRes?.data?.length || 0})</span>
                      </div>
                    }
                  />
                </Tabs>

                <Input
                  className="w-64"
                  size="sm"
                  placeholder="Tìm theo email, tên..."
                  startContent={<Search size={16} className="text-slate-400" />}
                  value={searchQuery}
                  onValueChange={(val) => {
                    setSearchQuery(val);
                    setPage(1);
                  }}
                />
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-black/40">
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  <Table 
                    aria-label="User List Table"
                    removeWrapper
                    isHeaderSticky
                    bottomContent={
                      pages > 1 ? (
                        <div className="flex w-full justify-center pb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="danger"
                            page={page}
                            total={pages}
                            onChange={(p) => setPage(p)}
                          />
                        </div>
                      ) : null
                    }
                  >
                    <TableHeader>
                      <TableColumn key="user">USER</TableColumn>
                      <TableColumn key="role">ROLE</TableColumn>
                      <TableColumn key="actions" align="end">ACTION</TableColumn>
                    </TableHeader>
                    <TableBody 
                      items={items}
                      emptyContent={
                        (selectedTab === "locked" && isLoadingLocked) || (selectedTab === "unlocked" && isLoadingUnlocked)
                          ? <Spinner size="lg" color="danger" />
                          : "Không có người dùng nào khớp với bộ lọc."
                      }
                    >
                      {(item) => (
                        <TableRow key={item.userId}>
                          {(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="flat" onPress={onClose} className="uppercase font-bold text-xs tracking-widest">
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
