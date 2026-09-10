import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Printer, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  GraduationCap, 
  Heart, 
  ShieldAlert, 
  Clock, 
  Edit3, 
  Loader2,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { Student } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onGenerateAIReport: (student: Student) => Promise<void>;
  onOpenCrisisModal: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
  onGenerateAIReport,
  onOpenCrisisModal,
}) => {
  if (!isOpen || !student) return null;

  const [isGenerating, setIsGenerating] = useState(false);

  const handleRunAI = async () => {
    setIsGenerating(true);
    try {
      await onGenerateAIReport(student);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const report = student.lastReport;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none">
        {/* Header */}
        <div className={`p-6 text-white flex flex-wrap items-center justify-between gap-4 print:text-slate-900 print:bg-transparent ${
          student.calculatedRisk === 'critico' ? 'bg-gradient-to-r from-red-600 to-rose-700' :
          student.calculatedRisk === 'alto' ? 'bg-gradient-to-r from-rose-500 to-pink-600' :
          student.calculatedRisk === 'moderado' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
          'bg-gradient-to-r from-emerald-600 to-teal-700'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 text-white font-black text-xl flex items-center justify-center border border-white/30 shadow-inner">
              {student.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-['Outfit',sans-serif]">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white border border-white/25">
                  Risco {student.calculatedRisk}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/90">
                {student.grade} • {student.classRoom} • {student.age} anos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Imprimir / Exportar Parecer"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(student)}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              title="Editar Triagem"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Callout if Critical or High Risk */}
        {(student.calculatedRisk === 'critico' || student.calculatedRisk === 'alto') && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-rose-900 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 animate-bounce" />
              <p>
                <strong>Protocolo de Proteção Ativo:</strong> Estudante com sinais de sofrimento agudo. Nunca deixar desacompanhado(a) e acolher sem julgamento.
              </p>
            </div>
            <button
              onClick={onOpenCrisisModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Ver Protocolo CVV 188
            </button>
          </div>
        )}

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Quick Academic & Socioemotional Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Média Geral</span>
              <p className={`text-xl font-bold ${student.academic.recentAverage < 6 ? 'text-rose-600' : 'text-slate-800'}`}>
                {student.academic.recentAverage.toFixed(1)}
              </p>
              <span className="text-xs text-slate-500">{student.academic.trend}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Faltas Recentes</span>
              <p className="text-xl font-bold text-slate-800">{student.academic.absences} dias</p>
              <span className="text-xs text-slate-500">Último bimestre</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Humor em Sala</span>
              <p className="text-sm font-bold text-slate-800 truncate mt-1">{student.socioemotional.predominantMood}</p>
              <span className="text-xs text-slate-500">{student.socioemotional.classroomEngagement}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Convivência</span>
              <p className="text-sm font-bold text-slate-800 truncate mt-1">{student.socioemotional.peerInteraction}</p>
              <span className="text-xs text-slate-500">Tolerância: {student.socioemotional.frustrationTolerance}</span>
            </div>
          </div>

          {/* Dificuldades Mapeadas e Notas do Professor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Dificuldades Pedagógicas Registradas:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {student.academic.reportedDifficulties.map((diff, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-800 shadow-2xs">
                    {diff}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                Observação Qualitativa do Educador:
              </h4>
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "{student.socioemotional.teacherNotes || 'Nenhuma nota adicional cadastrada.'}"
              </p>
            </div>
          </div>

          {/* Sinais de Alerta Precoce Ativos */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Sinais de Alerta Precoce & Prevenção ao Suicídio Verificados:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className={`p-2 rounded-xl border flex items-center gap-2 ${student.earlyWarning.hopelessnessExpressions ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold' : 'bg-white/60 border-slate-200 text-slate-500'}`}>
                {student.earlyWarning.hopelessnessExpressions ? <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Falas de desesperança / fim: {student.earlyWarning.hopelessnessExpressions ? `"${student.earlyWarning.hopelessnessExpressionsText || 'Identificada'}"` : 'Não'}</span>
              </div>

              <div className={`p-2 rounded-xl border flex items-center gap-2 ${student.earlyWarning.behaviorDrasticChange ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold' : 'bg-white/60 border-slate-200 text-slate-500'}`}>
                {student.earlyWarning.behaviorDrasticChange ? <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Roupas longas no calor / autolesão: {student.earlyWarning.behaviorDrasticChange ? 'SIM' : 'Não'}</span>
              </div>

              <div className={`p-2 rounded-xl border flex items-center gap-2 ${student.earlyWarning.givingAwayPossessions ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold' : 'bg-white/60 border-slate-200 text-slate-500'}`}>
                {student.earlyWarning.givingAwayPossessions ? <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Doação de pertences queridos: {student.earlyWarning.givingAwayPossessions ? 'SIM' : 'Não'}</span>
              </div>

              <div className={`p-2 rounded-xl border flex items-center gap-2 ${student.earlyWarning.isolationSigns ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold' : 'bg-white/60 border-slate-200 text-slate-500'}`}>
                {student.earlyWarning.isolationSigns ? <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Isolamento social progressivo: {student.earlyWarning.isolationSigns ? 'SIM' : 'Não'}</span>
              </div>
            </div>
          </div>

          {/* PARECER PSICOPEDAGÓGICO E PLANO DE INTERVENÇÃO */}
          <div className="border-t border-slate-200 pt-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800 font-['Outfit',sans-serif] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Parecer Psicopedagógico & Plano de Intervenção (PEI)
                </h3>
                <p className="text-xs text-slate-500">
                  {report?.generatedAt ? `Elaborado em: ${report.generatedAt}` : 'Parecer técnico psicopedagógico integrado'}
                </p>
              </div>

              <button
                onClick={handleRunAI}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-[1.02] disabled:opacity-50 print:hidden"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando Parecer com Especialista IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Atualizar Análise com IA
                  </>
                )}
              </button>
            </div>

            {report ? (
              <div className="space-y-5">
                {/* Hipótese Psicopedagógica */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    1. Hipótese Diagnóstica & Articulação Psicopedagógica
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {report.psychopedagogicalHypothesis}
                  </p>
                </div>

                {/* Perfil da Dificuldade de Aprendizagem */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    2. Mapeamento da Dificuldade de Aprendizagem
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700">Área Central Afetada:</p>
                      <p className="text-emerald-700 font-semibold mt-0.5">{report.learningDifficultyProfile.primaryArea}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-700">Processamento Cognitivo:</p>
                      <p className="text-slate-600 mt-0.5">{report.learningDifficultyProfile.cognitiveAspects}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                    <p className="font-bold text-slate-700">Impacto Direto na Sala de Aula:</p>
                    <p className="text-slate-600 mt-0.5">{report.learningDifficultyProfile.classroomImpact}</p>
                  </div>
                </div>

                {/* Estratégias Pedagógicas em Sala (Andaimagem / PEI) */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    3. Estratégias de Intervenção Pedagógica (Plano de Sala)
                  </h4>
                  <div className="space-y-3">
                    {report.pedagogicalInterventions.map((interv, i) => (
                      <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-sm text-slate-800">{interv.title}</p>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                            Estratégia {i + 1}
                          </span>
                        </div>
                        <p className="text-slate-600"><strong>Objetivo:</strong> {interv.objective}</p>
                        <p className="text-slate-700 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                          <strong>Como o Professor Aplica:</strong> {interv.howToApplyInClass}
                        </p>
                        <p className="text-slate-500"><strong>Adaptações Curriculares:</strong> {interv.adaptations}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estratégias Socioemocionais (O que Falar / Evitar) */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-600" />
                    4. Postura do Educador & Acolhimento Socioemocional
                  </h4>
                  <div className="space-y-3">
                    {report.socioemotionalInterventions.map((socio, i) => (
                      <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                        <p className="font-bold text-sm text-slate-800">{socio.action}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                            <span className="font-bold block text-[11px] uppercase text-emerald-800">Postura Recomendada:</span>
                            {socio.approach}
                          </div>
                          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900">
                            <span className="font-bold block text-[11px] uppercase text-rose-800">O que NUNCA dizer/fazer:</span>
                            {socio.avoid}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Protocolo Institucional e Rede de Apoio */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      5. Encaminhamento Institucional & Parceria com a Família
                    </h4>
                    <span className="px-2.5 py-0.5 bg-amber-200 text-amber-900 font-bold rounded-full text-[11px]">
                      Urgência: {report.institutionalProtocol.urgency}
                    </span>
                  </div>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                    {report.institutionalProtocol.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                  <p className="pt-2 border-t border-amber-200 font-medium text-amber-900">
                    <strong>Diretriz de Segurança:</strong> {report.institutionalProtocol.crisisGuidelines}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <p className="text-sm text-slate-600">
                  Nenhum parecer técnico foi gerado ainda para este estudante.
                </p>
                <button
                  onClick={handleRunAI}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Gerar Parecer & Estratégias com IA
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 font-medium">
            Confidencialidade Pedagógica Escolar • Acolher & Aprender
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Fechar Visualização
          </button>
        </div>
      </div>
    </div>
  );
};
