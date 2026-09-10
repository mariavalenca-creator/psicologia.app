import React from 'react';
import { 
  HeartHandshake, 
  ShieldAlert, 
  Sparkles, 
  UserPlus, 
  GraduationCap, 
  AlertTriangle,
  FileSpreadsheet,
  BookOpenCheck,
  LifeBuoy
} from 'lucide-react';
import { Student } from '../types';

interface HeaderProps {
  students: Student[];
  currentTab: 'dashboard' | 'form' | 'activities' | 'interventions' | 'crisis';
  onSelectTab: (tab: 'dashboard' | 'form' | 'activities' | 'interventions' | 'crisis') => void;
  onOpenNewStudent: () => void;
  onOpenCrisisModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  students,
  currentTab,
  onSelectTab,
  onOpenNewStudent,
  onOpenCrisisModal,
}) => {
  const criticalCount = students.filter(s => s.calculatedRisk === 'critico' || s.calculatedRisk === 'alto').length;
  const moderateCount = students.filter(s => s.calculatedRisk === 'moderado').length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      {/* Top emergency banner for educators */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-blue-700 text-white px-4 py-1.5 text-xs sm:text-sm font-medium shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>
              <strong>Sentinela da Vida Escolar:</strong> Prevenção ao suicídio e acolhimento socioemocional em sala de aula.
            </span>
          </div>
          <button
            onClick={onOpenCrisisModal}
            className="inline-flex items-center gap-1.5 bg-white text-blue-900 hover:text-red-600 px-2.5 py-0.5 rounded-full font-bold text-xs hover:bg-blue-50 transition-colors shadow-xs"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-red-600" />
            Protocolo de Crise (CVV 188)
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/15">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight font-['Outfit',sans-serif]">
                Acolher & Aprender
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Psicologia Educacional
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Mapeamento de dificuldades de aprendizagem e rastreio precoce de sinais de risco
            </p>
          </div>
        </div>

        {/* Action badges and quick button */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {criticalCount > 0 && (
            <div 
              onClick={() => onSelectTab('dashboard')}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
              title="Alunos em atenção crítica ou alta"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>{criticalCount} em Alerta Prioritário</span>
            </div>
          )}

          {moderateCount > 0 && (
            <div 
              onClick={() => onSelectTab('dashboard')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{moderateCount} com Dificuldade Moderada</span>
            </div>
          )}

          <button
            onClick={onOpenNewStudent}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Rastreio</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 pt-1 pb-2">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-amber-100/70 text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            Painel da Turma & Triagem
          </button>

          <button
            onClick={() => onSelectTab('activities')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'activities'
                ? 'bg-emerald-100/70 text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            Bateria de Atividades Pedagógicas
          </button>

          <button
            onClick={() => onSelectTab('interventions')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'interventions'
                ? 'bg-teal-100/70 text-teal-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpenCheck className="w-4 h-4 text-teal-600" />
            Estratégias de Intervenção (PEI)
          </button>

          <button
            onClick={() => onSelectTab('crisis')}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'crisis'
                ? 'bg-rose-100/70 text-rose-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Protocolo de Crise & Acolhimento
          </button>
        </nav>
      </div>
    </header>
  );
};
