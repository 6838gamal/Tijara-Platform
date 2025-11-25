
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import commonTranslations from '@/lib/translations/common.json';
import adminTranslations from '@/lib/translations/admin.json';
import merchantTranslations from '@/lib/translations/merchant.json';
import merchantDashboardTranslations from '@/lib/translations/merchant-dashboard.json';
import merchantProductsTranslations from '@/lib/translations/merchant-products.json';
import merchantCategoriesTranslations from '@/lib/translations/merchant-categories.json';
import merchantBrandsTranslations from '@/lib/translations/merchant-brands.json';
import merchantOrdersTranslations from '@/lib/translations/merchant-orders.json';
import merchantCustomersTranslations from '@/lib/translations/merchant-customers.json';
import merchantCouponsTranslations from '@/lib/translations/merchant-coupons.json';
import merchantNotificationsTranslations from '@/lib/translations/merchant-notifications.json';
import merchantAiServicesTranslations from '@/lib/translations/merchant-ai-services.json';
import merchantSettingsTranslations from '@/lib/translations/merchant-settings.json';
import merchantPaymentsTranslations from '@/lib/translations/merchant-payments.json';
import storeTranslations from '@/lib/translations/store.json';
import merchantWalletTranslations from '@/lib/translations/merchant-wallet.json';
import merchantStoreDesignTranslations from '@/lib/translations/merchant-store-design.json';
import merchantStorePackageTranslations from '@/lib/translations/merchant-store-package.json';
import merchantContentTranslations from '@/lib/translations/merchant-content.json';
import merchantMarketplaceTranslations from '@/lib/translations/merchant-marketplace.json';
import merchantAffiliateTranslations from '@/lib/translations/merchant-affiliate.json';
import merchantLoyaltyTranslations from '@/lib/translations/merchant-loyalty.json';
import merchantOffersTranslations from '@/lib/translations/merchant-offers.json';
import merchantMarketingToolsTranslations from '@/lib/translations/merchant-marketing-tools.json';
import merchantAbandonedCartsTranslations from '@/lib/translations/merchant-abandoned-carts.json';
import merchantReviewsTranslations from '@/lib/translations/merchant-reviews.json';
import merchantPagesTranslations from '@/lib/translations/merchant-pages.json';
import merchantBlogTranslations from '@/lib/translations/merchant-blog.json';
import merchantGovServicesTranslations from '@/lib/translations/merchant-gov-services.json';
import merchantAppStoreTranslations from '@/lib/translations/merchant-app-store.json';
import merchantInstalledAppsTranslations from '@/lib/translations/merchant-installed-apps.json';

// Combine all translations into one object
const translations = {
  ...commonTranslations,
  ...adminTranslations,
  ...merchantTranslations,
  ...merchantDashboardTranslations,
  ...merchantProductsTranslations,
  ...merchantCategoriesTranslations,
  ...merchantBrandsTranslations,
  ...merchantOrdersTranslations,
  ...merchantCustomersTranslations,
  ...merchantCouponsTranslations,
  ...merchantNotificationsTranslations,
  ...merchantAiServicesTranslations,
  ...merchantSettingsTranslations,
  ...merchantPaymentsTranslations,
  ...storeTranslations,
  ...merchantWalletTranslations,
  ...merchantStoreDesignTranslations,
  ...merchantStorePackageTranslations,
  ...merchantContentTranslations,
  ...merchantMarketplaceTranslations,
  ...merchantAffiliateTranslations,
  ...merchantLoyaltyTranslations,
  ...merchantOffersTranslations,
  ...merchantMarketingToolsTranslations,
  ...merchantAbandonedCartsTranslations,
  ...merchantReviewsTranslations,
  ...merchantPagesTranslations,
  ...merchantBlogTranslations,
  ...merchantGovServicesTranslations,
  ...merchantAppStoreTranslations,
  ...merchantInstalledAppsTranslations,
};

type Language = 'en' | 'ar';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = useCallback((key: string, fallback?: string): string => {
    const typedTranslations = translations as Record<string, Record<Language, string>>;
    if (typedTranslations[key] && typedTranslations[key][lang]) {
      return typedTranslations[key][lang];
    }
    // console.warn(`Translation key "${key}" not found for language "${lang}".`);
    return fallback || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
