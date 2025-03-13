"use client"

import { useState, useEffect } from "react";

export default function useResponsive(): "mobile" | "desktop" | null {
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDeviceType = () => {
      setDeviceType(window.innerWidth <= 768 ? "mobile" : "desktop");
    };

    updateDeviceType(); // Ensure correct value is set immediately
    window.addEventListener("resize", updateDeviceType);

    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  return deviceType; // Return `null` initially to avoid incorrect render
}
