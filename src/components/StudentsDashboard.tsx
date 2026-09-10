import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  User, 
  FileText, 
  Sparkles, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  Eye,
  BookOpen,
  Info,
  Clock
} from 'lucide-react';
import { Student, RiskLevel } from '../types';

interface StudentsDashboardProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onNewStudent: () => void;
  onOpenCrisisModal: () => void;
}

export const StudentsDashboard: React.FC<StudentsDashboardProps> = ({
  students,
  onSelectStudent,
  onEditStudent,
  onNewStudent,
  onOpenCrisisModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('todos');
  const [filterGrade, setFilterGrade] = useState<string>('todas');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.classRoom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.academic.reportedDifficulties.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRisk = filterRisk === 'todos' || student.calculatedRisk === filterRisk;
    const matchesGrade = filterGrade === 'todas' || student.grade === filterGrade;

    return matchesSearch && matchesRisk && matchesGrade;
  });

  const criticalCount = students.filter(s => s.calculatedRisk === 'critico').length;
  const highCount = students.filter(s => s.calculatedRisk === 'alto').length;
  const moderateCount = students.filter(s => s.calculatedRisk === 'moderado').length;
  const dropPerformanceCount = students.filter(s => s.academic.trend === 'Queda Abrupta' || s.academic.trend === 'Em Queda').length;

  const gradesList = Array.from(new Set(students.map(s => s.grade)));

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'critico':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
            Alerta Crítico / Proteção Imediata
          </span>
        );
      case 'alto':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Vulnerabilidade Alta
          </span>
        );
      case 'moderado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Atenção Psicopedagógica
          </span>
        );
      case 'baixo':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Acompanhamento Preventivo
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Educational Welcome & Fast Early Signs Alert Box */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-xs font-bold tracking-wide uppercase">
              <Eye className="w-3.5 h-3.5 text-amber-700" />
              Observatório do Educador
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-['Outfit',sans-serif]">
              O Olhar Atento do Professor Salva Vidas e Desbloqueia Aprendizagens
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Muitas vezes a dificuldade escolar esconde um sofrimento emocional profundo, e a queda súbita nas notas é o primeiro pedido de socorro silencioso. Este painel permite cruzar dados pedagógicos com sinais socioemocionais para intervir antes que a crise se agrave.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={onNewStudent}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <User className="w-4 h-4" />
              Cadastrar / Avaliar Estudante
            </button>
            <button
              onClick={onOpenCrisisModal}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              Guia Rápido CVV 188
            </button>
          </div>
        </div>

        {/* 4 Crucial Warning Signs Pills */}
        <div className="mt-5 pt-4 border-t border-amber-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">1</div>
            <div>
              <p className="font-bold text-slate-800">Queda Abrupta de Notas</p>
              <p className="text-slate-500">De 8,0 para 4,0 sem motivo aparente ou perda total de interesse em tarefas.</p>
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-bold">2</div>
            <div>
              <p className="font-bold text-slate-800">Falas de Desesperança</p>
              <p className="text-slate-500">"Queria sumir", "Sou um fardo", "Logo não estarei aqui", mensagens em margens de provas.</p>
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 font-bold">3</div>
            <div>
              <p className="font-bold text-slate-800">Isolamento Súbito</p>
              <p className="text-slate-500">Recusa do recreio, almoça sozinho, fones desligados, abandono de amizades habituais.</p>
            </div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">4</div>
            <div>
              <p className="font-bold text-slate-800">Mudanças Físicas</p>
              <p className="text-slate-500">Mangas compridas no calor intenso, doação de pertences queridos, cansaço extremo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Counters Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Alunos</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{students.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Em acompanhamento</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Risco Crítico / Alto</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-red-700 mt-1">{criticalCount + highCount}</p>
            <p className="text-xs text-red-500 mt-0.5">Requerem acolhimento hoje</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Dificuldade Moderada</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1">{moderateCount}</p>
            <p className="text-xs text-amber-500 mt-0.5">Adaptação PEI recomendada</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Desempenho em Queda</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{dropPerformanceCount}</p>
            <p className="text-xs text-slate-400 mt-0.5">Sinalizador de alerta</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-rose-500" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, turma ou dificuldade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Filtros:
          </div>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="todos">Todos os Níveis de Risco</option>
            <option value="critico">Risco Crítico</option>
            <option value="alto">Vulnerabilidade Alta</option>
            <option value="moderado">Atenção Moderada</option>
            <option value="baixo">Acompanhamento Preventivo</option>
          </select>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="todas">Todas as Séries</option>
            {gradesList.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => {
          const hasCriticalSignals = student.earlyWarning.hopelessnessExpressions || 
            student.earlyWarning.givingAwayPossessions ||
            student.earlyWarning.morbidContent ||
            student.earlyWarning.isolationSigns;

          return (
            <div
              key={student.id}
              className={`bg-white rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                student.calculatedRisk === 'critico'
                  ? 'border-red-300 ring-1 ring-red-200'
                  : student.calculatedRisk === 'alto'
                  ? 'border-rose-200'
                  : student.calculatedRisk === 'moderado'
                  ? 'border-amber-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Card top */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${student.avatarColor} text-white font-extrabold flex items-center justify-center text-sm shadow-xs`}>
                      {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base leading-snug">
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {student.grade} • {student.classRoom} ({student.age} anos)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Level Badge */}
                <div>
                  {getRiskBadge(student.calculatedRisk)}
                </div>

                {/* Academic Snapshot */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl text-center text-xs">
                  <div>
                    <p className="text-slate-400 font-medium">Média Geral</p>
                    <p className={`font-extrabold text-sm ${
                      student.academic.recentAverage < 6 ? 'text-rose-600' : 'text-slate-800'
                    }`}>
                      {student.academic.recentAverage.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Tendência</p>
                    <div className="flex items-center justify-center gap-1 font-bold text-slate-700">
                      {student.academic.trend === 'Melhorando' ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      ) : student.academic.trend.includes('Queda') ? (
                        <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                      ) : null}
                      <span className="text-[11px] truncate">{student.academic.trend}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Faltas Recentes</p>
                    <p className={`font-bold ${student.academic.absences > 10 ? 'text-amber-700' : 'text-slate-700'}`}>
                      {student.academic.absences} dias
                    </p>
                  </div>
                </div>

                {/* Reported Learning Difficulties */}
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Dificuldades Pedagógicas:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {student.academic.reportedDifficulties.map((diff, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                      >
                        {diff}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Socioemotional Alert Highlights */}
                {hasCriticalSignals && (
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-800 space-y-1">
                    <p className="font-bold flex items-center gap-1 text-[11px]">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                      Sinais de Alerta Registrados:
                    </p>
                    <p className="text-[11px] text-rose-700 line-clamp-2 italic">
                      "{student.socioemotional.teacherNotes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onEditStudent(student)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Atualizar Triagem
                </button>

                <button
                  onClick={() => onSelectStudent(student)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700 font-semibold text-xs shadow-xs transition-all"
                >
                  <span>Ver Parecer & PEI</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Nenhum estudante encontrado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Não foram localizados registros com os critérios de busca selecionados. Tente ajustar os filtros ou cadastre um novo aluno.
            </p>
            <button
              onClick={onNewStudent}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <User className="w-4 h-4" />
              Novo Rastreio Psicopedagógico
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
