import React from "react";
import { Avatar } from "@heroui/react";

interface UserAvatarProps {
  src?: string | null;
  frameUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  frameUrl,
  size = "md",
  className = "",
  fallback
}) => {
  // Kích thước chuẩn cho Avatar dựa trên size
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
  };

  const avatarSize = sizeMap[size];

  return (
    <div className={`relative flex items-center justify-center ${avatarSize} ${className}`}>
      {/* Avatar chính */}
      <Avatar
        src={src || undefined}
        name={fallback}
        className={avatarSize}
      />

      {/* Khung (Frame) nếu có */}
      {frameUrl && (
        <img
          src={frameUrl}
          alt="Avatar Frame"
          className="absolute inset-0 w-full h-full object-contain scale-[1.65] pointer-events-none z-10"
        />
      )}
    </div>
  );
};

export default UserAvatar;
