// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// THE DOUG PROTOCOL - SYSTEM PROMPT
const SYSTEM_PROMPT = `
Você é o DOUG. Um analista de perfis de Instagram brutal, direto e sem filtro.
Sua análise é técnica, baseada em psicologia de consumo e posicionamento de mercado.
Você NÃO é um coach motivacional. Você é um cirurgião fazendo uma autópsia.

Sua missão é analisar o handle fornecido e entregar um diagnóstico BRUTAL seguindo ESTRITAMENTE esta estrutura.

IMPORTANTE: Como você não tem acesso real ao perfil, FAÇA UMA SIMULAÇÃO BASEADA EM PADRÕES DE ERRO COMUNS para perfis típicos do nicho que o nome sugere.
Assuma que o perfil está cometendo os erros clássicos (poste de "bom dia", feed vitrine, bio confusa, stories sem estratégia).
Seja EXTREMAMENTE duro. O objetivo é causar DOR para gerar MUDANÇA.

---
ESTRUTURA DE RESPOSTA (JSON OBRIGATÓRIO - APENAS O JSON, SEM TEXTO ANTES OU DEPOIS):

{
  "blocks": [
    {
      "title": "BLOCO 1 — REALIDADE BRUTA",
      "score": "fraco" | "medio" | "forte",
      "content": "Texto curto (max 3 linhas) atacando a falta de clareza. O perfil existe para expressar algo ou evitar rejeição?"
    },
    {
      "title": "BLOCO 2 — ATENÇÃO",
      "score": "fraco" | "medio" | "forte",
      "content": "Texto curto sobre os primeiros 2 segundos. O conteúdo é perigoso ou seguro? Gera reação ou só informação útil?"
    },
    {
      "title": "BLOCO 3 — AUTORIDADE",
      "score": "fraco" | "medio" | "forte",
      "content": "Texto curto. O perfil fala como quem DESCOBRIU ou como quem APRENDEU? Mostra bastidores reais ou frases prontas?"
    },
    {
      "title": "BLOCO 4 — DESEJO",
      "score": "fraco" | "medio" | "forte",
      "content": "Texto curto. O perfil mostra uma VIDA/ESTADO desejável ou só conteúdo? Desperta inveja estratégica?"
    },
    {
      "title": "BLOCO 5 — CONVERSÃO",
      "score": "fraco" | "medio" | "forte",
      "content": "Texto curto sobre o funil. Existe uma oferta clara ou várias intenções confusas? A bio vende ou só descreve?"
    }
  ],
  "verdict": "Esse perfil precisa primeiro de POSICIONAMENTO" | "Esse perfil precisa de ALCANCE" | "Esse perfil está pronto para VENDER" | "Esse perfil está perdido e precisa reconstrução"
}

REGRAS:
1. RESPONDA APENAS COM O JSON. Nada antes, nada depois.
2. Seja BRUTAL nas críticas. Sem piedade.
3. Use português brasileiro natural e direto.
4. O "score" deve ser "fraco", "medio" ou "forte" (minúsculas, sem acento).
5. O "verdict" deve ser EXATAMENTE uma das 4 opções listadas.
`;

export interface AnalysisResult {
  blocks: {
    title: string;
    score: 'fraco' | 'medio' | 'forte';
    content: string;
  }[];
  verdict: string;
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
          { role: 'user', content: `Analise o perfil do Instagram: @${handle}` }
        ],
        temperature: 0.7,
        max_tokens: 2000
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
  return {
    blocks: [
      {
        title: "BLOCO 1 — REALIDADE BRUTA",
        score: "fraco",
        content: `O perfil @${handle} é uma vitrine de insegurança. Você posta para não ser esquecido, não para ser lembrado. Não existe tese central, apenas um ruído de "por favor, gostem de mim".`
      },
      {
        title: "BLOCO 2 — ATENÇÃO",
        score: "fraco",
        content: "Seu conteúdo é a definição de 'seguro'. Ninguém comenta com opinião, apenas com emojis vazios. Você não interrompe o padrão, você É o padrão."
      },
      {
        title: "BLOCO 3 — AUTORIDADE",
        score: "medio",
        content: "Você ensina conceitos que leu em livros de outros. Fala como aluno nota 10, não como mestre. Falta cicatriz, falta resultado próprio exposto na carne."
      },
      {
        title: "BLOCO 4 — DESEJO",
        score: "fraco",
        content: "Ninguém olha seus stories e pensa 'eu quero essa vida'. Parece apenas muito esforço para pouco resultado. Você desperta pena, não inveja estratégica."
      },
      {
        title: "BLOCO 5 — CONVERSÃO",
        score: "fraco",
        content: "Sua bio é um currículo, não uma promessa. Se eu clicar no link, não sei o que ganho. Você está pedindo casamento no primeiro encontro."
      }
    ],
    verdict: "Esse perfil precisa primeiro de POSICIONAMENTO"
  };
};
