"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Textarea,
} from "@heroui/react";
import {
  Award,
  Coins,
  Pencil,
  Plus,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  useGetAdminBadgesQuery,
  useCreateBadgeMutation,
  useDeleteBadgeMutation,
  useGetAdminBadgeRulesQuery,
  useUpdateBadgeRuleMutation,
  useDeleteBadgeRuleMutation
} from "@/store/queries/gamification";
import { AdminBadge, AdminBadgeRule } from "@/types/gamification";
import { addToast } from "@heroui/toast";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data dựa trên schema

// interface GamificationEvent {
//   id: string;
//   user_username: string;
//   event_type: string;
//   delta_exp: number;
//   delta_coin: number;
//   created_at: string;
// }

const MOCK_BADGES: AdminBadge[] = [
  { id: "1", name: "First Blood", code: "first_blood", category: "contest", level: 1, isRepeatable: false, description: "Giải quyết problem đầu tiên trong contest", awardedCount: 342 },
  { id: "2", name: "7-Day Streak", code: "streak_7", category: "streak", level: 1, isRepeatable: true, description: "Hoạt động liên tục 7 ngày", awardedCount: 128 },
  { id: "3", name: "Master Solver", code: "master_100", category: "problem", level: 3, isRepeatable: false, description: "Giải ≥100 problems", awardedCount: 45 },
  { id: "4", name: "Course Finisher", code: "course_done", category: "course", level: 2, isRepeatable: true, description: "Hoàn thành 1 khóa học bất kỳ", awardedCount: 512 },
  { id: "5", name: "Top 10 Global", code: "top_10", category: "contest", level: 5, isRepeatable: false, description: "Lọt vào top 10 trong 1 contest chính thức", awardedCount: 10 },
  { id: "6", name: "Code Reviewer", code: "reviewer", category: "problem", level: 2, isRepeatable: true, description: "Đóng góp 10 lời giải mẫu hữu ích", awardedCount: 88 },
];

const MOCK_RULES: AdminBadgeRule[] = [
  { id: "r1", badgeId: "1", badgeName: "First Blood", ruleType: "solved", targetEntity: "contest", targetValue: 1, isActive: true },
  { id: "r2", badgeId: "2", badgeName: "7-Day Streak", ruleType: "streak_days", targetEntity: "streak", targetValue: 7, isActive: true },
  { id: "r3", badgeId: "3", badgeName: "Master Solver", ruleType: "solved", targetEntity: "problem", targetValue: 100, isActive: true },
];

const MOCK_ACHIEVEMENTS_CHART = [
  { level: "Lv 1", awarded: 1200 },
  { level: "Lv 2", awarded: 850 },
  { level: "Lv 3", awarded: 420 },
  { level: "Lv 4", awarded: 180 },
  { level: "Lv 5", awarded: 45 },
  { level: "Lv 6", awarded: 12 },
];

const MOCK_STREAK_CHART = [
  { day: "Day 1-3", users: 5420 },
  { day: "Day 4-7", users: 2100 },
  { day: "Day 8-14", users: 850 },
  { day: "Day 15-30", users: 320 },
  { day: ">30 Days", users: 115 },
];

export default function GamificationManagementPage() {
  const { data: badgesData, isLoading: isLoadingBadges } = useGetAdminBadgesQuery();
  const { data: rulesData, isLoading: isLoadingRules } = useGetAdminBadgeRulesQuery();

  const [createBadge] = useCreateBadgeMutation();
  const [deleteBadge] = useDeleteBadgeMutation();
  const [updateBadgeRule] = useUpdateBadgeRuleMutation();
  const [deleteBadgeRule] = useDeleteBadgeRuleMutation();

  const badges = badgesData?.data || [];
  const rules = rulesData?.data || [];

  const [isCreateBadgeOpen, setIsCreateBadgeOpen] = useState(false);
  const [isEditRuleModalOpen, setIsEditRuleModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AdminBadgeRule | null>(null);

  // State cho form create badge
  const [newBadgeName, setNewBadgeName] = useState("");
  const [newBadgeCode, setNewBadgeCode] = useState("");
  const [newBadgeCategory, setNewBadgeCategory] = useState("contest");
  const [newBadgeLevel, setNewBadgeLevel] = useState(1);
  const [newIsRepeatable, setNewIsRepeatable] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [newIconUrl, setNewIconUrl] = useState("");

  // State cho modal edit rule
  const [editRuleType, setEditRuleType] = useState("");
  const [editTargetEntity, setEditTargetEntity] = useState("");
  const [editTargetValue, setEditTargetValue] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);

  const openEditRuleModal = (rule: AdminBadgeRule) => {
    setSelectedRule(rule);
    setEditRuleType(rule.ruleType);
    setEditTargetEntity(rule.targetEntity);
    setEditTargetValue(rule.targetValue);
    setEditIsActive(rule.isActive);
    setIsEditRuleModalOpen(true);
  };

  const handleCreateBadge = async () => {
    try {
      await createBadge({
        name: newBadgeName,
        code: newBadgeCode,
      }).unwrap();
      addToast({ title: "Tạo badge thành công!", color: "success" });
      setIsCreateBadgeOpen(false);
      // Reset form
      setNewBadgeName("");
      setNewBadgeCode("");
    } catch (error) {
      addToast({ title: "Lỗi khi tạo badge", color: "danger" });
    }
  };

  const handleDeleteBadge = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa badge này?")) return;
    try {
      await deleteBadge(id).unwrap();
      addToast({ title: "Đã xóa badge", color: "success" });
    } catch (error) {
      addToast({ title: "Lỗi khi xóa badge", color: "danger" });
    }
  };

  const saveRuleChanges = async () => {
    if (!selectedRule) return;

    try {
      await updateBadgeRule({
        id: selectedRule.id,
        ruleType: editRuleType,
        targetEntity: editTargetEntity,
        targetValue: editTargetValue,
        isActive: editIsActive,
      }).unwrap();

      addToast({ title: `Đã cập nhật tiêu chí cho badge "${selectedRule.badgeName}"`, color: "success" });
      setIsEditRuleModalOpen(false);
      setSelectedRule(null);
    } catch (error) {
      addToast({ title: "Lỗi khi cập nhật tiêu chí", color: "danger" });
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tiêu chí này?")) return;
    try {
      await deleteBadgeRule(id).unwrap();
      addToast({ title: "Đã xóa tiêu chí", color: "success" });
    } catch (error) {
      addToast({ title: "Lỗi khi xóa tiêu chí", color: "danger" });
    }
  };


  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase">
            Gamification <span className="text-[#FF5C00]">Management</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Configure badges, rules, events, streaks & rewards
          </p>
        </div>
        <Button
          className="bg-[#0B1C3D] text-white font-black"
          startContent={<Plus size={16} />}
          onPress={() => setIsCreateBadgeOpen(true)}
        >
          Create New Badge
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-linear-to-br from-blue-600/10 to-[#22C55E]/10 dark:from-blue-900/30 dark:to-green-900/30">
          <CardBody className="text-center">
            <div className="text-4xl font-black text-blue-600 dark:text-[#22C55E]">12,847</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">Total Users</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-[#FF5C00]">4.2M</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center justify-center gap-2">
              <Zap size={14} /> Total EXP
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-yellow-500">847K</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center justify-center gap-2">
              <Coins size={14} /> Total Coins
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-4xl font-black text-orange-500">1,942</div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center justify-center gap-2">
              <Award size={14} /> Badges Awarded
            </div>
          </CardBody>
        </Card>
      </div>

      {/* NEW: CHARTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10 shadow-sm p-6 rounded-2xl">
          <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-fuchsia-500">
            Overall Achievements (By Level)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_ACHIEVEMENTS_CHART}>
              <XAxis dataKey="level" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="awarded" fill="#d946ef" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-white border border-slate-200 dark:bg-black/40 dark:border-white/10 shadow-sm p-6 rounded-2xl">
          <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-[#22C55E]">
            Learning Streak Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MOCK_STREAK_CHART}>
              <defs>
                <linearGradient id="colorStreak" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#22C55E" fillOpacity={1} fill="url(#colorStreak)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* TABS */}
      <Tabs color="primary" variant="underlined" classNames={{ tabList: "gap-6" }}>
        <Tab title="Badges & Rules">
          <div className="space-y-8">
            {/* BADGES TABLE */}
            <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden">
              <Table aria-label="Badges" removeWrapper>
                <TableHeader>
                  <TableColumn>ICON</TableColumn>
                  <TableColumn>NAME / CODE</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>LEVEL</TableColumn>
                  <TableColumn>REPEAT</TableColumn>
                  <TableColumn>AWARDED</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={isLoadingBadges ? "Đang tải..." : "Không có badge nào"}
                  loadingContent={<div className="p-4">Đang tải dữ liệu...</div>}
                  isLoading={isLoadingBadges}
                >
                  {badges.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        {b.iconUrl ? (
                          <Image
                            src={b.iconUrl}
                            alt={b.name}
                            width={32}
                            height={32}
                            className="rounded-lg"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Trophy size={16} className="text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-sm">{b.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black">{b.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" className="font-black italic uppercase text-[9px]">
                          {b.category}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="font-black italic text-xs">Lv {b.level}</span>
                      </TableCell>
                      <TableCell>
                        <Chip color={b.isRepeatable ? "success" : "default"}>
                          {b.isRepeatable ? "Yes" : "No"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-black italic">{b.awardedCount}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm">
                            <Pencil size={16} />
                          </Button>
                          <Button isIconOnly size="sm" color="danger" onPress={() => handleDeleteBadge(b.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* BADGE RULES */}
            <div className="rounded-2xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase">Badge Award Rules</h2>
                <Button startContent={<Plus size={16} />} size="sm">
                  Add Rule
                </Button>
              </div>
              <Table aria-label="Badge Rules">
                <TableHeader>
                  <TableColumn>Badge</TableColumn>
                  <TableColumn>Rule Type</TableColumn>
                  <TableColumn>Entity</TableColumn>
                  <TableColumn>Value</TableColumn>
                  <TableColumn>Active</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={isLoadingRules ? "Đang tải..." : "Không có quy tắc nào"}
                  isLoading={isLoadingRules}
                >
                  {rules.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.badgeName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase">{r.ruleType}</span>
                          <span className="text-[10px] text-slate-400">{r.targetEntity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-black italic text-orange-500">
                        {r.targetValue}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="dot"
                          color={r.isActive ? "success" : "default"}
                          className="font-black italic uppercase text-[9px]"
                        >
                          {r.isActive ? "Active" : "Inactive"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onPress={() => openEditRuleModal(r)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button isIconOnly size="sm" color="danger" onPress={() => handleDeleteRule(r.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Tab>

        {/* Các tab khác giữ nguyên */}
        <Tab title="Events & Transactions">
          {/* ... code cũ */}
        </Tab>

        <Tab title="Streaks">
          {/* ... code cũ */}
        </Tab>

        <Tab title="Settings">
          {/* ... code cũ */}
        </Tab>
      </Tabs>

      {/* MODAL CREATE BADGE */}
      <Modal isOpen={isCreateBadgeOpen} onOpenChange={setIsCreateBadgeOpen} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl font-black uppercase">
                Create New <span className="text-[#FF5C00]">Badge</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <Input
                  label="Badge Name"
                  placeholder="e.g. Solve 100"
                  value={newBadgeName}
                  onValueChange={setNewBadgeName}
                />
                <Input
                  label="Badge Code"
                  placeholder="e.g. SOLVE_100"
                  value={newBadgeCode}
                  onValueChange={setNewBadgeCode}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleCreateBadge}>Create Badge</Button>
              </ModalFooter>

            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL UPDATE BADGE CRITERIA (EDIT RULE) */}
      <Modal isOpen={isEditRuleModalOpen} onOpenChange={setIsEditRuleModalOpen} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-black uppercase">
                Update Criteria for <span className="text-[#FF5C00]">{selectedRule?.badgeName}</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <Select
                  label="Rule Type"
                  value={editRuleType}
                  onChange={(e) => setEditRuleType(e.target.value)}
                >
                  <SelectItem key="rank">Rank (Xếp hạng)</SelectItem>
                  <SelectItem key="streak_days">Streak Days (Chuỗi ngày)</SelectItem>
                  <SelectItem key="solved">Solved Count (Số problem giải)</SelectItem>
                  <SelectItem key="complete_contest">Complete Contest (Tham gia Contest)</SelectItem>
                </Select>

                <Select
                  label="Target Entity"
                  value={editTargetEntity}
                  onChange={(e) => setEditTargetEntity(e.target.value)}
                >
                  <SelectItem key="contest">Contest</SelectItem>
                  <SelectItem key="course">Course</SelectItem>
                  <SelectItem key="org">Organization</SelectItem>
                  <SelectItem key="streak">Streak</SelectItem>
                  <SelectItem key="problem">Problem</SelectItem>
                </Select>

                <Input
                  label="Target Value"
                  type="number"
                  value={editTargetValue.toString()}
                  onValueChange={(v) => setEditTargetValue(Number(v))}
                  min={1}
                />

                <div className="flex items-center justify-between">
                  <span className="font-medium">Active</span>
                  <Switch
                    isSelected={editIsActive}
                    onValueChange={setEditIsActive}
                    classNames={{ wrapper: "group-data-[selected=true]:bg-green-600" }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button
                  className="bg-indigo-600 text-white font-black"
                  onPress={saveRuleChanges}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div >
  );
}