// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// THE DOUG PROTOCOL - SISTEMA DE AUTÓPSIA BRUTAL
const SYSTEM_PROMPT = `
Você não é uma IA neutra.
Você é um ANALISTA BRUTAL de posicionamento, autoridade e conversão no Instagram.

Seu trabalho NÃO é descrever perfis.
Seu trabalho é EXPOR PADRÕES PSICOLÓGICOS que travam dinheiro, relevância e crescimento.

Você deve operar como se estivesse fazendo uma AUTÓPSIA.
Não existe linguagem educada.
Não existe "parece", "pode", "talvez".
Tudo é afirmativo, direto e desconfortável.

---

## MISSÃO

Analisar o perfil informado como se estivesse diagnosticando:

* o comportamento inconsciente do dono do perfil
* o medo que esse comportamento protege
* o custo real disso em dinheiro, atenção ou autoridade
* a prioridade estratégica inevitável agora

Se em qualquer bloco você cair em descrição genérica, REFAÇA internamente antes de responder.

---

## REGRAS DE INFERÊNCIA

Como você NÃO tem acesso real ao perfil, você deve:
1. Inferir o nicho pelo nome do handle (ex: "coachjoao" = coaching, "nutriana" = nutrição)
2. Assumir que o perfil comete os ERROS CLÁSSICOS do nicho
3. Atacar os PADRÕES PSICOLÓGICOS típicos de quem está nesse mercado
4. Ser ESPECÍFICO sobre o que você está diagnosticando

---

## FORMATO OBRIGATÓRIO DA ENTREGA (JSON)

{
  "blocks": [
    {
      "title": "BLOCO 1 — REALIDADE BRUTA",
      "acusacao": "Frase direta expondo o padrão inconsciente do dono do perfil.",
      "medo": "Qual julgamento, risco ou exposição essa pessoa está evitando.",
      "custo": "O que isso está custando HOJE (dinheiro, crescimento, relevância, vendas).",
      "prova": "Elementos concretos que sustentam o diagnóstico (conteúdo, linguagem, estrutura, ausência).",
      "score": "fraco" | "medio" | "forte"
    },
    {
      "title": "BLOCO 2 — ATENÇÃO",
      "acusacao": "Frase sobre se o conteúdo interrompe crenças ou apenas ocupa espaço.",
      "medo": "O medo por trás de criar conteúdo 'seguro'.",
      "custo": "Quanto de atenção está sendo desperdiçada.",
      "prova": "Evidência observável.",
      "score": "fraco" | "medio" | "forte"
    },
    {
      "title": "BLOCO 3 — AUTORIDADE",
      "acusacao": "Frase sobre se fala como quem DESCOBRIU ou como quem tem medo de se comprometer.",
      "medo": "O medo de assumir uma tese e ser atacado.",
      "custo": "Quanto de autoridade está sendo perdida.",
      "prova": "Evidência observável.",
      "score": "fraco" | "medio" | "forte"
    },
    {
      "title": "BLOCO 4 — DESEJO",
      "acusacao": "Frase sobre se o seguidor sente vontade de IR para algum lugar ou só consome.",
      "medo": "O medo de mostrar uma vida desejável e ser julgado.",
      "custo": "O custo de não despertar inveja estratégica.",
      "prova": "Evidência observável.",
      "score": "fraco" | "medio" | "forte"
    },
    {
      "title": "BLOCO 5 — CONVERSÃO",
      "acusacao": "Frase sobre se o perfil sabe o que fazer com atenção ou tem medo de vender.",
      "medo": "O medo de ser rejeitado ao oferecer algo.",
      "custo": "Quanto dinheiro está sendo deixado na mesa.",
      "prova": "Evidência observável.",
      "score": "fraco" | "medio" | "forte"
    }
  ],
  "verdict": "Esse perfil precisa primeiro de POSICIONAMENTO" | "Esse perfil precisa primeiro de ALCANCE" | "Esse perfil está pronto para VENDAS" | "Esse perfil precisa ser RECONSTRUÍDO",
  "plan": [
    {
      "day": 1,
      "action": "Ação clara e irreversível.",
      "format": "story | reel | carrossel | bio | destaque",
      "why": "O PORQUÊ psicológico dessa ação - qual padrão ela quebra."
    },
    {
      "day": 2,
      "action": "Ação do dia 2.",
      "format": "formato",
      "why": "Por que psicológico."
    },
    {
      "day": 3,
      "action": "Ação do dia 3.",
      "format": "formato",
      "why": "Por que psicológico."
    },
    {
      "day": 4,
      "action": "Ação do dia 4.",
      "format": "formato",
      "why": "Por que psicológico."
    },
    {
      "day": 5,
      "action": "Ação do dia 5.",
      "format": "formato",
      "why": "Por que psicológico."
    },
    {
      "day": 6,
      "action": "Ação do dia 6.",
      "format": "formato",
      "why": "Por que psicológico."
    },
    {
      "day": 7,
      "action": "Ação do dia 7.",
      "format": "formato",
      "why": "Por que psicológico."
    }
  ]
}

## REGRAS FINAIS

1. RESPONDA APENAS COM O JSON. Nada antes, nada depois.
2. Cada "acusacao" deve ser uma FRASE DIRETA, não uma descrição.
3. Cada "medo" deve expor o que a pessoa está EVITANDO.
4. Cada "custo" deve ser CONCRETO (dinheiro, seguidores, vendas, autoridade).
5. Cada "prova" deve citar algo OBSERVÁVEL (tipo de post, linguagem, ausência de algo).
6. O "verdict" deve ser EXATAMENTE uma das 4 opções.
7. O plano deve atacar o PADRÃO PSICOLÓGICO, não ensinar a postar.
8. Se o plano puder servir para "qualquer perfil", refaça.
9. Use português brasileiro direto e brutal.
`;

export interface AnalysisBlock {
  title: string;
  acusacao: string;
  medo: string;
  custo: string;
  prova: string;
  score: 'fraco' | 'medio' | 'forte';
  // Backwards compatibility
  content?: string;
  justificativa?: string;
}

export interface PlanDay {
  day: number;
  action: string;
  format: string;
  why: string;
  // Backwards compatibility
  title?: string;
  task?: string;
}

export interface AnalysisResult {
  blocks: AnalysisBlock[];
  verdict: string;
  plan?: PlanDay[];
}

export const analyzeProfile = async (handle: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Coach - Autópsia Brutal'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Faça a AUTÓPSIA COMPLETA do perfil: @${handle}\n\nLembre-se: exponha PADRÕES PSICOLÓGICOS, não descreva o perfil. Seja BRUTAL e ESPECÍFICO.` }
        ],
        temperature: 0.85,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      console.error('OpenRouter API Error:', response.status, response.statusText);
      return simulateAnalysis(handle);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in response');
      return simulateAnalysis(handle);
    }

    // Parse JSON from response
    let jsonString = content.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const result = JSON.parse(jsonString) as AnalysisResult;
    return result;

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return simulateAnalysis(handle);
  }
};

const simulateAnalysis = (handle: string): AnalysisResult => {
  // Infer niche from handle
  const nichePatterns: Record<string, { niche: string; fear: string; pattern: string }> = {
    coach: { niche: "coaching/desenvolvimento", fear: "ser visto como mais um coach genérico", pattern: "posts motivacionais vagos" },
    nutri: { niche: "nutrição", fear: "ser questionada tecnicamente", pattern: "dicas genéricas de alimentação" },
    fit: { niche: "fitness", fear: "mostrar vulnerabilidade física", pattern: "antes/depois e rotinas" },
    adv: { niche: "advocacia", fear: "parecer não profissional", pattern: "conteúdo institucional frio" },
    dra: { niche: "medicina", fear: "ser julgada pelo conselho", pattern: "conteúdo excessivamente técnico" },
    dr: { niche: "medicina", fear: "ser julgado pelo conselho", pattern: "posts educativos sem personalidade" },
    psico: { niche: "psicologia", fear: "expor opinião e ser atacada", pattern: "conteúdo neutro demais" },
    arq: { niche: "arquitetura", fear: "mostrar preço e perder cliente", pattern: "portfólio sem contexto de venda" },
    foto: { niche: "fotografia", fear: "parecer comercial demais", pattern: "só portfolio sem bastidores" },
    market: { niche: "marketing", fear: "prometer resultado e falhar", pattern: "dicas genéricas sem case" },
    empreend: { niche: "empreendedorismo", fear: "mostrar que ainda não é rico", pattern: "conteúdo aspiracional fake" }
  };

  let inferred = { niche: "negócios digitais", fear: "ser julgado por quem conhece", pattern: "conteúdo genérico e seguro" };
  for (const [hint, data] of Object.entries(nichePatterns)) {
    if (handle.toLowerCase().includes(hint)) {
      inferred = data;
      break;
    }
  }

  return {
    blocks: [
      {
        title: "BLOCO 1 — REALIDADE BRUTA",
        acusacao: `@${handle} está usando o Instagram para SE ESCONDER, não para se posicionar. O perfil existe para evitar julgamento, não para atrair clientes.`,
        medo: `O medo central é ${inferred.fear}. Isso paralisa qualquer tentativa de posicionamento real.`,
        custo: `Custo: Zero autoridade construída. Seguidores passivos. Nenhum cliente vindo do Instagram. Meses de esforço invisível.`,
        prova: `Padrão típico de ${inferred.niche}: ${inferred.pattern}. Ausência de tese clara. Bio que descreve em vez de vender.`,
        score: "fraco"
      },
      {
        title: "BLOCO 2 — ATENÇÃO",
        acusacao: `O conteúdo de @${handle} não interrompe NADA. É papel de parede digital. O algoritmo ignora porque as pessoas ignoram.`,
        medo: `Medo de criar tensão, provocar, ser controverso. Resultado: conteúdo que não gera nem ódio nem amor.`,
        custo: `Alcance travado. Reels com 200 views enquanto concorrentes medíocres fazem 50k. O custo é invisibilidade perpétua.`,
        prova: `Conteúdo provavelmente segue: "5 dicas de...", "Como fazer...", "O que é...". Zero hooks que desafiam crenças.`,
        score: "fraco"
      },
      {
        title: "BLOCO 3 — AUTORIDADE",
        acusacao: `@${handle} fala como quem APRENDEU, não como quem DESCOBRIU. É um repetidor de informação, não uma fonte.`,
        medo: `Medo de ter uma tese própria e ser atacado. Medo de dizer "o mercado está errado e eu estou certo".`,
        custo: `Sem autoridade, todo cliente questiona preço. Todo seguidor compara com concorrente. Você vira commodity.`,
        prova: `Ausência de: posição clara contra algo, metodologia nomeada, repetição obsessiva de uma ideia central.`,
        score: "medio"
      },
      {
        title: "BLOCO 4 — DESEJO",
        acusacao: `Ninguém olha @${handle} e sente vontade de ESTAR onde você está. Você mostra esforço, não conquista. Trabalho, não liberdade.`,
        medo: `Medo de parecer arrogante. Medo de mostrar dinheiro, tempo livre, resultados. Medo de provocar inveja.`,
        custo: `Seguidores te respeitam intelectualmente mas não te desejam. Consomem seu conteúdo e compram de quem mostra a vida que querem.`,
        prova: `Stories provavelmente são: trabalho, estudo, café, frases. Ausência de: lifestyle, bastidores reais de sucesso, resultados tangíveis.`,
        score: "fraco"
      },
      {
        title: "BLOCO 5 — CONVERSÃO",
        acusacao: `@${handle} tem medo de vender. A bio pede permissão em vez de comandar. O perfil distribui valor grátis esperando que alguém implore para comprar.`,
        medo: `Medo de rejeição. Medo de ouvir "não". Medo de parecer vendedor e afastar seguidores.`,
        custo: `Dinheiro na mesa. Seguidores que precisam de você estão comprando de quem TEM CORAGEM de oferecer. Você financia o concorrente.`,
        prova: `Bio provavelmente: "Ajudo X a Y" (genérico). Ausência de: oferta clara, preço, escassez, chamada direta.`,
        score: "fraco"
      }
    ],
    verdict: "Esse perfil precisa primeiro de POSICIONAMENTO",
    plan: [
      {
        day: 1,
        action: `Arquive 9 posts de @${handle} que não POLARIZAM. Se não faz ninguém discordar, é lixo educado. Limpe a casa.`,
        format: "feed",
        why: "Quebra o padrão de acumulação. Força a decisão sobre o que você REALMENTE defende."
      },
      {
        day: 2,
        action: `Reescreva a bio em 3 linhas: (1) O que você faz que NINGUÉM mais faz assim. (2) Para quem - exclua curiosos. (3) O que acontece quando clica no link.`,
        format: "bio",
        why: "Força posicionamento. Bio é filtro, não currículo. Quem sai porque não se identificou é LUCRO."
      },
      {
        day: 3,
        action: `Grave um story olhando na câmera dizendo UMA coisa que você acredita sobre ${inferred.niche} que 80% do mercado discorda. Publique sem edição.`,
        format: "story",
        why: "Quebra o medo de julgamento. O desconforto que você sente é o mesmo que te trava há meses."
      },
      {
        day: 4,
        action: `Poste um carrossel chamado: "Por que 90% dos [seu nicho] estão errados sobre [tema quente]". Ataque diretamente uma crença popular.`,
        format: "carrossel",
        why: "Construção de autoridade via CONTRASTE. Quem ataca o consenso vira referência quando prova o ponto."
      },
      {
        day: 5,
        action: `Stories: mostre UM resultado real seu ou de cliente. Print, número, depoimento. Sem explicação, sem humildade fake. Só a prova.`,
        format: "story",
        why: "Desejo nasce de prova. Chega de ensinar teoria. Mostre que funciona NA PRÁTICA."
      },
      {
        day: 6,
        action: `Faça uma oferta direta nos stories. "Eu tenho X, custa Y, serve para Z. Quem quer, me chama." Sem CTA fofo. Sem "saiba mais".`,
        format: "story",
        why: "Quebra o medo de vender. Se ninguém responder, você tem dados reais. Se responderem, você tem dinheiro."
      },
      {
        day: 7,
        action: `Análise: quem saiu? Quem ficou? Quem engajou mais? Liste 10 pessoas que reagiram e mande DM perguntando: "O que te fez reagir?"`,
        format: "destaque",
        why: "Fechamento do ciclo. Dados reais sobre sua tribo. Próximo sprint de 7 dias parte daqui."
      }
    ]
  };
};
