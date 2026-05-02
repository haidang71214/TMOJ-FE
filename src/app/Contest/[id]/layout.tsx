
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
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#0A0F1C] transition-colors duration-500">
      {children}
    </div>
  );
}