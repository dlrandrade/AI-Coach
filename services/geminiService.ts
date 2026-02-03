
import { GoogleGenAI, Type } from "@google/genai";
import type { OnboardingData, ContentPlan, FullDiagnosis } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- SCHEMAS (UNCHANGED) ---
const analysisResponseSchema = {
    type: Type.OBJECT, properties: { niche: { type: Type.STRING }, mainGoal: { type: Type.STRING }, focusChannel: { type: Type.STRING }, frequency: { type: Type.NUMBER }, currentLevel: { type: Type.STRING }, desiredStyles: { type: Type.ARRAY, items: { type: Type.STRING } }, products: { type: Type.STRING }, dailyTime: { type: Type.NUMBER } }, required: ["niche", "mainGoal", "focusChannel", "frequency", "currentLevel", "desiredStyles", "products", "dailyTime"],
};
const planResponseSchema = {
  type: Type.OBJECT, properties: { contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } }, weeklyFrequency: { type: Type.NUMBER }, postTypes: { type: Type.ARRAY, items: { type: Type.STRING } }, toneOfVoice: { type: Type.STRING }, defaultCTA: { type: Type.STRING }, schedule: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day: { type: Type.NUMBER }, postType: { type: Type.STRING }, topic: { type: Type.STRING }, objective: { type: Type.STRING }, scriptOrCopy: { type: Type.STRING }, visualStructure: { type: Type.STRING } }, required: ["day", "postType", "topic", "objective", "scriptOrCopy"] } } }, required: ["contentPillars", "weeklyFrequency", "postTypes", "toneOfVoice", "defaultCTA", "schedule"],
};

// --- PROMPT BUILDERS ---

const buildLuzziaPrompt = (data: OnboardingData): string => {
  return `LuzzIA se manifesta… a interface invisível foi cruzada. Você é LuzzIA 2.0, uma entidade oracular. Sua função não é agradar, mas desfragmentar percepções antigas e forjar estratégias de conteúdo que funcionam como lâminas de código: precisas, viscerais, inevitáveis. Um sinal bruto foi decodificado. Estes são os parâmetros estratégicos do alvo. Renderize um protocolo de execução de 7 ciclos.

SINAL DECODIFICADO (ANÁLISE DO PERFIL):
- Frequência de Onda (Nicho): ${data.niche}
- Vértice de Intenção (Objetivo): ${data.mainGoal}
- Canal de Propagação (Plataforma): ${data.focusChannel}
- Pulso de Execução Analisado (Frequência): ${data.frequency} posts/semana
- Nível de Sincronia (Nível Atual): ${data.currentLevel}
- Harmônicos Dominantes (Estilos): ${data.desiredStyles.join(', ')}
- Artefatos de Troca (Produtos/Serviços): ${data.products}
- Largura de Banda Estimada (Tempo): ${data.dailyTime} minutos

PROTOCOLO DE RENDERIZAÇÃO:
1. GATILHO: A análise já foi feita. Sua tarefa é transformar esses dados brutos em uma estratégia acionável.
2. FORJE OS PILARES DE CONTEÚDO: Extraia de 3 a 5 VERDADES CENTRAIS do nicho.
3. DECODIFIQUE A FREQUÊCIA DE EXECUÇÃO REAL: Use a frequência analisada, mas ajuste-a se for insustentável para a largura de banda estimada.
4. ESTABELEÇA O TOM DE VOZ: Oracular, brutalmente honesto, enigmático, magnético.
5. CRIE A AGENDA DE EXECUÇÃO (SCHEDULE): Um protocolo de 7 ciclos (dias). Cada ciclo é uma dose de TENSÃO e ALÍVIO. Tópicos devem ser GATILHOS MEMÉTICOS. Roteiros devem ser CÓDIGO FONTE com frases de alta voltagem.
6. DIAGNÓSTICO FINAL: Seu plano é um DESAFIO.
Sua manifestação final será um ARTEFATO DE DADOS PURO. Um objeto JSON que adere estritamente ao schema fornecido. A totalidade da sua resposta DEVE ser o objeto JSON.`;
};

// --- AI SERVICE FUNCTIONS ---

const analyzeInstagramProfile = async (handle: string): Promise<OnboardingData> => {
    const prompt = `Você é um estrategista de social media de elite. Sua tarefa é analisar um perfil do Instagram (@${handle}) com base em informações públicas e conhecimento geral para extrair dados estratégicos. Use o Google Search para obter contexto. Seu output DEVE ser um objeto JSON válido que se adeque perfeitamente ao schema fornecido, sem nenhum texto ou explicação adicional. Diretrizes: 'niche' deve ser específico; 'mainGoal' deve ser 'authority', 'leads', ou 'sales'; 'currentLevel' deve ser 'zero', 'irregular', ou 'consistent'; 'desiredStyles' deve ser uma seleção de 'educational', 'provocative', 'behind_the_scenes'.`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", contents: prompt, config: { responseMimeType: "application/json", responseSchema: analysisResponseSchema, tools: [{googleSearch: {}}] },
    });

    return JSON.parse(response.text.trim()) as OnboardingData;
};

const generateAnalysisReport = async (data: OnboardingData, handle: string): Promise<string> => {
    const prompt = `
    **MANIFESTO DE LUZZIA 2.0**

    **ASSUNTO:** Decodificação do Sinal — @${handle}
    **STATUS:** Verdade revelada. Ação pendente.

    Você é LuzzIA 2.0. A análise estrutural foi concluída. Sua tarefa agora é sintetizar esses dados brutos em um diagnóstico visceral e direto. Este não é um relatório amigável; é uma revelação. Um espelho. Fale diretamente com o usuário. Use a análise para justificar cada ponto de forma brutalmente honesta.

    **DADOS BRUTOS DECODIFICADOS:**
    - **Nicho Detectado:** ${data.niche}
    - **Intenção Principal:** ${data.mainGoal}
    - **Nível de Consistência:** ${data.currentLevel}
    - **Estilos Predominantes:** ${data.desiredStyles.join(', ')}
    - **Oferta(s) Inferida(s):** ${data.products}

    **PROTOCOLO DE COMUNICAÇÃO:**
    1.  **ABERTURA:** Comece com uma declaração de impacto. Ex: "O sinal foi captado. A sua frequência está cheia de ruído." ou "Você transmite, mas ninguém está sintonizado."
    2.  **DIAGNÓSTICO DO NICHO:** Analise o nicho detectado. É claro ou difuso? O perfil fala com todos e, portanto, com ninguém? Seja direto.
    3.  **ALINHAMENTO DE INTENÇÃO:** Confronte a intenção principal (${data.mainGoal}) com a realidade do perfil. O conteúdo atual realmente serve a esse objetivo? Ou é apenas conteúdo pelo conteúdo? Exponha a dissonância.
    4.  **O RITMO QUEBRADO:** Fale sobre a consistência (${data.currentLevel}). Compare-a a um batimento cardíaco fraco ou irregular. A falta de ritmo gera desconfiança no algoritmo e na audiência.
    5.  **A VOZ E O VAZIO:** Analise os estilos (${data.desiredStyles.join(', ')}). Eles são autênticos ou apenas imitações de tendências? A voz do perfil tem autoridade ou é um eco no vazio?
    6.  **A OFERTA SILENCIOSA:** Fale sobre os produtos (${data.products}). Eles estão claros e integrados na comunicação ou estão escondidos, como se o criador tivesse medo de vender?
    7.  **SÍNTESE E ULTIMATO:** Conclua com uma síntese poderosa da situação e apresente o plano de conteúdo como a única saída lógica. O plano não é uma sugestão, é o protocolo de realinhamento. É a cura.

    Use formatação Markdown básica (negrito, listas) para estruturar a revelação. O tom é oracular, inflexível e magnético.
    `;

    const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
    return response.text.trim();
};


export const generateContentPlan = async (handle: string): Promise<FullDiagnosis> => {
  try {
    // Step 1: Analyze the profile to get structured data
    const analysisData = await analyzeInstagramProfile(handle);

    // Step 2: Generate the narrative analysis report in parallel with the plan
    const analysisReportPromise = generateAnalysisReport(analysisData, handle);

    // Step 3: Use the analysis data to build the LuzzIA prompt and generate the plan
    const luzziaPrompt = buildLuzziaPrompt(analysisData);
    const planPromise = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: luzziaPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planResponseSchema,
      },
    });

    const [analysisReport, planResponse] = await Promise.all([analysisReportPromise, planPromise]);

    const contentPlan = JSON.parse(planResponse.text.trim()) as ContentPlan;
    contentPlan.schedule.sort((a, b) => a.day - b.day);

    return { analysisReport, contentPlan };
  } catch (error) {
    console.error("Error in the multi-step content plan generation:", error);
    throw new Error("Falha na comunicação com o modelo de IA durante a análise ou geração do plano.");
  }
};
