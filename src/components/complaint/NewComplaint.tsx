import { Info, Camera, Paperclip, MapPin, Lightbulb, CheckCircle, BarChart3, Save } from 'lucide-react';
import { motion } from 'motion/react';

interface NewComplaintProps {
  onAnalyze: () => void;
}

export default function NewComplaint({ onAnalyze }: NewComplaintProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-4 max-w-[1200px] mx-auto min-h-screen"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-primary mb-3">Submit New Complaint</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Detail the civic issue you've encountered. Our AI-driven system will analyze your input to categorize and prioritize it for government action.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Input Form */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-outline-variant p-6 rounded-lg shadow-sm">
            <label className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 block">COMPLAINT DESCRIPTION</label>
            <textarea 
              className="w-full h-64 p-4 border border-outline bg-transparent rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-base resize-none transition-all outline-none" 
              placeholder="Please describe the issue in detail. Include specific locations, timestamps, and the impact on the community. For example: 'Large pothole at the intersection of 5th and Main, causing traffic delays and vehicle damage...'"
            />
            <div className="mt-4 flex items-center gap-2 text-on-surface-variant">
              <Info className="w-5 h-5" />
              <p className="text-sm font-medium">Clear, descriptive text helps speed up the resolution process.</p>
            </div>
          </div>

          {/* Attachment Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="aspect-square bg-surface-container border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 rounded-lg hover:bg-surface-container-high transition-colors text-primary group">
              <Camera className="w-8 h-8" />
              <span className="text-[10px] font-bold">ADD PHOTO</span>
            </button>
            
            <div className="aspect-square bg-surface-dim/30 border border-outline-variant rounded-lg relative group overflow-hidden">
              <img 
                className="w-full h-full object-cover grayscale opacity-50" 
                src="https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=300"
                alt="Draft attachment"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <RefreshCwIcon className="w-8 h-8 text-white animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <button className="aspect-square bg-surface-container border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 rounded-lg hover:bg-surface-container-high transition-colors text-primary group">
              <Paperclip className="w-8 h-8" />
              <span className="text-[10px] font-bold">ATTACH FILE</span>
            </button>
          </div>
        </div>

        {/* Right Side: Guidelines & Context */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-primary text-white p-6 rounded-lg shadow-md border-t-4 border-primary-fixed">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 fill-primary-fixed text-primary-fixed" />
              Pro Tips
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-primary-fixed flex-shrink-0" />
                Mention nearby landmarks or street numbers.
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-primary-fixed flex-shrink-0" />
                Specify how long the issue has been persisting.
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-primary-fixed flex-shrink-0" />
                Attach multiple angles for physical infrastructure issues.
              </li>
            </ul>
          </div>

          <div className="bg-white border border-outline-variant p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">PIN LOCATION</span>
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="h-40 bg-surface-dim rounded-lg mb-4 overflow-hidden relative">
              <img 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=400"
                alt="Map"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg animate-bounce"></div>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant leading-tight">Defaulting to current GPS location. Tap to adjust pinpoint.</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-outline-variant pt-8">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-error animate-pulse"></span>
          <span className="text-xs font-bold text-error uppercase tracking-widest">Draft Auto-Saved</span>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-8 py-3 font-bold text-[11px] uppercase tracking-wider border border-outline text-primary rounded-lg hover:bg-surface-container transition-colors">
            SAVE DRAFT
          </button>
          <button 
            onClick={onAnalyze}
            className="flex-1 sm:flex-none px-10 py-3 bg-primary text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow hover:bg-primary-container transition-all flex items-center justify-center gap-2"
          >
            ANALYZE COMPLAINT
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
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
