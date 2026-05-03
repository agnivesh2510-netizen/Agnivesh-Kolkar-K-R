import React from 'react';
import { BadgeCheck, MapPin, Wrench, AlertTriangle, ArrowRight, Save, Send, ClipboardList, Construction, Shield, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { AnalysisResult } from '../../services/geminiService';

interface AnalysisReportProps {
  data: AnalysisResult | null;
  onExecute: () => void;
  onDiscard: () => void;
}

import { useTranslation } from '../../contexts/LanguageContext';

export default function AnalysisReport({ data, onExecute, onDiscard }: AnalysisReportProps) {
  const { t, n } = useTranslation();
  if (!data) return null;

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-error-container text-on-error-container';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('infra')) return <Construction className="w-7 h-7" />;
    if (cat.includes('safe')) return <Shield className="w-7 h-7" />;
    if (cat.includes('light')) return <Lightbulb className="w-7 h-7" />;
    return <Wrench className="w-7 h-7" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="pt-24 pb-32 px-4 max-w-[1200px] mx-auto min-h-screen space-y-8"
    >
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">{t('analysis.title')}</h1>
          <p className="text-lg font-medium text-on-secondary-container">{t('analysis.complaint_id')}: #{n('CAS-8821-XP')}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-1.5 bg-primary text-white text-[12px] font-bold rounded-lg flex items-center gap-2 tracking-wider">
            <BadgeCheck className="w-4 h-4" /> {t('analysis.ai_processed')}
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Original Complaint */}
        <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant p-8 rounded-xl shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-4">{t('analysis.original')}</span>
            <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">{data.title}</h3>
            <p className="text-lg text-on-surface-variant leading-relaxed italic">
              "{data.description}"
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">{data.location}</span>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-4">{t('analysis.category')}</span>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                {getCategoryIcon(data.category)}
              </div>
              <span className="text-2xl font-bold text-primary">{data.category}</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-4">{t('analysis.urgency')}</span>
            <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-lg ${getUrgencyStyles(data.urgency)}`}>
              <AlertTriangle className="w-6 h-6 fill-current" />
              <span className="text-xl font-bold">{data.urgency} {t('analysis.priority')}</span>
            </div>
            <p className="mt-4 text-[12px] font-bold text-on-secondary-container tracking-wide uppercase">
              {data.urgency === 'Critical' ? t('analysis.immediate') : t('analysis.short_term')}
            </p>
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="md:col-span-12">
          <div className="bg-surface-container-highest border border-outline-variant p-8 rounded-xl shadow-inner space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-primary">{t('analysis.suggested')}</h2>
              <span className="text-[10px] font-bold text-primary bg-primary-fixed px-4 py-1.5 rounded-full tracking-widest border border-primary/10">{t('analysis.strategic').split(/(\d+)/).map(part => /\d+/.test(part) ? n(part) : part).join('')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.nextActions.map((action, i) => (
                <ActionItemCard 
                  key={i}
                  icon={<ArrowRight className="w-5 h-5" />} 
                  title={action.title} 
                  detail={action.detail} 
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-8 border-t border-primary/10">
              <button 
                onClick={onDiscard}
                className="px-8 py-3 border-2 border-primary text-primary font-bold text-[12px] uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
              >
                {t('analysis.discard')}
              </button>
              <button 
                onClick={onExecute}
                className="px-8 py-3 bg-primary text-white font-bold text-[12px] uppercase tracking-widest rounded-lg hover:bg-primary-container shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {t('analysis.execute')}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="md:col-span-12">
          <div className="h-80 rounded-xl border border-outline-variant relative overflow-hidden bg-slate-100 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1548345666-a57139a3f240?auto=format&fit=crop&q=80&w=1200" 
              alt="Incident location" 
              className="w-full h-full object-cover grayscale brightness-75"
            />
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="bg-surface-container-lowest p-4 rounded-full shadow-2xl border-4 border-error ring-8 ring-error/20 scale-125">
                <MapPin className="w-8 h-8 text-error fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActionItemCard({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string, key?: React.Key }) {
  return (
    <div className="bg-surface-container-lowest p-6 border border-outline-variant rounded-xl hover:border-primary transition-all cursor-pointer group shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <ArrowRight className="w-6 h-6" />
        </div>
        <ArrowRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
      </div>
      <h4 className="text-lg font-bold text-primary mb-2 leading-tight">{title}</h4>
      <p className="text-[12px] font-bold text-on-secondary-container leading-tight uppercase tracking-wider opacity-70">{detail}</p>
    </div>
  );
}
