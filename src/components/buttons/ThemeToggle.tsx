"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export default function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = (document.documentElement.getAttribute("data-bs-theme") as "dark" | "light") || "dark";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-bs-theme", nextTheme);
    try {
      localStorage.setItem("app-theme", nextTheme);
    } catch (e) {
      // ignore
    }
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={cn(
          "btn btn-outline-secondary d-inline-flex align-items-center justify-content-center p-2 rounded-3 border",
          size === "sm" ? "btn-sm" : "",
          className
        )}
        style={{ width: size === "sm" ? 34 : 40, height: size === "sm" ? 34 : 40 }}
        aria-label="Toggle theme"
      >
        <span className="spinner-border spinner-border-sm" role="status" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "btn btn-outline-secondary d-inline-flex align-items-center justify-content-center rounded-3 border transition-colors",
        size === "sm" ? "btn-sm p-1" : "p-2",
        className
      )}
      style={{
        width: size === "sm" ? 34 : 40,
        height: size === "sm" ? 34 : 40,
        borderColor: "var(--app-border)",
      }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className={cn("text-warning", size === "sm" ? "w-4 h-4" : "w-5 h-5")} />
      ) : (
        <Moon className={cn("text-primary", size === "sm" ? "w-4 h-4" : "w-5 h-5")} />
      )}
    </button>
  );
}
