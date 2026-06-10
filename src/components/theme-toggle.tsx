"use client";

import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

const themeStorageKey = "portfolio-os-theme";
const defaultTheme: ThemeMode = "dark";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "dark" || value === "light";
}

function readTheme() {
  if (typeof window === "undefined") {
    return defaultTheme;
  }

  const savedTheme = window.localStorage.getItem(themeStorageKey);
  return isThemeMode(savedTheme) ? savedTheme : defaultTheme;
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeInitializer() {
  useEffect(() => {
    applyTheme(readTheme());
  }, []);

  return null;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    const savedTheme = readTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(themeStorageKey, nextTheme);
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "light"}
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      <span aria-hidden="true">{theme === "dark" ? "D" : "L"}</span>
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
