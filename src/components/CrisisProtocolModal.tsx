import React from 'react';
import { 
  X, 
  PhoneCall, 
  ShieldAlert, 
  LifeBuoy, 
  AlertOctagon, 
  CheckCircle2, 
  Heart, 
  Users, 
  FileText,
  Clock
} from 'lucide-react';
import { CRISIS_PROTOCOL_GUIDE } from '../data/mockData';

interface CrisisProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisProtocolModal: React.FC<CrisisProtocolModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-200 max-w-3xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Urgent Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
              <LifeBuoy className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-1">
                Protocolo Escolar Imediato de Proteção à Vida
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Outfit',sans-serif]">
                SOS Escolar: Guia de Ação e Acolhimento em Crise
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Contacts Banner */}
        <div className="bg-rose-50 border-b border-rose-200 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              188
            </div>
            <div>
              <p className="font-extrabold text-red-900 text-sm sm:text-base">
                CVV - Centro de Valorização da Vida
              </p>
              <p className="text-rose-700">Ligação telefônica gratuita, confidencial, 24 horas por dia em todo o Brasil.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:188"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              Ligar 188
            </a>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Primeiros 10 Minutos - O que fazer */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Os Primeiros 10 Minutos: Passo a Passo do Educador
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200 space-y-1.5">
                <span className="font-black text-red-700 text-sm">Passo 1: Presença Contínua</span>
                <p className="font-bold text-slate-800">NUNCA deixe o estudante sozinho.</p>
                <p className="text-slate-600 text-xs">
                  Se o aluno verbalizou ideação suicida ou você notou marcas de autolesão fresca, conduza-o suavemente a um local calmo (sala da coordenação, biblioteca) e permaneça ao lado dele.
                </p>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1.5">
                <span className="font-black text-amber-700 text-sm">Passo 2: Comunicação Discreta</span>
                <p className="font-bold text-slate-800">Acione a equipe de apoio sem alarde.</p>
                <p className="text-slate-600 text-xs">
                  Peça discretamente a um colega professor ou monitor que chame a Orientação Educacional ou a Direção. Evite comoções públicas na frente da turma.
                </p>
              </div>

              <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-1.5">
                <span className="font-black text-teal-700 text-sm">Passo 3: Postura de Acolhimento</span>
                <p className="font-bold text-slate-800">Valide o sofrimento sem investigar detalhes invasivos.</p>
                <p className="text-slate-600 text-xs">
                  "Eu acredito na sua dor e vejo o quanto está difícil. Você está seguro aqui comigo e vamos encontrar ajuda juntos."
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="font-black text-slate-700 text-sm">Passo 4: Família e Rede de Saúde</span>
                <p className="font-bold text-slate-800">Contato protetivo com os responsáveis.</p>
                <p className="text-slate-600 text-xs">
                  A escola convoca os pais para acolhimento presencial no mesmo dia e orienta o encaminhamento imediato para o CAPSij ou UPA infantil.
                </p>
              </div>
            </div>
          </div>

          {/* O que Dizer vs O que NÃO Dizer */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" />
              Guia Verbal: Como Falar com o Estudante em Crise
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <p className="font-bold text-emerald-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Frases que Acolhem e Protegem:
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-700">
                  <li>"Estou muito feliz que você compartilhou isso comigo. Exigiu muita coragem."</li>
                  <li>"Você não está sozinho e não precisa passar por isso sem ajuda."</li>
                  <li>"Eu me importo de verdade com você e com a sua vida."</li>
                  <li>"Podemos dar um passo de cada vez. Vamos respirar juntos agora."</li>
                </ul>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2">
                <p className="font-bold text-rose-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  O que NUNCA Dizer (Frases Prejudiciais):
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-700">
                  <li>"Isso é frescura ou drama de adolescente."</li>
                  <li>"Tem tanta gente no mundo com problemas piores que os seus."</li>
                  <li>"Você tem uma vida inteira pela frente, não seja ingrato."</li>
                  <li>"Pense no desgosto que você vai dar para a sua mãe."</li>
                  <li>"Você só quer chamar atenção."</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rede de Saúde Mental */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-600" />
              Rede de Proteção Intersetorial no Brasil:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">CAPSij</p>
                <p className="text-slate-500 text-[11px]">Centro de Atenção Psicossocial Infantojuvenil (Atendimento público especializado em saúde mental).</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">UBS / ESF</p>
                <p className="text-slate-500 text-[11px]">Unidade Básica de Saúde da família do bairro do estudante para acompanhamento médico e psicológico.</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <p className="font-bold text-slate-800">Conselho Tutelar</p>
                <p className="text-slate-500 text-[11px]">Acionado formalmente se houver negligência ou violência familiar comprovada que impeça o cuidado do aluno.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Diretrizes alinhadas com Ministério da Saúde, Conselho Federal de Psicologia e CVV.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
