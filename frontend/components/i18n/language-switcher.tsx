"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

// Simple translations object (in a real app, this would be more comprehensive)
const translations = {
  en: {
    dashboard: "Dashboard",
    projects: "Projects",
    tasks: "Tasks",
    sprints: "Sprints",
    reports: "Reports",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    welcome: "Welcome",
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    // Add more translations as needed
  },
  id: {
    dashboard: "Dasbor",
    projects: "Proyek",
    tasks: "Tugas",
    sprints: "Sprint",
    reports: "Laporan",
    settings: "Pengaturan",
    profile: "Profil",
    logout: "Keluar",
    welcome: "Selamat Datang",
    loading: "Memuat...",
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    edit: "Edit",
    create: "Buat",
    search: "Cari",
    filter: "Filter",
    sort: "Urutkan",
  },
  es: {
    dashboard: "Panel",
    projects: "Proyectos",
    tasks: "Tareas",
    sprints: "Sprints",
    reports: "Informes",
    settings: "Configuración",
    profile: "Perfil",
    logout: "Cerrar Sesión",
    welcome: "Bienvenido",
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
  },
  // Add more languages as needed
};

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("sprintflow-language");
    if (
      savedLanguage &&
      languages.find((lang) => lang.code === savedLanguage)
    ) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split("-")[0];
      const supportedLanguage = languages.find(
        (lang) => lang.code === browserLanguage,
      );
      if (supportedLanguage) {
        setCurrentLanguage(browserLanguage);
      }
    }
  }, []);

  const changeLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem("sprintflow-language", languageCode);

    // In a real app, you would trigger a language change event
    // or use a proper i18n library like next-intl
    window.dispatchEvent(
      new CustomEvent("languageChange", {
        detail: { language: languageCode },
      }),
    );
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Globe className="h-4 w-4" />
      </Button>
    );
  }

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Change Language">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Change Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={
              currentLanguage === language.code
                ? "bg-slate-100 dark:bg-slate-800"
                : ""
            }
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
            {currentLanguage === language.code && (
              <span className="ml-auto text-xs text-slate-500">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook to use translations
export function useTranslations() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("sprintflow-language") || "en";
    setCurrentLanguage(savedLanguage);

    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener(
      "languageChange",
      handleLanguageChange as EventListener,
    );
    return () => {
      window.removeEventListener(
        "languageChange",
        handleLanguageChange as EventListener,
      );
    };
  }, []);

  const t = (key: string): string => {
    const langTranslations =
      translations[currentLanguage as keyof typeof translations] ||
      translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return { t, currentLanguage };
}

// Context for translations (optional, for more complex apps)
import { createContext, useContext } from "react";

interface I18nContextType {
  language: string;
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en");

  const t = (key: string): string => {
    const langTranslations =
      translations[language as keyof typeof translations] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("sprintflow-language", lang);
  };

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
