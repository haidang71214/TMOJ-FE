'use client'
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // chỉ render sau khi client mount

  const toggleTheme = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');

  return (
    <Button isIconOnly aria-label="Toggle Theme" className="text-[#4B6382] dark:text-[#A0AEC0] hover:text-[#ff8904]" onPress={toggleTheme} variant="light">
      {resolvedTheme === 'light' ? '🌙' : '🌞'}
    </Button>
  )
}