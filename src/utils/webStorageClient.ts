import { getCookie, setCookie } from "cookies-next";
import Cookies from "js-cookie";
import _ from "lodash";
import { ACCESS_TOKEN, USER_INFO } from "@/constants";
import { Users } from "@/types";

const REFRESH_TOKEN = "refresh_token";

type CookieOption = Record<string, unknown>;
type RawValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[];

const webStorageClient = {
  // ===== Generic =====
  set(key: string, rawValue: RawValue, option?: CookieOption) {
    const value = _.isString(rawValue)
      ? rawValue
      : JSON.stringify(rawValue);

    setCookie(key, value, { path: "/", ...option });
  },

  get(key: string) {
    const value = (getCookie(key, { path: "/" }) as string) || "";
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },

  remove(key: string) {
    setCookie(key, "", { maxAge: 0, path: "/" });
  },

  removeAll() {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
  },

  // ===== User =====
  getUser: (): Users | null => {
    const u = localStorage.getItem(USER_INFO);
    return u ? JSON.parse(u) : null;
  },

  setUser: (user: Users) => {
    localStorage.setItem(USER_INFO, JSON.stringify(user));
  },

  removeUser: () => {
    localStorage.removeItem(USER_INFO);
  },

  // ===== Access Token =====
  setToken(value: string, option?: CookieOption) {
    setCookie(ACCESS_TOKEN, value, { path: "/", ...option });
  },

  getToken(): string | undefined {
    return getCookie(ACCESS_TOKEN) as string | undefined;
  },

  removeToken() {
    setCookie(ACCESS_TOKEN, "", { maxAge: 0, path: "/" });
  },

  // ===== Refresh Token =====
  setRefreshToken(value: string, option?: CookieOption) {
    setCookie(REFRESH_TOKEN, value, { path: "/", ...option });
  },

  getRefreshToken(): string | undefined {
    return getCookie(REFRESH_TOKEN) as string | undefined;
  },

  removeRefreshToken() {
    setCookie(REFRESH_TOKEN, "", { maxAge: 0, path: "/" });
  },

  // ===== Logout =====
  logout() {
    this.removeUser();
    this.removeToken();
    this.removeRefreshToken();
  },
};

export default webStorageClient;