import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};
// đã nhét user vào đây
export type LoginResponse = {
  token: string;
  user: Users;
};

export enum RoleEnums {
  CLIENT = 0,
  ADMIN = 1,
}

export interface Users {
  id: string;
  name?: string | null;
  password?: string | null;
  age: number;
  imagesUrl?: string | null;
  email: string;
  role: RoleEnums;
}

export interface RegisterRequestDto {
  name?: string | null;
  password?: string | null;
  age: number;
  imagesUrl?: string | null;
  email?: string | null;
}

export interface RegisterResponseDto {
  id: number;
  name?: string | null;
  password?: string | null;
  age: number;
  imagesUrl?: string | null;
  email?: string | null;
  role: RoleEnums;
}

export interface UserDto {
  id: string;
  name?: string | null;
  email?: string | null;
  imagesUrl?: string | null;
  age: number;
  role?: string | null;
}

export interface CreateUserDto {
  name?: string | null;
  password?: string | null;
  imagesUrl?: string | null;
  age: number;
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
