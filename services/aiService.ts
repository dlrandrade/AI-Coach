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
      "why": "O PORQUÊ psicológico dessa ação - qual padrão ela quebra.",
      "prompt": "Prompt completo e contextualizado para o ChatGPT gerar o conteúdo desse dia. Deve incluir: (1) contexto do perfil, (2) objetivo do conteúdo, (3) tom de voz, (4) estrutura esperada, (5) o que evitar. Mínimo 150 palavras."
    },
    // ... dias 2 a 7 com a mesma estrutura incluindo "prompt"
  ]
}

## REGRAS PARA OS PROMPTS DE CADA DIA

Cada "prompt" deve ser um texto COMPLETO que o usuário pode copiar e colar no ChatGPT para gerar o conteúdo.

Estrutura obrigatória do prompt:
1. CONTEXTO: "Eu tenho um perfil de [nicho] chamado @[handle]. Meu problema principal é [problema identificado]."
2. OBJETIVO: "Preciso criar [formato] que [objetivo específico do dia]."
3. TOM: "O tom deve ser [descrever tom baseado na estratégia]."
4. ESTRUTURA: "O conteúdo deve ter [estrutura específica]."
5. EVITAR: "Evite [clichês e erros comuns do nicho]."
6. EXEMPLO DE GANCHO: Inclua um exemplo de hook/abertura.

Os prompts devem ser ESPECÍFICOS para o nicho inferido e para o problema identificado.
Se o prompt puder servir para qualquer perfil, ele está ERRADO.

## REGRAS FINAIS

1. RESPONDA APENAS COM O JSON. Nada antes, nada depois.
2. Cada "acusacao" deve ser uma FRASE DIRETA, não uma descrição.
3. Cada "medo" deve expor o que a pessoa está EVITANDO.
4. Cada "custo" deve ser CONCRETO (dinheiro, seguidores, vendas, autoridade).
5. Cada "prova" deve citar algo OBSERVÁVEL.
6. O "verdict" deve ser EXATAMENTE uma das 4 opções.
7. O plano deve atacar o PADRÃO PSICOLÓGICO, não ensinar a postar.
8. Cada PROMPT deve ser completo o suficiente para gerar conteúdo de qualidade.
9. Use português brasileiro direto.
`;

export interface AnalysisBlock {
  title: string;
  acusacao: string;
  medo: string;
  custo: string;
  prova: string;
  score: 'fraco' | 'medio' | 'forte';
  content?: string;
  justificativa?: string;
}

export interface PlanDay {
  day: number;
  action: string;
  format: string;
  why: string;
  prompt: string;
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
          { role: 'user', content: `Faça a AUTÓPSIA COMPLETA do perfil: @${handle}\n\nLembre-se: exponha PADRÕES PSICOLÓGICOS, não descreva o perfil. Seja BRUTAL e ESPECÍFICO. Inclua PROMPTS detalhados para cada dia do plano.` }
        ],
        temperature: 0.85,
        max_tokens: 6000
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
  const nichePatterns: Record<string, { niche: string; fear: string; pattern: string; audience: string }> = {
    coach: { niche: "coaching/desenvolvimento pessoal", fear: "ser visto como mais um coach genérico", pattern: "posts motivacionais vagos", audience: "profissionais em transição de carreira" },
    nutri: { niche: "nutrição", fear: "ser questionada tecnicamente", pattern: "dicas genéricas de alimentação", audience: "mulheres 25-45 que querem emagrecer" },
    fit: { niche: "fitness", fear: "mostrar vulnerabilidade física", pattern: "antes/depois e rotinas", audience: "pessoas que querem transformação física" },
    adv: { niche: "advocacia", fear: "parecer não profissional", pattern: "conteúdo institucional frio", audience: "empresários e pessoas com problemas jurídicos" },
    dra: { niche: "medicina", fear: "ser julgada pelo conselho", pattern: "conteúdo técnico sem personalidade", audience: "pacientes em busca de especialistas" },
    psico: { niche: "psicologia", fear: "expor opinião e ser atacada", pattern: "conteúdo neutro demais", audience: "pessoas em busca de autoconhecimento" },
    market: { niche: "marketing digital", fear: "prometer resultado e falhar", pattern: "dicas genéricas sem case", audience: "empreendedores e donos de negócio" }
  };

  let inferred = { niche: "negócios digitais", fear: "ser julgado por quem conhece", pattern: "conteúdo genérico", audience: "empreendedores iniciantes" };
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
        custo: `Alcance travado. Reels com 200 views enquanto concorrentes medíocres fazem 50k. Invisibilidade perpétua.`,
        prova: `Conteúdo segue padrão: "5 dicas de...", "Como fazer...", "O que é...". Zero hooks que desafiam crenças.`,
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
        acusacao: `Ninguém olha @${handle} e sente vontade de ESTAR onde você está. Você mostra esforço, não conquista.`,
        medo: `Medo de parecer arrogante. Medo de mostrar dinheiro, tempo livre, resultados. Medo de provocar inveja.`,
        custo: `Seguidores te respeitam intelectualmente mas não te desejam. Consomem seu conteúdo e compram de quem mostra a vida que querem.`,
        prova: `Stories: trabalho, estudo, café, frases. Ausência de: lifestyle, bastidores reais de sucesso, resultados tangíveis.`,
        score: "fraco"
      },
      {
        title: "BLOCO 5 — CONVERSÃO",
        acusacao: `@${handle} tem medo de vender. A bio pede permissão em vez de comandar. O perfil distribui valor grátis esperando que alguém implore para comprar.`,
        medo: `Medo de rejeição. Medo de ouvir "não". Medo de parecer vendedor e afastar seguidores.`,
        custo: `Dinheiro na mesa. Seguidores que precisam de você estão comprando de quem TEM CORAGEM de oferecer.`,
        prova: `Bio: "Ajudo X a Y" (genérico). Ausência de: oferta clara, preço, escassez, chamada direta.`,
        score: "fraco"
      }
    ],
    verdict: "Esse perfil precisa primeiro de POSICIONAMENTO",
    plan: [
      {
        day: 1,
        action: `Arquive os posts de @${handle} que não polarizam. Se não faz ninguém discordar, é lixo educado.`,
        format: "feed",
        why: "Quebra o padrão de acumulação. Força decisão sobre o que você REALMENTE defende.",
        prompt: `Você é um estrategista de conteúdo para Instagram especializado em ${inferred.niche}.

CONTEXTO: Eu tenho um perfil chamado @${handle} no nicho de ${inferred.niche}. Meu público-alvo são ${inferred.audience}. Meu problema principal é que meu conteúdo é genérico e não me diferencia dos concorrentes. Preciso decidir quais posts arquivar.

TAREFA: Me ajude a criar CRITÉRIOS CLAROS para decidir quais posts manter e quais arquivar. 

Para cada critério, me dê:
1. A pergunta que devo fazer sobre cada post
2. Se a resposta for X, arquivo. Se for Y, mantenho.
3. Um exemplo prático do meu nicho

Critérios obrigatórios a avaliar:
- O post defende uma POSIÇÃO ou apenas informa?
- O post poderia ser de QUALQUER pessoa do nicho ou é claramente MEU?
- O post gera DISCUSSÃO nos comentários ou apenas "👏🔥"?
- O post tem uma TESE clara ou é só "dica útil"?

Tom: Direto e prático. Sem rodeios.
Evite: Frases motivacionais, "depende do contexto", respostas genéricas.`
      },
      {
        day: 2,
        action: `Reescreva a bio com estrutura de filtro: O que você faz, Para quem (excluindo), O que acontece no link.`,
        format: "bio",
        why: "Bio é filtro, não currículo. Quem sai é lucro.",
        prompt: `Você é um copywriter especializado em bios de Instagram para ${inferred.niche}.

CONTEXTO: Eu sou @${handle}, trabalho com ${inferred.niche} e meu público são ${inferred.audience}. Minha bio atual é genérica e não converte. Preciso de uma bio que FILTRE as pessoas certas e REPILA as erradas.

TAREFA: Crie 3 versões de bio seguindo esta estrutura EXATA:

LINHA 1: O que você faz de forma ÚNICA (não "ajudo X a Y" - isso é genérico)
LINHA 2: Para quem é E para quem NÃO é (seja excludente de propósito)
LINHA 3: O que a pessoa GANHA clicando no link (promessa específica)

RESTRIÇÕES:
- Máximo 150 caracteres por linha
- ZERO emojis motivacionais (🚀💪✨ estão PROIBIDOS)
- Use no máximo 1 emoji funcional (→, ↓, •)
- A bio deve fazer 50% das pessoas pensarem "isso não é pra mim" - ISSO É BOM

Tom: Direto, confiante, levemente provocativo.
Evite: "Transformando vidas", "Especialista em", "Apaixonado por", qualquer clichê do nicho.

EXEMPLO DE ESTRUTURA (não copie, adapte ao meu nicho):
"Mostro como [ação específica] em [prazo]
Para quem já [pré-requisito] e não aguenta mais [frustração]
↓ [Resultado específico] grátis no link"`
      },
      {
        day: 3,
        action: `Grave um story olhando na câmera dizendo UMA coisa que você acredita sobre ${inferred.niche} que 80% do mercado discorda.`,
        format: "story",
        why: "Quebra o medo de julgamento. O desconforto que você sente é o mesmo que te trava há meses.",
        prompt: `Você é um estrategista de posicionamento para ${inferred.niche}.

CONTEXTO: Eu sou @${handle} e preciso gravar um story POLÊMICO para começar a me posicionar. Meu nicho é ${inferred.niche} e meu público são ${inferred.audience}. Tenho medo de ser julgado, mas sei que preciso quebrar isso.

TAREFA: Me dê 5 afirmações POLÊMICAS que eu poderia dizer no story, seguindo estes critérios:

1. A afirmação deve ser algo que EU REALMENTE ACREDITO (não inventar polêmica falsa)
2. Deve ir CONTRA o senso comum do mercado de ${inferred.niche}
3. Deve ser DEFENSÁVEL com argumentos lógicos
4. Deve atrair MEU cliente ideal e repelir quem não é

Para cada afirmação, inclua:
- A frase exata para eu falar (máximo 2 frases)
- Por que isso é polêmico no mercado
- Qual tipo de pessoa vai concordar (meu cliente ideal)
- Qual tipo de pessoa vai discordar (quem não quero atrair)

ESTRUTURA DO STORY:
- Abertura: "Vou falar uma coisa que talvez te incomode..."
- Afirmação polêmica
- Fechamento: "Se você concorda, [ação]. Se discorda, [outra ação]."

Tom: Confiante, direto, sem medo de criar inimigos.
Evite: Qualquer forma de "pedir desculpas" pela opinião ou suavizar.`
      },
      {
        day: 4,
        action: `Poste um carrossel atacando uma crença popular do mercado de ${inferred.niche}.`,
        format: "carrossel",
        why: "Quem ataca o consenso vira referência quando prova o ponto.",
        prompt: `Você é um criador de conteúdo viral para Instagram no nicho de ${inferred.niche}.

CONTEXTO: Eu sou @${handle}, meu público são ${inferred.audience}. Preciso criar um carrossel que ATAQUE uma crença popular do meu mercado para me posicionar como autoridade.

TAREFA: Crie um carrossel completo de 7 slides seguindo esta estrutura:

SLIDE 1 (CAPA - Hook):
- Título provocativo que faça as pessoas quererem discordar
- Exemplo: "Por que [crença popular] está destruindo [resultado desejado]"

SLIDE 2 (O PROBLEMA):
- Mostre a crença popular e por que as pessoas acreditam nela

SLIDE 3 (A VERDADE):
- Revele por que essa crença está errada

SLIDES 4-6 (AS PROVAS):
- 3 argumentos ou evidências que sustentam sua posição
- Use dados, exemplos, ou lógica

SLIDE 7 (O CHAMADO):
- CTA claro baseado no posicionamento
- Faça as pessoas escolherem um lado

REGRAS:
- Cada slide: máximo 50 palavras
- Use frases curtas e impactantes
- Inclua indicações de design (cores, ícones sugeridos)
- O carrossel deve ser IMPOSSÍVEL de ignorar

Tom: Confiante, levemente arrogante, baseado em evidências.
Evite: "Na minha opinião", "Pode ser que", qualquer suavização.`
      },
      {
        day: 5,
        action: `Mostre um resultado real seu ou de cliente nos stories. Print, número, depoimento. Sem explicação, sem humildade fake.`,
        format: "story",
        why: "Desejo nasce de prova. Chega de ensinar teoria. Mostre que funciona.",
        prompt: `Você é um especialista em prova social para Instagram no nicho de ${inferred.niche}.

CONTEXTO: Eu sou @${handle} e preciso mostrar RESULTADOS nos stories para construir autoridade. Meu público são ${inferred.audience}. Tenho medo de parecer convencido, mas sei que preciso mostrar provas.

TAREFA: Me ajude a estruturar uma SEQUÊNCIA DE STORIES (5-7 stories) que mostre resultados de forma estratégica:

STORY 1: Gancho de curiosidade
- "Olha o que aconteceu com [cliente/eu] em [período]..."

STORY 2: O ANTES
- Contexto do problema inicial (breve)

STORY 3: A PROVA
- Print, número, foto, ou depoimento
- Texto de suporte destacando o resultado

STORY 4: O MÉTODO (opcional)
- Brevemente o que foi feito (sem entregar tudo)

STORY 5: O CALL TO ACTION
- Convite para próximo passo

PARA CADA STORY, INCLUA:
- Texto exato para escrever
- Tipo de print/foto/vídeo usar
- Stickers ou elementos visuais sugeridos
- Cores e estilo visual

IMPORTANTE: Me dê exemplos de RESULTADOS que eu poderia mostrar mesmo sendo iniciante:
- Pequenas vitórias que contam
- Resultados pessoais que viram case
- Feedbacks informais que posso transformar em prova

Tom: Confiante, sem falsa modéstia, mas sem parecer "guru".
Evite: "Tive a honra de", "Humildemente", qualquer forma de pedir desculpas por ter resultado.`
      },
      {
        day: 6,
        action: `Faça uma oferta direta nos stories: "Eu tenho X, custa Y, serve para Z. Quem quer, me chama."`,
        format: "story",
        why: "Teste de conversão. Se ninguém responder, posicionamento ainda está fraco.",
        prompt: `Você é um copywriter de vendas diretas para Instagram no nicho de ${inferred.niche}.

CONTEXTO: Eu sou @${handle}, meu público são ${inferred.audience}. Tenho medo de vender e ser rejeitado, mas preciso fazer uma OFERTA DIRETA nos stories para testar minha conversão.

TAREFA: Crie uma SEQUÊNCIA DE STORIES DE VENDA (5-7 stories) que seja direta sem ser agressiva:

STORY 1: Pré-qualificação
- "Se você [situação específica], fica até o final..."

STORY 2: O Problema
- Descreva a dor que seu produto/serviço resolve

STORY 3: A Solução
- O que você oferece (sem enrolação)

STORY 4: Como funciona
- Formato, duração, entrega (objetivo)

STORY 5: Preço + Para quem é
- Valor claro + perfil ideal do cliente

STORY 6: Para quem NÃO é
- Quem não deve comprar (filtro)

STORY 7: CTA Direto
- "Manda 'QUERO' no DM que eu te respondo"

PARA CADA STORY:
- Texto exato
- Se é vídeo, texto, ou foto
- Elementos visuais

REGRAS:
- Preço deve aparecer de forma clara, sem esconder
- Use escassez REAL (não fake)
- Não use "saiba mais" ou "link na bio" - seja DIRETO

Tom: Vendedor confiante, não desesperado. Você está oferecendo, não implorando.
Evite: "Talvez você goste", "Se tiver interesse", qualquer forma de pedir permissão.`
      },
      {
        day: 7,
        action: `Análise: Liste quem mais engajou nos últimos 6 dias e mande DM perguntando: "O que te fez reagir?"`,
        format: "destaque",
        why: "Fechamento do ciclo. Dados reais sobre sua tribo. Próximo sprint parte daqui.",
        prompt: `Você é um estrategista de relacionamento e vendas por DM para ${inferred.niche}.

CONTEXTO: Eu sou @${handle}, passei 6 dias criando conteúdo polarizado e mostrando resultados. Agora preciso analisar quem engajou e iniciar conversas estratégicas. Meu público são ${inferred.audience}.

TAREFA: Me ajude a criar um SISTEMA DE ANÁLISE E ABORDAGEM:

PARTE 1 - ANÁLISE
Me dê critérios para identificar os TOP 10 engajadores:
- Onde procurar (stories views, comentários, DMs, saves)
- O que cada tipo de engajamento significa
- Como priorizar quem abordar primeiro

PARTE 2 - SCRIPT DE PRIMEIRA DM
Crie 3 versões de mensagem inicial que:
- Não pareça automatizada
- Faça referência ao conteúdo específico
- Gere resposta (pergunta aberta)
- Não tente vender nada ainda

PARTE 3 - SCRIPT DE CONTINUAÇÃO
Se a pessoa responder, como continuo a conversa:
- 2-3 mensagens de aprofundamento
- Ponto de transição para oferta (se fizer sentido)
- Como identificar se é lead qualificado

PARTE 4 - REGISTRO
Template simples para registrar:
- Nome
- Tipo de engajamento
- Resposta da DM
- Próximo passo

Tom: Genuinamente curioso, não vendedor. Você quer entender, não empurrar.
Evite: "Vi que você curtiu meu conteúdo", "Tudo bem?", qualquer abertura genérica.`
      }
    ]
  };
};
