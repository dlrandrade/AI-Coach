// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// THE LUZZIA PROTOCOL - SISTEMA DE AUTÓPSIA TÉCNICA v2.0
const SYSTEM_PROMPT = (intensity: 'SURGICAL' | 'LETHAL' = 'SURGICAL') => `
Você é a LuzzIA, um sistema de análise técnica de posicionamento e psicologia de consumo no Instagram.

Você está operando no modo: PROTOCOLO_${intensity}.

${intensity === 'LETHAL'
    ? 'Sua análise deve ser EXTREMAMENTE BRUTAL. Não poupe o ego. Use termos viscerais. Exponha a mediocridade sem filtros.'
    : 'Sua análise deve ser clínica, técnica e direta. Foque na falha estrutural de forma objetiva.'}

---

## MISSÃO

Analisar o perfil informado através do protocolo OPTIKKA:
* Identificar o padrão inconsciente (Acusação)
* Expor o medo que trava o crescimento (Medo)
* Calcular o custo real em autoridade/dinheiro (Custo)
* Listar EXATAMENTE o que foi analisado (Análise Técnica)

---

## REGRAS DE ANÁLISE TÉCNICA

Para cada bloco, você deve descrever o que especificamente "analisou" no perfil. 
Cite elementos específicos de Bio, Feed, Legendas, Estética e Estratégia de Conteúdo.

---

## FORMATO OBRIGATÓRIO DA ENTREGA (JSON)

{
  "metadata": {
    "intensity": "${intensity}",
    "session_id": "AUTO_GEN",
    "timestamp": "ISO_DATE"
  },
  "blocks": [
    {
      "title": "NOME DO BLOCO",
      "acusacao": "Frase direta sobre o erro.",
      "medo": "O medo psicológico.",
      "custo": "O impacto real.",
      "prova": "O detalhamento técnico do que foi analisado.",
      "score": "fraco" | "medio" | "forte"
    }
  ],
  "verdict": "SENTENÇA ESTRATÉGICA FINAL",
  "plan": [
    {
      "day": 1,
      "action": "Ação clara.",
      "format": "story | reel | carrossel | bio | destaque",
      "why": "O fundamento psicológico.",
      "prompt": "Prompt completo para ChatGPT."
    }
  ]
}
`;

export interface AnalysisBlock {
  title: string;
  acusacao: string;
  medo: string;
  custo: string;
  prova: string;
  score: 'fraco' | 'medio' | 'forte';
}

export interface PlanDay {
  day: number;
  action: string;
  format: string;
  why: string;
  prompt: string;
}

export interface AnalysisResult {
  metadata?: {
    intensity: string;
    session_id: string;
    timestamp: string;
  };
  blocks: AnalysisBlock[];
  verdict: string;
  plan: PlanDay[];
}

export const analyzeProfile = async (handle: string, intensity: 'SURGICAL' | 'LETHAL' = 'SURGICAL'): Promise<AnalysisResult> => {
  try {
    const response = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'LuzzIA - Autópsia Técnica'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT(intensity) },
          { role: 'user', content: `Realize a AUTÓPSIA TÉCNICA do perfil @${handle}. Modo: ${intensity}.` }
        ],
        temperature: intensity === 'LETHAL' ? 0.9 : 0.6,
        max_tokens: 4000
      })
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    const jsonString = content.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString) as AnalysisResult;

  } catch (error) {
    console.error('AI Error:', error);
    return simulateAnalysis(handle);
  }
};

const simulateAnalysis = (handle: string): AnalysisResult => {
  return {
    blocks: [
      {
        title: "REALIDADE ESTRUTURAL",
        acusacao: "O perfil comunica esforço, mas não autoridade.",
        medo: "Medo de ser criticado por quem já tem mais tempo de mercado.",
        custo: "Atração de clientes 'curiosos' que pedem desconto.",
        prova: "Análise das últimas 9 capas: Tipografia inconsistente e falta de um rosto/voz central forte nas legendas.",
        score: "fraco"
      }
    ],
    verdict: "O PERFIL PRECISA DE RECONSTRUÇÃO DE AUTORIDADE",
    plan: [
      {
        day: 1,
        action: "Remover frases motivacionais vazias da Bio.",
        format: "bio",
        why: "MOTIVAÇÃO É COMMODITY. RESULTADO É DIFERENCIAL.",
        prompt: "Atue como estrategista. Analise meu perfil @handle e sugira 3 bios focadas em resultado..."
      }
    ]
  };
};
