import { BadgeCheck, MapPin, Wrench, AlertTriangle, ArrowRight, Share2, Save, Send, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';

interface AnalysisReportProps {
  onExecute: () => void;
  onDiscard: () => void;
}

export default function AnalysisReport({ onExecute, onDiscard }: AnalysisReportProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="pt-24 pb-32 px-4 max-w-[1200px] mx-auto min-h-screen space-y-8"
    >
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">Analysis Report</h1>
          <p className="text-lg font-medium text-on-secondary-container">Complaint ID: #CAS-8821-XP</p>
        </div>
        <div className="flex gap-2">
          <span className="px-4 py-1.5 bg-primary text-white text-[12px] font-bold rounded-lg flex items-center gap-2 tracking-wider">
            <BadgeCheck className="w-4 h-4" /> AI PROCESSED
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Original Complaint */}
        <div className="md:col-span-8 bg-white border border-outline-variant p-8 rounded-xl shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-4">Original Submission</span>
            <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">Main Street Water Main Leak</h3>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              "I am writing to report a major water leak on Main Street, near the intersection of 5th Avenue. It looks like a main pipe has burst underground. Water has been bubbling up through the asphalt for at least three hours now, creating a large pool that is starting to obstruct traffic in the northbound lane. This is wasting a significant amount of clean water and could cause a sinkhole if not addressed immediately."
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">Main St & 5th Ave, Central District</span>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white border border-outline-variant p-6 rounded-xl">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-4">Detected Category</span>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <Wrench className="w-7 h-7" />
              </div>
              <span className="text-2xl font-bold text-primary">Infrastructure</span>
            </div>
          </div>

          <div className="bg-white border border-outline-variant p-6 rounded-xl">
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-4">Urgency Level</span>
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-error-container text-on-error-container rounded-lg">
              <AlertTriangle className="w-6 h-6 fill-current" />
              <span className="text-xl font-bold">High Priority</span>
            </div>
            <p className="mt-4 text-[12px] font-bold text-on-secondary-container tracking-wide uppercase">Resolution expected within 4 hours.</p>
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="md:col-span-12">
          <div className="bg-surface-container-highest border border-outline-variant p-8 rounded-xl shadow-inner space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-primary">Suggested Next Actions</h2>
              <span className="text-[10px] font-bold text-primary bg-primary-fixed px-4 py-1.5 rounded-full tracking-widest border border-primary/10">3 STRATEGIC RECOMMENDATIONS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ActionItemCard 
                icon={<ArrowRight className="w-5 h-5" />} 
                title="Dispatch maintenance crew" 
                detail="Emergency plumbing unit required for primary pipe repair." 
              />
              <ActionItemCard 
                icon={<ArrowRight className="w-5 h-5" />} 
                title="Notify traffic control" 
                detail="Redirect northbound traffic from 5th Ave intersection." 
              />
              <ActionItemCard 
                icon={<ArrowRight className="w-5 h-5" />} 
                title="Notify city council" 
                detail="Log incident in regional infrastructure health report." 
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-8 border-t border-primary/10">
              <button 
                onClick={onDiscard}
                className="px-8 py-3 border-2 border-primary text-primary font-bold text-[12px] uppercase tracking-widest rounded-lg hover:bg-white transition-colors"
              >
                Discard Analysis
              </button>
              <button 
                onClick={onExecute}
                className="px-8 py-3 bg-primary text-white font-bold text-[12px] uppercase tracking-widest rounded-lg hover:bg-primary-container shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Execute All Actions
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
              <div className="bg-white p-4 rounded-full shadow-2xl border-4 border-error ring-8 ring-error/20 scale-125">
                <MapPin className="w-8 h-8 text-error fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActionItemCard({ icon, title, detail }: { icon: JSX.Element, title: string, detail: string }) {
  return (
    <div className="bg-white p-6 border border-outline-variant rounded-xl hover:border-primary transition-all cursor-pointer group shadow-sm">
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
