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
  ADMIN = 1
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
export interface Contest {
  title: string;
  date: string;
  countdown: string;
  description: string;
  prizes: string[];
  eligibility: string;
  bannerImage?: string; // optional vì không phải contest nào cũng có
}