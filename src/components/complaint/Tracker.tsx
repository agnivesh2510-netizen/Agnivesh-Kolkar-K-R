import { motion } from 'motion/react';
import { RotateCw, CheckCircle, Clock, Calendar, Users, Hammer, Lightbulb, MapPin, ChevronRight, ClipboardList } from 'lucide-react';

export default function Tracker() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="pt-24 pb-32 px-4 md:px-8 max-w-[1200px] mx-auto min-h-screen"
    >
      {/* Case Header Card */}
      <section className="mb-8">
        <div className="bg-white border border-outline-variant rounded-xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 block">Case #CMP-8829</span>
              <h1 className="text-3xl font-bold text-on-surface leading-tight">Pothole Damage & Street Lighting Failure</h1>
            </div>
            <div className="inline-flex items-center bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-[13px] font-bold shadow-sm">
              <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin-slow" />
              Active Resolution
            </div>
          </div>
          <p className="text-on-surface-variant max-w-4xl mb-8 leading-relaxed text-base">
            Large pothole formed at the intersection of Maple and 4th Street following heavy rain. The adjacent street light (ID: SL-402) is also flickering, creating a safety hazard for night-time drivers and pedestrians. Reported on October 12, 2023.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-surface-container">
            <div>
              <span className="text-[10px] font-bold text-outline block mb-1 uppercase tracking-widest">CATEGORY</span>
              <span className="text-[15px] font-bold text-on-surface">Infrastructure</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-outline block mb-1 uppercase tracking-widest">LOCATION</span>
              <span className="text-[15px] font-bold text-on-surface">District 4 - Westview</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-outline block mb-1 uppercase tracking-widest">PRIORITY</span>
              <span className="text-[15px] font-bold text-error">High Urgency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress & Team Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
        <div className="md:col-span-8 bg-white border border-outline-variant rounded-xl p-8 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-primary">Resolution Timeline</h3>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">EST. COMPLETION: OCT 28</span>
          </div>
          
          <div className="relative pt-2">
            {/* Timeline track */}
            <div className="absolute top-[8px] left-0 w-full h-[3px] bg-surface-container rounded-full"></div>
            <div className="absolute top-[8px] left-0 w-[66%] h-[3px] bg-primary rounded-full shadow-sm"></div>
            
            <div className="flex items-start justify-between w-full px-1">
              <TimelineStep active label="Reported" />
              <TimelineStep active label="Assessed" />
              <TimelineStep active label="In Progress" />
              <TimelineStep active={false} label="Resolved" />
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-primary text-white rounded-xl p-8 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 text-white/5 group-hover:scale-110 transition-transform duration-700">
            <ClipboardList className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-bold text-primary-fixed-dim uppercase tracking-widest">Overall Status</span>
            <h2 className="text-3xl font-bold mt-2 tracking-tight">65% Processed</h2>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex -space-x-3">
              <Avatar src="https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=100" />
              <Avatar src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" />
            </div>
            <span className="text-[10px] font-bold text-primary-fixed uppercase tracking-wider">2 Assignees</span>
          </div>
        </div>
      </section>

      {/* Detailed Action Items */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-primary">Action Items</h3>
        </div>

        {/* Action Card 1: Completed */}
        <ActionCard 
          status="Completed" 
          statusColor="bg-green-100 text-green-800"
          type="inspection"
          title="Site Inspection & Hazard Marking"
          description="Safety team dispatched to mark the pothole with high-visibility cones and verify the light pole number."
          steps={[
            { label: 'Hazard cones deployed', time: 'OCT 14, 09:15 AM', completed: true },
            { label: 'Verification photos uploaded', time: 'OCT 14, 10:45 AM', completed: true }
          ]}
        />

        {/* Action Card 2: In Progress */}
        <ActionCard 
          status="In Progress" 
          statusColor="bg-blue-100 text-blue-800"
          type="repair"
          title="Pothole Filling & Surface Leveling"
          description="Road repair crew scheduled for asphalt pouring and steam rolling to restore road integrity."
          isHighlighted
          steps={[
            { label: 'Work order assigned to Crew Bravo', time: 'OCT 16, 02:00 PM', completed: true },
            { label: 'Asphalt leveling', time: 'PENDING', completed: false }
          ]}
        />

        {/* Action Card 3: Not Started */}
        <ActionCard 
          status="Not Started" 
          statusColor="bg-surface-container text-outline"
          type="electrical"
          title="Electrical Repair for Light Pole SL-402"
          description="Electrician team to replace the faulty bulb and inspect the ballast for the flickering street light."
          isMuted
          scheduleInfo="SCHEDULED FOR OCT 20"
        />
      </section>
    </motion.div>
  );
}

function TimelineStep({ active, label }: { active: boolean, label: string }) {
  return (
    <div className="flex flex-col items-center flex-1 first:items-start last:items-end">
      <div className={`w-4 h-4 rounded-full border-4 border-white shadow-md relative z-10 ${
        active ? 'bg-primary ring-2 ring-primary/20' : 'bg-surface-dim'
      }`}></div>
      <span className={`text-[10px] font-bold mt-4 tracking-widest uppercase ${
        active ? 'text-primary' : 'text-outline'
      }`}>{label}</span>
    </div>
  );
}

function Avatar({ src }: { src: string }) {
  return (
    <div className="w-10 h-10 rounded-full border-2 border-primary bg-surface overflow-hidden hover:scale-110 transition-transform cursor-pointer">
      <img src={src} className="w-full h-full object-cover" alt="Team avatar" />
    </div>
  );
}

function ActionCard({ 
  status, 
  statusColor, 
  type, 
  title, 
  description, 
  steps, 
  isHighlighted = false, 
  isMuted = false,
  scheduleInfo
}: any) {
  const Icon = type === 'inspection' ? CheckCircle : type === 'repair' ? Hammer : Lightbulb;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
      isHighlighted ? 'border-l-4 border-l-primary border-outline' : 'border-outline-variant hover:border-primary/50'
    } ${isMuted ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <div className="p-8 flex flex-col md:flex-row items-start gap-8">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm ${
          status === 'Completed' ? 'bg-green-50 text-green-700' : 
          status === 'In Progress' ? 'bg-primary text-white' : 'bg-surface-container text-outline'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-grow w-full">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <h4 className="text-lg font-bold text-on-surface">{title}</h4>
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${statusColor}`}>{status}</span>
          </div>
          <p className="text-on-surface-variant mb-8 max-w-3xl leading-relaxed text-[15px]">{description}</p>
          
          {steps && (
            <div className="border-l-2 border-surface-container ml-2 pl-8 space-y-6">
              {steps.map((step: any, i: number) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    step.completed ? 'bg-green-600' : 'bg-surface-dim ring-2 ring-white'
                  }`}></div>
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <span className={`text-sm font-bold tracking-tight ${step.completed ? 'text-on-surface' : 'text-outline font-medium'}`}>{step.label}</span>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {scheduleInfo && (
            <div className="flex items-center text-outline gap-2 mt-2">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{scheduleInfo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RefreshCwIcon(props: any) {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
