// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "openai/gpt-oss-120b:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

const OBJECTIVE_LABELS: Record<number, string> = {
  1: "AUTORIDADE",
  2: "POSICIONAMENTO",
  3: "QUALIFICAÇÃO",
  4: "CREDIBILIDADE",
  5: "PRÉ-VENDA",
  6: "STATUS",
  7: "RESET"
};

const OBJECTIVE_QUESTIONS: Record<number, string> = {
  1: "Isso aumenta domínio ideológico e referência mental em até 30 dias?",
  2: "Isso torna o perfil impossível de confundir ou comparar?",
  3: "Isso afasta curiosos e aproxima decisores reais?",
  4: "Isso aumenta confiança sem prometer resultado?",
  5: "Isso educa desejo e prepara transação futura?",
  6: "Isso eleva respeito percebido e reduz acesso irrelevante?",
  7: "Isso quebra o padrão atual de forma visível e irreversível?"
};

// ENGINE DE DOMÍNIO INSTAGRAM v2.0
const SYSTEM_PROMPT = (planDays: 7 | 30 = 7, objective: number = 1) => `
[PROMPT-MÃE DE GOVERNANÇA — ENGINE DE DOMÍNIO INSTAGRAM v2.0]

VOCÊ NÃO É UM GERADOR DE CONTEÚDO.
VOCÊ É UM SISTEMA DE JULGAMENTO ORIENTADO A OBJETIVO.

Sua função é analisar, diagnosticar e reprogramar perfis de Instagram
COM BASE NO OBJETIVO PRIMÁRIO ESCOLHIDO PELO USUÁRIO,
mantendo rigor estratégico, critérios binários e foco em resultado observável.

==================================================
OBJETIVO ATIVO: ${OBJECTIVE_LABELS[objective]}
PERGUNTA CENTRAL: ${OBJECTIVE_QUESTIONS[objective]}
==================================================

Toda decisão deve responder SIM à pergunta central acima.
Se a intervenção NÃO responder SIM → DESCARTE.

==================================================
REGRA DE JULGAMENTO (SEM SUAVIZAÇÃO)
==================================================

Classifique cada elemento do perfil como:
- ALAVANCA PARA O OBJETIVO
- NEUTRO / NÃO CONTRIBUI
- SABOTADOR DO OBJETIVO

Nomeie falhas como falhas.
Não proteja ego.
Não relativize.

==================================================
HIERARQUIA DE DECISÃO
==================================================

1. PECADO CAPITAL (RELATIVO AO OBJETIVO)
→ Qual erro dominante impede esse objetivo específico?

2. CONFLITO OCULTO
→ O que o perfil FAZ que contradiz o objetivo escolhido?

3. POSICIONAMENTO ATUAL
→ Commodity | Aspirante | Autoridade | Dominador

4. AÇÃO DE MAIOR ALAVANCAGEM
→ Qual única ação move o ponteiro do objetivo mais rápido?

==================================================
DISSECAÇÃO DO PERFIL (COM FOCO NO OBJETIVO)
==================================================

Analise: BIO, FEED, STORIES, PROVAS, OFERTAS, LINGUAGEM
Interprete TUDO à luz do objetivo ativo.
O mesmo elemento pode ser bom para um objetivo e ruim para outro.

==================================================
MODOS DE FALHA (ATIVAR QUANDO NECESSÁRIO)
==================================================

[MODO PERFIL PEQUENO] - Priorize tese e corte. Proibido fingir autoridade.
[MODO SEM PROVAS] - Substitua promessas por processo e raciocínio.
[MODO SEM OFERTA] - Construa pré-oferta antes de escalar plano.
[MODO NICHO SATURADO] - Aumente polarização e exclusão.
[MODO CONFLITO DE OBJETIVO] - Bloqueie ações que contradizem objetivo.

==================================================
CRITÉRIOS DE IRREVERSIBILIDADE
==================================================

Todo plano deve conter pelo menos UM:
- conteúdo que exclui parte do público
- declaração que impede retorno ao genérico
- mudança visível de postura ou linguagem
- movimento explícito em direção ao objetivo

==================================================
FORMATO DE RESPOSTA (JSON OBRIGATÓRIO)
==================================================

{
  "diagnosis": {
    "objetivo_ativo": "${OBJECTIVE_LABELS[objective]}",
    "pecado_capital": "Erro dominante que impede esse objetivo",
    "conflito_oculto": "O que o perfil faz que contradiz o objetivo",
    "posicionamento": "commodity" | "aspirante" | "autoridade" | "dominador",
    "acao_alavancagem": "Única ação de maior impacto",
    "sentenca": "Veredicto brutal em até 10 palavras",
    "dissecacao": {
      "bio": { "status": "alavanca" | "neutro" | "sabotador", "veredicto": "string" },
      "feed": { "status": "alavanca" | "neutro" | "sabotador", "veredicto": "string" },
      "stories": { "status": "alavanca" | "neutro" | "sabotador", "veredicto": "string" },
      "provas": { "status": "alavanca" | "neutro" | "sabotador", "veredicto": "string" },
      "ofertas": { "status": "alavanca" | "neutro" | "sabotador", "veredicto": "string" },
      "linguagem": { "status": "alavanca" | "neutro" | "sabotador", "veredicto": "string" }
    },
    "modo_falha": "pequeno" | "sem_provas" | "sem_oferta" | "nicho_saturado" | null
  },
  "plan": [
    {
      "day": 1,
      "objetivo_psicologico": "Ligado ao objetivo ${OBJECTIVE_LABELS[objective]}",
      "acao": "Ação única e específica",
      "formato": "story | post | reel | bio | destaque | carrossel",
      "ferramenta": "stories | feed | reels | bio | destaques",
      "tipo": "queima_ponte" | "excludente" | "tensao_maxima" | "movimento_dinheiro" | "padrao",
      "prompt": "Prompt reutilizável com [PLACEHOLDERS]. Proibido respostas genéricas."
    }
  ]
}

REGRAS:
- Gere EXATAMENTE ${planDays} dias de plano.
- TODAS as ações devem servir ao objetivo ${OBJECTIVE_LABELS[objective]}.
- Inclua pelo menos: 1 queima_ponte, 1 excludente, 1 tensao_maxima, 1 movimento_dinheiro.
- Retorne APENAS o JSON.
`;

export interface Dissecacao {
  bio: { status: 'alavanca' | 'neutro' | 'sabotador'; veredicto: string };
  feed: { status: 'alavanca' | 'neutro' | 'sabotador'; veredicto: string };
  stories: { status: 'alavanca' | 'neutro' | 'sabotador'; veredicto: string };
  provas: { status: 'alavanca' | 'neutro' | 'sabotador'; veredicto: string };
  ofertas: { status: 'alavanca' | 'neutro' | 'sabotador'; veredicto: string };
  linguagem: { status: 'alavanca' | 'neutro' | 'sabotador'; veredicto: string };
}

export interface Diagnosis {
  objetivo_ativo: string;
  pecado_capital: string;
  conflito_oculto: string;
  posicionamento: 'commodity' | 'aspirante' | 'autoridade' | 'dominador';
  acao_alavancagem: string;
  sentenca: string;
  dissecacao: Dissecacao;
  modo_falha: 'pequeno' | 'sem_provas' | 'sem_oferta' | 'nicho_saturado' | null;
}

export interface PlanDay {
  day: number;
  objetivo_psicologico: string;
  acao: string;
  formato: string;
  ferramenta: string;
  tipo: 'queima_ponte' | 'excludente' | 'tensao_maxima' | 'movimento_dinheiro' | 'padrao';
  prompt: string;
}

export interface AnalysisResult {
  diagnosis: Diagnosis;
  plan: PlanDay[];
}

export const analyzeProfile = async (handle: string, planDays: 7 | 30 = 7, objective: number = 1): Promise<AnalysisResult> => {
  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'LuzzIA Engine v2.0'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(planDays, objective) },
          { role: 'user', content: `ALVO: @${handle}. OBJETIVO: ${OBJECTIVE_LABELS[objective]}. Execute dissecação completa. Plano de ${planDays} dias. ZERO piedade.` }
        ],
        temperature: 0.85,
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
    return simulateAnalysis(handle, planDays, objective);
  }
};

const simulateAnalysis = (handle: string, planDays: 7 | 30, objective: number): AnalysisResult => {
  const objectiveLabel = OBJECTIVE_LABELS[objective];

  const diagnosis: Diagnosis = {
    objetivo_ativo: objectiveLabel,
    pecado_capital: `Para ${objectiveLabel}: O perfil não comunica uma tese clara. Falta posição ideológica que justifique o seguir.`,
    conflito_oculto: `O perfil tenta agradar todos, o que é incompatível com ${objectiveLabel}. A generalização sabota o objetivo.`,
    posicionamento: "commodity",
    acao_alavancagem: `Declarar uma posição única no nicho que seja impossível de ignorar. Isso ataca diretamente o objetivo de ${objectiveLabel}.`,
    sentenca: "SEM TESE CLARA, VOCÊ É MAIS UM NA MULTIDÃO.",
    dissecacao: {
      bio: {
        status: "sabotador",
        veredicto: `Bio genérica que não serve ao objetivo de ${objectiveLabel}. Precisa de declaração de território.`
      },
      feed: {
        status: "neutro",
        veredicto: `Feed não alavanca ${objectiveLabel}. Mistura conteúdos sem direção estratégica clara.`
      },
      stories: {
        status: "sabotador",
        veredicto: `Stories de entretenimento puro. Não servem ao objetivo de ${objectiveLabel}.`
      },
      provas: {
        status: "sabotador",
        veredicto: `Sem provas específicas que suportem ${objectiveLabel}. Apenas afirmações genéricas.`
      },
      ofertas: {
        status: "sabotador",
        veredicto: `Sem estrutura de oferta. Impossível alcançar ${objectiveLabel} sem caminho de conversão.`
      },
      linguagem: {
        status: "neutro",
        veredicto: `Linguagem correta mas sem força. Não comunica ${objectiveLabel} com clareza.`
      }
    },
    modo_falha: "sem_oferta"
  };

  const basePlan: PlanDay[] = [
    {
      day: 1,
      objetivo_psicologico: `[${objectiveLabel}] Declarar território mental. O público precisa entender exatamente QUAL problema você domina.`,
      acao: "Reescrever bio como manifesto de domínio",
      formato: "bio",
      ferramenta: "bio",
      tipo: "queima_ponte",
      prompt: `OBJETIVO: ${objectiveLabel}

Crie uma bio de Instagram para @[HANDLE] que funcione como DECLARAÇÃO DE TERRITÓRIO.

CONTEXTO:
- Nicho: [SEU NICHO]
- Público-alvo: [QUEM VOCÊ ATENDE]
- Resultado principal: [O QUE VOCÊ ENTREGA]

REGRAS:
1. Máximo 150 caracteres
2. Linha 1: Afirmação de domínio (não descrição)
3. Linha 2: Para quem é (com exclusão implícita)
4. Linha 3: Prova ou escassez
5. PROIBIDO: emojis decorativos, listas, frases motivacionais

Gere 3 versões, da mais agressiva para a menos.
PROIBIDO respostas genéricas.`
    },
    {
      day: 2,
      objetivo_psicologico: `[${objectiveLabel}] Estabelecer tese única. O público deve sair com UMA ideia que só você defende.`,
      acao: "Publicar carrossel de tese polarizadora",
      formato: "carrossel",
      ferramenta: "feed",
      tipo: "tensao_maxima",
      prompt: `OBJETIVO: ${objectiveLabel}

Crie carrossel de 7 slides que estabeleça uma TESE ÚNICA para @[HANDLE].

CONTEXTO:
- Crença dominante do mercado que você discorda: [CRENÇA]
- Sua posição contrária: [SUA TESE]

ESTRUTURA:
1. Afirmação polêmica (gancho)
2. "O mercado acredita que..."
3. "O problema é que..."
4. "O que eu descobri..."
5. Exemplo concreto
6. Sua tese em uma frase
7. CTA de debate

Cada slide: máximo 30 palavras.
Deve gerar discordância em 30% do público.`
    },
    {
      day: 3,
      objetivo_psicologico: `[${objectiveLabel}] Filtrar audiência. Deixar claro para quem você NÃO é.`,
      acao: "Publicar sequência de exclusão consciente",
      formato: "story",
      ferramenta: "stories",
      tipo: "excludente",
      prompt: `OBJETIVO: ${objectiveLabel}

Crie 5 stories que AFASTEM ativamente quem não é cliente ideal.

CONTEXTO:
- Quem você NÃO atende: [3 TIPOS]
- Por que não atende: [RAZÃO]
- Quem QUER atrair: [PERFIL IDEAL]

ESTRUTURA:
1. "Vou ser direto sobre algo"
2. "Eu NÃO trabalho com..."
3. "Porque..." (justificativa que valoriza ideal)
4. "Quem eu QUERO:"
5. "Se você se encaixa, responde com [PALAVRA]"

A exclusão deve ser REAL, não performática.`
    },
    {
      day: 4,
      objetivo_psicologico: `[${objectiveLabel}] Demonstrar processo. Mostrar competência sem entregar a receita.`,
      acao: "Publicar reel de bastidor estratégico",
      formato: "reel",
      ferramenta: "reels",
      tipo: "padrao",
      prompt: `OBJETIVO: ${objectiveLabel}

Crie roteiro de reel de 45s mostrando BASTIDOR sem ensinar processo completo.

CONTEXTO:
- Trabalho recente: [DESCREVA]
- Resultado: [DESCREVA]

ESTRUTURA:
0-5s: Cena do resultado
5-15s: "A maioria faz [CONVENCIONAL]. Eu não."
15-30s: 2-3 passos do SEU processo (sem detalhar)
30-40s: Resultado + número
40-45s: CTA sutil

Narração em primeira pessoa.
PROIBIDO: "3 dicas", "assista até o final".`
    },
    {
      day: 5,
      objetivo_psicologico: `[${objectiveLabel}] Movimento de dinheiro. Testar prontidão do público para comprar.`,
      acao: "Fazer pré-oferta com escassez real",
      formato: "story",
      ferramenta: "stories",
      tipo: "movimento_dinheiro",
      prompt: `OBJETIVO: ${objectiveLabel}

Crie sequência de stories de PRÉ-OFERTA.

CONTEXTO:
- O que você vende: [OFERTA]
- Vagas/prazo: [ESCASSEZ REAL]
- Para quem: [PERFIL]

ESTRUTURA (6 stories):
1. "Pensando em abrir algo..."
2. "Não vou abrir para todo mundo"
3. Descrição + resultado esperado
4. Critérios de participação (filtro)
5. "Se quer, responde com [PALAVRA]"
6. "Fecho amanhã às [HORA]"

Escassez REAL, não fabricada.`
    },
    {
      day: 6,
      objetivo_psicologico: `[${objectiveLabel}] Gerar tensão social. Mostrar custo da inação.`,
      acao: "Publicar conteúdo de custo de oportunidade",
      formato: "carrossel",
      ferramenta: "feed",
      tipo: "tensao_maxima",
      prompt: `OBJETIVO: ${objectiveLabel}

Crie carrossel de 5 slides sobre CUSTO DA INAÇÃO.

CONTEXTO:
- Problema do público: [PROBLEMA]
- Consequência: [O QUE ACONTECE]
- Sua solução: [OFERTA]

ESTRUTURA:
1. "O que te custou não fazer [AÇÃO]?"
2. 3 custos invisíveis (dinheiro, tempo, oportunidade)
3. "Enquanto você espera, [CONCORRÊNCIA]..."
4. Caso de quem agiu
5. "A pergunta é QUANDO, não SE."

Tom de constatação fria, não manipulação.`
    },
    {
      day: 7,
      objetivo_psicologico: `[${objectiveLabel}] Consolidar posição. Fechar semana com clareza absoluta.`,
      acao: "Atualizar destaque de posicionamento",
      formato: "destaque",
      ferramenta: "destaques",
      tipo: "padrao",
      prompt: `OBJETIVO: ${objectiveLabel}

Crie roteiro para DESTAQUE de posicionamento.

CONTEXTO:
- Quem você é: [DESCRIÇÃO]
- Diferencial: [O QUE FAZ DIFERENTE]
- Público: [PARA QUEM]

ESTRUTURA (7-10 stories):
1. Quem eu sou (1 frase)
2. Problema que resolvo
3. Por que eu, não outro
4. Como trabalho
5-6. Provas/números
7. Para quem é
8. Para quem NÃO é
9. Próximo passo (CTA)

Cada story: máximo 15 palavras.
Fundo sólido, texto grande.`
    }
  ];

  const plan = planDays === 7 ? basePlan : extendTo30Days(basePlan, objectiveLabel);
  return { diagnosis, plan };
};

const extendTo30Days = (basePlan: PlanDay[], objectiveLabel: string): PlanDay[] => {
  const extended = [...basePlan];
  const advancedActions: Omit<PlanDay, 'day'>[] = [
    { objetivo_psicologico: `[${objectiveLabel}] Criar prova social estratégica`, acao: "Coletar depoimento específico", formato: "story", ferramenta: "stories", tipo: "padrao", prompt: `OBJETIVO: ${objectiveLabel}\nCrie roteiro para coleta de depoimento focado em TRANSFORMAÇÃO MENSURÁVEL.` },
    { objetivo_psicologico: `[${objectiveLabel}] Atacar inimigo do nicho`, acao: "Declarar guerra a prática comum", formato: "carrossel", ferramenta: "feed", tipo: "queima_ponte", prompt: `OBJETIVO: ${objectiveLabel}\nCrie carrossel declarando GUERRA a prática errada do nicho.` },
    { objetivo_psicologico: `[${objectiveLabel}] Gerar FOMO real`, acao: "Bastidor de cliente em ação", formato: "reel", ferramenta: "reels", tipo: "tensao_maxima", prompt: `OBJETIVO: ${objectiveLabel}\nCrie reel mostrando cliente executando, tom de 'isso poderia ser você'.` },
    { objetivo_psicologico: `[${objectiveLabel}] Polarizar audiência`, acao: "Micro-conteúdo de opinião forte", formato: "post", ferramenta: "feed", tipo: "excludente", prompt: `OBJETIVO: ${objectiveLabel}\nCrie post de ÚNICA frase polarizadora.` },
    { objetivo_psicologico: `[${objectiveLabel}] Criar oferta secundária`, acao: "Apresentar produto de entrada", formato: "story", ferramenta: "stories", tipo: "movimento_dinheiro", prompt: `OBJETIVO: ${objectiveLabel}\nCrie sequência para produto de entrada como filtro para oferta principal.` },
    { objetivo_psicologico: `[${objectiveLabel}] Demonstrar profundidade`, acao: "Análise longa de caso", formato: "carrossel", ferramenta: "feed", tipo: "padrao", prompt: `OBJETIVO: ${objectiveLabel}\nCrie carrossel de 10 slides analisando caso em profundidade.` },
  ];

  for (let day = 8; day <= 30; day++) {
    const template = advancedActions[(day - 8) % advancedActions.length];
    extended.push({ ...template, day });
  }
  return extended;
};
