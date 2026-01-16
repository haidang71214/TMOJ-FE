import SettingsSidebar from "@/Provider/SettingSlidebar";
import Image from "next/image";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative">

      {/* ===== HEADER ===== */}
      <div className="relative z-0 h-64 bg-gradient-to-b from-neutral-700 to-neutral-900">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border-4 border-background">
            <Image src="/your-avatar.jpg" alt="avatar" fill className="object-cover" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Đăng Hải <span className="text-primary">↗</span>
            </h1>
            <p className="text-sm text-neutral-300">
              LeetCode ID: yMXnOfMOzd
            </p>
          </div>
        </div>
      </div>

      {/* ===== CONTENT LAYER ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 -mt-16 pb-12">
        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <SettingsSidebar />
          </aside>

          {/* Main */}
          <main className="flex-1">
            <div className="bg-content1 border border-divider rounded-xl shadow-sm p-6">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
