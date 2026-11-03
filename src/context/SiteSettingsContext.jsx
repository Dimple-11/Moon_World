import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { personalInfo } from '../data/portfolioData';
import { githubUrl, linkedinUrl, resumeUrl } from '../data/links';

const DEFAULTS = {
  brandName: personalInfo.brandName,
  brandSubtitle: personalInfo.brandSubtitle,
  tagline: personalInfo.tagline,
  email: personalInfo.email,
  github: githubUrl,
  linkedin: linkedinUrl,
  resumeUrl,
};

const SiteSettingsContext = createContext({ settings: DEFAULTS, setSettings: () => {} });

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!cancelled && data?.success && data.settings) {
          setSettings({ ...DEFAULTS, ...data.settings });
        }
      } catch {
        // Keep the built-in defaults when the API is unavailable.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (settings.brandName) {
      document.title = `${settings.brandName} | ${settings.brandSubtitle || 'Portfolio'}`;
    }
  }, [settings.brandName, settings.brandSubtitle]);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
