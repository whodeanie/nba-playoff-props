"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    const initial = stored === "light" ? "light" : "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");
  }, []);

  function flip(): void {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
  }

  return (
    <button onClick={flip} className="btn" aria-label="Toggle theme">
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
