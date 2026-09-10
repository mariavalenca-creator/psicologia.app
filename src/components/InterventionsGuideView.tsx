import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Lightbulb, 
  HeartHandshake, 
  Users, 
  Sparkles, 
  CheckCircle, 
  AlertOctagon, 
  ShieldAlert, 
  Check, 
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const InterventionsGuideView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string>('todas');

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const categories = [
    {
      id: 'socioemotional-suicide',
      title: 'Acolhimento de Sofrimento Psíquico & Prevenção ao Suicídio',
      color: 'border-rose-300 bg-rose-50/40',
      badge: 'Prioridade da Vida',
      badgeColor: 'bg-rose-100 text-rose-800',
      description: 'Estratégias para desarmar sentimentos de desamparo, solidão extrema e reestabelecer o pertencimento na escola.',
      strategies: [
        {
          title: 'O "Sinal Combinado" Silencioso (Safe Signal)',
          problem: 'Aluno entra em sobrecarga emocional ou pânico durante a aula e não quer chamar a atenção da turma.',
          application: 'Combine um código discreto (ex: colocar uma caneta azul de pé no estojo ou um post-it na quina da carteira). Quando acionado, o aluno tem permissão automática de ir ao bebedouro ou à sala de mediação por 5 minutos sem perguntas nem olhares da turma.',
          impact: 'Elimina o medo da humilhação pública e devolve sensação de controle.',
        },
        {
          title: 'A Escuta Ativa Sem Paternalismo e Sem Julgamento',
          problem: 'Aluno verbaliza frases como "queria sumir", "nada tem sentido" ou desabafa.',
          application: 'Sente-se no mesmo nível visual. Use a fórmula: Validação ("Vejo que as coisas estão realmente pesadas") + Presença ("Você não precisa carregar isso sozinho") + Aliança ("Estou do seu lado para achar um caminho"). NUNCA compare com outros ou minimize.',
          impact: 'Quebra o isolamento existencial, que é o principal catalisador de ideação suicida.',
        },
        {
          title: 'Atribuição de Papel de Valor Social na Sala',
          problem: 'O estudante se sente um fardo ou invisível entre os colegas.',
          application: 'Designe responsabilidades autênticas e valorizadas (ex: curadoria da trilha sonora de leitura, operação da mídia da aula, cuidar das plantas da sala em parceria com um colega acolhedor).',
          impact: 'Ativa o senso de utilidade e pertencimento (autoeficácia social).',
        },
      ],
    },
    {
      id: 'dyslexia',
      title: 'Dificuldades de Leitura, Escrita & Dislexia',
      color: 'border-emerald-300 bg-emerald-50/40',
      badge: 'Pedagógico Inclusivo',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Adaptações para desonerar o esforço de decodificação e valorizar o potencial cognitivo.',
      strategies: [
        {
          title: 'Suspensão da Leitura Oral Pública Forçada',
          problem: 'O aluno é chamado de surpresa para ler em voz alta, entra em sudorese, trava e é alvo de risos.',
          application: 'Nunca faça "chamada surpresa". Se quiser a participação do estudante, combine com ele um parágrafo no dia anterior para que ele treine em casa com segurança, ou faça leitura em coro/em duplas.',
          impact: 'Reduz a ansiedade fóbica ligada aos livros e ao ambiente escolar.',
        },
        {
          title: 'Régua de Foco Visual & Fonte sem Serifa (Chunking)',
          problem: 'Perda frequente da linha de leitura, fadiga ocular rápida e confusão de letras espelhadas.',
          application: 'Forneça uma régua vazada em cartão escuro para isolar uma linha de cada vez. Em provas impressas, use fonte sem serifa (ex: Arial ou Comic Sans, tamanho 14) com entrelinhas 1.5 e parágrafos curtos.',
          impact: 'Melhora da velocidade de processamento visual em até 40%.',
        },
        {
          title: 'Comprovação Oral do Conhecimento',
          problem: 'O estudante compreendeu todo o conteúdo histórico ou científico, mas tira zero na prova discursiva por lentidão na escrita.',
          application: 'Permita que o aluno complemente sua resposta oralmente com o professor após a prova, ou utilize respostas gravadas em áudio.',
          impact: 'Avalia o conhecimento real e não a limitação mecânica do traçado gráfico.',
        },
      ],
    },
    {
      id: 'adhd',
      title: 'Atenção, Desorganização & Funções Executivas (TDAH)',
      color: 'border-amber-300 bg-amber-50/40',
      badge: 'Neurociência Aplicada',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Estratégias de andaimagem e ancoragem externa da memória de trabalho.',
      strategies: [
        {
          title: 'A Regra do "Post-it Único" na Mesa',
          problem: 'O aluno abre quatro cadernos, o estojo espalhado, se distrai a cada 2 minutos e não inicia a tarefa.',
          application: 'Peça que guarde tudo na mochila, exceto o caderno da matéria. Cole um único post-it na mesa com o primeiro passo: "1. Resolver os exercícios 1 e 2". Quando terminar, ele amassa o post-it e recebe o próximo.',
          impact: 'Reduz a sobrecarga da memória de trabalho e gera micro-recompensas de dopamina.',
        },
        {
          title: 'Instruções Fracionadas com Checagem em Dupla',
          problem: 'O professor dá três instruções simultâneas ("abram na pág 40, copiem o texto e respondam a 3"). O aluno só ouve a primeira.',
          application: 'Instruções sequenciais: Uma ação por vez com apoio visual no quadro (ícones numerados: 📖 1, ✏️ 2). Peça para o colega ao lado confirmar se o parceiro achou a página certa.',
          impact: 'Evita a sensação crônica de desorientação e atraso.',
        },
      ],
    },
    {
      id: 'dyscalculia',
      title: 'Raciocínio Matemático & Discalculia',
      color: 'border-teal-300 bg-teal-50/40',
      badge: 'Material Manipulativo',
      badgeColor: 'bg-teal-100 text-teal-800',
      description: 'Tornar os números tangíveis para superar o medo da abstração aritmética.',
      strategies: [
        {
          title: 'Tabela de Pitágoras e Apoio de Memória Permanente',
          problem: 'Aluno gasta toda sua energia tentando lembrar 7x8 e erra a lógica de problemas complexos.',
          application: 'Disponibilize permanentemente na mesa a tábua de multiplicação e a reta numérica. A decoreba não é o objetivo; o raciocínio é.',
          impact: 'Desbloqueia a capacidade de resolver desafios lógicos sem a barreira do esquecimento de fatos aritméticos.',
        },
        {
          title: 'Uso de Material Concreto e Dinheiro Cenográfico',
          problem: 'Incapacidade de entender frações e porcentagens apenas com números no quadro.',
          application: 'Utilizar barras de chocolate lúdicas em papel ou cédulas pedagógicas para representar frações e trocos da vida real.',
          impact: 'Ancoragem sensorial que consolida o sentido de número no córtex parietal.',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-teal-50/80 border border-amber-200/80 rounded-3xl p-6 shadow-xs">
        <div className="space-y-1.5 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            <BookOpenCheck className="w-3.5 h-3.5 text-teal-700" />
            Guia Prático para Professores e Equipe Pedagógica
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 font-['Outfit',sans-serif]">
            Estratégias de Intervenção Psicopedagógica em Sala de Aula
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Intervir pedagogicamente não exige relatórios burocráticos intermináveis. Mudanças simples na mediação da aula, na linguagem com o estudante e na organização das tarefas reduzem o desespero emocional e resgatam a autoconfiança de quem está sofrendo.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={cat.id} className={`rounded-3xl border ${cat.color} p-6 bg-white shadow-xs space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${cat.badgeColor}`}>
                  {cat.badge}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 font-['Outfit',sans-serif]">
                  {cat.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 italic max-w-md">
                {cat.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.strategies.map((strat, stratIdx) => {
                const uniqueId = catIdx * 10 + stratIdx;
                return (
                  <div 
                    key={stratIdx}
                    className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 hover:bg-white hover:shadow-xs transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-800 leading-snug">
                          {strat.title}
                        </h4>
                        <button
                          onClick={() => copyText(`${strat.title}\n\nComo aplicar: ${strat.application}`, uniqueId)}
                          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
                          title="Copiar estratégia para planejamento"
                        >
                          {copiedIndex === uniqueId ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="text-xs space-y-1.5">
                        <p className="text-rose-900 bg-rose-50/70 p-2 rounded-lg border border-rose-100">
                          <strong>Cenário:</strong> {strat.problem}
                        </p>
                        <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                          <strong>Como o Professor Aplica:</strong> {strat.application}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Impacto: {strat.impact}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Script for Communicating with Families Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-700" />
          <h3 className="text-base sm:text-lg font-bold text-amber-900 font-['Outfit',sans-serif]">
            Roteiro Ético: Como Dialogar com a Família sem Julgamentos
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Quando o estudante apresenta sinais de sofrimento ou ideação, o contato com os responsáveis não deve ter tom de queixa disciplinar ou acusação. O tom deve ser estritamente de <strong>aliança protetiva pela vida do filho</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-emerald-200 space-y-2">
            <p className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              O Que Dizer à Família (Recomendado):
            </p>
            <p className="text-slate-700 italic">
              "Chamamos vocês porque nós temos um carinho imenso pelo Lucas e estamos muito atentos ao bem-estar dele. Notamos que nas últimas semanas ele parece estar carregando uma tristeza muito profunda e algumas dificuldades na escola. Queremos pensar juntos em como nós na escola e vocês em casa podemos acolhê-lo e buscar um suporte com profissionais de saúde mental."
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-rose-200 space-y-2">
            <p className="font-bold text-rose-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              O Que Evitar a Todo Custo:
            </p>
            <p className="text-slate-700 italic">
              "Seu filho não quer nada com nada, não presta atenção e fica falando bobagens de querer sumir para chamar atenção. Se continuar assim, vai reprovar ou causar problemas para a escola." (Esse tipo de abordagem gera revolta familiar e pode agravar a punição em casa).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
