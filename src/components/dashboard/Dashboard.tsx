import { Plus, ArrowRight, AlertTriangle, Clock, Construction, CheckCircle, ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Report, Activity } from '../../types';

interface DashboardProps {
  onNewComplaint: () => void;
  onViewReport: (id: string) => void;
}

const mockReports: Report[] = [
  {
    id: 'REF-8821',
    title: 'Hazardous Pothole - Main St. Crossing',
    category: 'Infrastructure',
    urgency: 'Critical',
    status: 'In Progress',
    timeAgo: '2 days ago',
    description: 'Reported near the north entrance of Central Park. Causing traffic delays.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'REF-9012',
    title: 'Broken Street Lamp - 4th Avenue',
    category: 'Maintenance',
    urgency: 'Medium',
    status: 'Pending Review',
    timeAgo: '5 hours ago',
    description: 'The lamp post outside the community center has been dark for 3 nights.',
    imageUrl: 'https://images.unsplash.com/photo-1610492806440-ae791834226f?auto=format&fit=crop&q=80&w=400',
  }
];

const mockActivities: Activity[] = [
  {
    id: 'act1',
    type: 'resolved',
    title: 'Complaint Resolved',
    detail: 'Graffiti removal at West Side Park completed successfully.',
    timeAgo: '10 MIN AGO'
  },
  {
    id: 'act2',
    type: 'comment',
    title: 'New Comment',
    detail: 'Official from Department of Water added a note to your report #REF-8821.',
    timeAgo: '2 HOURS AGO'
  },
  {
    id: 'act3',
    type: 'photo',
    title: 'Photo Evidence Added',
    detail: 'You uploaded 3 new photos to "Street Lamp - 4th Ave".',
    timeAgo: 'YESTERDAY'
  }
];

export default function Dashboard({ onNewComplaint, onViewReport }: DashboardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-20 pb-24 px-4 max-w-[1200px] mx-auto min-h-screen space-y-8"
    >
      {/* Welcome Hero */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">Citizen Dashboard</h1>
          <p className="text-on-surface-variant text-lg">Track your active reports and contribute to your community.</p>
        </div>
        <button 
          onClick={onNewComplaint}
          className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-8 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Complaint
        </button>
      </section>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatusCard icon={<Clock className="w-8 h-8 text-secondary" />} count="04" label="Awaiting Review" badge="PENDING" badgeColor="bg-secondary-container text-on-secondary-container" />
          <StatusCard icon={<Construction className="w-8 h-8 text-primary" />} count="12" label="Currently Active" badge="IN PROGRESS" badgeColor="bg-primary-fixed text-on-primary-fixed-variant" />
          <StatusCard icon={<CheckCircle className="w-8 h-8 text-green-700" />} count="89" label="Completed Works" badge="RESOLVED" badgeColor="bg-green-100 text-green-800" />
        </div>
        
        {/* Urgent Notification */}
        <div className="md:col-span-4 bg-primary-container text-white p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">City Alert</h3>
            <p className="opacity-90 leading-relaxed mb-4">Water main maintenance scheduled for sector 4G tomorrow at 08:00 AM.</p>
          </div>
          <button className="relative z-10 flex items-center gap-2 font-semibold hover:underline text-primary-fixed-dim">
            View Impact Map
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
            <h2 className="text-2xl font-bold text-primary">My Active Reports</h2>
            <button className="text-primary font-semibold hover:underline flex items-center gap-1">
              View All <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-5">
            {mockReports.map((report) => (
              <ReportCard key={report.id} report={report} onClick={() => onViewReport(report.id)} />
            ))}
          </div>
        </div>

        {/* Activity & CTA Side */}
        <div className="space-y-8">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant h-fit">
            <h2 className="text-2xl font-bold text-primary mb-6">Recent Activity</h2>
            <div className="space-y-8 relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-outline-variant"></div>
              {mockActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-outline-variant text-center space-y-4">
            <div className="w-16 h-16 bg-primary-container/10 text-primary-container rounded-full flex items-center justify-center mx-auto">
              <Construction className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-primary">Join Local Council</h4>
            <p className="text-on-surface-variant text-sm">Lend your voice to community planning meetings every Tuesday.</p>
            <button className="w-full border border-primary text-primary py-2 rounded font-semibold hover:bg-surface-container transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusCard({ icon, count, label, badge, badgeColor }: { icon: any, count: string, label: string, badge: string, badgeColor: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-outline-variant hover:border-primary transition-colors group">
      <div className="flex justify-between items-start mb-4">
        {icon}
        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${badgeColor}`}>{badge}</span>
      </div>
      <div className="text-3xl font-bold text-primary mb-1">{count}</div>
      <div className="text-on-surface-variant text-sm font-medium">{label}</div>
    </div>
  );
}

function ReportCard({ report, onClick }: { report: Report, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left bg-white p-6 rounded-xl border border-outline-variant flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group overflow-hidden"
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
            #{report.id}
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-1 group-hover:text-primary-container transition-colors">{report.title}</h3>
        <p className="text-on-surface-variant line-clamp-1 mb-3 text-sm">{report.description}</p>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            {report.timeAgo}
          </div>
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
            <RefreshCw className="w-3.5 h-3.5" />
            {report.status}
          </div>
        </div>
      </div>
    </button>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
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
        <span className="text-[10px] font-bold text-outline mt-2 block tracking-wider uppercase">{activity.timeAgo}</span>
      </div>
    </div>
  );
}
