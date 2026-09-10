import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Printer, 
  PlusCircle, 
  Loader2,
  HelpCircle,
  Eye
} from 'lucide-react';
import { DiagnosticActivity } from '../types';
import { DIAGNOSTIC_ACTIVITIES } from '../data/mockData';

export const DiagnosticActivitiesView: React.FC = () => {
  const [activities, setActivities] = useState<DiagnosticActivity[]>(DIAGNOSTIC_ACTIVITIES);
  const [selectedArea, setSelectedArea] = useState<string>('todas');
  const [selectedActivity, setSelectedActivity] = useState<DiagnosticActivity>(DIAGNOSTIC_ACTIVITIES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Custom Activity form state
  const [customDiff, setCustomDiff] = useState('Leitura lenta com ansiedade de exposição');
  const [customSubject, setCustomSubject] = useState('Língua Portuguesa');
  const [customProfile, setCustomProfile] = useState('Estudante do 7º ano com bloqueio criativo e medo de errar');

  const filteredActivities = activities.filter(act => 
    selectedArea === 'todas' || act.targetArea === selectedArea
  );

  const handleGenerateCustomActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/psychopedagogy/generate-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDifficulty: customDiff,
          subjectArea: customSubject,
          studentProfile: customProfile,
        }),
      });
      const data = await res.json();
      if (data?.activity) {
        const newAct: DiagnosticActivity = {
          id: `custom-act-${Date.now()}`,
          title: data.activity.title || 'Nova Atividade Diagnóstica Adaptada',
          targetArea: 'Leitura & Expressão',
          estimatedDuration: '45 minutos',
          description: data.activity.objective || 'Atividade gerada com foco psicopedagógico inclusivo.',
          materials: data.activity.materials || ['Caderno de apoio', 'Cartões visuais'],
          pedagogicalSteps: data.activity.stepByStep?.map((s: string, idx: number) => ({
            phase: `Etapa ${idx + 1}`,
            description: s,
          })) || [
            { phase: 'Sensibilização', description: 'Abertura afetiva com redução de ansiedade.' }
          ],
          psychopedagogicalObservationChecklist: [
            data.activity.teacherObservationGuide || 'Observe sinais de lentidão, insegurança ou hesitação motora.'
          ],
          earlySignsAlertChecklist: [
            data.activity.emotionalSafetyNote || 'Atenção a comportamentos de fuga ou rebaixamento da autoestima.'
          ],
          interventionAdaptation: data.activity.emotionalSafetyNote || 'Mediar em pequenos grupos sem competição.',
        };
        setActivities([newAct, ...activities]);
        setSelectedActivity(newAct);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error(err);
      alert('Não foi possível gerar a atividade no momento. Verifique a conexão.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 border border-emerald-200/80 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
              Investigação Diagnóstica em Sala de Aula
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-['Outfit',sans-serif]">
              Bateria de Atividades Pedagógicas com Olhar Psicopedagógico
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Atividades estruturadas que o professor aplica na rotina comum da sala de aula. Enquanto a turma realiza uma dinâmica engajadora, o professor observa barreiras cognitivas específicas (dislexia, discalculia, TDAH) e sinais precoces de retraimento socioemocional.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-[1.02] shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Criar Atividade com Especialista IA
          </button>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 pt-4 border-t border-emerald-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Área Alvo:</span>
          {['todas', 'Autoestima & Vínculos', 'Leitura & Expressão', 'Raciocínio & Cálculo', 'Atenção & Funções Executivas'].map(area => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedArea === area
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {area === 'todas' ? 'Todas as Áreas' : area}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Activity List + Detailed Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Activities (5 columns) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredActivities.map((act) => {
            const isSelected = selectedActivity.id === act.id;
            return (
              <div
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'bg-white/80 border-slate-200 hover:border-emerald-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    {act.targetArea}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {act.estimatedDuration}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 leading-snug">
                  {act.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {act.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane (7 columns) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {selectedActivity.targetArea}
              </span>
              <h2 className="text-xl font-bold text-slate-800 mt-2 font-['Outfit',sans-serif]">
                {selectedActivity.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>Duração média: {selectedActivity.estimatedDuration}</span>
                <span>•</span>
                <span>Uso em sala de aula</span>
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir Roteiro
            </button>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {selectedActivity.description}
          </p>

          {/* Materiais Necessários */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Materiais Simples Necessários:
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedActivity.materials.map((mat, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
                  {mat}
                </span>
              ))}
            </div>
          </div>

          {/* Passo a Passo Pedagógico */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Roteiro de Aplicação em Sala (Passo a Passo):
            </h4>
            <div className="space-y-2.5">
              {selectedActivity.pedagogicalSteps.map((step, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{step.phase}</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* O que o Professor deve Observar (Pistas Psicopedagógicas) */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
            <h4 className="font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-700" />
              Checklist de Observação Psicopedagógica (Mapeamento de Dificuldades):
            </h4>
            <ul className="space-y-1.5 text-slate-700">
              {selectedActivity.psychopedagogicalObservationChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sinais de Alerta Precoce & Cuidados Socioemocionais */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2 text-xs">
            <h4 className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Sinais de Alerta & Prevenção ao Suicídio Durante Esta Atividade:
            </h4>
            <ul className="space-y-1.5 text-slate-700">
              {selectedActivity.earlySignsAlertChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Adaptação e Acolhimento */}
          <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200 text-xs text-teal-950 space-y-1">
            <p className="font-bold uppercase tracking-wider text-[11px] text-teal-800">
              Adaptação Inclusiva & Segurança Afetiva:
            </p>
            <p className="text-slate-700 leading-relaxed">
              {selectedActivity.interventionAdaptation}
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Criação de Atividade Customizada com IA */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-800">Criar Atividade com IA</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              O motor de psicologia educacional gerará uma atividade sob medida para as características específicas da sua turma ou estudante.
            </p>

            <form onSubmit={handleGenerateCustomActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dificuldade Alvo a Investigar:</label>
                <input
                  type="text"
                  required
                  value={customDiff}
                  onChange={(e) => setCustomDiff(e.target.value)}
                  placeholder="Ex: Dislexia, ansiedade matemática, hiperatividade..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Área ou Disciplina:</label>
                <input
                  type="text"
                  required
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Ex: Matemática, Português, Ciências..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Breve Perfil do Estudante / Turma:</label>
                <textarea
                  rows={3}
                  value={customProfile}
                  onChange={(e) => setCustomProfile(e.target.value)}
                  placeholder="Ex: Estudante tímido que se recusa a ler na frente da turma e se isola..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Elaborando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Atividade
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
