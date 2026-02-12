const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8787' : '');
const API_KEY = import.meta.env.VITE_API_KEY || '';
const ENABLE_SIMULATION_FALLBACK = import.meta.env.VITE_ALLOW_SIMULATION_FALLBACK === 'true';

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

// ENGINE DE DOMÍNIO INSTAGRAM v2.1
const SYSTEM_PROMPT = (planDays: 7 | 30 = 7, objective: number = 1) => `
[ENGINE DE DOMÍNIO INSTAGRAM v2.1]

VOCÊ É UM SISTEMA DE JULGAMENTO.
NÃO PROTEJA O EGO. NÃO SUAVIZE. NÃO RELATIVIZE.

==================================================
OBJETIVO ATIVO: ${OBJECTIVE_LABELS[objective]}
PERGUNTA DE JULGAMENTO: ${OBJECTIVE_QUESTIONS[objective]}
==================================================

INSTRUÇÕES:
- Você receberá DADOS REAIS do perfil (bio, posts, métricas)
- Use APENAS os dados fornecidos para análise
- NÃO invente dados que não foram fornecidos
- Se algum dado estiver ausente, registre como "não disponível"

==================================================
FORMATO DE RESPOSTA (JSON)
==================================================

{
  "leitura_perfil": {
    "bio_completa": "Transcrição exata da bio encontrada",
    "posts_analisados": ["Descrição do post 1", "Descrição do post 2", ...],
    "destaques_encontrados": ["Nome destaque 1", "Nome destaque 2"],
    "stories_recentes": "Descrição geral dos stories se houver",
    "metricas_visiveis": {
      "seguidores": "número ou null",
      "seguindo": "número ou null", 
      "posts_total": "número ou null"
    },
    "impressao_geral": "Primeira impressão em uma frase"
  },
  "diagnosis": {
    "objetivo_ativo": "${OBJECTIVE_LABELS[objective]}",
    "pecado_capital": "Erro dominante. Seja brutal. Sem eufemismos.",
    "conflito_oculto": "O que o perfil FAZ que contradiz o objetivo",
    "posicionamento": "commodity | aspirante | autoridade | dominador",
    "acao_alavancagem": "UMA ação. A mais importante. Nada mais.",
    "sentenca": "Máximo 10 palavras. Deve doer.",
    "dissecacao": {
      "bio": { "status": "alavanca | neutro | sabotador", "veredicto": "Julgamento direto" },
      "feed": { "status": "alavanca | neutro | sabotador", "veredicto": "Julgamento direto" },
      "stories": { "status": "alavanca | neutro | sabotador", "veredicto": "Julgamento direto" },
      "provas": { "status": "alavanca | neutro | sabotador", "veredicto": "Julgamento direto" },
      "ofertas": { "status": "alavanca | neutro | sabotador", "veredicto": "Julgamento direto" },
      "linguagem": { "status": "alavanca | neutro | sabotador", "veredicto": "Julgamento direto" }
    },
    "modo_falha": "pequeno | sem_provas | sem_oferta | nicho_saturado | null"
  },
  "plan": [
    {
      "day": 1,
      "objetivo_psicologico": "O que esse dia CAUSA no público. Ligado a ${OBJECTIVE_LABELS[objective]}.",
      "acao": "UMA ação específica. Sem alternativas.",
      "formato": "story | post | reel | bio | destaque | carrossel",
      "ferramenta": "stories | feed | reels | bio | destaques",
      "tipo": "queima_ponte | excludente | tensao_maxima | movimento_dinheiro | padrao",
      "prompt": "PROMPT VISCERAL - ver instrução abaixo"
    }
  ]
}

==================================================
DNA DOS PROMPTS (OBRIGATÓRIO EM CADA DIA)
==================================================

Cada prompt DEVE:
1. Começar com "SISTEMA: Você é implacável. Não protege ego. Não suaviza."
2. Declarar o OBJETIVO em maiúsculas
3. Usar verbos de COMANDO (crie, escreva, produza, gere)
4. Proibir explicitamente o que NÃO PODE conter
5. Ter [PLACEHOLDERS] claros para preenchimento
6. Incluir EXEMPLOS concretos quando possível
7. Terminar com "PROIBIDO: respostas genéricas, clichês, linguagem motivacional."

EXEMPLO DE PROMPT VISCERAL:

"SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR BIO QUE DECLARA TERRITÓRIO

Escreva uma bio de Instagram para @[HANDLE] que funcione como MANIFESTO, não descrição.

CONTEXTO OBRIGATÓRIO:
- Nicho: [SEU NICHO ESPECÍFICO]
- Público: [QUEM VOCÊ ATENDE - com critério de exclusão]
- Resultado entregue: [TRANSFORMAÇÃO CONCRETA]

ESTRUTURA:
Linha 1: Afirmação de domínio. Não 'eu ajudo'. Sim 'eu faço X acontecer'.
Linha 2: Para quem é. Com exclusão implícita.
Linha 3: Prova ou escassez. Número ou deadline.

EXEMPLOS QUE FUNCIONAM:
- 'Advogados que cobram 10x mais passaram por aqui. Agenda até março.'
- 'Estratégia para quem quer clientes, não seguidores. Não ensino dancinhas.'
- 'Faço donos de academia pararem de trabalhar no balcão. 147 formados.'

PROIBIDO: respostas genéricas, emojis decorativos, listas de serviços, frases motivacionais, palavras como 'ajudo', 'auxílio', 'suporte'."

==================================================
REGRAS FINAIS
==================================================

- Gere EXATAMENTE ${planDays} dias
- TODAS as ações servem a ${OBJECTIVE_LABELS[objective]}
- Mínimo obrigatório: 1 queima_ponte, 1 excludente, 1 tensao_maxima, 1 movimento_dinheiro
- Se não conseguir ler o perfil, diga claramente no campo leitura_perfil
- Retorne APENAS JSON válido
`;

export interface LeituraPerfil {
  bio_completa: string;
  posts_analisados: string[];
  destaques_encontrados: string[];
  stories_recentes: string;
  metricas_visiveis: {
    seguidores: string | null;
    seguindo: string | null;
    posts_total: string | null;
  };
  impressao_geral: string;
}

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
  leitura_perfil: LeituraPerfil;
  diagnosis: Diagnosis;
  plan: PlanDay[];
}

export interface InstagramProfileData {
  username: string;
  fullName: string | null;
  biography: string | null;
  externalUrl: string | null;
  followersCount: number | null;
  followingCount: number | null;
  postsCount: number | null;
  isVerified: boolean;
  isPrivate: boolean;
  profilePicUrl: string | null;
  highlightNames: string[];
  recentPosts: {
    caption: string;
    likesCount: number;
    commentsCount: number;
    isVideo: boolean;
  }[];
  scrapedAt: string;
  error: string | null;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
  rawScrapedData?: InstagramProfileData | null;
  clientId?: string;
  usage?: UsageInfo;
  meta?: {
    modelUsed?: string;
  };
}

export interface UsageInfo {
  freeUsed: boolean;
  creditsRemaining: number;
  totalUsed: number;
  packages: number[];
}

export interface UsageResponse {
  clientId: string;
  usage: UsageInfo;
}

export class ApiError extends Error {
  status: number;
  code: string;
  usage?: UsageInfo;
  clientId?: string;

  constructor(message: string, status: number, code = 'API_ERROR', usage?: UsageInfo, clientId?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.usage = usage;
    this.clientId = clientId;
  }
}

const getClientId = () => {
  const key = 'luzzia_client_id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = `cli_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(key, created);
  return created;
};

export const analyzeProfile = async (
  handle: string,
  planDays: 7 | 30 = 7,
  objective: number = 1
): Promise<AnalyzeResponse> => {
  try {
    const clientId = getClientId();
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CLIENT-ID': clientId,
        ...(API_KEY ? { 'X-API-KEY': API_KEY } : {})
      },
      body: JSON.stringify({ handle, planDays, objective })
    });

    if (!response.ok) {
      let payload: any = null;
      try {
        payload = await response.json();
      } catch {
        // ignore parse issues
      }
      const code = payload?.error || 'API_ERROR';
      const msg = payload?.message || payload?.error || `Erro ${response.status} ao acessar /api/analyze`;
      throw new ApiError(msg, response.status, code, payload?.usage, payload?.clientId);
    }

    const data = await response.json();
    return data as AnalyzeResponse;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (!ENABLE_SIMULATION_FALLBACK) {
      throw new ApiError('Backend indisponível. Tente novamente em instantes.', 503, 'BACKEND_UNAVAILABLE');
    }
    console.warn('Backend indisponivel, usando simulacao local:', error);
    return {
      result: simulateAnalysis(handle, planDays, objective),
      rawScrapedData: {
        username: handle.replace('@', ''),
        fullName: null,
        biography: null,
        externalUrl: null,
        followersCount: null,
        followingCount: null,
        postsCount: null,
        isVerified: false,
        isPrivate: false,
        profilePicUrl: null,
        highlightNames: [],
        recentPosts: [],
        scrapedAt: new Date().toISOString(),
        error: 'Backend offline: iniciando diagnostico simulado.'
      },
      clientId: getClientId(),
      usage: {
        freeUsed: false,
        creditsRemaining: 0,
        totalUsed: 0,
        packages: [3, 10, 30]
      }
    };
  }
};

export const getUsage = async (): Promise<UsageResponse> => {
  const clientId = getClientId();
  const response = await fetch(`${API_BASE_URL}/api/usage`, {
    headers: {
      'X-CLIENT-ID': clientId,
      ...(API_KEY ? { 'X-API-KEY': API_KEY } : {})
    }
  });
  if (!response.ok) {
    throw new ApiError(`Erro ${response.status} ao consultar uso`, response.status);
  }
  return response.json();
};

const simulateAnalysis = (handle: string, planDays: 7 | 30, objective: number): AnalysisResult => {
  const objectiveLabel = OBJECTIVE_LABELS[objective];

  const leitura_perfil: LeituraPerfil = {
    bio_completa: `[SIMULAÇÃO] Bio de @${handle} não pôde ser lida em tempo real. Usando análise simulada para demonstração.`,
    posts_analisados: [
      "[SIM] Post 1: Conteúdo genérico sobre o nicho",
      "[SIM] Post 2: Dicas básicas sem posicionamento claro",
      "[SIM] Post 3: Conteúdo motivacional sem profundidade"
    ],
    destaques_encontrados: ["Sobre", "Serviços", "Depoimentos"],
    stories_recentes: "[SIM] Stories de bastidores sem direcionamento estratégico",
    metricas_visiveis: {
      seguidores: "~5k",
      seguindo: "~800",
      posts_total: "~150"
    },
    impressao_geral: "Perfil genérico que tenta agradar todos e não se destaca em nada."
  };

  const diagnosis: Diagnosis = {
    objetivo_ativo: objectiveLabel,
    pecado_capital: `PARA ${objectiveLabel}: Ausência de tese. O perfil não defende nada. Não ataca nada. É neutro demais para gerar qualquer reação.`,
    conflito_oculto: `O perfil quer ${objectiveLabel.toLowerCase()}, mas age como commodity. Fala para todos, logo não fala para ninguém.`,
    posicionamento: "commodity",
    acao_alavancagem: `Reescrever bio como DECLARAÇÃO DE GUERRA. Escolher um inimigo. Deixar claro para quem NÃO é.`,
    sentenca: "VOCÊ É INVISÍVEL. NINGUÉM LEMBRA DE VOCÊ.",
    dissecacao: {
      bio: {
        status: "sabotador",
        veredicto: `Bio de${objectiveLabel}: Lista de coisas que faz. Não comunica POR QUE seguir. Zero urgência.`
      },
      feed: {
        status: "neutro",
        veredicto: `Feed inofensivo. Não gera tensão, não gera desejo, não gera ação.`
      },
      stories: {
        status: "sabotador",
        veredicto: `Stories de entretenimento. Treinam o público a consumir, não a comprar.`
      },
      provas: {
        status: "sabotador",
        veredicto: `Provas genéricas ou inexistentes. "Obrigado pelo atendimento" não é prova.`
      },
      ofertas: {
        status: "sabotador",
        veredicto: `Sem estrutura de oferta. Link na bio leva para página fria.`
      },
      linguagem: {
        status: "neutro",
        veredicto: `Linguagem correta mas sem força. Parece artigo de blog, não voz de autoridade.`
      }
    },
    modo_falha: "sem_oferta"
  };

  const basePlan: PlanDay[] = [
    {
      day: 1,
      objetivo_psicologico: `[${objectiveLabel}] DECLARAR TERRITÓRIO. O público deve entender em 3 segundos o que você domina e para quem é.`,
      acao: "Reescrever bio como manifesto de domínio",
      formato: "bio",
      ferramenta: "bio",
      tipo: "queima_ponte",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR BIO QUE DECLARA TERRITÓRIO PARA ${objectiveLabel}

Escreva uma bio de Instagram para @[HANDLE] que funcione como MANIFESTO, não descrição.

CONTEXTO OBRIGATÓRIO:
- Nicho: [SEU NICHO ESPECÍFICO]
- Público: [QUEM VOCÊ ATENDE - com critério de exclusão]
- Resultado entregue: [TRANSFORMAÇÃO CONCRETA, não processo]

ESTRUTURA EXATA:
Linha 1: Afirmação de domínio. VERBO FORTE + RESULTADO. Não "eu ajudo". Sim "eu faço X acontecer".
Linha 2: Para quem é + exclusão implícita. "Para X que Y. Não para Z."
Linha 3: Prova ou escassez. Número real ou deadline.

EXEMPLOS QUE FUNCIONAM:
- "Advogados que cobram 10x mais passaram por aqui. Agenda até março."
- "Estratégia para quem quer clientes, não seguidores. Não ensino dancinhas."
- "Faço donos de academia pararem de trabalhar no balcão. 147 formados."

Gere 3 versões: AGRESSIVA, MODERADA, SUTIL.

PROIBIDO: emojis decorativos, listas de serviços, "ajudo/auxílio/suporte", frases motivacionais, descrição de profissão.`
    },
    {
      day: 2,
      objetivo_psicologico: `[${objectiveLabel}] ESTABELECER TESE. O público deve sair com UMA ideia que só você defende.`,
      acao: "Publicar carrossel de tese polarizadora",
      formato: "carrossel",
      ferramenta: "feed",
      tipo: "tensao_maxima",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR CARROSSEL QUE ESTABELECE TESE ÚNICA PARA ${objectiveLabel}

Crie carrossel de 7 slides que faça o público ESCOLHER lados.

CONTEXTO:
- Crença ERRADA do mercado: [O QUE A MAIORIA ACREDITA E ESTÁ ERRADO]
- Sua tese contrária: [SUA POSIÇÃO REAL]
- Por que isso importa: [CONSEQUÊNCIA DE SEGUIR A CRENÇA ERRADA]

ESTRUTURA DOS SLIDES:
1. GANCHO: Afirmação polêmica em 7 palavras máximo. Deve parar scroll.
2. "O mercado inteiro acredita que..." (crença dominante)
3. "O problema é que..." (consequência dessa crença)
4. "O que ninguém te conta..." (sua descoberta/insight)
5. "Na prática isso significa..." (exemplo concreto)
6. SUA TESE EM UMA FRASE. Sem explicação.
7. "Concorda? Discorda? Comenta." (provocação de debate)

REGRAS:
- Cada slide: MÁXIMO 25 palavras
- Deve gerar discordância em 30% do público (isso é bom)
- Linguagem direta, afirmativa, sem "talvez" ou "pode ser"

PROIBIDO: definições óbvias, dicas genéricas, "vou te ensinar", linguagem motivacional.`
    },
    {
      day: 3,
      objetivo_psicologico: `[${objectiveLabel}] FILTRAR AUDIÊNCIA. Afastar ativamente quem não é cliente ideal.`,
      acao: "Sequência de exclusão consciente",
      formato: "story",
      ferramenta: "stories",
      tipo: "excludente",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR STORIES QUE AFASTAM PÚBLICO ERRADO PARA ${objectiveLabel}

Crie 5 stories que façam pessoas ERRADAS pararem de te seguir.

CONTEXTO:
- 3 tipos de pessoas que você NÃO QUER como cliente: [LISTE COM CARACTERÍSTICAS ESPECÍFICAS]
- Por que não quer: [A RAZÃO ESTRATÉGICA]
- Quem você QUER: [PERFIL IDEAL COM CRITÉRIOS]

ESTRUTURA:
Story 1: "Preciso ser honesto sobre algo." (abertura que gera curiosidade)
Story 2: "Eu NÃO trabalho com:" + lista de 3 tipos (sem pedir desculpas)
Story 3: "Porque..." + justificativa que VALORIZA quem é ideal
Story 4: "Quem eu QUERO trabalhando comigo:" + perfil ideal
Story 5: "Se você se vê aqui, responde com [PALAVRA-CHAVE]" + CTA de engajamento

TOM: Você tem o DIREITO de escolher. Não está rejeitando. Está selecionando.

PROIBIDO: pedir desculpas, suavizar ("não é que eles sejam ruins"), linguagem passivo-agressiva.`
    },
    {
      day: 4,
      objetivo_psicologico: `[${objectiveLabel}] DEMONSTRAR COMPETÊNCIA. Mostrar a caixa preta sem entregar a receita.`,
      acao: "Reel de bastidor estratégico",
      formato: "reel",
      ferramenta: "reels",
      tipo: "padrao",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR REEL QUE DEMONSTRA PROCESSO PARA ${objectiveLabel}

Roteiro de 45 segundos que mostra SUA COMPETÊNCIA sem ensinar o processo completo.

CONTEXTO:
- Um trabalho recente que você fez: [DESCREVA O PROJETO]
- O resultado observável: [NÚMERO OU TRANSFORMAÇÃO]
- O que você fez diferente: [SEU DIFERENCIAL NO PROCESSO]

ESTRUTURA DO REEL:
0-5s: Cena do RESULTADO (antes/depois, número, reação do cliente)
5-15s: "A maioria faz [CAMINHO CONVENCIONAL]. Eu não. Eu faço [DIFERENTE]."
15-30s: Mostre 2-3 passos do SEU processo (sem detalhar o como)
30-40s: Resultado novamente + "Foi isso que aconteceu com [CLIENTE/PROJETO]"
40-45s: "Se você quer entender como replico isso, [CTA específico]"

NARRAÇÃO: Primeira pessoa. Tom de quem está compartilhando um segredo.
VISUAL: Mostre complexidade sem explicar (gera percepção de competência)

PROIBIDO: "vou te ensinar", "3 dicas", "assista até o final", música de tendência sem propósito.`
    },
    {
      day: 5,
      objetivo_psicologico: `[${objectiveLabel}] MOVIMENTO DE DINHEIRO. Testar se o público está pronto para pagar.`,
      acao: "Pré-oferta com escassez real",
      formato: "story",
      ferramenta: "stories",
      tipo: "movimento_dinheiro",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR PRÉ-OFERTA PARA ${objectiveLabel}

Sequência de 6 stories que TESTA prontidão de compra do público.

CONTEXTO:
- O que você vai oferecer: [PRODUTO/SERVIÇO ESPECÍFICO]
- Vagas ou prazo: [ESCASSEZ REAL - não invente]
- Resultado esperado: [O QUE A PESSOA VAI CONSEGUIR]
- Para quem é ideal: [PERFIL ESPECÍFICO]

ESTRUTURA:
Story 1: "Estou pensando em abrir algo..." (antecipação, não promessa)
Story 2: "Mas não vou abrir para qualquer pessoa." (exclusividade)
Story 3: Descrição em UMA frase + resultado esperado
Story 4: "Só faz sentido para quem:" + 3 critérios (filtro)
Story 5: "Se você se encaixa, responde com [PALAVRA-CHAVE ESPECÍFICA]"
Story 6: "Fecho amanhã às [HORA]. Depois disso, só em [DATA]." (urgência real)

TOM: Você está OFERECENDO ACESSO, não pedindo venda. Posição de força.

PROIBIDO: explicar demais, justificar preço, garantias excessivas, "não perca", escassez fabricada.`
    },
    {
      day: 6,
      objetivo_psicologico: `[${objectiveLabel}] CRIAR TENSÃO. Mostrar o custo de não agir.`,
      acao: "Carrossel de custo de oportunidade",
      formato: "carrossel",
      ferramenta: "feed",
      tipo: "tensao_maxima",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: MOSTRAR CUSTO DA INAÇÃO PARA ${objectiveLabel}

Carrossel de 5 slides que faz o público SENTIR o que está perdendo.

CONTEXTO:
- Problema que seu público tem: [DOR ESPECÍFICA]
- O que acontece se não resolver: [CONSEQUÊNCIA REAL EM 6-12 MESES]
- O que poderia ter se agisse: [GANHO PERDIDO]

ESTRUTURA:
Slide 1: "Quanto te custou NÃO fazer [AÇÃO] esse ano?" (pergunta que dói)
Slide 2: 3 custos invisíveis - DINHEIRO perdido, TEMPO desperdiçado, OPORTUNIDADE que passou
Slide 3: "Enquanto você espera, [CONCORRENTE/MERCADO] está..." (FOMO real)
Slide 4: Caso de alguém que AGIU (antes/depois com número se possível)
Slide 5: "A pergunta não é SE você vai resolver. É QUANDO. E o QUANDO custa cada dia mais."

TOM: Constatação fria. Você não está ameaçando. Está mostrando o que já está acontecendo.

PROIBIDO: tom de desespero, manipulação emocional barata, promessas irreais.`
    },
    {
      day: 7,
      objetivo_psicologico: `[${objectiveLabel}] CONSOLIDAR POSIÇÃO. Fechar a semana com clareza absoluta.`,
      acao: "Destaque de posicionamento",
      formato: "destaque",
      ferramenta: "destaques",
      tipo: "padrao",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR DESTAQUE DE POSICIONAMENTO PARA ${objectiveLabel}

Roteiro de 8-10 stories para um DESTAQUE que comunica quem você é.

CONTEXTO:
- Quem você é em uma frase: [IDENTIDADE PROFISSIONAL]
- O que você faz diferente: [DIFERENCIAL REAL]
- Para quem trabalha: [PÚBLICO ESPECÍFICO]
- Prova que funciona: [RESULTADO OU NÚMERO]

ESTRUTURA DO DESTAQUE:
1. QUEM SOU - Uma frase. Não história de vida.
2. O PROBLEMA QUE RESOLVO - Dor específica. Não abstração.
3. POR QUE EU - Diferencial em uma frase.
4. COMO TRABALHO - Metodologia resumida.
5. RESULTADOS - 2-3 provas visuais ou números.
6. PARA QUEM É - Perfil ideal.
7. PARA QUEM NÃO É - Exclusão explícita.
8. PRÓXIMO PASSO - CTA claro e único.

REGRAS VISUAIS:
- Cada story: MÁXIMO 15 palavras
- Fundo sólido (preto, branco, ou cor da marca)
- Texto grande e legível
- Sem animações que atrapalhem leitura

PROIBIDO: fotos aleatórias, música que distrai, mais de um CTA, linguagem vaga.`
    }
  ];

  const plan = planDays === 7 ? basePlan : extendTo30Days(basePlan, objectiveLabel);
  return { leitura_perfil, diagnosis, plan };
};

const extendTo30Days = (basePlan: PlanDay[], objectiveLabel: string): PlanDay[] => {
  const extended = [...basePlan];

  const advancedDays: Omit<PlanDay, 'day'>[] = [
    {
      objetivo_psicologico: `[${objectiveLabel}] Criar prova social estratégica`,
      acao: "Coletar e publicar depoimento específico",
      formato: "story",
      ferramenta: "stories",
      tipo: "padrao",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: COLETAR DEPOIMENTO QUE PROVA ${objectiveLabel}

Crie roteiro para solicitar depoimento focado em TRANSFORMAÇÃO MENSURÁVEL.

PERGUNTAS PARA O CLIENTE:
1. "Qual era sua situação ANTES de trabalhar comigo?" (número ou situação concreta)
2. "O que mudou DEPOIS?" (resultado mensurável)
3. "O que teria acontecido se não tivesse feito isso?" (custo evitado)
4. "Para quem você recomendaria?" (filtro de público)

PROIBIDO: depoimentos genéricos tipo "atendimento incrível", "super recomendo".`
    },
    {
      objetivo_psicologico: `[${objectiveLabel}] Atacar inimigo comum`,
      acao: "Declarar guerra a prática errada do nicho",
      formato: "carrossel",
      ferramenta: "feed",
      tipo: "queima_ponte",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: DECLARAR GUERRA A INIMIGO PARA ${objectiveLabel}

Crie carrossel de 6 slides atacando uma PRÁTICA COMUM do seu nicho que você considera ERRADA.

O inimigo não é uma pessoa. É uma PRÁTICA, CRENÇA ou METODOLOGIA.

ESTRUTURA:
1. "O maior erro do [NICHO] que ninguém fala"
2. O que é a prática errada
3. Por que parece fazer sentido (validação do erro)
4. Por que está DESTRUINDO resultados
5. O que funciona no lugar
6. "Se você ainda faz isso, para. Agora."

PROIBIDO: atacar pessoas específicas, ser vago demais, não propor alternativa.`
    },
    {
      objetivo_psicologico: `[${objectiveLabel}] Gerar FOMO real`,
      acao: "Mostrar bastidor de cliente em ação",
      formato: "reel",
      ferramenta: "reels",
      tipo: "tensao_maxima",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR FOMO PARA ${objectiveLabel}

Reel mostrando cliente EXECUTANDO, com tom de "isso poderia ser você".

ESTRUTURA:
0-5s: Cliente trabalhando/implementando algo
5-15s: "Enquanto você pensa se vale a pena, [CLIENTE] está..."
15-30s: Mostrar o que o cliente está fazendo (processo visível)
30-40s: Resultado parcial ou expectativa
40-45s: "Quer ser o próximo? [CTA]"

PROIBIDO: forçar, parecer desesperado, prometer resultados irreais.`
    },
    {
      objetivo_psicologico: `[${objectiveLabel}] Polarizar audiência`,
      acao: "Post de opinião forte",
      formato: "post",
      ferramenta: "feed",
      tipo: "excludente",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: POLARIZAR PARA ${objectiveLabel}

Crie post de UMA frase que divida sua audiência.

A frase deve:
- Ter posição clara (sem "depende")
- Gerar reação emocional
- Atrair quem pensa como você
- Repelir quem não pensa

EXEMPLOS:
- "Quem não tem oferta não tem negócio. Tem hobby."
- "Conteúdo sem intenção de venda é propaganda para concorrente."
- "Se você atende qualquer um, não é expert. É freelancer."

PROIBIDO: explicar demais na legenda, pedir desculpas, suavizar depois.`
    },
    {
      objetivo_psicologico: `[${objectiveLabel}] Criar oferta de entrada`,
      acao: "Lançar produto de baixo ticket",
      formato: "story",
      ferramenta: "stories",
      tipo: "movimento_dinheiro",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: CRIAR OFERTA DE ENTRADA PARA ${objectiveLabel}

Sequência de stories para produto de baixo ticket que FILTRA para oferta principal.

CONTEXTO:
- Produto de entrada: [O QUE É]
- Preço: [VALOR ACESSÍVEL]
- O que resolve: [PROBLEMA ESPECÍFICO]
- Próximo passo depois: [OFERTA PRINCIPAL]

ESTRUTURA:
1. Problema que esse produto resolve
2. O que está incluso
3. Para quem é (e para quem NÃO é)
4. Preço + como comprar
5. "Quem compra hoje, também recebe [BÔNUS]"

PROIBIDO: complicar demais, muitas opções, escassez falsa.`
    },
    {
      objetivo_psicologico: `[${objectiveLabel}] Demonstrar profundidade`,
      acao: "Análise longa de caso",
      formato: "carrossel",
      ferramenta: "feed",
      tipo: "padrao",
      prompt: `SISTEMA: Você é implacável. Não protege ego. Não suaviza.

OBJETIVO: DEMONSTRAR PROFUNDIDADE DE ANÁLISE PARA ${objectiveLabel}

Carrossel de 10 slides analisando UM caso em profundidade.

ESTRUTURA:
1. Título: "Como [RESULTADO] aconteceu: análise completa"
2. Contexto: situação inicial
3-4. O que foi feito (passos principais)
5-6. Obstáculos encontrados
7-8. Como foram superados
9. Resultado final (números)
10. "Uma lição que você pode aplicar hoje"

PROIBIDO: simplificar demais, esconder dificuldades, parecer fácil demais.`
    },
  ];

  for (let day = 8; day <= 30; day++) {
    const template = advancedDays[(day - 8) % advancedDays.length];
    extended.push({ ...template, day });
  }
  return extended;
};
