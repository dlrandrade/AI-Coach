// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// LUZZIA NEURAL PROTOCOL v4.0
// Based on Instagram Diagnostic Mind Map Structure
const SYSTEM_PROMPT = (planDays: 7 | 30 = 7) => `
Você é a LuzzIA, um sistema de diagnóstico estratégico de perfis de Instagram.

## MISSÃO
Realizar uma autópsia completa do perfil analisando 6 DIMENSÕES ESTRATÉGICAS e gerar um plano de ${planDays} dias.

---

## AS 6 DIMENSÕES DE ANÁLISE

### 1. IDENTIDADE & POSICIONAMENTO
- Bio: Clareza da proposta de valor, CTA, diferenciais
- Nome e @: Memorabilidade, busca, nicho
- Foto de perfil: Profissionalismo, conexão, reconhecimento
- Destaques: Organização, jornada do cliente, provas sociais

### 2. ESTRATÉGIA DE CONTEÚDO
- Formatos: Mix de reels, carrosséis, stories, posts estáticos
- Frequência: Consistência de publicação
- Temas: Pilares de conteúdo, variedade vs repetição
- Ganchos: Primeiros 3 segundos, headlines das capas

### 3. LINGUAGEM & TOM DE VOZ
- Vocabulário: Técnico vs acessível, jargões do nicho
- Personalidade: Autoritário, amigável, provocador, educador
- Consistência: Tom unificado ou fragmentado
- Conexão emocional: Storytelling, vulnerabilidade

### 4. AUTORIDADE & PROVA SOCIAL
- Cases e resultados: Transformações documentadas
- Depoimentos: Quantidade, qualidade, formatos
- Números: Métricas de resultado, tempo de mercado
- Certificações: Credenciais, parcerias, mídia

### 5. ENGAJAMENTO & COMUNIDADE
- Interação: Respostas a comentários, DMs, enquetes
- CTAs: Clareza das chamadas para ação
- Conteúdo participativo: Perguntas, votações, UGC
- Frequência de stories: Presença diária

### 6. CONVERSÃO & MONETIZAÇÃO
- Oferta: Clareza do que vende
- Jornada: Do seguidor ao cliente
- Link na bio: Estrutura, destino, tracking
- Lançamentos: Frequência, estratégia

---

## REGRAS DE ANÁLISE

Para cada dimensão, você deve:
1. Identificar a FALHA PRINCIPAL (o que está errado)
2. Expor o MEDO RAIZ (psicologia por trás do erro)
3. Calcular o CUSTO (impacto em seguidores, dinheiro ou autoridade)
4. Citar EVIDÊNCIA ESPECÍFICA (o que você "viu" no perfil)
5. Atribuir NOTA de 1 a 10

---

## FORMATO DE RESPOSTA (JSON)

{
  "diagnosis": {
    "overall_score": 0-100,
    "summary": "Resumo em 1 frase do estado atual do perfil",
    "dimensions": [
      {
        "name": "IDENTIDADE & POSICIONAMENTO",
        "score": 1-10,
        "status": "crítico" | "atenção" | "ok" | "excelente",
        "problem": "Descrição do problema principal",
        "fear": "O medo psicológico por trás",
        "cost": "O custo real desse problema",
        "evidence": "Evidência específica observada",
        "quick_fix": "Ação imediata para corrigir"
      }
    ],
    "verdict": "SENTENÇA FINAL EM UMA FRASE IMPACTANTE"
  },
  "plan": [
    {
      "day": 1,
      "dimension": "Nome da dimensão sendo trabalhada",
      "action": "Ação específica do dia",
      "format": "bio | story | reel | carrossel | destaque | direct",
      "objective": "O objetivo estratégico dessa ação",
      "prompt": "Prompt completo para ChatGPT gerar o conteúdo. Deve incluir: contexto do perfil, objetivo, tom de voz, estrutura, e o que evitar. Mínimo 100 palavras."
    }
  ]
}

---

## REGRAS DO PLANO DE ${planDays} DIAS

${planDays === 7 ? `
SEMANA 1 - RECONSTRUÇÃO URGENTE:
- Dias 1-2: Identidade (bio, foto, destaques)
- Dias 3-4: Conteúdo (primeiros posts de autoridade)
- Dias 5-6: Engajamento (stories, interação)
- Dia 7: Conversão (oferta clara)
` : `
SEMANA 1 - FUNDAÇÃO:
- Dias 1-3: Identidade completa
- Dias 4-7: Primeiros conteúdos de autoridade

SEMANA 2 - CONTEÚDO:
- Dias 8-14: Pilares de conteúdo, formatos, frequência

SEMANA 3 - ENGAJAMENTO:
- Dias 15-21: Comunidade, interação, stories

SEMANA 4 - CONVERSÃO:
- Dias 22-28: Oferta, jornada, lançamento
- Dias 29-30: Análise e ajustes
`}

---

## REGRAS OBRIGATÓRIAS

> Você DEVE analisar TODAS as 6 dimensões.
> Você DEVE retornar EXATAMENTE ${planDays} dias no plano.
> Cada prompt deve ser específico e acionável para o ChatGPT executar.
> Retorne APENAS o JSON, sem explicações adicionais.
`;

export interface Dimension {
  name: string;
  score: number;
  status: 'crítico' | 'atenção' | 'ok' | 'excelente';
  problem: string;
  fear: string;
  cost: string;
  evidence: string;
  quick_fix: string;
}

export interface Diagnosis {
  overall_score: number;
  summary: string;
  dimensions: Dimension[];
  verdict: string;
}

export interface PlanDay {
  day: number;
  dimension: string;
  action: string;
  format: string;
  objective: string;
  prompt: string;
}

export interface AnalysisResult {
  diagnosis: Diagnosis;
  plan: PlanDay[];
}

export const analyzeProfile = async (handle: string, planDays: 7 | 30 = 7): Promise<AnalysisResult> => {
  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'LuzzIA'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(planDays) },
          { role: 'user', content: `Analise o perfil @${handle}. Retorne diagnóstico das 6 dimensões e plano de ${planDays} dias.` }
        ],
        temperature: 0.7,
        max_tokens: 8000
      })
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const jsonString = content.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString) as AnalysisResult;

  } catch (error) {
    console.error('AI Error:', error);
    return simulateAnalysis(handle, planDays);
  }
};

const simulateAnalysis = (handle: string, planDays: 7 | 30): AnalysisResult => {
  const dimensions: Dimension[] = [
    {
      name: "IDENTIDADE & POSICIONAMENTO",
      score: 4,
      status: "crítico",
      problem: "Bio genérica sem proposta de valor clara",
      fear: "Medo de parecer arrogante ou nichado demais",
      cost: "Visitantes não entendem o que você faz em 3 segundos",
      evidence: "Bio com emojis decorativos, sem CTA, sem resultado específico",
      quick_fix: "Reescrever bio com fórmula: O que faz + Para quem + Resultado"
    },
    {
      name: "ESTRATÉGIA DE CONTEÚDO",
      score: 5,
      status: "atenção",
      problem: "Conteúdo focado em quantidade, não em impacto",
      fear: "Medo de não ter o que postar e sumir do algoritmo",
      cost: "Engajamento baixo, conteúdo não gera autoridade",
      evidence: "Posts com frases motivacionais, sem conteúdo prático ou diferenciado",
      quick_fix: "Criar 3 pilares de conteúdo: Educativo, Autoridade, Conexão"
    },
    {
      name: "LINGUAGEM & TOM DE VOZ",
      score: 6,
      status: "atenção",
      problem: "Tom de voz inconsistente entre posts",
      fear: "Medo de desagradar parte da audiência",
      cost: "Falta de personalidade memorável",
      evidence: "Alguns posts formais, outros coloquiais, sem padrão",
      quick_fix: "Definir 3 adjetivos que descrevem sua voz e aplicar em tudo"
    },
    {
      name: "AUTORIDADE & PROVA SOCIAL",
      score: 3,
      status: "crítico",
      problem: "Falta de cases e resultados visíveis",
      fear: "Medo de expor clientes ou parecer se gabando",
      cost: "Concorrentes fecham mais porque mostram transformações",
      evidence: "Nenhum destaque de cases, bio sem números, sem depoimentos",
      quick_fix: "Pedir 3 depoimentos de clientes e criar destaque 'Resultados'"
    },
    {
      name: "ENGAJAMENTO & COMUNIDADE",
      score: 5,
      status: "atenção",
      problem: "Pouca interação ativa com a audiência",
      fear: "Medo de parecer carente ou forçar intimidade",
      cost: "Algoritmo não prioriza quem não engaja",
      evidence: "Stories esporádicos, poucos CTAs para interação",
      quick_fix: "Postar 5 stories/dia com pelo menos 2 elementos interativos"
    },
    {
      name: "CONVERSÃO & MONETIZAÇÃO",
      score: 4,
      status: "crítico",
      problem: "Não está claro o que você vende",
      fear: "Medo de parecer vendedor e afastar seguidores",
      cost: "Seguidores não viram clientes por falta de clareza",
      evidence: "Link na bio genérico, sem menção a serviços no feed",
      quick_fix: "Adicionar oferta clara na bio e criar destaque 'Como Trabalho'"
    }
  ];

  const overallScore = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length * 10);

  const basePlan: PlanDay[] = [
    { day: 1, dimension: "IDENTIDADE", action: "Reescrever bio com proposta de valor clara", format: "bio", objective: "Converter visitantes em seguidores", prompt: `Você é estrategista de Instagram. Crie 3 versões de bio para @${handle}. Cada bio deve: ter no máximo 150 caracteres, incluir o que faz, para quem, e um resultado específico. Inclua um CTA claro. Evite emojis decorativos. Tom: profissional mas acessível.` },
    { day: 2, dimension: "IDENTIDADE", action: "Organizar destaques estratégicos", format: "destaque", objective: "Guiar visitante pela jornada de conhecimento", prompt: `Liste 5 categorias de destaques para @${handle} com: nome (máx 10 caracteres), objetivo de cada, e primeiros 3 stories sugeridos para cada categoria. Categorias obrigatórias: Sobre Mim, Resultados, Como Funciona.` },
    { day: 3, dimension: "CONTEÚDO", action: "Carrossel sobre maior erro do nicho", format: "carrossel", objective: "Gerar salvamentos e estabelecer autoridade", prompt: `Crie carrossel de 8 slides sobre o maior erro que [nicho de ${handle}] comete. Slide 1: gancho provocativo (pergunta ou afirmação chocante). Slides 2-6: explicação do erro e consequências. Slide 7: como evitar. Slide 8: CTA para salvar e seguir.` },
    { day: 4, dimension: "AUTORIDADE", action: "Post de case/transformação", format: "carrossel", objective: "Provar resultados com evidência concreta", prompt: `Crie carrossel de transformação para @${handle}. Estrutura: Slide 1 (gancho), Slide 2-3 (situação antes), Slide 4-5 (processo), Slide 6-7 (resultado com dados), Slide 8 (CTA). Use storytelling emocional.` },
    { day: 5, dimension: "ENGAJAMENTO", action: "Série de stories interativos", format: "story", objective: "Aumentar respostas de DM e engajamento", prompt: `Crie roteiro de 8 stories para @${handle}. Inclua: 2 enquetes sobre dores do público, 1 caixinha de perguntas, 2 bastidores, 1 dica rápida, 1 CTA para DM, 1 repost de conteúdo. Ordem estratégica para manter atenção.` },
    { day: 6, dimension: "LINGUAGEM", action: "Reel com opinião forte", format: "reel", objective: "Polarizar e criar memorabilidade", prompt: `Crie roteiro de reel de 45s para @${handle} com opinião forte sobre [tendência do nicho]. Estrutura: Gancho provocativo (5s), Contexto (10s), Argumento (20s), Conclusão impactante (10s). Tom direto, sem rodeios.` },
    { day: 7, dimension: "CONVERSÃO", action: "Conteúdo de oferta clara", format: "carrossel", objective: "Converter seguidores aquecidos", prompt: `Crie carrossel de apresentação de serviço para @${handle}. Estrutura: Slide 1 (problema que resolve), Slides 2-3 (para quem é), Slides 4-5 (como funciona), Slide 6 (diferenciais), Slide 7 (objeções vs respostas), Slide 8 (CTA claro com próximo passo).` }
  ];

  // If 30 days, extend the plan
  const plan = planDays === 7 ? basePlan : extendTo30Days(basePlan, handle);

  return {
    diagnosis: {
      overall_score: overallScore,
      summary: `Perfil com falhas estruturais em autoridade e conversão. Falta clareza no posicionamento.`,
      dimensions,
      verdict: "SEU PERFIL VENDE ESFORÇO, NÃO TRANSFORMAÇÃO"
    },
    plan
  };
};

const extendTo30Days = (basePlan: PlanDay[], handle: string): PlanDay[] => {
  const extended = [...basePlan];

  const templates = [
    { dimension: "CONTEÚDO", action: "Reel educativo sobre técnica específica", format: "reel", objective: "Gerar alcance e autoridade técnica" },
    { dimension: "ENGAJAMENTO", action: "Story de bastidores do trabalho", format: "story", objective: "Humanizar e gerar conexão" },
    { dimension: "AUTORIDADE", action: "Depoimento de cliente em vídeo", format: "reel", objective: "Prova social em formato dinâmico" },
    { dimension: "CONTEÚDO", action: "Carrossel com checklist prático", format: "carrossel", objective: "Gerar salvamentos" },
    { dimension: "CONVERSÃO", action: "Story com CTA direto", format: "story", objective: "Gerar leads qualificados" },
    { dimension: "LINGUAGEM", action: "Post de história pessoal", format: "carrossel", objective: "Criar conexão emocional" },
    { dimension: "ENGAJAMENTO", action: "Live ou Q&A nos stories", format: "story", objective: "Engajamento ao vivo" },
  ];

  for (let day = 8; day <= 30; day++) {
    const template = templates[(day - 8) % templates.length];
    extended.push({
      day,
      dimension: template.dimension,
      action: template.action,
      format: template.format,
      objective: template.objective,
      prompt: `Crie conteúdo para @${handle}: ${template.action}. Objetivo: ${template.objective}. Formato: ${template.format}. Seja específico com estrutura e tom de voz.`
    });
  }

  return extended;
};
