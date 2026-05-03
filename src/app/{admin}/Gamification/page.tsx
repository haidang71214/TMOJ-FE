"use client";

import {
  Avatar,
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
  useUpdateBadgeMutation,
  useDeleteBadgeMutation,
  useGetAdminBadgeRulesQuery,
  useCreateBadgeRuleMutation,
  useUpdateBadgeRuleMutation,
  useDeleteBadgeRuleMutation
} from "@/store/queries/gamification";
import { AdminBadge, AdminBadgeRule } from "@/types/gamification";
import { addToast } from "@heroui/toast";
import { useGamification } from "@/Provider/GamificationProvider";

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
  { badgeId: "1", name: "First Blood", badgeCode: "first_blood", badgeCategory: "contest", badgeLevel: 1, isRepeatable: false, description: "Giải quyết problem đầu tiên trong contest", iconUrl: "" },
  { badgeId: "2", name: "7-Day Streak", badgeCode: "streak_7", badgeCategory: "streak", badgeLevel: 1, isRepeatable: true, description: "Hoạt động liên tục 7 ngày", iconUrl: "" },
  { badgeId: "3", name: "Master Solver", badgeCode: "master_100", badgeCategory: "problem", badgeLevel: 3, isRepeatable: false, description: "Giải ≥100 problems", iconUrl: "" },
  { badgeId: "4", name: "Course Finisher", badgeCode: "course_done", badgeCategory: "course", badgeLevel: 2, isRepeatable: true, description: "Hoàn thành 1 khóa học bất kỳ", iconUrl: "" },
  { badgeId: "5", name: "Top 10 Global", badgeCode: "top_10", badgeCategory: "contest", badgeLevel: 5, isRepeatable: false, description: "Lọt vào top 10 trong 1 contest chính thức", iconUrl: "" },
  { badgeId: "6", name: "Code Reviewer", badgeCode: "reviewer", badgeCategory: "problem", badgeLevel: 2, isRepeatable: true, description: "Đóng góp 10 lời giải mẫu hữu ích", iconUrl: "" },
];

const MOCK_RULES: AdminBadgeRule[] = [
  { id: "r1", badgeId: "1", badgeName: "First Blood", ruleType: "solved", targetEntity: "contest", targetValue: 1, isActive: true },
  { id: "r2", badgeId: "2", badgeName: "7-Day Streak", ruleType: "streak_days", targetEntity: "streak", targetValue: 7, isActive: true },
  { id: "r3", badgeId: "3", badgeName: "Master Solver", ruleType: "solved", targetEntity: "problem", targetValue: 100, isActive: true },
];


export default function GamificationManagementPage() {
  const { showCelebration } = useGamification();
  const { data: badgesData, isLoading: isLoadingBadges } = useGetAdminBadgesQuery();
  const { data: rulesData, isLoading: isLoadingRules } = useGetAdminBadgeRulesQuery();

  const [createBadge] = useCreateBadgeMutation();
  const [updateBadge] = useUpdateBadgeMutation();
  const [deleteBadge] = useDeleteBadgeMutation();
  const [createBadgeRule] = useCreateBadgeRuleMutation();
  const [updateBadgeRule] = useUpdateBadgeRuleMutation();
  const [deleteBadgeRule] = useDeleteBadgeRuleMutation();

  const badges = badgesData || [];
  const rules = rulesData || [];

  const [isCreateBadgeOpen, setIsCreateBadgeOpen] = useState(false);
  const [isCreateRuleModalOpen, setIsCreateRuleModalOpen] = useState(false);
  const [isEditRuleModalOpen, setIsEditRuleModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AdminBadgeRule | null>(null);

  // State cho form create badge
  const [newBadgeName, setNewBadgeName] = useState("");
  const [newBadgeCode, setNewBadgeCode] = useState("");
  const [newBadgeDescription, setNewBadgeDescription] = useState("");
  const [newBadgeIconUrl, setNewBadgeIconUrl] = useState("");
  const [newBadgeCategory, setNewBadgeCategory] = useState("problem");
  const [newBadgeLevel, setNewBadgeLevel] = useState(1);
  const [newBadgeIsRepeatable, setNewBadgeIsRepeatable] = useState(false);
  const [newBadgeIconFile, setNewBadgeIconFile] = useState<File | null>(null);

  // State cho form create rule
  const [newRuleBadgeId, setNewRuleBadgeId] = useState("");
  const [newRuleType, setNewRuleType] = useState("solved_count");
  const [newRuleTargetEntity, setNewRuleTargetEntity] = useState("problem");
  const [newRuleTargetValue, setNewRuleTargetValue] = useState(1);
  const [newRuleScopeId, setNewRuleScopeId] = useState<string | null>(null);

  // State cho modal edit rule
  const [editRuleType, setEditRuleType] = useState("");
  const [editTargetEntity, setEditTargetEntity] = useState("");
  const [editTargetValue, setEditTargetValue] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);
  const [isEditBadgeOpen, setIsEditBadgeOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<AdminBadge | null>(null);

  const [editBadgeName, setEditBadgeName] = useState("");
  const [editBadgeCode, setEditBadgeCode] = useState("");
  const [editBadgeDescription, setEditBadgeDescription] = useState("");
  const [editBadgeIconUrl, setEditBadgeIconUrl] = useState("");
  const [editBadgeCategory, setEditBadgeCategory] = useState("problem");
  const [editBadgeLevel, setEditBadgeLevel] = useState(1);
  const [editBadgeIsRepeatable, setEditBadgeIsRepeatable] = useState(true);
  const [editBadgeIconFile, setEditBadgeIconFile] = useState<File | null>(null);

  const openEditBadgeModal = (badge: AdminBadge) => {
    setSelectedBadge(badge);
    setEditBadgeName(badge.name);
    setEditBadgeCode(badge.badgeCode);
    setEditBadgeDescription(badge.description);
    setEditBadgeIconUrl(badge.iconUrl);
    setEditBadgeCategory(badge.badgeCategory);
    setEditBadgeLevel(badge.badgeLevel);
    setEditBadgeIsRepeatable(badge.isRepeatable);
    setEditBadgeIconFile(null); // Reset file on open
    setIsEditBadgeOpen(true);
  };

  const openEditRuleModal = (rule: AdminBadgeRule) => {
    setSelectedRule(rule);
    setEditRuleType(rule.ruleType);
    setEditTargetEntity(rule.targetEntity);
    setEditTargetValue(rule.targetValue);
    setEditIsActive(rule.isActive);
    setIsEditRuleModalOpen(true);
  };

  const handleCreateBadge = async () => {
    const formData = new FormData();
    formData.append("Name", newBadgeName);
    formData.append("BadgeCode", newBadgeCode);
    formData.append("Description", newBadgeDescription);
    formData.append("BadgeCategory", newBadgeCategory);
    formData.append("BadgeLevel", newBadgeLevel.toString());
    formData.append("IsRepeatable", newBadgeIsRepeatable.toString());
    if (newBadgeIconUrl) formData.append("IconUrl", newBadgeIconUrl);
    if (newBadgeIconFile) formData.append("IconFile", newBadgeIconFile);

    try {
      await createBadge(formData).unwrap();
      addToast({ title: "Tạo badge thành công!", color: "success" });
      setIsCreateBadgeOpen(false);
      // Reset form
      setNewBadgeName("");
      setNewBadgeCode("");
      setNewBadgeDescription("");
      setNewBadgeIconUrl("");
      setNewBadgeCategory("problem");
      setNewBadgeLevel(1);
      setNewBadgeIsRepeatable(false);
      setNewBadgeIconFile(null);
    } catch (error) {
      addToast({ title: "Lỗi khi tạo badge", color: "danger" });
    }
  };

  const handleUpdateBadge = async () => {
    if (!selectedBadge) return;
    const formData = new FormData();
    formData.append("Name", editBadgeName);
    formData.append("Description", editBadgeDescription);
    formData.append("BadgeCategory", editBadgeCategory);
    formData.append("BadgeLevel", editBadgeLevel.toString());
    if (editBadgeIconUrl) formData.append("IconUrl", editBadgeIconUrl);
    if (editBadgeIconFile) formData.append("IconFile", editBadgeIconFile);

    try {
      await updateBadge({
        id: selectedBadge.badgeId,
        formData
      }).unwrap();
      addToast({ title: "Cập nhật badge thành công!", color: "success" });
      setIsEditBadgeOpen(false);
    } catch (error) {
      addToast({ title: "Lỗi khi cập nhật badge", color: "danger" });
    }
  };

  const handleCreateRule = async () => {
    try {
      await createBadgeRule({
        badgeId: newRuleBadgeId,
        ruleType: newRuleType,
        targetEntity: newRuleTargetEntity,
        targetValue: newRuleTargetValue,
        scopeId: newRuleScopeId,
      }).unwrap();
      addToast({ title: "Tạo tiêu chí thành công!", color: "success" });
      setIsCreateRuleModalOpen(false);
    } catch (error) {
      addToast({ title: "Lỗi khi tạo tiêu chí", color: "danger" });
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
        badgeId: selectedRule.badgeId,
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
          <p className="text-xs uppercase tracking-widest text-white/40">
            Configure badges, rules, events, streaks & rewards
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="flat"
            className="bg-white/5 text-white/60 border border-white/10"
            onPress={() => showCelebration({ badgeId: "test", name: "Test Badge", awardedAt: new Date().toISOString() })}
          >
            Test Celebration
          </Button>
          <Button
            className="bg-[#0B1C3D] text-white font-black"
            startContent={<Plus size={16} />}
            onPress={() => setIsCreateBadgeOpen(true)}
          >
            Create New Badge
          </Button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-linear-to-br from-orange-500/10 to-yellow-500/10 border-none shadow-none">
          <CardBody className="text-center py-8">
            <div className="text-5xl font-black text-orange-500">{isLoadingBadges ? "..." : badges.length}</div>
            <div className="text-xs uppercase tracking-widest text-orange-500/60 mt-2 flex items-center justify-center gap-2 font-bold">
              <Award size={16} /> Total Badges Created
            </div>
          </CardBody>
        </Card>
      </div>


      {/* TABS */}
      <Tabs color="primary" variant="underlined" classNames={{ tabList: "gap-6" }}>
        <Tab title="Badges">
          <div className="pt-4">
            {/* BADGES TABLE */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm overflow-hidden">
              <Table
                aria-label="Badges"
                removeWrapper
                classNames={{
                  th: "bg-white/[0.05] text-slate-300 text-[11px] font-black uppercase tracking-wider border-b border-white/[0.08]",
                  td: "text-white/75 border-b border-white/[0.05] py-3",
                  tr: "hover:bg-white/[0.03] transition-colors",
                }}
              >
                <TableHeader>
                  <TableColumn>ICON</TableColumn>
                  <TableColumn>NAME / CODE</TableColumn>
                  <TableColumn>CATEGORY</TableColumn>
                  <TableColumn>REPEAT</TableColumn>
                  <TableColumn>CREATED AT</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                  items={badges}
                  emptyContent={isLoadingBadges ? "Đang tải..." : "Không có badge nào"}
                  loadingContent={<div className="p-4">Đang tải dữ liệu...</div>}
                  isLoading={isLoadingBadges}
                >
                  {(b) => (
                    <TableRow key={b.badgeId}>
                      <TableCell>
                        <Avatar src={b.iconUrl} radius="md" />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-sm">{b.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black">{b.badgeCode}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            b.badgeCategory === "contest" ? "warning" :
                              b.badgeCategory === "course" ? "primary" :
                                b.badgeCategory === "streak" ? "danger" :
                                  b.badgeCategory === "problem" ? "success" : "secondary"
                          }
                          className="font-bold uppercase text-[10px] border-white/5 bg-white/5"
                        >
                          {b.badgeCategory}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border w-fit ${b.isRepeatable ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-white/10 bg-white/5 text-white/40"}`}>
                          <div className={`w-1 h-1 rounded-full ${b.isRepeatable ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {b.isRepeatable ? "Repeatable" : "Once"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[10px] font-bold text-slate-400">
                          {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="w-8 h-8 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            onPress={() => openEditBadgeModal(b)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="w-8 h-8 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            onPress={() => handleDeleteBadge(b.badgeId)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Tab>

        <Tab title="Rules">
          <div className="pt-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase text-white">Badge Award Rules</h2>
                <Button
                  startContent={<Plus size={16} />}
                  size="sm"
                  variant="flat"
                  className="bg-white/[0.05] hover:bg-white/[0.1] text-white"
                  onPress={() => setIsCreateRuleModalOpen(true)}
                >
                  Add Rule
                </Button>
              </div>
              <Table
                aria-label="Badge Rules"
                removeWrapper
                classNames={{
                  th: "bg-white/[0.05] text-slate-300 text-[11px] font-black uppercase tracking-wider border-b border-white/[0.08]",
                  td: "text-white/75 border-b border-white/[0.05] py-3",
                  tr: "hover:bg-white/[0.03] transition-colors",
                }}
              >
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
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={badges.find((b) => b.badgeId === r.badgeId)?.iconUrl}
                            radius="md"
                            size="sm"
                          />
                          <span className="font-bold text-sm">
                            {badges.find((b) => b.badgeId === r.badgeId)?.name || r.badgeName || "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 w-fit">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                            {r.ruleType.replace("_", " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            r.targetEntity === "contest" ? "warning" :
                              r.targetEntity === "course" ? "primary" :
                                r.targetEntity === "streak" ? "danger" :
                                  r.targetEntity === "problem" ? "success" : "secondary"
                          }
                          className="font-bold uppercase text-[10px] border-white/5 bg-white/5"
                        >
                          {r.targetEntity}
                        </Chip>
                      </TableCell>
                      <TableCell className="font-black italic text-orange-500 text-sm">
                        {r.targetValue}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border w-fit ${r.isActive ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-white/10 bg-white/5 text-white/40"}`}>
                          <div className={`w-1 h-1 rounded-full ${r.isActive ? "bg-emerald-400 animate-pulse" : "bg-white/20"}`} />
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {r.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="w-8 h-8 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            onPress={() => openEditRuleModal(r)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="w-8 h-8 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            onPress={() => handleDeleteRule(r.id)}
                          >
                            <Trash2 size={14} />
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
                <Input
                  label="Icon URL"
                  placeholder="https://..."
                  value={newBadgeIconUrl}
                  onValueChange={setNewBadgeIconUrl}
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Icon File (Direct Upload)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewBadgeIconFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-500/10 file:text-indigo-400
                      hover:file:bg-indigo-500/20"
                  />
                  {newBadgeIconFile && (
                    <p className="text-xs text-indigo-400">Selected: {newBadgeIconFile.name}</p>
                  )}
                </div>
                <Textarea
                  label="Description"
                  placeholder="Describe the badge"
                  value={newBadgeDescription}
                  onValueChange={setNewBadgeDescription}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    selectedKeys={[newBadgeCategory]}
                    onSelectionChange={(keys) => setNewBadgeCategory(Array.from(keys)[0] as string)}
                  >
                    <SelectItem key="contest">Contest</SelectItem>
                    <SelectItem key="course">Course</SelectItem>
                    <SelectItem key="organization">Organization</SelectItem>
                    <SelectItem key="streak">Streak</SelectItem>
                    <SelectItem key="problem">Problem</SelectItem>
                  </Select>
                  <Input
                    label="Level"
                    type="number"
                    value={newBadgeLevel.toString()}
                    onValueChange={(v) => setNewBadgeLevel(Number(v))}
                    min={1}
                  />
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-medium">Is Repeatable</span>
                  <Switch
                    isSelected={newBadgeIsRepeatable}
                    onValueChange={setNewBadgeIsRepeatable}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleCreateBadge}>Create Badge</Button>
              </ModalFooter>

            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL EDIT BADGE */}
      <Modal isOpen={isEditBadgeOpen} onOpenChange={setIsEditBadgeOpen} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-2xl font-black uppercase">
                Edit <span className="text-[#FF5C00]">Badge</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <Input
                  label="Badge Name"
                  placeholder="e.g. Solve 100"
                  value={editBadgeName}
                  onValueChange={setEditBadgeName}
                />
                <Input
                  label="Badge Code"
                  placeholder="e.g. SOLVE_100"
                  value={editBadgeCode}
                  onValueChange={setEditBadgeCode}
                />
                <Input
                  label="Icon URL"
                  placeholder="https://..."
                  value={editBadgeIconUrl}
                  onValueChange={setEditBadgeIconUrl}
                />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Icon File (Direct Upload)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditBadgeIconFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-500/10 file:text-indigo-400
                      hover:file:bg-indigo-500/20"
                  />
                  {editBadgeIconFile && (
                    <p className="text-xs text-indigo-400">Selected: {editBadgeIconFile.name}</p>
                  )}
                </div>
                <Textarea
                  label="Description"
                  placeholder="Describe the badge"
                  value={editBadgeDescription}
                  onValueChange={setEditBadgeDescription}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    selectedKeys={[editBadgeCategory]}
                    onSelectionChange={(keys) => setEditBadgeCategory(Array.from(keys)[0] as string)}
                  >
                    <SelectItem key="contest">Contest</SelectItem>
                    <SelectItem key="course">Course</SelectItem>
                    <SelectItem key="organization">Organization</SelectItem>
                    <SelectItem key="streak">Streak</SelectItem>
                    <SelectItem key="problem">Problem</SelectItem>
                  </Select>
                  <Input
                    label="Level"
                    type="number"
                    value={editBadgeLevel.toString()}
                    onValueChange={(v) => setEditBadgeLevel(Number(v))}
                    min={1}
                  />
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-medium">Is Repeatable</span>
                  <Switch
                    isSelected={editBadgeIsRepeatable}
                    onValueChange={setEditBadgeIsRepeatable}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleUpdateBadge}>Update Badge</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL CREATE RULE */}
      <Modal isOpen={isCreateRuleModalOpen} onOpenChange={setIsCreateRuleModalOpen} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-xl font-black uppercase">
                Create New <span className="text-[#FF5C00]">Badge Rule</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <Select
                  label="Select Badge"
                  placeholder="Pick a badge"
                  selectedKeys={newRuleBadgeId ? [newRuleBadgeId] : []}
                  onSelectionChange={(keys) => setNewRuleBadgeId(Array.from(keys)[0] as string)}
                >
                  {badges.map((b) => (
                    <SelectItem key={b.badgeId} textValue={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Rule Type"
                  selectedKeys={[newRuleType]}
                  onSelectionChange={(keys) => setNewRuleType(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="solved_count" textValue="Solved Count">Solved Count (Số problem giải)</SelectItem>
                  <SelectItem key="streak_days" textValue="Streak Days">Streak Days (Chuỗi ngày)</SelectItem>
                  <SelectItem key="rank" textValue="Rank">Rank (Xếp hạng)</SelectItem>
                  <SelectItem key="complete_contest" textValue="Complete Contest">Complete Contest (Tham gia Contest)</SelectItem>
                </Select>

                <Select
                  label="Target Entity"
                  selectedKeys={[newRuleTargetEntity]}
                  onSelectionChange={(keys) => setNewRuleTargetEntity(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="contest">Contest</SelectItem>
                  <SelectItem key="course">Course</SelectItem>
                  <SelectItem key="organization">Organization</SelectItem>
                  <SelectItem key="streak">Streak</SelectItem>
                  <SelectItem key="problem">Problem</SelectItem>
                </Select>

                <Input
                  label="Target Value"
                  type="number"
                  placeholder="e.g. 100"
                  value={newRuleTargetValue.toString()}
                  onValueChange={(v) => setNewRuleTargetValue(Number(v))}
                  min={1}
                />

                <Input
                  label="Scope ID (Optional)"
                  placeholder="e.g. Contest ID or Course ID"
                  value={newRuleScopeId || ""}
                  onValueChange={(v) => setNewRuleScopeId(v || null)}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={handleCreateRule}>Create Rule</Button>
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
                Update Criteria for <span className="text-[#FF5C00]">{badges.find(b => b.badgeId === selectedRule?.badgeId)?.name || selectedRule?.badgeName}</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <Select
                  label="Rule Type"
                  selectedKeys={editRuleType ? [editRuleType] : []}
                  onSelectionChange={(keys) => setEditRuleType(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="rank">Rank (Xếp hạng)</SelectItem>
                  <SelectItem key="streak_days">Streak Days (Chuỗi ngày)</SelectItem>
                  <SelectItem key="solved_count">Solved Count (Số problem giải)</SelectItem>
                  <SelectItem key="complete_contest">Complete Contest (Tham gia Contest)</SelectItem>
                </Select>

                <Select
                  label="Target Entity"
                  selectedKeys={editTargetEntity ? [editTargetEntity] : []}
                  onSelectionChange={(keys) => setEditTargetEntity(Array.from(keys)[0] as string)}
                >
                  <SelectItem key="contest">Contest</SelectItem>
                  <SelectItem key="course">Course</SelectItem>
                  <SelectItem key="organization">Organization</SelectItem>
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