/**
 * Utility functions for managing localStorage and sessionStorage
 */

export const StorageKeys = {
  AUTH: "auth-storage",
  PROJECT: "project-storage",
  SPRINT: "sprint-storage",
  THEME: "theme-storage",
  LANGUAGE: "language-preference",
  CHAT: "chat-storage",
  TEMPLATE: "template-storage",
  TAG: "tag-storage",
  ACTIVITY: "activity-storage",
  SETTINGS: "user-settings",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/**
 * Clear all application-related storage
 */
export function clearAllStorage(): void {
  if (typeof window === "undefined") return;

  try {
    // Clear specific storage keys
    Object.values(StorageKeys).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Clear any keys that start with 'sprintflow-'
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sprintflow-")) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear service worker caches if available
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes("sprintflow")) {
            caches.delete(name);
          }
        });
      });
    }

    console.log("All application storage cleared successfully");
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
}

/**
 * Clear specific storage key
 */
export function clearStorage(key: StorageKey): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
    console.log(`Storage key '${key}' cleared successfully`);
  } catch (error) {
    console.error(`Error clearing storage key '${key}':`, error);
  }
}

/**
 * Get storage item with error handling
 */
export function getStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting storage item '${key}':`, error);
    return null;
  }
}

/**
 * Set storage item with error handling
 */
export function setStorageItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting storage item '${key}':`, error);
    return false;
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
