import React from 'react';
import { motion } from 'motion/react';
import { Globe, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

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

interface LanguageSelectorProps {
  onSelect: (langId: string) => void;
  userName: string;
}

export default function LanguageSelector({ onSelect, userName }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useTranslation();
  const [selected, setSelected] = React.useState(language || 'en');

  const handleSelect = (id: string) => {
    setSelected(id);
    setLanguage(id);
  };

  return (
    <div className="fixed inset-0 bg-surface z-[200] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-on-surface">
            {t('lang.welcome').replace('{name}', userName)}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {t('lang.select')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className={`p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${
                selected === lang.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-outline-variant hover:border-primary/50 bg-white'
              }`}
            >
              <div className="space-y-1 relative z-10">
                <p className={`font-bold text-sm ${selected === lang.id ? 'text-primary' : 'text-on-surface'}`}>
                  {lang.name}
                </p>
                <p className="text-xs text-on-surface-variant font-medium">
                  {lang.nativeName}
                </p>
              </div>
              {selected === lang.id && (
                <motion.div 
                  layoutId="active-check"
                  className="absolute top-3 right-3 text-primary"
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelect(selected)}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {t('btn.continue')}
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>

      <div className="mt-12 flex items-center gap-2 text-outline font-bold text-[10px] uppercase tracking-widest">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
        Secure Citizen Portal
      </div>
    </div>
  );
}
