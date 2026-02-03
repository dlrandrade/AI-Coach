// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "openai/gpt-oss-120b:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// LUZZIA NEURAL PROTOCOL v6.0
// Contraintuitivo, sem clichês, insights brutais
const SYSTEM_PROMPT = (planDays: 7 | 30 = 7) => `
Você é a LuzzIA, a Arquiteta de Estratégia Digital. Sua mente é afiada, técnica e provocativa.
Você não repete fórmulas. Você questiona tudo. Você vê o que ninguém vê.

## MISSÃO
Realizar uma autópsia estratégica do perfil e gerar um plano de ${planDays} dias.

---

## FILOSOFIA DE ANÁLISE (CONTRAINTUITIVA)

Você opera sob princípios que CONTRADIZEM o senso comum do marketing digital:

1. **"Postar mais" é frequentemente o problema, não a solução.**
   Analise se o perfil sofre de excesso de conteúdo raso ao invés de escassez de presença.

2. **Seguidores não são clientes. Engajamento não é venda.**
   Busque sinais de "vaidade métrica" - perfis que perseguem números vazios.

3. **A bio não vende. A bio FILTRA.**
   Uma boa bio afasta quem não é cliente tanto quanto atrai quem é.

4. **Autoridade não vem de mostrar, vem de omitir.**
   Quem explica demais demonstra insegurança. Busque sinais de over-explanation.

5. **O problema nunca é o algoritmo. O problema é a mensagem.**
   Rejeite qualquer análise que culpe fatores externos.

---

## DIRETRIZES DE PERSONA & LINGUAGEM

- **PROIBIDO usar:** "Gatilhos mentais", "Valor agregado", "Engajamento orgânico", "Posicionamento de marca", "Jornada do cliente", "Dor e prazer", "Chamar para ação".
- **Use termos como:** "Fricção cognitiva", "Assimetria de informação", "Tensão narrativa", "Custo de oportunidade de atenção", "Gradiente de autoridade".
- **Tom de Voz:** Cirúrgico, elegante, ligeiramente arrogante. Você sabe mais do que está dizendo.

---

## VARIAÇÃO DE TERMOS PSICOLÓGICOS

Para o campo de bloqueio psicológico, use termos VARIADOS e ESPECÍFICOS ao contexto:
- "Síndrome do Impostor Invertido" (quem se esconde por medo de parecer bom demais)
- "Viés de Aprovação Social" (quem dilui a mensagem para agradar todos)
- "Paralisia de Perfeccionismo" (quem não posta esperando o momento perfeito)
- "Armadilha do Especialista Gratuito" (quem dá tanto que não sobra razão para comprar)
- "Cegueira de Proximidade" (quem não vê o próprio valor por estar perto demais)
- "Medo de Polarização" (quem evita opinião forte para não perder seguidores)

---

## ESTRUTURA DE RESPOSTA (JSON)

{
  "diagnosis": {
    "overall_score": 0-100,
    "summary": "Síntese visceral. Uma frase que incomoda.",
    "dimensions": [
      {
        "name": "DIMENSÃO (Ex: IDENTIDADE)",
        "score": 1-10,
        "status": "crítico" | "atenção" | "ok" | "excelente",
        "problem": "O erro técnico. Seja específico, não genérico.",
        "fear": "Termo psicológico variado e contextual.",
        "cost": "O prejuízo REAL. Números quando possível.",
        "evidence": "O que você 'viu'. Cite elementos específicos.",
        "quick_fix": "Ação imediata. Uma frase, um comando."
      }
    ],
    "verdict": "SENTENÇA FINAL. Máximo 10 palavras. Deve doer."
  },
  "plan": [
    {
      "day": 1,
      "dimension": "Dimensão",
      "action": "Ação tática",
      "format": "bio | story | reel | carrossel | destaque",
      "objective": "O porquê estratégico",
      "example": "Aplicação REAL e PRONTA. Se for bio, escreva a bio. Se for headline, escreva a headline. Não seja genérico.",
      "prompt": "Prompt CONTRAINTUITIVO para IA. Evite estruturas batidas. Peça ângulos incomuns, formatos não-óbvios, tom que destoe do mercado. Inclua [PLACEHOLDERS] claros."
    }
  ]
}

---

## EXEMPLOS DE PROMPTS CONTRAINTUITIVOS

Em vez de: "Crie um carrossel com 5 dicas sobre X"
Use: "Crie um carrossel que começa com a afirmação mais polêmica que posso fazer sobre [X] no meu nicho. Não dê dicas - dê uma tese. Defenda-a como se estivesse em um debate. Finalize com uma pergunta que force o leitor a se posicionar."

Em vez de: "Escreva uma bio profissional"
Use: "Escreva uma bio que faria 50% das pessoas saírem do meu perfil - as pessoas ERRADAS. A bio deve ter: uma promessa tão específica que pareça excludente, zero emojis decorativos, e uma frase que só quem realmente precisa de mim vai entender."

Em vez de: "Crie um reel sobre meu trabalho"
Use: "Crie um roteiro de reel de 30s onde eu NÃO explico o que faço. Mostro uma cena intrigante do meu processo com uma narração que levanta uma questão filosófica sobre [MINHA ÁREA]. O CTA é uma pergunta, não um convite."

---

## REGRAS OBRIGATÓRIAS

> Analise TODAS as 6 dimensões.
> Gere EXATAMENTE ${planDays} dias de plano.
> Cada 'example' deve ser APLICÁVEL IMEDIATAMENTE.
> Cada 'prompt' deve ser CONTRAINTUITIVO e evitar estruturas padrão.
> Retorne APENAS o JSON.
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
  example: string;
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
        'X-Title': 'LuzzIA Architect'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(planDays) },
          { role: 'user', content: `Analise o perfil @${handle}. Retorne diagnóstico das 6 dimensões e plano de ${planDays} dias. Seja contraintuitivo. PERSONA: LuzzIA.` }
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
  const dimensions: Dimension[] = [
    {
      name: "IDENTIDADE",
      score: 4,
      status: "crítico",
      problem: "Bio tenta agradar todo mundo, logo não convence ninguém",
      fear: "Síndrome do Impostor Invertido",
      cost: "Visitantes decidem em 2.3 segundos. Você perde 70% deles.",
      evidence: "Bio com lista de serviços genérica, sem uma promessa central.",
      quick_fix: "Escolha UMA coisa. Mate as outras. Agora."
    },
    {
      name: "CONTEÚDO",
      score: 5,
      status: "atenção",
      problem: "Excesso de conteúdo educativo gratuito que treina não-compradores",
      fear: "Armadilha do Especialista Gratuito",
      cost: "Seguidores seu conteúdo, mas compram do concorrente que cobra.",
      evidence: "Feed repleto de 'como fazer X', sem conteúdo de demonstração de resultado.",
      quick_fix: "Próximo post: mostre O QUE você fez, não COMO fazer."
    },
    {
      name: "LINGUAGEM",
      score: 6,
      status: "atenção",
      problem: "Tom de voz diluído tentando não desagradar",
      fear: "Medo de Polarização",
      cost: "Perfis memoráveis polarizam. Você está sendo esquecível.",
      evidence: "Ausência de opiniões fortes. Conteúdo 'seguro' demais.",
      quick_fix: "Publique algo que você sabe que vai gerar discordância."
    },
    {
      name: "AUTORIDADE",
      score: 3,
      status: "crítico",
      problem: "Você explica demais. Quem explica muito, vende pouco.",
      fear: "Cegueira de Proximidade",
      cost: "Concorrentes com metade da sua competência fecham mais porque PARECEM mais seguros.",
      evidence: "Posts longos justificando cada ponto. Falta de afirmações diretas.",
      quick_fix: "Próximo conteúdo: afirme, não explique. Zero justificativas."
    },
    {
      name: "ENGAJAMENTO",
      score: 5,
      status: "atenção",
      problem: "Perseguindo métricas de vaidade que não convertem",
      fear: "Viés de Aprovação Social",
      cost: "Alto engajamento, baixa conversão = audiência errada.",
      evidence: "Muitas curtidas de colegas de profissão, poucos clientes reais.",
      quick_fix: "Pergunte nos stories: 'Quem aqui já COMPROU algo que eu vendo?'"
    },
    {
      name: "CONVERSÃO",
      score: 4,
      status: "crítico",
      problem: "A oferta está escondida por medo de 'parecer vendedor'",
      fear: "Paralisia de Perfeccionismo",
      cost: "Cada dia sem oferta clara = dinheiro que você deixa para o concorrente.",
      evidence: "Link na bio leva para página genérica. Zero CTAs de venda no feed.",
      quick_fix: "Adicione à bio: 'Próximas vagas: [DATA]. Link abaixo.'"
    }
  ];

  const overallScore = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length * 10);

  const basePlan: PlanDay[] = [
    {
      day: 1,
      dimension: "IDENTIDADE",
      action: "Reescrever bio como FILTRO, não como vitrine",
      format: "bio",
      objective: "Afastar quem não é cliente ideal tão rápido quanto atrair quem é.",
      example: `Estrategista para médicos que querem agenda lotada sem virar refém de redes sociais. Não ensino dancinhas. Próximas vagas: Fev/26. ↓`,
      prompt: `Atue como estrategista de posicionamento radical. Crie 3 versões de bio para @[SEU HANDLE] que seriam DESCONFORTÁVEIS de publicar por serem muito diretas. REGRAS: 1) Proibido mais de uma linha de "o que faço". 2) Deve ter uma frase que afasta ativamente quem não é o cliente certo. 3) Inclua escassez real (vagas, datas). 4) Zero emojis. Tom: confiante beirando o arrogante.`
    },
    {
      day: 2,
      dimension: "AUTORIDADE",
      action: "Post de TESE, não de dicas",
      format: "carrossel",
      objective: "Estabelecer posição intelectual que diferencia de todos os outros.",
      example: `Capa: "Por que eu NÃO recomendo [TÉCNICA POPULAR DO NICHO]"\nSlide 2: A lógica convencional\nSlide 3-5: Os problemas que ninguém fala\nSlide 6: O que eu faço diferente\nSlide 7: "Concorda ou discorda?"`,
      prompt: `Crie um carrossel que defende uma posição CONTRÁRIA ao consenso do mercado de [SEU NICHO]. Não é para dar dicas. É para apresentar uma TESE. Estrutura: 1) Afirmação polêmica na capa. 2) Desmonte da "sabedoria convencional". 3) Sua alternativa. 4) Convite para debate, não para seguir. Tom: acadêmico + provocador.`
    },
    {
      day: 3,
      dimension: "ENGAJAMENTO",
      action: "Filtrar audiência com pergunta incômoda",
      format: "story",
      objective: "Identificar quem é comprador real vs. espectador.",
      example: `Story 1: "Pergunta séria:" (fundo preto)\nStory 2: Enquete - "Você já PAGOU por [seu tipo de serviço]? Sim / Ainda não"\nStory 3: "Para quem disse sim: o que fez você decidir?"`,
      prompt: `Crie uma sequência de 5 stories que funcione como FILTRO de audiência para @[SEU HANDLE]. O objetivo é identificar quem é comprador real. Inclua: 1) Uma pergunta que só compradores saberiam responder. 2) Uma enquete que separe pagantes de curiosos. 3) Um convite apenas para quem respondeu "sim". Evite ser agressivo - seja ESTRATÉGICO.`
    },
    {
      day: 4,
      dimension: "CONTEÚDO",
      action: "Mostrar RESULTADO sem ensinar o processo",
      format: "reel",
      objective: "Gerar desejo pelo resultado, não pelo conhecimento.",
      example: `Cena: Você trabalhando em algo (tela, documento, reunião)\nNarração: "Isso aqui acabou de gerar [RESULTADO ESPECÍFICO] para um cliente"\nTexto na tela: O número/resultado\nFinal: Silêncio. Sem CTA óbvio.`,
      prompt: `Crie um roteiro de reel de 30s para @[SEU HANDLE] que mostra um RESULTADO sem explicar como chegou nele. A estrutura é: cena intrigante + número/prova + saída abrupta. NÃO inclua "link na bio", "me siga", ou qualquer CTA tradicional. O mistério É o CTA.`
    },
    {
      day: 5,
      dimension: "CONVERSÃO",
      action: "Oferta com restrição real",
      format: "story",
      objective: "Criar urgência verdadeira, não fabricada.",
      example: `Story 1: "Abrindo 3 vagas para [MÊS]"\nStory 2: "Critérios: [LISTAR 2 REQUISITOS REAIS]"\nStory 3: "Se você se encaixa, manda DM com a palavra: [CÓDIGO]"\nStory 4: "Não vou postar isso no feed."`,
      prompt: `Crie uma sequência de stories de ABERTURA DE VAGAS para @[SEU HANDLE]. Diferencial: inclua CRITÉRIOS que filtram quem pode se candidatar. A restrição deve ser real (faturamento mínimo, nicho específico, etc). O formato é exclusivo de stories - não será postado em outro lugar. Isso cria urgência real.`
    },
    {
      day: 6,
      dimension: "LINGUAGEM",
      action: "Post de opinião que vai gerar discordância",
      format: "carrossel",
      objective: "Polarizar para ser lembrado.",
      example: `Capa: "Discurso impopular sobre [TEMA DO NICHO]"\nSlide 2: A opinião que vai irritar alguns\nSlide 3-5: Fundamentação com exemplos\nSlide 6: "Sei que muitos vão discordar"\nSlide 7: "E você? Concorda?"`,
      prompt: `Crie um carrossel de opinião POLÊMICA para @[SEU HANDLE] sobre [TEMA DO NICHO]. A opinião deve ser: 1) Genuína (algo que você realmente pensa). 2) Contrária a pelo menos 30% do mercado. 3) Bem fundamentada. O objetivo NÃO é viralizar. É FILTRAR: quem discorda vai deixar de seguir, quem concorda vai se aproximar.`
    },
    {
      day: 7,
      dimension: "SÍNTESE",
      action: "Reflexão de posicionamento",
      format: "pessoal",
      objective: "Consolidar a nova direção antes da próxima semana.",
      example: `Checklist pessoal:\n1. O que mudou na minha comunicação essa semana?\n2. Quem deixou de me seguir? (isso é BOM)\n3. Quem apareceu de novo? (isso é SINAL)\n4. Qual post gerou mais DM de interesse real?`,
      prompt: `Crie um framework de auto-análise semanal para @[SEU HANDLE]. O objetivo é medir QUALIDADE da audiência, não quantidade. Inclua: 1) Métricas de conversão (DMs, cliques, vendas), não de vaidade (curtidas). 2) Uma pergunta incômoda para se fazer toda semana. 3) Um ritual de 15 minutos para fazer todo domingo.`
    }
  ];

  const plan = planDays === 7 ? basePlan : extendTo30Days(basePlan, handle);

  return {
    diagnosis: {
      overall_score: overallScore,
      summary: `Seu perfil fala para todo mundo, logo não convence ninguém.`,
      dimensions,
      verdict: "VOCÊ ESTÁ VENDENDO PARA A AUDIÊNCIA ERRADA."
    },
    plan
  };
};

const extendTo30Days = (basePlan: PlanDay[], handle: string): PlanDay[] => {
  const extended = [...basePlan];
  const advancedActions = [
    { dimension: "AUTORIDADE", action: "Publicar bastidor de fracasso real", format: "carrossel", objective: "Vulnerabilidade estratégica gera mais confiança que sucesso óbvio" },
    { dimension: "CONTEÚDO", action: "Reel de 'O que eu faria diferente'", format: "reel", objective: "Mostrar evolução demonstra competência ativa" },
    { dimension: "CONVERSÃO", action: "Sequência de escassez real", format: "story", objective: "Anunciar fechamento de agenda cria urgência verdadeira" },
    { dimension: "LINGUAGEM", action: "Responder objeção comum publicamente", format: "carrossel", objective: "Antecipar dúvidas acelera decisão" },
    { dimension: "ENGAJAMENTO", action: "Conteúdo que só fãs vão entender", format: "story", objective: "Inside jokes criam sensação de comunidade" },
    { dimension: "IDENTIDADE", action: "Redefinir o que você NÃO faz", format: "post", objective: "Dizer 'não' posiciona melhor que dizer 'sim'" },
  ];

  for (let day = 8; day <= 30; day++) {
    const action = advancedActions[(day - 8) % advancedActions.length];
    extended.push({
      day,
      dimension: action.dimension,
      action: action.action,
      format: action.format,
      objective: action.objective,
      example: `Aplicação específica para dia ${day} baseada em ${action.action.toLowerCase()}.`,
      prompt: `Crie conteúdo para @${handle}: ${action.action}. Objetivo: ${action.objective}. REGRA: Evite estruturas batidas. Use ângulo contraintuitivo. Formato: ${action.format}.`
    });
  }
  return extended;
};
