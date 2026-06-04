"use client";

import { useEffect } from "react";

const backgroundStorageKey = "portfolio-os-background";
const fallbackBackgrounds = [
  "/backgrounds/bg-contents.jpg",
  "/backgrounds/bg-wallpaper.jpg",
];

function applyBackground(imagePath: string) {
  document.documentElement.style.setProperty(
    "--desktop-bg-image",
    `url("${imagePath}")`,
  );
}

function pickBackground(backgrounds: string[]) {
  return backgrounds[Math.floor(Math.random() * backgrounds.length)];
}

async function loadBackgrounds() {
  try {
    const response = await fetch("/backgrounds/list.json", {
      cache: "no-store",
    });
    const backgrounds = (await response.json()) as unknown;

    if (!Array.isArray(backgrounds)) {
      return fallbackBackgrounds;
    }

    const validBackgrounds = backgrounds.filter(
      (item): item is string => typeof item === "string" && item.length > 0,
    );

    return validBackgrounds.length > 0 ? validBackgrounds : fallbackBackgrounds;
  } catch {
    return fallbackBackgrounds;
  }
}

export default function BackgroundRotator() {
  useEffect(() => {
    const savedBackground = window.sessionStorage.getItem(backgroundStorageKey);

    if (savedBackground) {
      applyBackground(savedBackground);
      return;
    }

    let isActive = true;

    void loadBackgrounds().then((backgrounds) => {
      if (!isActive) {
        return;
      }

      const selectedBackground = pickBackground(backgrounds);
      window.sessionStorage.setItem(backgroundStorageKey, selectedBackground);
      applyBackground(selectedBackground);
    });

    return () => {
      isActive = false;
    };
  }, []);

  return null;
}
