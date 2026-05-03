import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, Save, ArrowLeft, Shield, Mail, CheckCircle2, Loader2, Trash2, LogOut } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface ProfilePageProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  onBack: () => void;
}

export default function ProfilePage({ user, onUpdateUser, onLogout, onBack }: ProfilePageProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("Permission denied")) {
        setCameraError("Camera access was denied. Please check your browser settings or try opening the app in a new tab.");
      } else {
        setCameraError("Could not access camera. Please ensure it's not being used by another application.");
      }
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setAvatar(canvas.toDataURL('image/png'));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const handleSave = () => {
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateUser({ ...user, name, avatar });
      setIsUpdating(false);
      onBack();
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-32 px-4 max-w-2xl mx-auto min-h-screen"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-surface-container rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-3xl font-bold text-primary">{t('profile.title')}</h1>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="h-32 bg-primary relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-surface-container shadow-lg">
                <img 
                  src={avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8 space-y-8">
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold text-primary hover:bg-surface-container transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              {t('profile.upload')}
            </button>
            <button 
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold text-primary hover:bg-surface-container transition-colors"
            >
              <Camera className="w-4 h-4" />
              {t('profile.take_photo')}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">{t('profile.full_name')}</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary outline-none transition-all font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">{t('profile.email')}</label>
              <div className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg opacity-60">
                <Mail className="w-4 h-4 text-outline" />
                <span className="font-medium">{user.email}</span>
                <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-outline-variant flex justify-end gap-4">
            <button 
              onClick={onBack}
              className="px-6 py-2 border border-outline text-primary font-bold text-sm rounded-lg hover:bg-surface-container transition-colors"
            >
              {t('profile.cancel')}
            </button>
            <button 
              onClick={handleSave}
              disabled={isUpdating}
              className="px-8 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary-container shadow-md flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {t('profile.save')}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-error/10 border border-error/20 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-error/20 text-error rounded-full flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-error">{t('profile.sign_out')}</h4>
            <p className="text-error/70 text-xs">{t('profile.sign_out_desc')}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-2 bg-error text-white font-bold text-sm rounded-lg hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          {t('profile.logout')}
        </button>
      </div>

      <div className="mt-8 p-6 bg-primary-container/10 border border-primary-container/20 rounded-xl flex items-start gap-4">
        <Shield className="w-6 h-6 text-primary flex-shrink-0" />
        <div>
          <h4 className="font-bold text-primary mb-1">{t('profile.identity_title')}</h4>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {t('profile.identity_desc')}
          </p>
        </div>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl"
            >
              <div className="p-4 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-bold text-primary">{t('profile.take_photo_modal')}</h3>
                <button onClick={stopCamera} className="p-2 border border-outline rounded-full"><Trash2 className="w-4 h-4"/></button>
              </div>
              <div className="aspect-video bg-black relative flex items-center justify-center">
                {cameraError ? (
                  <div className="p-8 text-center">
                    <Shield className="w-12 h-12 text-error mx-auto mb-4 opacity-50" />
                    <p className="text-white text-sm font-medium">{cameraError}</p>
                    <button 
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="mt-6 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all text-xs font-bold"
                    >
                      Open in New Tab
                    </button>
                  </div>
                ) : (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-white/20 pointer-events-none"></div>
                  </>
                )}
              </div>
              <div className="p-8 flex justify-center gap-4">
                <button 
                  onClick={stopCamera}
                  className="px-6 py-2 border border-outline text-primary font-bold rounded-lg"
                >
                  {cameraError ? 'Close' : t('profile.cancel')}
                </button>
                {!cameraError && (
                  <button 
                    onClick={takePhoto}
                    className="px-8 py-2 bg-primary text-white font-bold rounded-lg flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    {t('profile.capture')}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
