"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Chip,
  Switch,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  Plus,
  Trophy,
  Flame,
  Coins,
  Pencil,
  Trash2,
  Award,
  Zap,
  Settings,
} from "lucide-react";

// Mock data dựa trên schema
interface Badge {
  id: string;
  name: string;
  badge_code: string;
  badge_category: "contest" | "course" | "org" | "streak" | "problem";
  badge_level: number;
  is_repeatable: boolean;
  description: string;
  icon_url?: string;
  awarded_count: number;
}

interface BadgeRule {
  id: string;
  badge_id: string;
  badge_name: string;
  rule_type: "rank" | "streak_days" | "solved_count";
  target_entity: "contest" | "course" | "org" | "streak" | "problem";
  target_value: number;
  is_active: boolean;
}

interface GamificationEvent {
  id: string;
  user_username: string;
  event_type: string;
  delta_exp: number;
  delta_coin: number;
  created_at: string;
}

const MOCK_BADGES: Badge[] = [
  { id: "1", name: "First Blood", badge_code: "first_blood", badge_category: "contest", badge_level: 1, is_repeatable: false, description: "Giải quyết problem đầu tiên trong contest", awarded_count: 342 },
  { id: "2", name: "7-Day Streak", badge_code: "streak_7", badge_category: "streak", badge_level: 1, is_repeatable: true, description: "Hoạt động liên tục 7 ngày", awarded_count: 128 },
  { id: "3", name: "Master Solver", badge_code: "master_100", badge_category: "problem", badge_level: 3, is_repeatable: false, description: "Giải ≥100 problems", awarded_count: 45 },
];

const MOCK_RULES: BadgeRule[] = [
  { id: "r1", badge_id: "1", badge_name: "First Blood", rule_type: "solved_count", target_entity: "contest", target_value: 1, is_active: true },
  { id: "r2", badge_id: "2", badge_name: "7-Day Streak", rule_type: "streak_days", target_entity: "streak", target_value: 7, is_active: true },
  { id: "r3", badge_id: "3", badge_name: "Master Solver", rule_type: "solved_count", target_entity: "problem", target_value: 100, is_active: true },
];

const MOCK_EVENTS: GamificationEvent[] = [
  { id: "e1", user_username: "hainguyen", event_type: "solve_problem", delta_exp: 50, delta_coin: 10, created_at: "2026-01-27 09:15" },
  { id: "e2", user_username: "student123", event_type: "daily_login", delta_exp: 20, delta_coin: 5, created_at: "2026-01-27 08:40" },
];

export default function GamificationManagementPage() {
  const [badges] = useState<Badge[]>(MOCK_BADGES);
  const [rules, setRules] = useState<BadgeRule[]>(MOCK_RULES);
  const [events] = useState<GamificationEvent[]>(MOCK_EVENTS);

  const [isCreateBadgeOpen, setIsCreateBadgeOpen] = useState(false);
  const [isEditRuleModalOpen, setIsEditRuleModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<BadgeRule | null>(null);

  // State cho modal edit rule
  const [editRuleType, setEditRuleType] = useState("");
  const [editTargetEntity, setEditTargetEntity] = useState("");
  const [editTargetValue, setEditTargetValue] = useState(0);
  const [editIsActive, setEditIsActive] = useState(true);

  const openEditRuleModal = (rule: BadgeRule) => {
    setSelectedRule(rule);
    setEditRuleType(rule.rule_type);
    setEditTargetEntity(rule.target_entity);
    setEditTargetValue(rule.target_value);
    setEditIsActive(rule.is_active);
    setIsEditRuleModalOpen(true);
  };

  const saveRuleChanges = () => {
    if (!selectedRule) return;

    setRules((prev) =>
      prev.map((r) =>
        r.id === selectedRule.id
          ? {
              ...r,
              rule_type: editRuleType,
              target_entity: editTargetEntity,
              target_value: editTargetValue,
              is_active: editIsActive,
            }
          : r
      )
    );

    alert(`Đã cập nhật tiêu chí cho badge "${selectedRule.badge_name}"`);
    setIsEditRuleModalOpen(false);
    setSelectedRule(null);
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
        <Card className="bg-gradient-to-br from-blue-600/10 to-[#22C55E]/10 dark:from-blue-900/30 dark:to-green-900/30">
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
                <TableBody>
                  {badges.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        {b.icon_url ? (
                          <img src={b.icon_url} alt="" className="w-10 h-10 rounded-lg" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                            <Trophy size={20} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-bold">{b.name}</div>
                        <div className="text-xs text-slate-500">{b.badge_code}</div>
                      </TableCell>
                      <TableCell>
                        <Chip variant="flat" color="primary">{b.badge_category}</Chip>
                      </TableCell>
                      <TableCell>Lv {b.badge_level}</TableCell>
                      <TableCell>
                        <Chip color={b.is_repeatable ? "success" : "default"}>
                          {b.is_repeatable ? "Yes" : "No"}
                        </Chip>
                      </TableCell>
                      <TableCell>{b.awarded_count.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button isIconOnly size="sm">
                            <Pencil size={16} />
                          </Button>
                          <Button isIconOnly size="sm" color="danger">
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
                <TableBody>
                  {rules.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.badge_name}</TableCell>
                      <TableCell>
                        <Chip variant="flat">{r.rule_type}</Chip>
                      </TableCell>
                      <TableCell>{r.target_entity}</TableCell>
                      <TableCell>{r.target_value}</TableCell>
                      <TableCell>
                        <Switch isSelected={r.is_active} size="sm" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            onPress={() => openEditRuleModal(r)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button isIconOnly size="sm" color="danger">
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
                <Input label="Badge Name" placeholder="e.g. First Blood" />
                <Input label="Badge Code" placeholder="first_blood" />
                <Select label="Category" defaultSelectedKeys={["contest"]}>
                  <SelectItem key="contest">Contest</SelectItem>
                  <SelectItem key="course">Course</SelectItem>
                  <SelectItem key="org">Organization</SelectItem>
                  <SelectItem key="streak">Streak</SelectItem>
                  <SelectItem key="problem">Problem</SelectItem>
                </Select>
                <Input label="Level" type="number" defaultValue="1" />
                <div className="flex items-center gap-4">
                  <span className="font-black uppercase text-sm">Repeatable?</span>
                  <Switch defaultSelected />
                </div>
                <Textarea label="Description" placeholder="Badge description..." />
                <Input label="Icon URL" placeholder="https://..." />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="primary" onPress={onClose}>Create Badge</Button>
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
                Update Criteria for <span className="text-[#FF5C00]">{selectedRule?.badge_name}</span>
              </ModalHeader>
              <ModalBody className="space-y-6">
                <Select
                  label="Rule Type"
                  value={editRuleType}
                  onChange={(e) => setEditRuleType(e.target.value)}
                >
                  <SelectItem key="rank">Rank (Xếp hạng)</SelectItem>
                  <SelectItem key="streak_days">Streak Days (Chuỗi ngày)</SelectItem>
                  <SelectItem key="solved_count">Solved Count (Số problem giải)</SelectItem>
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
    </div>
  );
}