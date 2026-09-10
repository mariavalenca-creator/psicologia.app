import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartHandshake, 
  Sparkles, 
  GraduationCap, 
  ShieldAlert, 
  Heart, 
  BookOpen, 
  ArrowRight, 
  Flame, 
  CheckCircle2,
  LifeBuoy,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
  isOpen: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter, isOpen }) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset progress whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setProgress(0);
    }
  }, [isOpen]);

  // Handle countdown progress
  useEffect(() => {
    if (!isOpen || isPaused) return;

    if (progress >= 100) {
      const timer = setTimeout(() => {
        onEnter();
      }, 100);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.25;
        return next >= 100 ? 100 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, progress, onEnter]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="splash-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 sm:p-6 bg-slate-950 text-white select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
        {/* Animated Background Mesh & Colorful Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Vibrant Red Blob */}
          <motion.div 
            animate={{ 
              x: [-40, 40, -40],
              y: [-30, 30, -30],
              scale: [1, 1.25, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -left-24 w-96 sm:w-[540px] h-96 sm:h-[540px] rounded-full bg-gradient-to-br from-red-600/50 via-rose-600/35 to-transparent blur-3xl"
          />

          {/* Vibrant Royal Blue Blob */}
          <motion.div 
            animate={{ 
              x: [40, -40, 40],
              y: [30, -30, 30],
              scale: [1.1, 0.9, 1.1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-24 -right-24 w-96 sm:w-[580px] h-96 sm:h-[580px] rounded-full bg-gradient-to-tl from-blue-600/50 via-indigo-600/40 to-transparent blur-3xl"
          />

          {/* Central Violet & Magenta Flare */}
          <motion.div 
            animate={{ 
              scale: [0.9, 1.15, 0.9],
              opacity: [0.35, 0.6, 0.35],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-blue-500/30 blur-3xl"
          />

          {/* Subtle Golden Amber Accent */}
          <motion.div 
            animate={{ 
              y: [-20, 20, -20],
              opacity: [0.2, 0.45, 0.2],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl"
          />

          {/* Floating animated sparkles & decorative icons */}
          <div className="absolute inset-0 opacity-40">
            {[
              { icon: Sparkles, color: 'text-amber-300', top: '15%', left: '12%', delay: 0.2 },
              { icon: Heart, color: 'text-rose-400', top: '22%', right: '15%', delay: 0.5 },
              { icon: GraduationCap, color: 'text-blue-300', bottom: '20%', left: '18%', delay: 0.8 },
              { icon: BookOpen, color: 'text-emerald-300', bottom: '25%', right: '16%', delay: 0.4 },
              { icon: LifeBuoy, color: 'text-red-400', top: '65%', left: '8%', delay: 0.6 },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 0, opacity: 0 }}
                animate={{ 
                  y: [-12, 12, -12],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 5 + idx, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: item.delay 
                }}
                style={{ position: 'absolute', top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
                className={`${item.color} hidden sm:block pointer-events-none`}
              >
                <item.icon className="w-8 h-8" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Card Content Container */}
        <motion.div 
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl w-full my-auto bg-slate-900/80 backdrop-blur-2xl rounded-3xl sm:rounded-[36px] border border-white/15 p-6 sm:p-10 shadow-2xl shadow-blue-950/70 text-center overflow-hidden"
        >
          {/* Dynamic Top Glow Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-rose-500 via-amber-400 to-blue-500" />

          {/* Animated Central Emblem with Red-Blue Ring Pulses */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-6">
            {/* Outer Pulsing Ring Red */}
            <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-3xl bg-red-500/30 blur-sm"
            />
            {/* Outer Pulsing Ring Blue */}
            <motion.div 
              animate={{ 
                scale: [1, 1.25, 1],
                opacity: [0.6, 0.1, 0.6]
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute -inset-2 rounded-3xl border border-blue-400/40"
            />

            {/* Core Icon Box */}
            <motion.div 
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-blue-700 p-0.5 shadow-xl shadow-red-600/30 flex items-center justify-center relative"
            >
              <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-slate-950/40 backdrop-blur-xs flex items-center justify-center">
                <HeartHandshake className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-md" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 shadow-md">
                <Sparkles className="w-4 h-4 fill-slate-950" />
              </div>
            </motion.div>
          </div>

          {/* Header Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-500/20 via-blue-500/20 to-purple-500/20 border border-white/20 text-xs sm:text-sm font-bold text-white mb-3"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span className="bg-gradient-to-r from-rose-300 via-white to-blue-200 bg-clip-text text-transparent uppercase tracking-wider text-[11px] sm:text-xs">
              Plataforma Escolar de Apoio à Vida & Aprendizagem
            </span>
          </motion.div>

          {/* Main Display Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-5xl font-black font-['Outfit',sans-serif] tracking-tight leading-tight mb-3"
          >
            <span className="bg-gradient-to-r from-red-400 via-rose-300 via-blue-300 to-blue-500 bg-clip-text text-transparent">
              Acolher & Aprender
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-6 font-medium"
          >
            Psicologia Educacional aplicada à sala de aula: identificação precoce de dificuldades cognitivas, acolhimento do sofrimento psíquico e prevenção ao suicídio escolar.
          </motion.p>

          {/* 4 Interactive Feature Highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6 text-left"
          >
            <div className="p-3 rounded-2xl bg-white/5 border border-red-500/30 hover:bg-red-500/10 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-1.5">
                <Heart className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-white leading-snug">Prevenção 188</p>
              <p className="text-[10px] text-slate-400">Rastreio de risco e acolhimento imediato</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-blue-500/30 hover:bg-blue-500/10 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-white leading-snug">Investigação</p>
              <p className="text-[10px] text-slate-400">Atividades para dislexia, TDAH e cálculo</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-amber-500/30 hover:bg-amber-500/10 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-white leading-snug">Parecer com IA</p>
              <p className="text-[10px] text-slate-400">Geração de PEI e andaimagem escolar</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="font-bold text-xs text-white leading-snug">Rede Protetiva</p>
              <p className="text-[10px] text-slate-400">Aliança ética com a família e CAPSij</p>
            </div>
          </motion.div>

          {/* Action Bar & Animated Progress Line */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 pt-2 border-t border-white/10"
          >
            {/* Countdown / Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  {isPaused ? 'Pausa (mova o mouse para retomar)' : 'Iniciando painel pedagógico...'}
                </span>
                <span className="font-mono text-slate-300 font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-500 via-rose-500 via-amber-400 to-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onEnter}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 hover:shadow-red-900/40 transition-all hover:scale-[1.03] active:scale-[0.98] group"
              >
                <span>Acessar Painel Agora</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onEnter}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Pular Introdução
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Em conformidade com as diretrizes do CVV e da Lei 13.935/2019 de Psicologia Escolar.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};
