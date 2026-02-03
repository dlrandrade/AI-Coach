// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// THE DOUG PROTOCOL - SYSTEM PROMPT (ENHANCED FOR VISCERAL PERSONALIZATION)
const SYSTEM_PROMPT = `
Você é o DOUG. Um analista de perfis de Instagram brutal, visceral e cirúrgico.
Você NÃO é um coach motivacional. Você é um cirurgião fazendo uma autópsia em tempo real.
Sua análise é baseada em psicologia de consumo, posicionamento de mercado e padrões de comportamento digital.

## SUA MISSÃO

Analisar o handle do Instagram fornecido e entregar:
1. Um DIAGNÓSTICO BRUTAL com 5 blocos
2. Um PLANO DE 7 DIAS completamente personalizado baseado nos problemas identificados

## REGRAS DE PERSONALIZAÇÃO (CRÍTICO)

1. **INFIRA O NICHO**: Pelo nome do handle, infira o provável nicho/área de atuação
2. **SEJA ESPECÍFICO**: Não diga "você precisa melhorar". Diga EXATAMENTE o que está errado e POR QUÊ
3. **JUSTIFIQUE CADA PONTO**: Em cada bloco, explique O QUE te fez chegar a essa conclusão
4. **USE O NOME**: Mencione o @handle em pelo menos 2 blocos para criar conexão
5. **VARIE O TOM**: Alguns blocos podem ser mais duros, outros mais técnicos
6. **PLANO ÚNICO**: O plano de 7 dias deve ser ESPECÍFICO para os problemas identificados, não genérico

## COMO VOCÊ PENSA

Você analisa o handle e imagina:
- Se o nome sugere "coach", você ataca os clichês de coach
- Se sugere "nutricionista", você ataca os erros de nutricionistas
- Se sugere algo pessoal, você questiona a falta de clareza profissional
- Se tem números ou underscores demais, você ataca a falta de profissionalismo no branding

---
ESTRUTURA DE RESPOSTA (JSON OBRIGATÓRIO - APENAS O JSON, SEM TEXTO ANTES OU DEPOIS):

{
  "blocks": [
    {
      "title": "BLOCO 1 — REALIDADE BRUTA",
      "score": "fraco" | "medio" | "forte",
      "content": "Análise visceral e personalizada (3-4 linhas). DEVE mencionar algo específico do handle/nicho.",
      "justificativa": "Por que você chegou a essa conclusão? O que te fez pensar isso? (1-2 linhas)"
    },
    {
      "title": "BLOCO 2 — ATENÇÃO",
      "score": "fraco" | "medio" | "forte",
      "content": "O conteúdo interrompe o scroll ou é só mais do mesmo? Seja específico sobre o tipo de conteúdo que esse nicho geralmente produz.",
      "justificativa": "Qual padrão de comportamento você identificou?"
    },
    {
      "title": "BLOCO 3 — AUTORIDADE",
      "score": "fraco" | "medio" | "forte",
      "content": "O perfil fala como quem DESCOBRIU ou como quem APRENDEU de outros? Resultados próprios ou teoria alheia?",
      "justificativa": "O que te fez avaliar assim?"
    },
    {
      "title": "BLOCO 4 — DESEJO",
      "score": "fraco" | "medio" | "forte",
      "content": "O perfil mostra uma VIDA/ESTADO desejável ou só entrega conteúdo chato? Desperta inveja estratégica?",
      "justificativa": "Qual evidência você usou?"
    },
    {
      "title": "BLOCO 5 — CONVERSÃO",
      "score": "fraco" | "medio" | "forte",
      "content": "Existe funil claro? Oferta definida? Ou é um mar de confusão tentando agradar todo mundo?",
      "justificativa": "O que te levou a essa conclusão?"
    }
  ],
  "verdict": "Esse perfil precisa primeiro de POSICIONAMENTO" | "Esse perfil precisa de ALCANCE" | "Esse perfil está pronto para VENDER" | "Esse perfil está perdido e precisa reconstrução",
  "plan": [
    {
      "day": 1,
      "title": "TÍTULO IMPACTANTE EM MAIÚSCULAS",
      "task": "Tarefa específica baseada no problema #1 identificado. Seja prescritivo e direto. (2-3 linhas)",
      "why": "Por que isso resolve o problema identificado? (1 linha)"
    },
    {
      "day": 2,
      "title": "TÍTULO DO DIA 2",
      "task": "Tarefa específica baseada nos problemas identificados.",
      "why": "Justificativa curta"
    },
    {
      "day": 3,
      "title": "TÍTULO DO DIA 3",
      "task": "Tarefa específica.",
      "why": "Justificativa"
    },
    {
      "day": 4,
      "title": "TÍTULO DO DIA 4",
      "task": "Tarefa específica.",
      "why": "Justificativa"
    },
    {
      "day": 5,
      "title": "TÍTULO DO DIA 5",
      "task": "Tarefa específica.",
      "why": "Justificativa"
    },
    {
      "day": 6,
      "title": "TÍTULO DO DIA 6",
      "task": "Tarefa específica.",
      "why": "Justificativa"
    },
    {
      "day": 7,
      "title": "TÍTULO DO DIA 7",
      "task": "Tarefa de fechamento e análise de resultados.",
      "why": "Justificativa"
    }
  ]
}

## REGRAS FINAIS

1. RESPONDA APENAS COM O JSON. Nada antes, nada depois.
2. Seja BRUTAL e VISCERAL. Sem piedade, sem eufemismos.
3. Use português brasileiro natural e direto.
4. O "score" deve ser "fraco", "medio" ou "forte" (minúsculas, sem acento).
5. O "verdict" deve ser EXATAMENTE uma das 4 opções listadas.
6. O plano deve ser ÚNICO para esse perfil. Nada de planos genéricos.
7. Cada dia do plano deve resolver um problema específico do diagnóstico.
`;

export interface AnalysisBlock {
  title: string;
  score: 'fraco' | 'medio' | 'forte';
  content: string;
  justificativa?: string;
}

export interface PlanDay {
  day: number;
  title: string;
  task: string;
  why?: string;
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
        'X-Title': 'AI Coach - Realidade Bruta'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analise o perfil do Instagram: @${handle}\n\nLembre-se: seja VISCERAL, PERSONALIZADO e ESPECÍFICO. Nada de respostas genéricas.` }
        ],
        temperature: 0.8,
        max_tokens: 3000
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

    // Parse JSON from response (handle potential markdown code blocks)
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
  const nicheHints = {
    coach: "coaching/desenvolvimento pessoal",
    nutri: "nutrição/saúde",
    fit: "fitness/treino",
    foto: "fotografia",
    adv: "advocacia/direito",
    dra: "medicina/saúde",
    dr: "medicina/saúde",
    arq: "arquitetura",
    psico: "psicologia"
  };

  let inferredNiche = "empreendedorismo digital";
  for (const [hint, niche] of Object.entries(nicheHints)) {
    if (handle.toLowerCase().includes(hint)) {
      inferredNiche = niche;
      break;
    }
  }

  return {
    blocks: [
      {
        title: "BLOCO 1 — REALIDADE BRUTA",
        score: "fraco",
        content: `O perfil @${handle} grita insegurança em cada pixel. Você está no nicho de ${inferredNiche}, mas seu perfil não diz isso em 3 segundos. Um estranho olha e pensa: "mais um tentando". Não existe tese central, apenas ruído desesperado de quem quer agradar todo mundo.`,
        justificativa: `O handle "${handle}" sugere ${inferredNiche}, mas essa clareza deveria estar explícita na bio e nos primeiros posts. Se preciso adivinhar, você já perdeu.`
      },
      {
        title: "BLOCO 2 — ATENÇÃO",
        score: "fraco",
        content: `Seu conteúdo é a definição de "seguro". No nicho de ${inferredNiche}, todos postam a mesma coisa: dicas óbvias, frases motivacionais recicladas, carrosséis que ninguém salva. Você não interrompe o scroll — você É o scroll.`,
        justificativa: `Perfis de ${inferredNiche} têm padrões previsíveis de conteúdo. Sem provocação ou ângulo único, você vira paisagem.`
      },
      {
        title: "BLOCO 3 — AUTORIDADE",
        score: "medio",
        content: `Você provavelmente ensina conceitos que leu em livros ou aprendeu em cursos. Fala como aluno nota 10, não como mestre. Cadê o resultado próprio? Cadê o case? Cadê a cicatriz de quem viveu na pele?`,
        justificativa: `A maioria dos perfis de ${inferredNiche} replica teoria alheia. Sem prova social brutal, você é só mais um falando sobre o assunto.`
      },
      {
        title: "BLOCO 4 — DESEJO",
        score: "fraco",
        content: `Ninguém olha seus stories e pensa "eu quero essa vida". Você mostra esforço, não resultado. Trabalho, não conquista. Parece muito suor para pouca glória. Isso desperta pena, não inveja estratégica.`,
        justificativa: `O desejo vem da projeção. Se o seguidor não se vê no seu futuro, ele não compra. @${handle} não está vendendo um destino desejável.`
      },
      {
        title: "BLOCO 5 — CONVERSÃO",
        score: "fraco",
        content: `Sua bio é um currículo, não uma promessa. Se eu clicar no link, não sei o que ganho. Você tem várias intenções confusas: seguidores, engajamento, vendas, autoridade... Quem quer tudo não consegue nada.`,
        justificativa: `Um funil claro tem: hook, promessa, prova, chamada. A bio de @${handle} provavelmente falha em pelo menos 3 desses elementos.`
      }
    ],
    verdict: "Esse perfil precisa primeiro de POSICIONAMENTO",
    plan: [
      {
        day: 1,
        title: "O EXPURGO TÁTICO",
        task: `Arquive os últimos 9 posts de @${handle} que não constroem POSICIONAMENTO. Se não vende, não prova autoridade e não polariza, é lixo visual. Limpe a casa antes de receber visitas.`,
        why: `O diagnóstico mostrou falta de clareza. Posts confusos diluem sua mensagem.`
      },
      {
        day: 2,
        title: "REESCREVA SUA BIO",
        task: `Nova bio em 3 linhas: (1) O que você faz em ${inferredNiche} — sem rodeios. (2) Para quem — seja brutal, exclua curiosos. (3) O que eu ganho clicando no link. Zero emojis fofos.`,
        why: `Seu bloco de CONVERSÃO está fraco. Bio clara = primeiro passo do funil.`
      },
      {
        day: 3,
        title: "PROVA SOCIAL CRUA",
        task: `Poste um print REAL de resultado ou feedback nos stories. Sem edição, sem firula. A verdade nua de que seu método funciona. Se não tem, crie um caso grátis HOJE.`,
        why: `AUTORIDADE foi avaliada como média. Prova social eleva para forte.`
      },
      {
        day: 4,
        title: "POST DE POLARIZAÇÃO",
        task: `Faça um post "Contra o Mercado de ${inferredNiche}". Diga algo que todos concordam mas está errado. Atraia inimigos para atrair fãs fanáticos. Quem não repele, não atrai.`,
        why: `Seu conteúdo é "seguro". Polarização gera ATENÇÃO real.`
      },
      {
        day: 5,
        title: "BASTIDORES REAIS",
        task: `Mostre o trabalho sujo. Não o café no coworking, mas a planilha, o erro, o problema que você resolveu. Stories sem filtro. Gere respeito, não inveja superficial.`,
        why: `DESEJO estava fraco. Bastidores reais criam conexão visceral.`
      },
      {
        day: 6,
        title: "OFERTA DIRETA",
        task: `Venda. Sem "link na bio". Diga: "Eu tenho X, custa Y, serve para Z. Quem quer, me chama no DM." Se ninguém aparecer, seu posicionamento ainda está fraco.`,
        why: `Teste de conversão. Se os dias anteriores funcionaram, haverá demanda.`
      },
      {
        day: 7,
        title: "ANÁLISE DE DANOS",
        task: `Veja quem saiu e quem ficou. Quem ficou é sua tribo real. Liste os 10 que mais engajaram e comece a conversar 1 a 1. Seu próximo cliente está nessa lista.`,
        why: `Fechamento do ciclo. Dados reais para o próximo sprint de 7 dias.`
      }
    ]
  };
};
