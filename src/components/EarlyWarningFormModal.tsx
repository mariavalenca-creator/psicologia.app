import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  BookOpen,
  Heart,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Student, RiskLevel, EarlyWarningForm, AcademicData, SocioemotionalIndicators } from '../types';

interface EarlyWarningFormModalProps {
  studentToEdit?: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveStudent: (student: Student, generateAIReport: boolean) => Promise<void>;
}

export const EarlyWarningFormModal: React.FC<EarlyWarningFormModalProps> = ({
  studentToEdit,
  isOpen,
  onClose,
  onSaveStudent,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(studentToEdit?.name || '');
  const [age, setAge] = useState(studentToEdit?.age || 13);
  const [grade, setGrade] = useState(studentToEdit?.grade || '8º Ano');
  const [classRoom, setClassRoom] = useState(studentToEdit?.classRoom || 'Turma 801');

  // Academic State
  const [recentAverage, setRecentAverage] = useState<number>(studentToEdit?.academic.recentAverage ?? 7.0);
  const [trend, setTrend] = useState<AcademicData['trend']>(studentToEdit?.academic.trend || 'Estável');
  const [absences, setAbsences] = useState<number>(studentToEdit?.academic.absences ?? 2);
  const [assignmentSubmissionRate, setAssignmentSubmissionRate] = useState<number>(studentToEdit?.academic.assignmentSubmissionRate ?? 80);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    studentToEdit?.academic.reportedDifficulties || ['Atenção & Organização']
  );
  const [customDiff, setCustomDiff] = useState('');

  // Socioemotional State
  const [predominantMood, setPredominantMood] = useState<SocioemotionalIndicators['predominantMood']>(
    studentToEdit?.socioemotional.predominantMood || 'Neutro'
  );
  const [peerInteraction, setPeerInteraction] = useState<SocioemotionalIndicators['peerInteraction']>(
    studentToEdit?.socioemotional.peerInteraction || 'Sociável'
  );
  const [frustrationTolerance, setFrustrationTolerance] = useState<SocioemotionalIndicators['frustrationTolerance']>(
    studentToEdit?.socioemotional.frustrationTolerance || 'Média'
  );
  const [classroomEngagement, setClassroomEngagement] = useState<SocioemotionalIndicators['classroomEngagement']>(
    studentToEdit?.socioemotional.classroomEngagement || 'Médio'
  );
  const [teacherNotes, setTeacherNotes] = useState(studentToEdit?.socioemotional.teacherNotes || '');

  // Early Warning Checklist
  const [isolationSigns, setIsolationSigns] = useState(studentToEdit?.earlyWarning.isolationSigns || false);
  const [isolationSignsDetails, setIsolationSignsDetails] = useState(studentToEdit?.earlyWarning.isolationSignsDetails || '');
  const [suddenPerformanceDrop, setSuddenPerformanceDrop] = useState(studentToEdit?.earlyWarning.suddenPerformanceDrop || false);
  const [hopelessnessExpressions, setHopelessnessExpressions] = useState(studentToEdit?.earlyWarning.hopelessnessExpressions || false);
  const [hopelessnessExpressionsText, setHopelessnessExpressionsText] = useState(studentToEdit?.earlyWarning.hopelessnessExpressionsText || '');
  const [behaviorDrasticChange, setBehaviorDrasticChange] = useState(studentToEdit?.earlyWarning.behaviorDrasticChange || false);
  const [behaviorChangeDetails, setBehaviorChangeDetails] = useState(studentToEdit?.earlyWarning.behaviorChangeDetails || '');
  const [givingAwayPossessions, setGivingAwayPossessions] = useState(studentToEdit?.earlyWarning.givingAwayPossessions || false);
  const [morbidContent, setMorbidContent] = useState(studentToEdit?.earlyWarning.morbidContent || false);
  const [extremeSelfCriticism, setExtremeSelfCriticism] = useState(studentToEdit?.earlyWarning.extremeSelfCriticism || false);
  const [frequentAcheComplaints, setFrequentAcheComplaints] = useState(studentToEdit?.earlyWarning.frequentAcheComplaints || false);
  const [bullyingHistory, setBullyingHistory] = useState(studentToEdit?.earlyWarning.bullyingHistory || false);
  const [evaluatorRole, setEvaluatorRole] = useState<EarlyWarningForm['evaluatorRole']>(
    studentToEdit?.earlyWarning.evaluatorRole || 'Professor Regente'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Common pedagogical difficulties options
  const difficultyOptions = [
    'Leitura & Decodificação (Dislexia)',
    'Ortografia & Escrita (Disgrafia)',
    'Raciocínio Lógico & Cálculo (Discalculia)',
    'Atenção & Desorganização (TDAH)',
    'Lentidão no Processamento',
    'Bloqueio Emocional / Ansiedade de Prova',
    'Desmotivação Generalizada',
    'Dificuldade de Interpretação Textual',
  ];

  const toggleDifficulty = (diff: string) => {
    if (selectedDifficulties.includes(diff)) {
      setSelectedDifficulties(selectedDifficulties.filter(d => d !== diff));
    } else {
      setSelectedDifficulties([...selectedDifficulties, diff]);
    }
  };

  const handleAddCustomDifficulty = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDiff.trim() && !selectedDifficulties.includes(customDiff.trim())) {
      setSelectedDifficulties([...selectedDifficulties, customDiff.trim()]);
      setCustomDiff('');
    }
  };

  // Calculate projected risk in real time
  const calculateRisk = (): RiskLevel => {
    if (givingAwayPossessions || (hopelessnessExpressions && morbidContent) || (hopelessnessExpressions && behaviorDrasticChange)) {
      return 'critico';
    }
    if (hopelessnessExpressions || behaviorDrasticChange || (isolationSigns && suddenPerformanceDrop)) {
      return 'alto';
    }
    if (isolationSigns || suddenPerformanceDrop || bullyingHistory || recentAverage < 5.0 || trend === 'Em Queda') {
      return 'moderado';
    }
    return 'baixo';
  };

  const projectedRisk = calculateRisk();

  const handleSave = async (generateAI: boolean) => {
    if (!name.trim()) {
      alert('Por favor, informe o nome do estudante.');
      return;
    }

    setIsSubmitting(true);
    try {
      const studentData: Student = {
        id: studentToEdit?.id || `std-${Date.now()}`,
        name: name.trim(),
        age: Number(age),
        grade,
        classRoom,
        calculatedRisk: projectedRisk,
        avatarColor: studentToEdit?.avatarColor || (
          projectedRisk === 'critico' ? 'from-amber-400 to-rose-500' :
          projectedRisk === 'alto' ? 'from-rose-400 to-red-500' :
          projectedRisk === 'moderado' ? 'from-amber-400 to-orange-500' :
          'from-emerald-400 to-teal-500'
        ),
        academic: {
          recentAverage: Number(recentAverage),
          trend,
          absences: Number(absences),
          assignmentSubmissionRate: Number(assignmentSubmissionRate),
          reportedDifficulties: selectedDifficulties,
          notesHistory: studentToEdit?.academic.notesHistory || [
            { date: 'Recente', subject: 'Média Geral', score: Number(recentAverage) }
          ],
        },
        socioemotional: {
          predominantMood,
          peerInteraction,
          frustrationTolerance,
          classroomEngagement,
          teacherNotes: teacherNotes.trim(),
        },
        earlyWarning: {
          isolationSigns,
          isolationSignsDetails: isolationSignsDetails.trim(),
          suddenPerformanceDrop,
          hopelessnessExpressions,
          hopelessnessExpressionsText: hopelessnessExpressionsText.trim(),
          behaviorDrasticChange,
          behaviorChangeDetails: behaviorChangeDetails.trim(),
          givingAwayPossessions,
          morbidContent,
          extremeSelfCriticism,
          frequentAcheComplaints,
          bullyingHistory,
          dateFilled: new Date().toISOString().split('T')[0],
          evaluatorRole,
        },
        lastReport: studentToEdit?.lastReport,
        activeProtocols: studentToEdit?.activeProtocols || (
          projectedRisk === 'critico' ? ['Acolhimento Prioritário', 'Protocolo de Emergência 188'] :
          projectedRisk === 'alto' ? ['Intervenção Socioemocional', 'Contato com Família'] :
          projectedRisk === 'moderado' ? ['Plano Individualizado (PEI)'] :
          ['Monitoramento Pedagógico']
        ),
      };

      await onSaveStudent(studentData, generateAI);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 max-w-3xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 p-5 sm:p-6 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Instrumento de Rastreio Psicopedagógico
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif]">
              {studentToEdit ? `Atualizar Rastreio: ${studentToEdit.name}` : 'Novo Rastreio de Sinais & Aprendizagem'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-50">
              Coleta de dados de desempenho acadêmico, indicadores socioemocionais e sinais de alerta precoce
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Tab Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 1 ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Identificação & Desempenho</span>
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 2 ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Socioemocional em Sala</span>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeStep === 3 ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]">3</span>
              <span>Sinais de Alerta & Prevenção</span>
            </button>
          </div>

          {/* Real-time calculated risk indicator pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Classificação Prévia:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs uppercase ${
              projectedRisk === 'critico' ? 'bg-red-100 text-red-700' :
              projectedRisk === 'alto' ? 'bg-rose-100 text-rose-700' :
              projectedRisk === 'moderado' ? 'bg-amber-100 text-amber-800' :
              'bg-emerald-100 text-emerald-800'
            }`}>
              {projectedRisk}
            </span>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* STEP 1: Dados do Aluno & Desempenho */}
          {activeStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Dados de Identificação & Histórico Escolar
                </h3>
                <p className="text-xs text-slate-500">
                  Preencha as informações do estudante para cruzamento com o perfil de aprendizagem.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo ou Código do Estudante *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Lucas Silva Mendes"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Idade (anos)</label>
                    <input
                      type="number"
                      min={5}
                      max={20}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Série / Ano</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="6º Ano">6º Ano</option>
                      <option value="7º Ano">7º Ano</option>
                      <option value="8º Ano">8º Ano</option>
                      <option value="9º Ano">9º Ano</option>
                      <option value="1º Ano EM">1º Ano EM</option>
                      <option value="2º Ano EM">2º Ano EM</option>
                      <option value="3º Ano EM">3º Ano EM</option>
                      <option value="Ensino Fundamental I">Ensino Fundamental I</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Turma / Período</label>
                  <input
                    type="text"
                    value={classRoom}
                    onChange={(e) => setClassRoom(e.target.value)}
                    placeholder="Ex: Turma 802 (Matutino)"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seu Papel Avaliador</label>
                  <select
                    value={evaluatorRole}
                    onChange={(e) => setEvaluatorRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Professor Regente">Professor Regente</option>
                    <option value="Coordenador Pedagógico">Coordenador Pedagógico</option>
                    <option value="Orientador Educacional">Orientador Educacional</option>
                    <option value="Psicopedagogo">Psicopedagogo</option>
                  </select>
                </div>
              </div>

              {/* Indicadores Acadêmicos Quantitativos */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-sm text-slate-800 mb-3">
                  Indicadores de Desempenho & Frequência
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Média Recente (0 a 10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={recentAverage}
                      onChange={(e) => setRecentAverage(Number(e.target.value))}
                      className="w-full font-bold text-lg px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Tendência de Desempenho
                    </label>
                    <select
                      value={trend}
                      onChange={(e) => setTrend(e.target.value as any)}
                      className="w-full font-bold text-xs py-2 px-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Estável">Estável</option>
                      <option value="Melhorando">Melhorando</option>
                      <option value="Em Queda">Em Queda Lenta</option>
                      <option value="Queda Abrupta">⚠️ Queda Abrupta (Alerta)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Faltas no Último Bimestre
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={absences}
                      onChange={(e) => setAbsences(Number(e.target.value))}
                      className="w-full font-bold text-lg px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Dificuldades de Aprendizagem Identificadas */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Dificuldades de Aprendizagem Observadas em Sala:
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {difficultyOptions.map((diff) => (
                    <button
                      type="button"
                      key={diff}
                      onClick={() => toggleDifficulty(diff)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                        selectedDifficulties.includes(diff)
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAddCustomDifficulty} className="flex gap-2">
                  <input
                    type="text"
                    value={customDiff}
                    onChange={(e) => setCustomDiff(e.target.value)}
                    placeholder="Adicionar outra dificuldade específica..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
                  >
                    + Adicionar
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 2: Indicadores Socioemocionais */}
          {activeStep === 2 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-teal-600" />
                  Mapeamento Socioemocional e Comportamental em Sala
                </h3>
                <p className="text-xs text-slate-500">
                  Como o estudante se comporta nos 50 minutos de aula, durante trabalhos em equipe e nos intervalos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Humor Predominante Observado
                  </label>
                  <select
                    value={predominantMood}
                    onChange={(e) => setPredominantMood(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Alegre/Participativo">Alegre / Participativo</option>
                    <option value="Neutro">Neutro / Tranquilo</option>
                    <option value="Cabisbaixo/Triste">Cabisbaixo / Triste / Choro Frequente</option>
                    <option value="Ansioso/Irritável">Ansioso / Irritável / Inquieto</option>
                    <option value="Apatia/Letargia">Apatia Total / Letargia / Cabeça na mesa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Interação com os Colegas (Pares)
                  </label>
                  <select
                    value={peerInteraction}
                    onChange={(e) => setPeerInteraction(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Sociável">Sociável / Integrado ao grupo</option>
                    <option value="Poucos amigos">Círculo restrito / 1 ou 2 amigos</option>
                    <option value="Isolado/Evita contato">Isolado / Evita ativamente contato</option>
                    <option value="Alvo de zombarias/exclusão">Alvo de zombarias / Exclusão velada (Bullying)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tolerância à Frustração e ao Erro
                  </label>
                  <select
                    value={frustrationTolerance}
                    onChange={(e) => setFrustrationTolerance(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Alta">Alta (Lida bem com correções)</option>
                    <option value="Média">Média (Fica chateado, mas retoma)</option>
                    <option value="Baixa">Baixa (Desiste na primeira tentativa)</option>
                    <option value="Reação de choro ou explosão">Crítica (Choro intenso, raiva ou amassa a folha)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nível de Engajamento nas Tarefas
                  </label>
                  <select
                    value={classroomEngagement}
                    onChange={(e) => setClassroomEngagement(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="Alto">Alto (Realiza as tarefas com autonomia)</option>
                    <option value="Médio">Médio (Precisa de incentivo do professor)</option>
                    <option value="Baixo">Baixo (Demora para começar, não conclui)</option>
                    <option value="Completamente desengajado">Desengajamento Total (Não abre o material)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas Qualitativas do Educador (Comportamentos específicos, falas ou episódios)
                </label>
                <textarea
                  rows={4}
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Ex: No último mês, o estudante deixou de conversar com os colegas no recreio. Quando errou uma questão de português, começou a chorar baixinho dizendo que nada que faz presta..."
                  className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Formulário de Identificação Precoce & Prevenção ao Suicídio */}
          {activeStep === 3 && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                      Rastreio de Sinais de Sofrimento Extremo & Ideação (Prevenção ao Suicídio)
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Estes indicadores são baseados em protocolos internacionais de saúde mental escolar. Marque qualquer alteração recente observada.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {/* 1. Falas de Desesperança */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-rose-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hopelessnessExpressions}
                      onChange={(e) => setHopelessnessExpressions(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="text-rose-600 font-extrabold">⚠️ ALERTA:</span>
                        Expressões de Desesperança, Fim ou Não Pertencimento
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Falas como "queria sumir", "sou um fardo para minha família", "não aguento mais", "ninguém vai sentir minha falta", bilhetes em cadernos.
                      </p>
                      {hopelessnessExpressions && (
                        <input
                          type="text"
                          value={hopelessnessExpressionsText}
                          onChange={(e) => setHopelessnessExpressionsText(e.target.value)}
                          placeholder="Qual frase ou situação específica foi dita ou escrita?"
                          className="mt-2 w-full px-3 py-1.5 text-xs bg-rose-50/50 border border-rose-200 rounded-lg text-rose-900"
                        />
                      )}
                    </div>
                  </label>
                </div>

                {/* 2. Roupas em calor ou alterações corporais */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-rose-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={behaviorDrasticChange}
                      onChange={(e) => setBehaviorDrasticChange(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="text-rose-600 font-extrabold">⚠️ ALERTA:</span>
                        Uso de Roupas Longas no Calor / Indícios de Autolesão
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Casacos pesados ou mangas compridas em dias de calor intenso para ocultar braços/pernas, machucados frequentes sem explicação plausível.
                      </p>
                      {behaviorDrasticChange && (
                        <input
                          type="text"
                          value={behaviorChangeDetails}
                          onChange={(e) => setBehaviorChangeDetails(e.target.value)}
                          placeholder="Detalhes observados (ex: casaco com 32°C, curativos frequentes no punho)..."
                          className="mt-2 w-full px-3 py-1.5 text-xs bg-rose-50/50 border border-rose-200 rounded-lg text-rose-900"
                        />
                      )}
                    </div>
                  </label>
                </div>

                {/* 3. Doação de pertences */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-rose-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={givingAwayPossessions}
                      onChange={(e) => setGivingAwayPossessions(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="text-rose-600 font-extrabold">⚠️ ALERTA CRÍTICO:</span>
                        Doação Súbita de Pertences Queridos ou Despedidas Formais
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Começou a dar objetos afetivos (jogos, pulseiras, livros, desenhos) para colegas como "lembrança", ou mensagens de despedida emotivas.
                      </p>
                    </div>
                  </label>
                </div>

                {/* 4. Isolamento Social Agudo */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-amber-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isolationSigns}
                      onChange={(e) => setIsolationSigns(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Isolamento Social Progressivo ou Súbito
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Antes interagia e agora fica no canto do pátio, não almoça, evita conversas e rejeita trabalhos em grupo.
                      </p>
                      {isolationSigns && (
                        <input
                          type="text"
                          value={isolationSignsDetails}
                          onChange={(e) => setIsolationSignsDetails(e.target.value)}
                          placeholder="Onde o estudante costuma ficar isolado?"
                          className="mt-2 w-full px-3 py-1.5 text-xs bg-amber-50/50 border border-amber-200 rounded-lg text-amber-900"
                        />
                      )}
                    </div>
                  </label>
                </div>

                {/* 5. Queda Abrupta no Rendimento */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-amber-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={suddenPerformanceDrop}
                      onChange={(e) => setSuddenPerformanceDrop(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Queda Abrupta no Rendimento Escolar
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Queda drástica de notas em semanas, esquecimento recorrente de provas, caderno em branco.
                      </p>
                    </div>
                  </label>
                </div>

                {/* 6. Desenhos / Redações com Conteúdo Mórbido */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-slate-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={morbidContent}
                      onChange={(e) => setMorbidContent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-slate-700 focus:ring-slate-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Conteúdo de Desenhos ou Textos com Temas de Morte / Destruição
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Redações com desesperança recorrente, rabiscos agressivos, desenhos de figuras machucadas ou sepultadas.
                      </p>
                    </div>
                  </label>
                </div>

                {/* 7. Autocrítica Punitiva */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-slate-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={extremeSelfCriticism}
                      onChange={(e) => setExtremeSelfCriticism(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-slate-700 focus:ring-slate-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Autocrítica Punitiva / Perfeccionismo Destrutivo
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Choro ou pânico ao tirar nota 8,0 ou errar uma questão; crença de que qualquer erro é uma catástrofe irreparável.
                      </p>
                    </div>
                  </label>
                </div>

                {/* 8. Queixas Psicossomáticas */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-slate-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={frequentAcheComplaints}
                      onChange={(e) => setFrequentAcheComplaints(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-slate-700 focus:ring-slate-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Queixas Físicas Frequentes sem Causa Médica
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dores de cabeça ou estômago constantes para ir à enfermaria ou voltar para casa nos dias de avaliação.
                      </p>
                    </div>
                  </label>
                </div>

                {/* 9. Bullying */}
                <div className="p-4 rounded-2xl border transition-colors bg-white hover:border-slate-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bullyingHistory}
                      onChange={(e) => setBullyingHistory(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-slate-700 focus:ring-slate-500 border-slate-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">
                        Vítima de Bullying / Zombaria Constante
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Apelidos pejorativos por conta do desempenho escolar, peso, aparência ou trejeitos.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Actions & Step Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev - 1) as any)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Voltar
              </button>
            )}

            {activeStep < 3 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev + 1) as any)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors"
              >
                Próxima Etapa
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white transition-colors"
            >
              Salvar Dados
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave(true)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando Parecer...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Salvar & Gerar Parecer com IA
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
