import React, { useState, useEffect, useRef } from 'react';
import { Info, Camera, Paperclip, MapPin, Lightbulb, CheckCircle, BarChart3, Loader2, Send, Mic, MicOff, RefreshCw, Shield, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
// Using a DIV icon or a direct URL to avoid build path issues
const customIcon = L.divIcon({
  html: `<div class="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full"></div>
         </div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface NewComplaintProps {
  onAnalyze: (text: string) => void;
  isLoading?: boolean;
}

function LocationMarker({ position, setPosition, onLocationChange }: { 
  position: [number, number] | null, 
  setPosition: (pos: [number, number] | null) => void,
  onLocationChange: (lat: number, lng: number) => void 
}) {
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      onLocationChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (!position) {
      map.locate().on("locationfound", function (e) {
        const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        onLocationChange(e.latlng.lat, e.latlng.lng);
        map.flyTo(e.latlng, map.getZoom());
      });
    }
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon} draggable={true} eventHandlers={{
      dragend: (e) => {
        const marker = e.target;
        const pos = marker.getLatLng();
        setPosition([pos.lat, pos.lng]);
        onLocationChange(pos.lat, pos.lng);
      }
    }} />
  );
}

// Component to handle map view updates from external changes
function MapViewSetter({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16);
    }
  }, [center, map]);
  return null;
}

function MapComponent({ center, onLocationChange }: { 
  center: [number, number] | null,
  onLocationChange: (lat: number, lng: number) => void 
}) {
  const [position, setPosition] = useState<[number, number] | null>(center);

  // Sync internal position with external center prop (from search)
  useEffect(() => {
    if (center) {
      setPosition(center);
    }
  }, [center]);

  return (
    <MapContainer 
      center={center || [20, 78]} 
      zoom={center ? 16 : 5} 
      scrollWheelZoom={true} 
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewSetter center={center} />
      <LocationMarker position={position} setPosition={setPosition} onLocationChange={onLocationChange} />
    </MapContainer>
  );
}

import { useTranslation } from '../../contexts/LanguageContext';

export default function NewComplaint({ onAnalyze, isLoading = false }: NewComplaintProps) {
  const { t, n } = useTranslation();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [attachments, setAttachments] = useState<{ id: string; file: File; type: 'photo' | 'document'; preview?: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'document') => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        type,
        preview: type === 'photo' ? URL.createObjectURL(file) : undefined
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const filtered = prev.filter(a => a.id !== id);
      // Clean up memory from object URLs
      const removed = prev.find(a => a.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = navigator.language || 'en-US';

      recog.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setText((prev) => prev + (prev ? ' ' : '') + finalTranscript);
        }
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recog);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognition.stop();
    } else {
      setIsRecording(true);
      recognition.start();
    }
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCoords: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCoords);
        setLocation({ lat: newCoords[0], lng: newCoords[1] });
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      alert("Could not reach the search service. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-4 max-w-[1200px] mx-auto min-h-screen relative"
    >
      {isLoading && (
        <div className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-xl font-bold text-primary animate-pulse">{t('complaint.analysis_loading')}</p>
          <p className="text-on-surface-variant mt-2 text-center max-w-xs">
            {t('complaint.analysis_desc')}
          </p>
        </div>
      )}

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-primary mb-3">{t('complaint.title')}</h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {t('complaint.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Input Form */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg shadow-sm relative">
            <label className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 block">{t('complaint.label')}</label>
            <div className="relative">
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className={`w-full h-64 p-4 pr-14 border bg-transparent rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-base resize-none transition-all outline-none disabled:opacity-50 ${isRecording ? 'border-primary ring-1 ring-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]' : 'border-outline'}`} 
                placeholder={t('complaint.placeholder')}
              />
              <div className="absolute right-3 bottom-3 flex flex-col gap-2">
                <button 
                  type="button"
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className={`p-2 rounded-lg transition-all active:scale-90 ${isRecording ? 'bg-error text-white animate-pulse' : 'bg-surface-container text-primary hover:bg-surface-container-high'}`}
                  title={isRecording ? "Stop Voice Input" : "Start Voice Input"}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleAnalyze}
                  disabled={!text.trim() || isLoading || isRecording}
                  className="p-2 bg-primary text-primary-fixed-dim rounded-lg hover:bg-primary-container disabled:opacity-30 transition-all active:scale-90"
                  title="Finish and Analyze"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-2 right-6 px-3 py-1 bg-error/10 text-error rounded-full flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-error rounded-full animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t('complaint.listening')}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-4 flex items-center gap-2 text-on-surface-variant">
              <Info className="w-5 h-5" />
              <p className="text-sm font-medium">{t('complaint.info')}</p>
            </div>
          </div>

          {/* Attachment Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <input 
              type="file" 
              hidden 
              ref={photoInputRef} 
              accept="image/*" 
              multiple
              onChange={(e) => handleFileChange(e, 'photo')} 
            />
            <button 
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="aspect-square bg-surface-container border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 rounded-lg hover:bg-surface-container-high transition-colors text-primary group"
            >
              <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold">{t('complaint.add_photo')}</span>
            </button>
            
            {/* ... other code */}

            <AnimatePresence initial={false}>
              {attachments.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="aspect-square bg-surface-dim/30 border border-outline-variant rounded-lg relative group overflow-hidden"
                >
                  {item.preview ? (
                    <img className="w-full h-full object-cover" src={item.preview} alt="Attachment" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                      <Paperclip className="w-8 h-8 text-primary mb-1" />
                      <span className="text-[8px] text-on-surface-variant font-bold truncate w-full px-1">{item.file.name}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => removeAttachment(item.id)}
                    className="absolute top-1 right-1 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <Info className="w-3 h-3 rotate-45" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <input 
              type="file" 
              hidden 
              ref={fileInputRef} 
              multiple
              onChange={(e) => handleFileChange(e, 'document')} 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-surface-container border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 rounded-lg hover:bg-surface-container-high transition-colors text-primary group"
            >
              <Paperclip className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold">{t('complaint.attach_file')}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Guidelines & Context */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-primary text-white p-6 rounded-lg shadow-md border-t-4 border-primary-fixed">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 fill-primary-fixed text-primary-fixed" />
              {t('complaint.tips')}
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-primary-fixed flex-shrink-0" />
                {t('complaint.tip1')}
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-primary-fixed flex-shrink-0" />
                {t('complaint.tip2')}
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-primary-fixed flex-shrink-0" />
                {t('complaint.tip3')}
              </li>
            </ul>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{t('complaint.pin_location')}</span>
              <MapPin className="w-5 h-5 text-primary" />
            </div>

            <div className="relative mb-3">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                placeholder={t('complaint.search_placeholder')}
                className="w-full pl-10 pr-12 py-2.5 bg-surface-container-lowest border border-outline rounded-xl text-sm focus:border-primary outline-none transition-all shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <button 
                type="button"
                onClick={handleSearchLocation}
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:bg-primary-container disabled:opacity-50 transition-all active:scale-95"
              >
                {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </button>
            </div>

            <div className="h-64 bg-surface-dim rounded-2xl mb-4 overflow-hidden relative border border-outline-variant shadow-inner">
              <MapComponent 
                center={mapCenter}
                onLocationChange={(lat, lng) => setLocation({ lat, lng })} 
              />
            </div>
            <p className="text-sm text-on-surface-variant leading-tight">
              {location 
                ? `${t('complaint.pinned')}${n(location.lat.toFixed(4))}, ${n(location.lng.toFixed(4))}`
                : t('complaint.locating')
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-outline-variant pt-8">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-error animate-pulse"></span>
          <span className="text-xs font-bold text-error uppercase tracking-widest">{t('complaint.auto_save')}</span>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-8 py-3 font-bold text-[11px] uppercase tracking-wider border border-outline text-primary rounded-lg hover:bg-surface-container transition-colors">
            {t('complaint.save_draft')}
          </button>
          <button 
            onClick={onAnalyze}
            className="flex-1 sm:flex-none px-10 py-3 bg-primary text-white font-bold text-[11px] uppercase tracking-wider rounded-lg shadow hover:bg-primary-container transition-all flex items-center justify-center gap-2"
          >
            {t('complaint.analyze_btn')}
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
