import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};
// đã nhét user vào đây
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: Users;
}
export interface Logout {
  message:string
}
export enum RoleEnums {
  CLIENT = 0,
  ADMIN = 1,
}

export interface Users {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  roles: string[];
}

export interface RegisterRequestDto {
    firstName: string ,
  lastName: string,
  email: string,
  password: string
}

export interface RegisterResponseDto {
    firstName: string ,
  lastName: string,
  email: string,
  password: string
}
export interface sendEmailForgotPassword{
  email:string,
}
export interface resetPasswordInformation{
  email: string,
  token: string,
  newPassword: string
}
export interface UserDto {
  id: string;
  name?: string | null;
  email?: string | null;
  imagesUrl?: string | null;
  age: number;
  role?: string | null;
}
export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  statusCode: "draft" | "published";
  isActive: boolean;
  content?:string;
  acceptancePercent: number | null;
  timeLimitMs: number;
  memoryLimitKb: number;
  createdAt: string;
  publishedAt: string | null;
}
export interface ProblemListResponse {
  data: Problem[];
  message: string | null;
  traceId: string;
}
export interface CreateProblemDraftRequest {
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  typeCode: "algorithm" | "frontend" | "sql" /* thêm nếu có */;
  visibilityCode: "public" | "private";
  scoringCode: "acm" | "partial" | "oi" /* tùy hệ thống */;
  descriptionMd: string;
  displayIndex?: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  createdBy: string; // UUID của user
}
export interface ProblemDraft {
  id: string;                    // UUID dạng string
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";  // hoặc string nếu API linh hoạt hơn
  statusCode: "draft" | "published";       // dựa trên response & code trước
  isActive: boolean;
  acceptancePercent: number | null;
  timeLimitMs: number;
  memoryLimitKb: number;
  createdAt: string;             // ISO datetime string
  publishedAt: string | null;    // ISO hoặc null
}
export interface CreateProblemDraftResponse {
  data: ProblemDraft;
  message: string | null;
  traceId: string;
}
export interface CreateUserDto {
  name?: string | null;
  password?: string | null;
  imagesUrl?: string | null;
  age: number;
}
export interface ProblemTestsetResponse {
  id: string;
  problemId: string;
  type: string;
  isActive: boolean;
  note?: string;
  storageBlobId?: string;
  expireAt?: string;
  createdAt: string;
}
export interface ProblemTestCaseUploadResult {
  problemId: string;
  slug: string;
  testsetId: string;
  savedTo: string;
  total: number;
}
export interface ProblemTestCaseUploadResponse {
  data: ProblemTestCaseUploadResult;
  message?: string | null;
  traceId: string;
}
export interface ProblemTestsetCreate {
  type: string;
  note?: string;
  createdBy?: string;
  expireAt?: string;
}
export interface UpdateUserDto {
  name?: string | null;
  password?: string | null;
  email?: string | null;
  imagesUrl?: string | null;
  age?: number | null;
}

export enum ProblemTag {
  DP = "dp",
  GREEDY = "greedy",
  GRAPH = "graph",
  TREE = "tree",
  STRING = "string",
  MATH = "math",
  SORTING = "sorting",
  BINARY_SEARCH = "binary_search",
  TWO_POINTERS = "two_pointers",
}
export const PROBLEM_TAG_LABEL: Record<ProblemTag, string> = {
  [ProblemTag.DP]: "Dynamic Programming",
  [ProblemTag.GREEDY]: "Greedy",
  [ProblemTag.GRAPH]: "Graph",
  [ProblemTag.TREE]: "Tree",
  [ProblemTag.STRING]: "String",
  [ProblemTag.MATH]: "Math",
  [ProblemTag.SORTING]: "Sorting",
  [ProblemTag.BINARY_SEARCH]: "Binary Search",
  [ProblemTag.TWO_POINTERS]: "Two Pointers",
};

export interface Contest {
  id: number;
  title: string;
  status: string;
  endsIn?: string;
  startsIn?: string;
  participants: number;
  image: string;
}

export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  progress: number;
  total: number;
  solved?: number;
  dob?: string;
  address?: string;
}

export interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  dept: string;
  status: string;
  progress?: number;
  total?: number;
  solved?: number;
  dob?: string;
  address?: string;
}

export interface Subject {
  subjectId: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}


export type PracticePackage = {
  id: string;
  name: string;
  description?: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  published: boolean;
  disabled: boolean;
  price: number;
  image: string;
  createdAt: string;
  problems?: string[];
};
export interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard"; // lowercase như trong mock
  points: number;
  // thêm field khác nếu cần, ví dụ:
  // acceptance?: string;
  // tags?: string[];
}
export interface ErrorForm{
  data: Data;
}
export interface Data{
  data :MessageError;
}

export interface MessageError{
  message:string;
}
export interface SubmitResponse {
  submissionId: string
  statusCode: string
  verdictCode: string
  compile: SubmitCompile
  summary: SubmitSummary
  failed: SubmitFailedCase[]
}
export interface SubmitCreateForm {
  code: string,
  name: string,
  description: string
}

export interface SubmitCompile {
  ok: boolean
  exitCode: number
  stdout: string
  stderr: string
}

export interface SubmitSummary {
  passed: number
  total: number
  timeMs: number
}

export interface SubmitFailedCase {
  ordinal: number
  verdict: string
  message: string
}
export interface Runtime {
  id: string
  runtimeName: string
  runtimeVersion: string
  imageRef: string | null
  defaultTimeLimitMs: number
  defaultMemoryLimitKb: number
  isActive: boolean
}export interface RuntimeResponse {
  data: Runtime[]
  message: string | null
  traceId: string
}
export interface SubmissionData {
  id: string;
  status:
    | "Accepted"
    | "Compile Error"
    | "Time Limit Exceeded"
    | "Memory Limit Exceeded"
    | "Runtime Error"
    | "Compile Error";
  language: string;
  runtime: string;
  memory: string;
  notes: string;
  timestamp: string;
}
export enum VerdictCode {
  AC = "ac",
  WA = "wa",
  RTE = "rte",
  IR = "ir",
  OLE = "ole",
  MLE = "mle",
  TLE = "tle",
  IE = "ie",
  CE = "ce"
}
// Interface đơn giản, gọn, dùng string từ enum
export interface SubmissionResponse {
  data: {
    submissionId: string;
    statusCode: string;           // "done", "pending", ...
    verdictCode: VerdictCode;     // dùng enum ở đây
    compile: {
      ok: boolean;
      exitCode: number;
      stdout: string;
      stderr: string;
    };
    summary: {
      passed: number;
      total: number;
      timeMs: number;
    };
    failed: Array<{
      ordinal: number;
      message: string;
      verdict?: VerdictCode;      // optional
    }>;
  };
  message: string | null;
  traceId: string;
}
export interface Semester {
  semesterId: string;
  code: string;
  name: string;
}
export interface SubjectCreateForm {
  code: string;
  name: string;
  description: string
}
export interface SubjectResponseForm {
 subjectId: string,
code: string,
name: string,
description: string,
isActive: boolean,
}
export interface Teacher {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
}
export interface ClassItem {
  classId: string;

  classCode: string;
  className: string;

  description: string;

  startDate: string;
  endDate: string;

  isActive: boolean;

  inviteCode: string;
  inviteCodeExpiresAt: string | null;

  createdAt: string;
  updatedAt: string;

  subject: Subject;

  semester: Semester;

  teacher: Teacher;

  memberCount: number;
}
export interface ClassListData {
  items: ClassItem[];
  totalCount: number;
}
export interface ClassResponse {
  data: ClassListData;
  message: string;
  traceId: string | null;
}
export interface CreateClassRequest {
  subjectId: string;
  semesterId: string;
  classCode?: string | null;
  className?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  teacherId?: string | null;
}
export interface UpdateClassTeacherPayload {
  teacherId: string;
}

export interface SemesterItem {
  semesterId: string;
  code: string;
  name: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface SemesterResponse {
  data: {
    items: SemesterItem[];
    totalCount: number;
  };
  message: string;
  traceId: string | null;
}

export interface CreateSemesterRequest {
  code: string;
  name: string;
  startAt: string;
  endAt: string;
}

export interface UpdateSemesterRequest {
  code?: string;
  name?: string;
  startAt?: string;
  endAt?: string;
  isActive: boolean
}

// ── ClassSlot (Assignment) Requests ───────────────────────

export interface CreateClassSlotRequest {
  slotNo: number;
  title: string;
  description?: string;
  rules?: string;
  openAt?: string;
  dueAt?: string;
  closeAt?: string;
  mode: string; // "problemset" | "contest"
  problems?: SlotProblemItem[];
}

export interface SlotProblemItem {
  problemId: string;
  ordinal?: number;
  points?: number;
  isRequired: boolean;
}

export interface UpdateClassSlotRequest {
  title?: string;
  description?: string;
  rules?: string;
  openAt?: string;
  dueAt?: string;
  closeAt?: string;
  isPublished?: boolean;
}

export interface SetDueDateRequest {
  dueAt: string;
  closeAt?: string;
}
export interface ClassSlotResponse {
  id: string;
  classId: string;
  slotNo: number;
  title: string;
  description?: string;
  rules?: string;
  openAt?: string;
  dueAt?: string;
  closeAt?: string;
  mode: string;
  contestId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  problems: SlotProblemResponse[];
}export interface SlotProblemResponse {
  problemId: string;
  problemTitle?: string;
  problemSlug?: string;
  ordinal?: number;
  points?: number;
  isRequired: boolean;
}export interface StudentSlotScoreResponse {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
  problemScores: ProblemScoreEntry[];
  totalScore: number;
  solvedCount: number;
}export interface ProblemScoreEntry {
  problemId: string;
  problemTitle?: string;
  verdictCode?: string;
  score?: number;
  attempts: number;
  lastSubmittedAt?: string;
}export interface StudentSubmissionDetailResponse {
  submissionId: string;
  problemId: string;
  problemTitle?: string;
  verdictCode?: string;
  finalScore?: number;
  timeMs?: number;
  memoryKb?: number;
  statusCode?: string;
  createdAt: string;
  results: SubmissionResultEntry[];
}export interface SubmissionResultEntry {
  resultId: string;
  statusCode?: string;
  runtimeMs?: number;
  memoryKb?: number;
  checkerMessage?: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
}