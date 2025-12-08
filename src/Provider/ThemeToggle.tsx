'use client'
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // chỉ render sau khi client mount

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <Button onPress={toggleTheme} color="secondary" variant="flat">
      {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
    </Button>
  );
}