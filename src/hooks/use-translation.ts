"use client";

import { useLanguage } from "@/context/language-context";

export const useTranslation = () => {
  const { t, lang, setLang } = useLanguage();
  return { t, lang, setLang };
};
