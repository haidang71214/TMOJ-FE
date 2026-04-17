
import React from "react";

// Layout giờ phải là async function
export default async function ContestLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;  // ← type đúng là Promise
}) {
  // Await params để lấy id an toàn
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      {children}
    </div>
  );
}