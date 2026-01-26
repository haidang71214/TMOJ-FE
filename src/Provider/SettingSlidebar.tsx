"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
  User,
  Settings,
  Shield,
  Bell,
  FlaskConical,
} from "lucide-react";

const items = [
  { label: "Basic Info", href: "/settings", icon: User },
  { label: "Account", href: "/Settings/Account", icon: Settings },
  { label: "Lab", href: "/settings/lab", icon: FlaskConical },
  { label: "Privacy", href: "/settings/privacy", icon: Shield },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0">
      <div className="bg-content1 border border-divider rounded-xl p-2 space-y-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/settings" && pathname.startsWith(item.href));

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-default-200"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
