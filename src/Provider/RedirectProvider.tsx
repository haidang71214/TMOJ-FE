"use client";

import { useEffect, useState } from "react";
import webStorageClient from "@/utils/webStorageClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetUserInformationQuery, useGetUserManualMutation } from "@/store/queries/usersProfile";
import AdminPage from "@/app/{admin}/page";
import NavbarProvider from "./NavbarProvider";
import { Toaster } from "sonner";
import FooterWrapper from "@/app/components/FooterWrapper";

export default function RedirectProvider({ children }: { children: React.ReactNode }) {
    const params = useSearchParams();
    const router = useRouter();
    const [getUser] = useGetUserManualMutation();
    const { refetch } = useGetUserInformationQuery();
    const [isAdminSubdomain, setAdminSubdomain] = useState(false);

    const handleRouting = async () => {
        const token = webStorageClient.getToken() ?? webStorageClient.get("__admin_access_token");
        const user = webStorageClient.getUser();
        const isAdminSubdomain = window.location.hostname.includes("admin");
        setAdminSubdomain(isAdminSubdomain);
        if(isAdminSubdomain){
            console.log(`-------- Token: ${token}`)
            console.log(`-------- User: ${JSON.stringify(user)}`)
            
            if(params.has("token")){

                console.log(params.get("token"));
                
                webStorageClient.setToken(params.get("token")!, {domain:"admin.lvh.me"})
                const user = await getUser(params.get("token")!).unwrap();
                webStorageClient.setUser(user);
                refetch();
                router.push("/");
                return;
            }

            if(!token){
                window.location.href = window.location.origin.replace("admin.", "");
            }
            if(!user?.roles.includes("admin")){
                window.location.href = window.location.origin.replace("admin.", "");
            }
        }
    }

    useEffect(() => {
        handleRouting();        
    }, []);

    return isAdminSubdomain ? <><NavbarProvider />
          <AdminPage />
          <Toaster richColors position="bottom-right" />
          <FooterWrapper /></> : <>{children}</>;
}