"use client";

import { useEffect, useState } from "react";
import webStorageClient from "@/utils/webStorageClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetUserInformationQuery, useGetUserManualMutation } from "@/store/queries/usersProfile";
import AdminPage from "@/app/{admin}/page";
import AdminLoginPage from "@/app/{admin}/AdminLoginPage";
import AdminTopbar from "@/app/{admin}/AdminTopbar";
import { Toaster } from "sonner";
import { ADMIN_PAGE_URL } from "@/constants";
import { Users } from "@/types";

type AdminAuthState = "loading" | "login" | "authenticated";

export default function RedirectProvider({ children }: { children: React.ReactNode }) {
    const params = useSearchParams();
    const router = useRouter();
    const [getUser] = useGetUserManualMutation();
    const { refetch } = useGetUserInformationQuery();

    const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [adminState, setAdminState] = useState<AdminAuthState>("loading");
    const [adminUser, setAdminUser] = useState<Users | null>(null);

    useEffect(() => {
        const init = async () => {
            const hostname = window.location.hostname;
            const isAdmin = hostname.includes("admin");
            setIsAdminSubdomain(isAdmin);

            if (!isAdmin) {
                setIsReady(true);
                return;
            }

            // Handle ?token= SSO redirect from main domain
            if (params.has("token")) {
                const token = params.get("token")!;
                webStorageClient.setToken(token, { domain: new URL(ADMIN_PAGE_URL).hostname });
                const user = await getUser(token).unwrap();
                webStorageClient.setUser(user);
                setAdminUser(user);
                refetch();
                router.push("/");
                return;
            }

            const token = webStorageClient.getToken() ?? webStorageClient.get("__admin_access_token");
            const user = webStorageClient.getUser();

            console.log(`-------- Token: ${token}`);
            console.log(`-------- User: ${JSON.stringify(user)}`);

            if (!token || user?.role !== "admin") {
                setAdminState("login");
                setIsReady(true);
                return;
            }

            setAdminUser(user);
            setAdminState("authenticated");
            setIsReady(true);
        };

        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Not yet initialized — blank to avoid flash ───────────────────────────
    if (!isReady) {
        return <div className="min-h-screen bg-[#060C18]" />;
    }

    // ── Non-admin subdomain ──────────────────────────────────────────────────
    if (!isAdminSubdomain) {
        return <>{children}</>;
    }

    // ── Admin subdomain ──────────────────────────────────────────────────────
    if (adminState === "loading") {
        // Blank screen while we check auth — avoids flash
        return (
            <div className="min-h-screen bg-[#060C18]" />
        );
    }

    if (adminState === "login") {
        return (
            <>
                <AdminLoginPage onLoginSuccess={(user) => {
                    setAdminUser(user);
                    setAdminState("authenticated");
                }} />
                <Toaster richColors position="bottom-right" />
            </>
        );
    }

    // authenticated
    return (
        <div className="min-h-screen flex flex-col bg-[#060C18]">
            <AdminTopbar
                username={adminUser?.displayName ?? adminUser?.username}
                email={adminUser?.email}
                avatarUrl={adminUser?.avatarUrl}
                role={adminUser?.role}
                onLogout={() => {
                    setAdminUser(null);
                    setAdminState("login");
                }}
            />
            <div className="flex-1">
                <AdminPage />
            </div>
            <Toaster richColors position="bottom-right" />
        </div>
    );
}