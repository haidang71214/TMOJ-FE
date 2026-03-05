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
  id: string;
  name: string;
  department: string;
  credits: number;
  totalProblems: number;
  visible: boolean;
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