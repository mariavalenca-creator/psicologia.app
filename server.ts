import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Psychopedagogical Diagnostic & Intervention Synthesis API
app.post("/api/psychopedagogy/analyze", async (req, res) => {
  try {
    const { student, assessment } = req.body;
    if (!student) {
      return res.status(400).json({ error: "Dados do estudante são obrigatórios." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback to structured psychopedagogical algorithmic synthesis
      const fallbackReport = generateAlgorithmicReport(student, assessment);
      return res.json({
        source: "expert-rules",
        report: fallbackReport,
      });
    }

    const prompt = `
Atue como um Especialista em Psicologia da Educação e Psicopedagogia Institucional e Clínica, com profunda especialização em neurociência da aprendizagem, desenvolvimento socioemocional de crianças e adolescentes, e protocolos escolares de prevenção ao suicídio e automutilação (Diretrizes do CVV, Ministério da Saúde e OMS para o ambiente escolar).

Analise o seguinte estudante e os dados de rastreio preenchidos pela equipe pedagógica:

DADOS DO ESTUDANTE:
- Nome/Identificador: ${student.name}
- Idade/Série: ${student.age} anos, ${student.grade}
- Turma: ${student.classRoom || "Não informada"}

DADOS DE DESEMPENHO ACADÊMICO:
- Média Geral Recente: ${student.academic?.recentAverage ?? "N/A"} (Escala 0 a 10)
- Tendência de Desempenho: ${student.academic?.trend || "Estável"}
- Frequência Escolar / Faltas recentes: ${student.academic?.absences || 0} faltas no último bimestre
- Tarefas e Trabalhos Entregues: ${student.academic?.assignmentSubmissionRate || "N/A"}%
- Principais dificuldades pedagógicas apontadas: ${student.academic?.reportedDifficulties?.join(", ") || "Nenhuma específica relatada"}

INDICADORES SOCIOEMOCIONAIS OBSERVADOS EM SALA:
- Humor Predominante: ${student.socioemotional?.predominantMood || "Neutro"}
- Nível de Vínculo com Pares: ${student.socioemotional?.peerInteraction || "Típico"}
- Tolerância à Frustração: ${student.socioemotional?.frustrationTolerance || "Média"}
- Engajamento nas Atividades: ${student.socioemotional?.classroomEngagement || "Médio"}
- Observações do Professor: "${student.socioemotional?.teacherNotes || "Sem notas adicionais"}"

FORMULÁRIO DE IDENTIFICAÇÃO PRECOCE & SINAIS DE ALERTA (TRIAGEM):
- Sinais de Isolamento/Retraimento: ${assessment?.isolationSigns ? "SIM - " + assessment.isolationSignsDetails : "Não observado"}
- Queda Abrupta no Rendimento sem causa aparente: ${assessment?.suddenPerformanceDrop ? "SIM" : "Não"}
- Falas de Desesperança/Desvalia ("Queria sumir", "Sou um fardo"): ${assessment?.hopelessnessExpressions ? "SIM - Detalhes: " + assessment.hopelessnessExpressionsText : "Não observado"}
- Mudança Drástica de Comportamento/Aparência (ex: roupas longas no calor, letargia extrema): ${assessment?.behaviorDrasticChange ? "SIM - " + assessment.behaviorChangeDetails : "Não"}
- Descarte ou Doação de Pertences Pessoais Afetivos: ${assessment?.givingAwayPossessions ? "SIM" : "Não"}
- Conteúdo de Desenhos/Redações com ideação mórbida: ${assessment?.morbidContent ? "SIM" : "Não"}
- Autocrítica Punitiva ou Perfeccionismo Paralisante: ${assessment?.extremeSelfCriticism ? "SIM" : "Não"}
- Histórico de Bullying/Exclusão Sistêmica: ${assessment?.bullyingHistory ? "SIM" : "Não"}

Gere uma resposta em JSON estrito com a seguinte estrutura:
{
  "riskLevel": "baixo" | "moderado" | "alto" | "critico",
  "riskColor": "emerald" | "amber" | "rose" | "red",
  "summaryTitle": "Título conciso do parecer psicopedagógico",
  "psychopedagogicalHypothesis": "Parágrafo detalhado com fundamentação da psicologia da educação articulando as dificuldades de aprendizagem e o quadro socioemocional",
  "learningDifficultyProfile": {
    "primaryArea": "Leitura/Escrita | Raciocínio Lógico | Funções Executivas e Atenção | Bloqueio Emocional de Aprendizagem",
    "cognitiveAspects": "Descrição do processamento cognitivo e barreiras pedagógicas",
    "classroomImpact": "Como isso impacta o estudante na prática da sala de aula"
  },
  "emotionalSufferingIndicators": {
    "alertLevelDescription": "Síntese dos sinais de sofrimento emocional ou ideação",
    "criticalSignalsDetected": ["lista", "de", "sinais", "que", "exigem", "atenção"],
    "protectiveFactors": ["fatores", "de", "proteção", "presentes", "ou", "a", "desenvolver"]
  },
  "pedagogicalInterventions": [
    {
      "title": "Nome da estratégia pedagógica inclusiva",
      "objective": "Objetivo psicopedagógico",
      "howToApplyInClass": "Passo a passo prático para o professor regente aplicar sem sobrecarga",
      "adaptations": "Adaptações de tempo, formato ou mediação"
    }
  ],
  "socioemotionalInterventions": [
    {
      "action": "Ação de acolhimento em sala de aula",
      "approach": "Frase ou postura recomendada para o professor",
      "avoid": "O que NÃO dizer ou fazer (erros comuns)"
    }
  ],
  "institutionalProtocol": {
    "urgency": "Imediata (Hoje) | Curto Prazo (Esta semana) | Monitoramento Contínuo",
    "steps": [
      "Passo 1 com coordenação/orientação",
      "Passo 2 com família com cuidado e ética",
      "Passo 3 encaminhamento para rede externa se aplicável (CAPSij/UBS/Conselho)"
    ],
    "crisisGuidelines": "Orientações fundamentais de acolhimento seguro (ex: não deixar sozinho se risco crítico, CVV 188, validação da dor)."
  }
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Você é um Psicopedagogo e Psicólogo da Educação com vasta experiência em ambientes escolares. Você redige relatórios com extremo rigor técnico, empatia pedagógica, clareza aplicável para professores e compromisso irrestrito com a proteção à vida e acolhimento de alunos em sofrimento psíquico. Responda SEMPRE em JSON válido conforme o esquema solicitado.",
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    let parsedJson;
    try {
      parsedJson = JSON.parse(text);
    } catch {
      // Clean up markdown block if present
      const cleaned = text.replace(/```json\n?|```/g, "").trim();
      parsedJson = JSON.parse(cleaned);
    }

    return res.json({
      source: "gemini-3.8-flash",
      report: parsedJson,
    });
  } catch (error: any) {
    console.error("Erro na rota de análise psicopedagógica:", error);
    // Fallback to rule-based engine on error
    const { student, assessment } = req.body;
    const fallbackReport = generateAlgorithmicReport(student, assessment);
    return res.json({
      source: "expert-rules-fallback",
      warning: "Análise gerada via matriz psicopedagógica institucional integrada.",
      report: fallbackReport,
    });
  }
});

// Custom Pedagogical Activity Generator for Learning Difficulties
app.post("/api/psychopedagogy/generate-activity", async (req, res) => {
  try {
    const { studentProfile, targetDifficulty, subjectArea } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        activity: getCuratedActivity(targetDifficulty, subjectArea),
      });
    }

    const prompt = `
Crie uma Atividade Pedagógica Diagnóstica e Interventiva para sala de aula, adaptada para um estudante com:
- Dificuldade alvo: ${targetDifficulty}
- Área/Componente Curricular: ${subjectArea || "Multidisciplinar"}
- Perfil do Estudante: ${studentProfile || "Ensino Fundamental / Médio, enfrentando frustração escolar"}

A atividade deve ser prazerosa, reduzir ansiedade de desempenho, promover sentimento de competência (autoeficácia de Bandura), e permitir ao professor avaliar dificuldades de aprendizagem sem expor o estudante ao ridículo perante a turma.

Retorne em JSON:
{
  "title": "Nome criativo e engajador da atividade",
  "objective": "Objetivo psicopedagógico claro",
  "materials": ["materiais simples de sala"],
  "stepByStep": [
    "Fase 1: Preparação e quebra-gelo seguro",
    "Fase 2: Desenvolvimento com mediação pedagógica",
    "Fase 3: Fechamento com autoavaliação afetiva positiva"
  ],
  "teacherObservationGuide": "O que o professor deve observar atentamente (pistas de dislexia, discalculia, TDAH ou bloqueio ansioso)",
  "emotionalSafetyNote": "Como acolher se o aluno demonstrar frustração ou retraimento durante a atividade"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Você é um Psicopedagogo especialista em metodologia ativa, design de atividades diferenciadas e suporte socioemocional em sala de aula.",
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json\n?|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({ activity: parsed });
  } catch (error) {
    console.error("Erro ao gerar atividade:", error);
    const { targetDifficulty, subjectArea } = req.body;
    return res.json({
      activity: getCuratedActivity(targetDifficulty, subjectArea),
    });
  }
});

// Robust clinical/expert rules fallback generator
function generateAlgorithmicReport(student: any, assessment: any) {
  const hasSevereHopelessness = assessment?.hopelessnessExpressions || false;
  const hasMorbidContent = assessment?.morbidContent || false;
  const hasDrasticBehavior = assessment?.behaviorDrasticChange || false;
  const hasSevereIsolation = assessment?.isolationSigns || false;
  const hasGivingAway = assessment?.givingAwayPossessions || false;

  let riskLevel: "baixo" | "moderado" | "alto" | "critico" = "baixo";
  let riskColor: "emerald" | "amber" | "rose" | "red" = "emerald";

  if (hasGivingAway || (hasSevereHopelessness && hasMorbidContent) || (hasSevereHopelessness && hasDrasticBehavior)) {
    riskLevel = "critico";
    riskColor = "red";
  } else if (hasSevereHopelessness || hasDrasticBehavior || (hasSevereIsolation && assessment?.suddenPerformanceDrop)) {
    riskLevel = "alto";
    riskColor = "rose";
  } else if (hasSevereIsolation || assessment?.suddenPerformanceDrop || assessment?.bullyingHistory) {
    riskLevel = "moderado";
    riskColor = "amber";
  }

  const primaryDiff = student?.academic?.reportedDifficulties?.[0] || "Desatenção e sobrecarga de tarefas";

  return {
    riskLevel,
    riskColor,
    summaryTitle: `Parecer Psicopedagógico e Mapeamento Diagnóstico: ${student?.name || "Estudante"}`,
    psychopedagogicalHypothesis: `O estudante apresenta correlação significativa entre dificuldades acadêmicas identificadas em ${primaryDiff} e manifestações de vulnerabilidade socioemocional. O quadro demanda uma abordagem integrada onde a intervenção pedagógica reduz a frustração escolar, enquanto a rede escolar fortalece o suporte afetivo e a escuta ativa sem julgamentos.`,
    learningDifficultyProfile: {
      primaryArea: primaryDiff.includes("Leitura") ? "Leitura e Escrita (Processamento Fonológico)" : primaryDiff.includes("Matemática") ? "Raciocínio Lógico-Matemático" : "Funções Executivas e Organização",
      cognitiveAspects: "Fragilidade na sustentação da atenção, sobrecarga da memória operacional sob estresse e sensação de incapacidade aprendida gerada por insucessos repetidos.",
      classroomImpact: "Hesitação em participar de tarefas públicas, desengajamento precoce diante de enunciados longos e tendência ao isolamento durante trabalhos coletivos.",
    },
    emotionalSufferingIndicators: {
      alertLevelDescription: riskLevel === "critico"
        ? "ALERTA MÁXIMO DE PROTEÇÃO: Indicadores críticos de sofrimento agudo e ideação. Não deixar o aluno desacompanhado e acionar imediatamente a orientação e a família com respaldo no CVV 188 e na rede de saúde mental infantil."
        : riskLevel === "alto"
        ? "VULNERABILIDADE ELEVADA: Sinais nítidos de desesperança e retração social. Requer intervenção acolhedora prioritária e interlocução com os responsáveis."
        : riskLevel === "moderado"
        ? "ATENÇÃO PEDAGÓGICA E AFETIVA: Descompasso entre potencial e desempenho acompanhado de isolamento pontual. Estratégias preventivas imediatas em sala são recomendadas."
        : "NÍVEL TÍPICO DE ACOMPANHAMENTO: Sinais leves de rotina. Foco em suporte pedagógico contínuo e fortalecimento de vínculos positivos.",
      criticalSignalsDetected: [
        ...(hasSevereHopelessness ? ["Verbalizações ou indícios de desesperança e falta de sentido"] : []),
        ...(hasDrasticBehavior ? ["Alteração drástica na vestimenta, postura corporal ou energia em sala"] : []),
        ...(hasSevereIsolation ? ["Isolamento progressivo dos colegas nos intervalos e dinâmicas"] : []),
        ...(assessment?.suddenPerformanceDrop ? ["Queda repentina no rendimento escolar sem justificativa biológica aparente"] : []),
      ],
      protectiveFactors: [
        "Vínculo de confiança com ao menos um educador de referência na escola",
        "Interesses e habilidades específicas não acadêmicas (artes, esportes, tecnologia)",
        "Ambiente de sala de aula estruturado com previsibilidade e sem exposição vexatória",
      ],
    },
    pedagogicalInterventions: [
      {
        title: "Metodologia de Andaimagem e Tarefas Fracionadas (Chunking)",
        objective: "Reduzir o impacto do desamparo aprendido e reativar a percepção de competência do estudante.",
        howToApplyInClass: "Dividir enunciados complexos em três passos visuais. Permitir a entrega inicial do primeiro passo para validação imediata do professor, elogiando o esforço específico.",
        adaptations: "Tempo adicional de 30% em avaliações e alternativa oral ou esquemática para comprovação de conteúdo.",
      },
      {
        title: "Contrato de Apoio Silencioso (Sinal Combinado)",
        objective: "Proteger o aluno de crises de ansiedade em sala de aula sem estigmatizá-lo perante a turma.",
        howToApplyInClass: "Combinar previamente um sinal discreto (ex: marcador amarelo na quina da carteira) para quando o estudante sentir sobrecarga emocional ou cognitiva, permitindo-lhe fazer uma pausa de 3 minutos para tomar água.",
        adaptations: "Evitar chamadas orais surpresa ou leitura forçada em voz alta na frente da turma.",
      },
    ],
    socioemotionalInterventions: [
      {
        action: "Escuta Ativa Acolhedora ao final do período",
        approach: "'Notei que as coisas têm parecido pesadas ultimamente. Quero que saiba que eu me importo com você e estou aqui para apoiar no seu ritmo.'",
        avoid: "NUNCA dizer: 'Isso é só uma fase', 'Falta força de vontade', ou 'Pense positivo, tem gente pior'.",
      },
      {
        action: "Inclusão em Papel de Valor Social na Sala",
        approach: "Designar uma função prática de valor (ex: organizar a mídia da aula, cuidar de um projeto prático em dupla com um colega acolhedor e empático).",
        avoid: "Não forçar a socialização com grupos que praticam sarcasmo ou exclusão velada.",
      },
    ],
    institutionalProtocol: {
      urgency: riskLevel === "critico" ? "Imediata (Hoje)" : riskLevel === "alto" ? "Curto Prazo (Esta semana)" : "Monitoramento Contínuo",
      steps: [
        "Registrar formalmente as observações na ficha psicopedagógica confidencial da escola.",
        "Comunicar a Coordenação Pedagógica e a Orientação Educacional de forma sigilosa e acolhedora.",
        riskLevel === "critico" || riskLevel === "alto"
          ? "Convidar os responsáveis para diálogo presencial de suporte (não punitivo), recomendando avaliação pelo CAPSij ou psicoterapia infantojuvenil."
          : "Realizar feedback quinzenal com a equipe de professores da turma.",
      ],
      crisisGuidelines: "Em caso de fala explícita de fim da vida: Manter a calma, NÃO deixar o estudante sozinho em nenhum momento, manter presença afetuosa e calma, acionar a gestão imediatamente. Divulgar com sensibilidade o canal de apoio 188 (CVV).",
    },
  };
}

function getCuratedActivity(targetDifficulty: string, subjectArea: string) {
  return {
    title: `Oficina de Mapeamento Cognitivo e Autoestima: ${subjectArea || "Linguagens e Expressão"}`,
    objective: `Mapear barreiras específicas relacionadas a ${targetDifficulty || "dificuldade de aprendizagem"} reduzindo a ansiedade de desempenho.`,
    materials: ["Folhas com organizador gráfico visual", "Cartões de pistas em cores", "Post-its"],
    stepByStep: [
      "1. Acolhimento e contextualização lúdica: apresentar o desafio como um 'laboratório de detetives de ideias', onde o foco é o processo de resolução, não apenas a resposta final.",
      "2. Mediação em duplas complementares: propor a resolução mediada com cartões ilustrativos, permitindo que o aluno expresse o raciocínio oralmente antes de grafar.",
      "3. Fechamento valorativo: autoavaliação 'O que eu descobri sobre meu jeito de aprender hoje', com feedback afirmativo do professor sobre a estratégia utilizada.",
    ],
    teacherObservationGuide: "Observe se o aluno hesita na decodificação fonológica, se perde a linha da leitura, se demonstra cansaço visual rápido ou se fecha o caderno por medo de errar.",
    emotionalSafetyNote: "Se notar bloqueio, sente-se ao lado na mesma altura dos olhos e diga: 'Vamos fazer essa primeira linha juntos, sem pressa alguma.'",
  };
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor Psicopedagógico rodando na porta ${PORT}`);
  });
}

startServer();
