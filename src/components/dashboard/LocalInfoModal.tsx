import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, MapPin, Shield, Flame, Landmark, Info, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

interface LocalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocalInfoModal({ isOpen, onClose }: LocalInfoModalProps) {
  const { t, n } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    setIsRegistering(true);
    setTimeout(() => {
      setIsRegistering(false);
      setIsRegistered(true);
    }, 2000);
  };

  const emergencyContacts = [
    {
      name: t('emergency.central.name'),
      number: n("112"),
      icon: <Info className="w-5 h-5" />,
      color: "bg-red-50 text-red-600"
    },
    {
      name: t('emergency.police.name'),
      number: n("+91 11 2345 6789"),
      address: t('emergency.police.address').split(/(\d+)/).map(part => /\d+/.test(part) ? n(part) : part).join(''),
      icon: <Shield className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600"
    },
    {
      name: t('emergency.fire.name'),
      number: n("+91 11 9876 5432"),
      address: t('emergency.fire.address').split(/(\d+)/).map(part => /\d+/.test(part) ? n(part) : part).join(''),
      icon: <Flame className="w-5 h-5" />,
      color: "bg-orange-50 text-orange-600"
    },
    {
      name: t('emergency.helpline.name'),
      number: n("1800-456-7890"),
      address: t('emergency.helpline.address'),
      icon: <Landmark className="w-5 h-5" />,
      color: "bg-green-50 text-green-600"
    }
  ];

  const councilMeetings = [
    {
      title: t('meeting.town_hall'),
      date: `${t('month.may')} ${n('15')}, ${n('2026')}`,
      time: n("06:30 PM"),
      location: t('meeting.location.auditorium')
    },
    {
      title: t('meeting.waste'),
      date: `${t('month.may')} ${n('22')}, ${n('2026')}`,
      time: n("05:00 PM"),
      location: t('meeting.location.center')
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-surface-container-lowest z-[101] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-primary text-white">
              <div className="flex items-center gap-3">
                <Landmark className="w-6 h-6" />
                <h2 className="text-xl font-bold">{t('modal.resources')}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8">
              {/* Emergency Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {t('emergency.directory')}
                  </h3>
                  <span className="text-[10px] font-bold text-error border border-error px-2 py-0.5 rounded uppercase tracking-widest">{t('emergency.available')}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-4 rounded-xl border border-outline-variant hover:border-primary transition-colors bg-surface-container-lowest">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${contact.color}`}>
                          {contact.icon}
                        </div>
                        <h4 className="font-bold text-on-surface">{contact.name}</h4>
                      </div>
                      <div className="space-y-2">
                        <a href={`tel:${contact.number}`} className="flex items-center gap-2 text-primary font-bold hover:underline">
                          <Phone className="w-4 h-4" />
                          {contact.number}
                        </a>
                        {contact.address && (
                          <div className="flex items-start gap-2 text-on-surface-variant text-xs">
                            <MapPin className="w-4 h-4 shrink-0" />
                            <span>{contact.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Council Info */}
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Landmark className="w-5 h-5" />
                  {t('section.council')}
                </h3>
                <div className="bg-primary-container/10 p-5 rounded-xl border border-primary-container/20 space-y-4">
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {t('council.desc')}
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">{t('council.upcoming')}</h4>
                    {councilMeetings.map((meeting, index) => (
                      <div key={index} className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-on-surface">{meeting.title}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase font-medium">{meeting.date} • {meeting.time}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                          <MapPin className="w-3 h-3" />
                          {meeting.location}
                        </div>
                      </div>
                    ))}
                  </div>

                  {isRegistered ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex items-center justify-center gap-3 bg-green-500/10 text-green-500 py-4 rounded-xl border border-green-500/20"
                    >
                      <CheckCircle className="w-6 h-6" />
                      <div className="text-left">
                        <p className="font-bold text-sm">{t('success.registered')}</p>
                        <p className="text-[10px] uppercase tracking-wider font-medium opacity-80">{t('welcome.council')}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-70"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t('btn.processing')}
                        </>
                      ) : (
                        <>
                          {t('council.register')}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </section>

              {/* Official Links */}
              <section className="space-y-3">
                <h4 className="text-xs font-bold text-outline uppercase tracking-wider">{t('links.quick')}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="text-left p-3 rounded-lg border border-outline-variant text-xs font-semibold flex items-center justify-between hover:bg-surface-container transition-colors">
                    {t('links.gazette')}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </button>
                  <button className="text-left p-3 rounded-lg border border-outline-variant text-xs font-semibold flex items-center justify-between hover:bg-surface-container transition-colors">
                    {t('links.works')}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ArrowRight(props: any) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
