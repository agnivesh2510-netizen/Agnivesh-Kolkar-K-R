import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Moon, LogOut, Check, Languages, Sun } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

interface Language {
  id: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { id: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { id: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { id: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { id: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { id: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { id: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { id: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function SettingsModal({ isOpen, onClose, onLogout }: SettingsModalProps) {
  const { language, setLanguage, t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl overflow-hidden border border-outline-variant"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
                <Globe className="w-6 h-6" />
                {t('settings.title')}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Language Selection */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-on-surface/60">
                  <Languages className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{t('settings.lang')}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${
                        language === lang.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-outline-variant hover:border-primary/50'
                      }`}
                    >
                      <div className="space-y-1 relative z-10">
                        <p className={`font-bold text-sm ${language === lang.id ? 'text-primary' : 'text-on-surface'}`}>
                          {lang.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight">
                          {lang.nativeName}
                        </p>
                      </div>
                      {language === lang.id && (
                        <div className="absolute top-3 right-3 text-primary">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Visual Theme */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-on-surface/60">
                  <Moon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{t('settings.theme')}</span>
                </div>
                <div className="flex bg-surface-container rounded-2xl p-1 relative">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                      theme === 'light' 
                        ? 'bg-surface shadow-sm text-primary' 
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                      theme === 'dark' 
                        ? 'bg-surface shadow-sm text-primary' 
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                </div>
              </section>
            </div>

            {/* Footer / Logout */}
            <div className="p-6 bg-surface-container-low border-t border-outline-variant">
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 bg-error/10 text-error py-4 rounded-2xl font-bold hover:bg-error/20 transition-all active:scale-[0.98]"
              >
                <LogOut className="w-5 h-5" />
                {t('settings.logout')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
