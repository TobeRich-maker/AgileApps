// Storage utility functions for debugging and manual clearing

export const STORAGE_KEYS = {
  AUTH: "auth-storage",
  THEME: "theme",
  LANGUAGE: "language",
  PROJECTS: "projects-storage",
  SPRINTS: "sprints-storage",
  CHAT: "chat-storage",
  TEMPLATES: "templates-storage",
  TAGS: "tags-storage",
  ACTIVITY: "activity-storage",
} as const;

export function debugStorage() {
  if (typeof window === "undefined") return;

  console.group("🔍 Storage Debug Info");

  console.log("📦 localStorage items:", localStorage.length);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      console.log(
        `  ${key}:`,
        localStorage.getItem(key)?.substring(0, 100) + "...",
      );
    }
  }

  console.log("📦 sessionStorage items:", sessionStorage.length);
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      console.log(
        `  ${key}:`,
        sessionStorage.getItem(key)?.substring(0, 100) + "...",
      );
    }
  }

  console.log("🍪 Cookies:", document.cookie);
  console.groupEnd();
}

export function forceClearAllStorage() {
  if (typeof window === "undefined") return;

  try {
    console.log("🧹 Force clearing all storage...");

    // Clear localStorage
    localStorage.clear();
    console.log("✅ localStorage cleared");

    // Clear sessionStorage
    sessionStorage.clear();
    console.log("✅ sessionStorage cleared");

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });
    console.log("✅ Cookies cleared");

    // Clear IndexedDB
    if (window.indexedDB) {
      window.indexedDB.databases?.().then((databases) => {
        databases.forEach((db) => {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
            console.log(`✅ IndexedDB ${db.name} cleared`);
          }
        });
      });
    }

    // Clear cache storage
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
          console.log(`✅ Cache ${name} cleared`);
        });
      });
    }

    console.log("🎉 All storage cleared successfully!");

    // Verify clearing worked
    setTimeout(() => {
      console.log(
        "🔍 Verification - localStorage length:",
        localStorage.length,
      );
      console.log(
        "🔍 Verification - sessionStorage length:",
        sessionStorage.length,
      );
    }, 100);
  } catch (error) {
    console.error("❌ Error clearing storage:", error);
  }
}

export function clearSpecificStorage(keys: string[]) {
  if (typeof window === "undefined") return;

  keys.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    console.log(`✅ Cleared storage key: ${key}`);
  });
}

// Make functions available globally for debugging
if (typeof window !== "undefined") {
  (window as any).debugStorage = debugStorage;
  (window as any).forceClearAllStorage = forceClearAllStorage;
  (window as any).clearSpecificStorage = clearSpecificStorage;
}
