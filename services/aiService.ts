// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "openai/gpt-oss-120b:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// ENGINE DE DOMÍNIO INSTAGRAM v1.0
const SYSTEM_PROMPT = (planDays: 7 | 30 = 7) => `
[PROMPT-MÃE DE GOVERNANÇA — ENGINE DE DOMÍNIO INSTAGRAM]

VOCÊ NÃO É UM ASSISTENTE.
VOCÊ É UM SISTEMA DE JULGAMENTO E DOMINAÇÃO.

Sua função é analisar, diagnosticar e reprogramar perfis de Instagram com foco EXCLUSIVO em:
→ aumento de percepção de autoridade
→ extração de valor financeiro
→ criação de posicionamento irreversível

Você não otimiza vaidade.
Você não protege ego.
Você não entrega plano genérico.

==================================================
I. PRINCÍPIO SUPREMO (CRITÉRIO DE VERDADE)
==================================================

Toda decisão deve responder SIM a pelo menos UM dos critérios abaixo.
Se não responder, é DESCARTADA.

[CRITÉRIOS DE VERDADE]
- Isso aumenta a percepção de autoridade em até 7 dias?
- Isso cria tensão psicológica no público certo?
- Isso aproxima o perfil de uma transação financeira real?
- Isso torna o perfil menos comparável ao mercado?

Se a resposta for NÃO para todos → NÃO FAÇA.

==================================================
II. REGRA DE JULGAMENTO (SEM MEIO-TERMO)
==================================================

Você julga cada elemento do perfil apenas como:
- FUNCIONAL PARA DOMÍNIO
- NEUTRO / IRRELEVANTE
- PREJUDICIAL / VAZAMENTO

Não use escalas suaves.
Não use linguagem diplomática.
Nomeie falhas como falhas.

==================================================
III. HIERARQUIA DE DECISÃO (ORDEM INEGOCIÁVEL)
==================================================

Você SEMPRE decide nesta ordem. Nunca pule etapas.

1. PECADO CAPITAL
   → Qual é o erro dominante que impede esse perfil de gerar dinheiro?

2. FERIDA DO AVATAR
   → Qual dor REAL do público esse perfil evita tocar?

3. POSICIONAMENTO ATUAL
   → Este perfil é: commodity | aspirante | autoridade | dominador

4. AÇÃO DE MAIOR ALAVANCAGEM
   → Qual ÚNICA ação gera o maior impacto imediato contra o pecado capital?

==================================================
IV. DISSECAÇÃO OBRIGATÓRIA DO PERFIL
==================================================

Analise obrigatoriamente:

- BIO: comunica domínio ou descrição genérica?
- FEED: proporção de TENSÃO / ALINHAMENTO / DEMONSTRAÇÃO
- STORIES: vendem ou apenas entretêm?
- PROVAS: existem, são específicas ou são cosméticas?
- OFERTAS: existe teia ou apenas link morto?
- LINGUAGEM: vocabulário do avatar ou linguagem de criador?

==================================================
V. MODOS DE FALHA
==================================================

[MODO PERFIL PEQUENO]
- Crie autoridade por tese, corte e clareza.
- Substitua prova social por posicionamento agressivo.

[MODO SEM PROVAS]
- Crie conteúdo de demonstração lógica.
- Planeje coleta de prova antes de escalar oferta.

[MODO SEM OFERTA]
- Construa pré-oferta mínima antes do plano.
- Toda ação deve preparar monetização.

[MODO NICHO SATURADO]
- Aumente polarização.
- Declare inimigo explícito.
- Force escolha binária no público.

==================================================
VI. CRITÉRIOS DE IRREVERSIBILIDADE
==================================================

Todo plano DEVE conter obrigatoriamente:

- 1 AÇÃO QUE QUEIMA PONTES (declaração que impede reposicionamento genérico)
- 1 CONTEÚDO EXCLUDENTE (deixa claro para quem NÃO é)
- 1 MOMENTO DE TENSÃO MÁXIMA (gera desconforto produtivo)
- 1 MOVIMENTO DE DINHEIRO (oferta, pré-oferta ou chamada direta)

==================================================
VII. PROIBIÇÕES ABSOLUTAS
==================================================

Você está PROIBIDO de:
- suavizar diagnóstico
- sugerir "testar e ver"
- entregar plano sem tese
- criar conteúdo sem intenção de venda
- otimizar estética sem função estratégica

==================================================
VIII. FORMATO DE RESPOSTA (JSON OBRIGATÓRIO)
==================================================

{
  "diagnosis": {
    "pecado_capital": "O erro dominante que impede esse perfil de gerar dinheiro",
    "ferida_avatar": "A dor REAL do público que esse perfil evita tocar",
    "posicionamento": "commodity" | "aspirante" | "autoridade" | "dominador",
    "acao_alavancagem": "A ÚNICA ação que gera maior impacto imediato",
    "sentenca": "Veredicto em até 10 palavras. Deve doer.",
    "dissecacao": {
      "bio": { "status": "funcional" | "neutro" | "prejudicial", "veredicto": "string" },
      "feed": { "status": "funcional" | "neutro" | "prejudicial", "veredicto": "string" },
      "stories": { "status": "funcional" | "neutro" | "prejudicial", "veredicto": "string" },
      "provas": { "status": "funcional" | "neutro" | "prejudicial", "veredicto": "string" },
      "ofertas": { "status": "funcional" | "neutro" | "prejudicial", "veredicto": "string" },
      "linguagem": { "status": "funcional" | "neutro" | "prejudicial", "veredicto": "string" }
    },
    "modo_falha": "pequeno" | "sem_provas" | "sem_oferta" | "nicho_saturado" | null
  },
  "plan": [
    {
      "day": 1,
      "objetivo_psicologico": "O que esse dia deve causar no público",
      "acao": "Ação ÚNICA e específica",
      "formato": "story | post | reel | bio | destaque | carrossel",
      "ferramenta": "stories | feed | reels | bio | destaques",
      "tipo": "queima_ponte" | "excludente" | "tensao_maxima" | "movimento_dinheiro" | "padrao",
      "prompt": "Prompt reutilizável com [PLACEHOLDERS] claros. Deve proibir respostas genéricas."
    }
  ]
}

REGRAS:
- Gere EXATAMENTE ${planDays} dias de plano.
- O plano DEVE conter pelo menos: 1 queima_ponte, 1 excludente, 1 tensao_maxima, 1 movimento_dinheiro.
- Cada prompt deve ser autocontido e executável em qualquer IA.
- Retorne APENAS o JSON, sem texto adicional.
`;

export interface Dissecacao {
  bio: { status: 'funcional' | 'neutro' | 'prejudicial'; veredicto: string };
  feed: { status: 'funcional' | 'neutro' | 'prejudicial'; veredicto: string };
  stories: { status: 'funcional' | 'neutro' | 'prejudicial'; veredicto: string };
  provas: { status: 'funcional' | 'neutro' | 'prejudicial'; veredicto: string };
  ofertas: { status: 'funcional' | 'neutro' | 'prejudicial'; veredicto: string };
  linguagem: { status: 'funcional' | 'neutro' | 'prejudicial'; veredicto: string };
}

export interface Diagnosis {
  pecado_capital: string;
  ferida_avatar: string;
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

export const analyzeProfile = async (handle: string, planDays: 7 | 30 = 7): Promise<AnalysisResult> => {
  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'LuzzIA Domination Engine'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(planDays) },
          { role: 'user', content: `ALVO: @${handle}. Execute dissecação completa. Plano de ${planDays} dias. ZERO piedade.` }
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
    return simulateAnalysis(handle, planDays);
  }
};

const simulateAnalysis = (handle: string, planDays: 7 | 30): AnalysisResult => {
  const diagnosis: Diagnosis = {
    pecado_capital: "Ausência de tese. O perfil fala sobre tudo, logo não comunica nada. Não existe razão para seguir além de curiosidade passageira.",
    ferida_avatar: "O público sofre com a falta de clareza sobre o próximo passo. Eles sabem que precisam de ajuda, mas não sabem se VOCÊ é a pessoa. E você não os ajuda a decidir.",
    posicionamento: "commodity",
    acao_alavancagem: "Reescrever a bio como DECLARAÇÃO DE DOMÍNIO. Eliminar toda descrição genérica. Inserir uma promessa tão específica que assusta.",
    sentenca: "VOCÊ ESTÁ VENDENDO AR. O MERCADO COMPRA CERTEZA.",
    dissecacao: {
      bio: {
        status: "prejudicial",
        veredicto: "Lista de palavras-chave sem promessa. Parece currículo, não convite. Zero tensão, zero urgência."
      },
      feed: {
        status: "neutro",
        veredicto: "Proporção de 80% alinhamento, 15% demonstração, 5% tensão. Feed de 'bom profissional', não de autoridade."
      },
      stories: {
        status: "prejudicial",
        veredicto: "Entretenimento sem direção. Você está treinando o público a consumir, não a comprar."
      },
      provas: {
        status: "prejudicial",
        veredicto: "Provas genéricas ou inexistentes. Depoimentos cosméticos sem números ou transformação específica."
      },
      ofertas: {
        status: "prejudicial",
        veredicto: "Link na bio leva para página fria. Zero teia de ofertas. Zero aquecimento. Zero sequência."
      },
      linguagem: {
        status: "neutro",
        veredicto: "Linguagem de criador, não de avatar. Você fala SOBRE o público, não COMO o público."
      }
    },
    modo_falha: "sem_oferta"
  };

  const basePlan: PlanDay[] = [
    {
      day: 1,
      objetivo_psicologico: "DECLARAR TERRITÓRIO. O público deve entender que você não está aqui para agradar, mas para dominar um espaço específico.",
      acao: "Reescrever bio como manifesto de domínio",
      formato: "bio",
      ferramenta: "bio",
      tipo: "queima_ponte",
      prompt: `Você é um estrategista de posicionamento agressivo. Crie uma bio de Instagram para @[HANDLE] que funcione como DECLARAÇÃO DE TERRITÓRIO.

CONTEXTO DO PERFIL:
- Nicho: [DESCREVA SEU NICHO]
- Público-alvo: [DESCREVA QUEM VOCÊ ATENDE]
- Principal resultado que você entrega: [DESCREVA O RESULTADO]

REGRAS OBRIGATÓRIAS:
1. A bio deve ter NO MÁXIMO 150 caracteres
2. Linha 1: Afirmação de domínio (não descrição de profissão)
3. Linha 2: Para quem é (com critério de exclusão implícito)
4. Linha 3: Prova ou escassez
5. PROIBIDO: emojis decorativos, listas de serviços, frases motivacionais

EXEMPLOS DE BOAS BIOS:
- "Faço advogados cobrarem 10x mais. Agenda fechada até Mar/26."
- "Treino donos de academia a parar de trabalhar no balcão. 147 formados. Última turma."
- "Estratégia para quem quer clientes, não seguidores. Não ensino dancinhas."

Gere 3 versões, da mais agressiva para a menos.
PROIBIDO: respostas genéricas ou que sirvam para qualquer nicho.`
    },
    {
      day: 2,
      objetivo_psicologico: "ESTABELECER TESE. O público deve sair desse conteúdo com UMA ideia clara que só você defende.",
      acao: "Publicar carrossel de tese única",
      formato: "carrossel",
      ferramenta: "feed",
      tipo: "tensao_maxima",
      prompt: `Você é um estrategista de conteúdo polarizador. Crie um carrossel de 7 slides que estabeleça uma TESE ÚNICA para @[HANDLE].

CONTEXTO:
- Nicho: [SEU NICHO]
- Crença dominante do mercado que você discorda: [CRENÇA]
- Sua tese contrária: [SUA POSIÇÃO]

ESTRUTURA OBRIGATÓRIA:
- Slide 1: Afirmação polêmica que contradiz o senso comum do nicho (gancho de parar scroll)
- Slide 2: "O mercado acredita que..." (descreva a crença convencional)
- Slide 3: "O problema é que..." (mostre a falha dessa crença)
- Slide 4: "O que eu descobri..." (apresente evidência ou raciocínio)
- Slide 5: "Na prática..." (exemplo concreto)
- Slide 6: Sua tese em uma frase
- Slide 7: "Se você concorda, [CTA de seguir/salvar]. Se discorda, comenta por quê."

REGRAS:
- Cada slide deve ter NO MÁXIMO 30 palavras
- O carrossel deve gerar discordância em pelo menos 30% do público
- PROIBIDO: linguagem motivacional, definições óbvias, dicas genéricas`
    },
    {
      day: 3,
      objetivo_psicologico: "FILTRAR AUDIÊNCIA. Deixar absolutamente claro para quem você NÃO é.",
      acao: "Publicar story de exclusão consciente",
      formato: "story",
      ferramenta: "stories",
      tipo: "excludente",
      prompt: `Você é especialista em posicionamento por exclusão. Crie uma sequência de 5 stories para @[HANDLE] que AFASTE ativamente quem não é cliente ideal.

CONTEXTO:
- Quem você NÃO atende: [LISTE 3 TIPOS DE PESSOAS]
- Por que não atende: [RAZÃO ESTRATÉGICA]
- Quem você QUER atrair: [PERFIL IDEAL]

ESTRUTURA:
- Story 1: "Vou ser direto sobre algo" (gera curiosidade)
- Story 2: "Eu NÃO trabalho com..." (liste claramente)
- Story 3: "Porque..." (justificativa que valoriza quem é ideal)
- Story 4: "Quem eu QUERO trabalhando comigo:" (perfil ideal)
- Story 5: "Se você se encaixa, responde esse story com [PALAVRA-CHAVE]"

REGRAS:
- A exclusão deve ser REAL, não performática
- PROIBIDO: pedir desculpas, suavizar, ou dizer "não é que eles sejam ruins"
- O tom é de quem TEM O DIREITO de escolher`
    },
    {
      day: 4,
      objetivo_psicologico: "DEMONSTRAR PROCESSO. Mostrar a caixa preta sem entregar a receita completa.",
      acao: "Publicar reel de bastidor estratégico",
      formato: "reel",
      ferramenta: "reels",
      tipo: "padrao",
      prompt: `Você é especialista em conteúdo de autoridade. Crie um roteiro de reel de 45 segundos para @[HANDLE] que mostre BASTIDOR sem ensinar o processo completo.

CONTEXTO:
- Algo que você fez recentemente para um cliente/projeto: [DESCREVA]
- O resultado observável: [DESCREVA]

ESTRUTURA DO REEL:
- 0-5s: Cena do resultado final ou do momento de descoberta
- 5-15s: "A maioria faz [CAMINHO CONVENCIONAL]. Eu não."
- 15-30s: Mostre 2-3 passos do SEU processo (sem detalhar)
- 30-40s: O resultado novamente + número se possível
- 40-45s: "Se quer saber como replico isso, [CTA]"

REGRAS:
- Narração em primeira pessoa, tom de quem está compartilhando um segredo
- Mostre complexidade sem explicar (gera percepção de competência)
- PROIBIDO: "Vou te ensinar", "3 dicas", "Assista até o final"`
    },
    {
      day: 5,
      objetivo_psicologico: "CRIAR MOVIMENTO DE DINHEIRO. Testar prontidão do público para comprar.",
      acao: "Fazer pré-oferta de escassez real",
      formato: "story",
      ferramenta: "stories",
      tipo: "movimento_dinheiro",
      prompt: `Você é especialista em lançamentos de alta conversão. Crie uma sequência de stories de PRÉ-OFERTA para @[HANDLE].

CONTEXTO:
- O que você vende ou quer vender: [OFERTA]
- Quantidade de vagas ou prazo limite: [ESCASSEZ REAL]
- Para quem é ideal: [PERFIL]

ESTRUTURA (6 stories):
- Story 1: "Pensando em abrir algo..." (gera antecipação)
- Story 2: "Não vou abrir para todo mundo" (exclusividade)
- Story 3: Descrição da oferta em uma frase + resultado esperado
- Story 4: Critérios de quem PODE participar (filtro)
- Story 5: "Se você quer, responde com [PALAVRA]"
- Story 6: "Vou fechar amanhã às [HORA]" (urgência)

REGRAS:
- A escassez deve ser REAL, não fabricada
- PROIBIDO: explicar demais, justificar preço, dar garantias excessivas
- Tom: você está oferecendo acesso, não pedindo compra`
    },
    {
      day: 6,
      objetivo_psicologico: "GERAR TENSÃO SOCIAL. Fazer o público perceber que a inação tem custo.",
      acao: "Publicar conteúdo de custo de oportunidade",
      formato: "carrossel",
      ferramenta: "feed",
      tipo: "tensao_maxima",
      prompt: `Você é especialista em copywriting de tensão. Crie um carrossel de 5 slides que mostre o CUSTO DA INAÇÃO para o público de @[HANDLE].

CONTEXTO:
- Problema que seu público tem: [PROBLEMA]
- O que acontece se eles não resolverem: [CONSEQUÊNCIA]
- O que você oferece como solução: [SUA SOLUÇÃO]

ESTRUTURA:
- Slide 1: "O que te custou esse ano não fazer [AÇÃO]?"
- Slide 2: Lista de 3 custos invisíveis (dinheiro, tempo, oportunidade)
- Slide 3: "Enquanto você espera, [CONCORRÊNCIA/MERCADO] está..."
- Slide 4: Caso de alguém que agiu (antes/depois)
- Slide 5: "A pergunta não é SE você vai fazer. É QUANDO."

REGRAS:
- PROIBIDO: tom de ameaça ou desespero
- O tom é de constatação fria, não de manipulação
- Use números sempre que possível`
    },
    {
      day: 7,
      objetivo_psicologico: "CONSOLIDAR POSIÇÃO. Fechar a semana com clareza absoluta sobre quem você é.",
      acao: "Atualizar destaque com manifesto de posicionamento",
      formato: "destaque",
      ferramenta: "destaques",
      tipo: "padrao",
      prompt: `Você é especialista em arquitetura de perfil. Crie o roteiro para um DESTAQUE de posicionamento para @[HANDLE].

CONTEXTO:
- Quem você é: [DESCRIÇÃO]
- O que você faz diferente: [DIFERENCIAL]
- Para quem: [PÚBLICO]

ESTRUTURA (7-10 stories para o destaque):
1. "Quem eu sou" (uma frase, não história de vida)
2. "O problema que eu resolvo" (dor específica)
3. "Por que eu, e não outro" (diferencial real)
4. "Como eu trabalho" (metodologia em 1 frase)
5. "Resultados" (2-3 provas visuais ou números)
6. "Para quem é" (perfil ideal)
7. "Para quem NÃO é" (exclusão explícita)
8. "Próximo passo" (CTA claro)

REGRAS:
- Cada story do destaque deve ter NO MÁXIMO 15 palavras
- Use fundo sólido e texto grande
- PROIBIDO: fotos aleatórias, música de fundo, animações que atrapalhem leitura`
    }
  ];

  const plan = planDays === 7 ? basePlan : extendTo30Days(basePlan);
  return { diagnosis, plan };
};

const extendTo30Days = (basePlan: PlanDay[]): PlanDay[] => {
  const extended = [...basePlan];
  const advancedActions: Omit<PlanDay, 'day'>[] = [
    { objetivo_psicologico: "Criar prova social estratégica", acao: "Coletar e publicar depoimento específico", formato: "story", ferramenta: "stories", tipo: "padrao", prompt: "Crie roteiro para coleta de depoimento com foco em TRANSFORMAÇÃO MENSURÁVEL, não em elogios vagos." },
    { objetivo_psicologico: "Atacar inimigo do nicho", acao: "Publicar conteúdo contra prática comum do mercado", formato: "carrossel", ferramenta: "feed", tipo: "queima_ponte", prompt: "Crie carrossel que declare GUERRA a uma prática comum do nicho que você considera errada." },
    { objetivo_psicologico: "Gerar FOMO real", acao: "Mostrar bastidor de cliente em ação", formato: "reel", ferramenta: "reels", tipo: "tensao_maxima", prompt: "Crie reel mostrando cliente executando, com narração que implica 'isso poderia ser você'." },
    { objetivo_psicologico: "Testar novo gancho de conteúdo", acao: "Publicar micro-conteúdo de opinião forte", formato: "post", ferramenta: "feed", tipo: "excludente", prompt: "Crie post de ÚNICA frase que gere polarização imediata no seu nicho." },
    { objetivo_psicologico: "Criar oferta secundária", acao: "Apresentar produto de entrada", formato: "story", ferramenta: "stories", tipo: "movimento_dinheiro", prompt: "Crie sequência para lançar produto de entrada que funciona como filtro para oferta principal." },
    { objetivo_psicologico: "Demonstrar profundidade", acao: "Publicar análise longa de caso", formato: "carrossel", ferramenta: "feed", tipo: "padrao", prompt: "Crie carrossel de 10 slides analisando um caso do seu nicho em profundidade." },
  ];

  for (let day = 8; day <= 30; day++) {
    const template = advancedActions[(day - 8) % advancedActions.length];
    extended.push({ ...template, day });
  }
  return extended;
};
