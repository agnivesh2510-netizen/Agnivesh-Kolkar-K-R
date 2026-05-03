import React, { useState } from 'react';
import { Plus, ArrowRight, AlertTriangle, Clock, Construction, CheckCircle, ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Report, Activity } from '../../types';
import LocalInfoModal from './LocalInfoModal';
import { useTranslation } from '../../contexts/LanguageContext';

interface DashboardProps {
  reports: Report[];
  activities: Activity[];
  onNewComplaint: () => void;
  onViewReport: (id: string) => void;
}

export default function Dashboard({ reports, activities, onNewComplaint, onViewReport }: DashboardProps) {
  const { t, n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pendingCount = reports.filter(r => r.status === 'Pending Review').length;
  const activeCount = reports.filter(r => r.status === 'In Progress').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-20 pb-24 px-4 max-w-[1200px] mx-auto min-h-screen space-y-8"
    >
      <LocalInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Welcome Hero */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">{t('nav.dashboard')}</h1>
          <p className="text-on-surface-variant text-lg">{t('hero.desc')}</p>
        </div>
        <button 
          onClick={onNewComplaint}
          className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-8 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {t('hero.new_complaint')}
        </button>
      </section>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatusCard 
            icon={<Clock className="w-8 h-8 text-secondary" />} 
            count={n(pendingCount.toString().padStart(2, '0'))} 
            label={t('stats.pending')} 
            badge="PENDING" 
            badgeColor="bg-secondary-container text-on-secondary-container" 
          />
          <StatusCard 
            icon={<Construction className="w-8 h-8 text-primary" />} 
            count={n(activeCount.toString().padStart(2, '0'))} 
            label={t('stats.active')} 
            badge="IN PROGRESS" 
            badgeColor="bg-primary-fixed text-on-primary-fixed-variant" 
          />
          <StatusCard 
            icon={<CheckCircle className="w-8 h-8 text-green-700" />} 
            count={n(resolvedCount.toString().padStart(2, '0'))} 
            label={t('stats.resolved')} 
            badge="RESOLVED" 
            badgeColor="bg-green-100 text-green-800" 
          />
        </div>
        
        {/* Urgent Notification */}
        <div className="md:col-span-4 bg-primary-container text-white p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">{t('stats.alert')}</h3>
            <p className="opacity-90 leading-relaxed mb-4">{t('alert.text').split(/(\d+)/).map(part => /\d+/.test(part) ? n(part) : part).join('')}</p>
          </div>
          <button className="relative z-10 flex items-center gap-2 font-semibold hover:underline text-primary-fixed-dim">
            {t('alert.map')}
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <AlertTriangle className="w-32 h-32" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Reports List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">{t('active_reports.title')}</h2>
            <button className="text-primary font-semibold hover:underline flex items-center gap-1">
              {t('active_reports.view_all')} <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-5">
            {reports.length === 0 ? (
              <div className="bg-surface-container-lowest border border-outline-variant border-dashed p-12 rounded-xl text-center space-y-4">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-outline">
                  <BarChart3Icon className="w-8 h-8" />
                </div>
                <p className="text-on-surface-variant font-medium">{t('active_reports.empty')}</p>
                <button onClick={onNewComplaint} className="text-primary font-bold hover:underline">{t('active_reports.empty_cta')}</button>
              </div>
            ) : (
              reports.map((report) => (
                <ReportCard key={report.id} report={report} onClick={() => onViewReport(report.id)} />
              ))
            )}
          </div>
        </div>

        {/* Activity & CTA Side */}
        <div className="space-y-8">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant h-fit">
            <h2 className="text-2xl font-bold text-primary mb-6">{t('activity.recent')}</h2>
            <div className="space-y-8 relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-outline-variant opacity-30"></div>
              {activities.length === 0 ? (
                <div className="pl-10 text-on-surface-variant text-sm py-4 italic">
                  {t('activity.empty')}
                </div>
              ) : (
                activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              )}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant text-center space-y-4">
            <div className="w-16 h-16 bg-primary-container/10 text-primary-container rounded-full flex items-center justify-center mx-auto">
              <Construction className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-primary">{t('section.council')}</h4>
            <p className="text-on-surface-variant text-sm">{t('council.desc')}</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full border border-primary text-primary py-2 rounded font-semibold hover:bg-surface-container transition-colors"
            >
              {t('council.learn')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusCard({ icon, count, label, badge, badgeColor }: { icon: any, count: string, label: string, badge: string, badgeColor: string, key?: React.Key }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-primary transition-colors group">
      <div className="flex justify-between items-start mb-4">
        {icon}
        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${badgeColor}`}>{badge}</span>
      </div>
      <div className="text-3xl font-bold text-primary mb-1">{count}</div>
      <div className="text-on-surface-variant text-sm font-medium">{label}</div>
    </div>
  );
}

function ReportCard({ report, onClick }: { report: Report, onClick: () => void, key?: React.Key }) {
  const { n, t } = useTranslation();
  return (
    <button 
      onClick={onClick}
      className="w-full text-left bg-surface-container-lowest p-6 rounded-xl border border-outline-variant flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group overflow-hidden"
    >
      <div className="w-full md:w-32 h-24 rounded-lg bg-surface-variant overflow-hidden flex-shrink-0">
        <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
            report.urgency === 'Critical' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'
          }`}>
            {report.urgency}
          </span>
          <span className="text-[10px] font-bold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded uppercase tracking-wider">
            #{n(report.id)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-primary-container transition-colors">{report.title}</h3>
        <p className="text-on-surface-variant line-clamp-1 mb-3 text-sm">{report.description}</p>
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            {report.timeAgo.split(/(\d+)/).map(part => /\d+/.test(part) ? n(part) : part).join('')}
          </div>
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
            <RefreshCw className="w-3.5 h-3.5" />
            {report.status}
          </div>
          {report.estimatedDays && (
            <div className="flex items-center gap-1.5 text-secondary text-xs font-bold bg-secondary-container/20 px-2 py-0.5 rounded">
              <Clock className="w-3.5 h-3.5" />
              {n(report.estimatedDays)} {t('tracker.days')}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function ActivityItem({ activity }: { activity: Activity, key?: React.Key }) {
  const { n } = useTranslation();
  const localizedTime = activity.timeAgo.split(/(\d+)/).map(part => /\d+/.test(part) ? n(part) : part).join('');
  
  return (
    <div className="relative flex gap-4 pl-10">
      <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center z-10 ${
        activity.type === 'resolved' ? 'bg-green-100 text-green-700' :
        activity.type === 'comment' ? 'bg-blue-100 text-primary' : 'bg-surface-variant text-secondary'
      }`}>
        {activity.type === 'resolved' && <CheckCircle className="w-4 h-4" />}
        {activity.type === 'comment' && <ArrowRight className="w-4 h-4" />}
        {activity.type === 'photo' && <ArrowRight className="w-4 h-4" />}
      </div>
      <div>
        <p className="font-bold text-on-surface text-sm">{activity.title}</p>
        <p className="text-on-surface-variant text-xs leading-relaxed mt-1">{activity.detail}</p>
        <span className="text-[10px] font-bold text-outline mt-2 block tracking-wider uppercase">{localizedTime}</span>
      </div>
    </div>
  );
}

function BarChart3Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
