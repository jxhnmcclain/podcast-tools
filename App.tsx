
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Settings, Check, Zap, ZapOff, ArrowRight, Mic2, X } from 'lucide-react';
import { INITIAL_TIME, PODCAST_POINTS, DEFAULT_SEGMENT_DURATION } from './constants';
import { PodcastPoint } from './types';

/**
 * TransitionOverlay Component
 * Sequence:
 * 1. Black Background appears with Previous Segment title.
 * 2. After 2 seconds, title slides out to the left.
 * 3. New segment title slides in from the right (moving left).
 * 4. Shows "Nuevo Segmento" (top) and "Segmento Anterior" (bottom).
 */
const TransitionOverlay: React.FC<{ 
  prevPoint: PodcastPoint | null; 
  nextPoint: PodcastPoint | null; 
  active: boolean; 
}> = ({ prevPoint, nextPoint, active }) => {
  const [phase, setPhase] = useState<'showing-prev' | 'transitioning-out' | 'transitioning-in' | 'showing-next'>('showing-prev');

  useEffect(() => {
    if (active) {
      setPhase('showing-prev');
      const t1 = setTimeout(() => setPhase('transitioning-out'), 2000);
      const t2 = setTimeout(() => setPhase('transitioning-in'), 2600);
      const t3 = setTimeout(() => setPhase('showing-next'), 3200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [active, nextPoint?.id]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in overflow-hidden">
      <div className="text-center px-12 relative w-full max-w-5xl flex flex-col items-center">
        
        {/* Top Label: Nuevo Segmento */}
        <div className={`mb-16 transition-all duration-700 h-6 ${phase === 'showing-next' || phase === 'transitioning-in' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <span className="text-white/40 text-xs font-black tracking-[1.5em] uppercase border-b border-white/20 pb-2">Segmento Actual</span>
        </div>

        {/* Main Title Stage */}
        <div className="h-64 flex items-center justify-center relative w-full overflow-hidden">
          {/* Phase 1 & 2: Show Previous then Slide Out */}
          {(phase === 'showing-prev' || phase === 'transitioning-out') && (
             <h1 className={`text-[#F5F2ED] text-6xl md:text-8xl font-black tracking-tighter leading-none select-none ${phase === 'transitioning-out' ? 'animate-slide-left-out' : ''}`}>
               {prevPoint?.title || "Inicio"}
             </h1>
          )}

          {/* Phase 3 & 4: Slide In New then Stay */}
          {(phase === 'transitioning-in' || phase === 'showing-next') && (
             <h1 className={`text-[#F5F2ED] text-6xl md:text-8xl font-black tracking-tighter leading-none select-none ${phase === 'transitioning-in' ? 'animate-slide-left-in' : ''}`}>
               {nextPoint?.title}
             </h1>
          )}
        </div>

        {/* Bottom Metadata Label: Segmento Anterior */}
        <div className={`mt-16 transition-all duration-1000 flex flex-col items-center gap-6 ${phase === 'showing-next' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/20 text-[10px] font-black tracking-[0.6em] uppercase">Segmento Anterior</span>
            <span className="text-white/60 text-xl font-serif italic">{prevPoint?.title || "N/A"}</span>
          </div>
          
          {nextPoint?.speaker && (
             <div className="mt-4 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white/40 text-[10px] font-black tracking-[0.4em] uppercase">
               Locución: {nextPoint.speaker}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Navbar Component
const Navbar: React.FC = () => (
  <nav className="h-16 flex items-center justify-between px-12 border-b border-black/5 bg-[#F5F2ED] z-50 animate-slide-down-in shrink-0">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-[#F5F2ED]">
        <Mic2 size={16} />
      </div>
      <span className="text-xs font-black tracking-widest uppercase">Prompter Studio</span>
    </div>
    <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span>En Vivo</span>
      </div>
    </div>
  </nav>
);

// Free Tools Form
const ToolsForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="p-12 border-t border-black/5 bg-black/5 animate-slide-up-in">
      <div className="max-w-2xl">
        <h3 className="text-2xl font-black tracking-tight mb-2">Más herramientas para tu Podcast.</h3>
        <p className="text-sm font-light opacity-60 mb-8 max-w-md">Únete a nuestra lista para recibir scripts, prompts de IA y plantillas cada semana.</p>
        
        {submitted ? (
          <div className="flex items-center gap-3 text-sm font-bold text-green-700">
            <Check size={20} /> ¡Te hemos enviado el acceso!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input 
              type="email" 
              required
              placeholder="Tu mejor email"
              className="flex-1 minimal-input text-lg font-light italic bg-transparent"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit" className="p-4 bg-black text-[#F5F2ED] rounded-full hover:scale-105 transition-transform">
              <ArrowRight size={20} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Time Input Helper
const TimeInputGroup: React.FC<{ 
  seconds: number, 
  onChange: (totalSecs: number) => void 
}> = ({ seconds, onChange }) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const handleChange = (type: 'h' | 'm' | 's', val: string) => {
    const v = parseInt(val) || 0;
    if (type === 'h') onChange(v * 3600 + m * 60 + s);
    if (type === 'm') onChange(h * 3600 + v * 60 + s);
    if (type === 's') onChange(h * 3600 + m * 60 + v);
  };

  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-black/5 shadow-sm">
      <div className="flex flex-col items-center">
        <span className="text-[7px] font-black opacity-30 uppercase">Hora</span>
        <input type="number" className="bg-transparent w-5 text-center text-[11px] font-black outline-none" value={h} onChange={e => handleChange('h', e.target.value)} />
      </div>
      <span className="opacity-10 text-xs">:</span>
      <div className="flex flex-col items-center">
        <span className="text-[7px] font-black opacity-30 uppercase">Min</span>
        <input type="number" className="bg-transparent w-5 text-center text-[11px] font-black outline-none" value={m} onChange={e => handleChange('m', e.target.value)} />
      </div>
      <span className="opacity-10 text-xs">:</span>
      <div className="flex flex-col items-center">
        <span className="text-[7px] font-black opacity-30 uppercase">Seg</span>
        <input type="number" className="bg-transparent w-5 text-center text-[11px] font-black outline-none" value={s} onChange={e => handleChange('s', e.target.value)} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [points, setPoints] = useState<PodcastPoint[]>(PODCAST_POINTS);
  const [activePointIndex, setActivePointIndex] = useState(0);
  const [prevPointIndex, setPrevPointIndex] = useState<number | null>(null);
  const [isGlobalRunning, setIsGlobalRunning] = useState(false);
  const [globalTimeLeft, setGlobalTimeLeft] = useState(INITIAL_TIME);
  const [segmentTimeLeft, setSegmentTimeLeft] = useState(PODCAST_POINTS[0].durationSeconds);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const triggerTransition = useCallback((nextIndex: number) => {
    setPrevPointIndex(activePointIndex);
    setShowTransition(true);
    
    // Sequence timing:
    // 2.0s showing previous
    // 0.6s sliding out
    // 0.6s sliding in new
    // 2.0s showing new + labels
    // Total: ~5.2s
    
    // We update the local state index just after the slide-out phase (around 2.6s)
    setTimeout(() => {
      setActivePointIndex(nextIndex);
      const nextDuration = isTestMode ? 10 : (points[nextIndex]?.durationSeconds || DEFAULT_SEGMENT_DURATION);
      setSegmentTimeLeft(nextDuration);
      
      // Close overlay after user sees the new segment info
      setTimeout(() => {
        setShowTransition(false);
      }, 2600); 
    }, 2600);
  }, [activePointIndex, points, isTestMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) return;
      if (e.key === 'ArrowDown') {
        if (activePointIndex < points.length - 1) triggerTransition(activePointIndex + 1);
      } else if (e.key === 'ArrowUp') {
        if (activePointIndex > 0) triggerTransition(activePointIndex - 1);
      } else if (e.key === ' ') {
        setIsGlobalRunning(prev => !prev);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePointIndex, points.length, isEditing, triggerTransition]);

  useEffect(() => {
    let interval: number;
    if (isGlobalRunning) {
      interval = window.setInterval(() => {
        setGlobalTimeLeft(prev => Math.max(0, prev - 1));
        setSegmentTimeLeft(prev => {
          if (prev <= 1) {
            if (activePointIndex < points.length - 1) {
              triggerTransition(activePointIndex + 1);
            } else {
              setIsGlobalRunning(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGlobalRunning, activePointIndex, points.length, triggerTransition]);

  useEffect(() => {
    if (scrollContainerRef.current && !isEditing) {
      const activeElement = scrollContainerRef.current.children[activePointIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activePointIndex, isEditing]);

  const addPoint = () => {
    const newPoint: PodcastPoint = {
      id: Date.now().toString(),
      title: "Nuevo Segmento",
      speaker: "",
      durationSeconds: DEFAULT_SEGMENT_DURATION
    };
    setPoints([...points, newPoint]);
  };

  const removePoint = (id: string) => {
    setPoints(points.filter(p => p.id !== id));
  };

  const updatePoint = (id: string, updates: Partial<PodcastPoint>) => {
    setPoints(points.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleTestMode = () => {
    const newMode = !isTestMode;
    setIsTestMode(newMode);
    setSegmentTimeLeft(newMode ? 10 : points[activePointIndex].durationSeconds);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F5F2ED] text-[#1A1A1A] overflow-hidden">
      
      <TransitionOverlay 
        prevPoint={prevPointIndex !== null ? points[prevPointIndex] : null} 
        nextPoint={points[activePointIndex]} 
        active={showTransition} 
      />
      
      <Navbar />

      <main className="flex flex-1 overflow-hidden relative">
        {/* Left: Timer Panel */}
        <section className="w-5/12 h-full flex flex-col border-r border-black/5 bg-[#F5F2ED] z-10 animate-slide-up-in">
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="w-full max-w-xs mb-10">
               <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30">Bloque Actual</span>
                  <span className={`text-4xl font-black tabular-nums transition-colors duration-500 ${isTestMode ? 'text-red-500' : ''}`}>
                    {formatTime(segmentTimeLeft)}
                  </span>
               </div>
               <div className="h-1 bg-black/5 w-full overflow-hidden rounded-full">
                  <div 
                    className="h-full bg-black transition-all duration-1000 ease-linear" 
                    style={{ width: `${(segmentTimeLeft / (isTestMode ? 10 : (points[activePointIndex]?.durationSeconds || 1))) * 100}%` }}
                  />
               </div>
            </div>

            <div className="timer-display font-black tracking-tighter tabular-nums select-none opacity-90 text-center w-full truncate px-4">
              {formatTime(globalTimeLeft)}
            </div>
            <div className="mt-8 text-[9px] font-black tracking-[0.6em] uppercase opacity-20">Total Session Time</div>
          </div>

          <div className="h-40 border-t border-black/5 flex items-center justify-center gap-8 px-6 shrink-0">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-4 rounded-full border transition-all duration-500 ${isEditing ? 'bg-black text-[#F5F2ED] scale-110' : 'border-black/5 hover:bg-black/5'}`}
            >
              {isEditing ? <Check size={24} /> : <Settings size={24} />}
            </button>
            
            <button 
              onClick={() => setIsGlobalRunning(!isGlobalRunning)}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
                isGlobalRunning ? 'bg-black text-[#F5F2ED] scale-105' : 'bg-transparent border-2 border-black text-black hover:bg-black/5'
              }`}
            >
              {isGlobalRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
            </button>

            <button 
              onClick={toggleTestMode}
              className={`p-4 rounded-full border transition-all duration-500 ${isTestMode ? 'bg-red-500 text-white' : 'border-black/5 opacity-40 hover:opacity-100'}`}
              title="Prueba Rápida"
            >
              {isTestMode ? <ZapOff size={24} /> : <Zap size={24} />}
            </button>

            <button 
              onClick={() => { setGlobalTimeLeft(INITIAL_TIME); setIsGlobalRunning(false); setSegmentTimeLeft(points[0].durationSeconds); setActivePointIndex(0); }}
              className="p-4 rounded-full border border-black/5 hover:bg-black/5 transition-all duration-500"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </section>

        {/* Right: Content Panel */}
        <section className="w-7/12 h-full flex flex-col relative overflow-hidden bg-white/10">
          {isEditing ? (
            <div className="flex-1 overflow-y-auto p-12 bg-black/[0.02] animate-fade-in">
              <div className="max-w-2xl mx-auto space-y-4 pb-20">
                <header className="mb-10">
                  <h2 className="text-4xl font-black tracking-tight mb-2">Editor de Escaleta</h2>
                  <p className="opacity-40 text-xs font-light italic">Configura tus bloques y tiempos antes de empezar.</p>
                </header>
                {points.map((p, idx) => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 flex items-center gap-6 group transition-all hover:shadow-lg">
                    <span className="text-xl font-black opacity-10 font-serif italic w-6">{idx + 1}</span>
                    <div className="flex-1 space-y-3">
                      <input 
                        className="w-full bg-transparent text-2xl font-black outline-none minimal-input" 
                        value={p.title} 
                        onChange={e => updatePoint(p.id, { title: e.target.value })}
                      />
                      <div className="flex items-center gap-4">
                        <input 
                          className="bg-black/5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] w-36 outline-none" 
                          placeholder="Locutor/a" 
                          value={p.speaker} 
                          onChange={e => updatePoint(p.id, { speaker: e.target.value })}
                        />
                        <TimeInputGroup 
                          seconds={p.durationSeconds} 
                          onChange={val => updatePoint(p.id, { durationSeconds: val })} 
                        />
                      </div>
                    </div>
                    <button onClick={() => removePoint(p.id)} className="p-3 text-black/10 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addPoint}
                  className="w-full py-8 border-2 border-dashed border-black/5 rounded-3xl flex items-center justify-center gap-3 text-black/20 hover:text-black hover:border-black/20 transition-all font-black uppercase tracking-[0.4em] text-[9px]"
                >
                  <Plus size={18} /> Añadir Bloque
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto no-scrollbar scroll-smooth py-[45vh] px-12 animate-fade-in"
              >
                {points.map((point, index) => {
                  const isActive = index === activePointIndex;
                  return (
                    <div 
                      key={point.id}
                      onClick={() => triggerTransition(index)}
                      className={`relative py-24 px-12 border-b border-black/5 transition-all duration-700 cursor-pointer rounded-[3rem] mb-6 overflow-hidden ${
                        isActive 
                          ? 'bg-black text-[#F5F2ED] shadow-2xl scale-[1.05] z-10' 
                          : 'opacity-10 grayscale hover:opacity-25'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-12 items-baseline">
                          <span className={`text-4xl font-black font-serif italic ${isActive ? 'text-white/10' : ''}`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <h2 className={`text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] max-w-xl select-none transition-transform duration-700 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-50'}`}>
                            {point.title}
                          </h2>
                        </div>
                      </div>
                      <div className="mt-12 flex items-center gap-8">
                        {point.speaker && (
                          <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-6 py-3 border rounded-full ${isActive ? 'border-white/20 bg-white/5 text-white' : 'border-black/10'}`}>
                            {point.speaker}
                          </span>
                        )}
                        <span className={`text-xl font-light tabular-nums font-serif italic ${isActive ? 'opacity-40' : 'opacity-10'}`}>
                          {formatTime(point.durationSeconds)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <ToolsForm />
            </div>
          )}
        </section>
      </main>

      {/* Frame Aesthetic */}
      <div className="fixed inset-0 pointer-events-none border-[24px] border-[#F5F2ED] z-[150]" />
    </div>
  );
};

export default App;
