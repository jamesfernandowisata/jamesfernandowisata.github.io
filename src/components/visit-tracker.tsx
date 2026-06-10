"use client";

import { useEffect } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");
const visitStorageKey = "portfolio-os-visit-tracked";

function getClientTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "";
  }
}

export default function VisitTracker() {
  useEffect(() => {
    if (!backendUrl) {
      return;
    }

    if (window.sessionStorage.getItem(visitStorageKey) === "true") {
      return;
    }

    const payload = {
      clientTimezone: getClientTimezone(),
      locale: window.navigator.language,
      path: window.location.pathname,
      referrer: document.referrer,
    };

    void fetch(`${backendUrl}/api/visits`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          window.sessionStorage.setItem(visitStorageKey, "true");
        }
      })
      .catch(() => undefined);
  }, []);

  return null;
}
