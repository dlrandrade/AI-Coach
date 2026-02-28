import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use((req, res, next) => {
  // Route-level body limits
  if (req.path === '/api/analyze') return express.json({ limit: '256kb' })(req, res, next);
  if (req.path === '/api/grant-credits') return express.json({ limit: '64kb' })(req, res, next);
  return express.json({ limit: '128kb' })(req, res, next);
});
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  return next();
});

const DEBUG = process.env.DEBUG === 'true';
const QUOTA_ENABLED = process.env.QUOTA_ENABLED !== 'false';
const API_KEY = process.env.API_KEY || '';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
const CORS_ORIGINS = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const matchesCorsRule = (origin, rule) => {
  if (rule === '*') return true;
  if (rule.startsWith('*.')) {
    const suffix = rule.slice(1); // ".example.com"
    return origin.endsWith(suffix);
  }
  return origin === rule;
};

const isSameHostOrigin = (origin, req) => {
  try {
    const u = new URL(origin);
    const host = req.headers.host;
    return !!host && u.host === host;
  } catch {
    return false;
  }
};

const isAllowedOrigin = (origin, req) => {
  if (!origin) return true;
  if (isSameHostOrigin(origin, req)) return true;
  if (CORS_ORIGINS.length === 0) return false;
  return CORS_ORIGINS.some((rule) => matchesCorsRule(origin, rule));
};

app.use((req, res, next) => {
  req.setTimeout(REQUEST_TIMEOUT_MS);
  res.setTimeout(REQUEST_TIMEOUT_MS);
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      return res.status(504).json({ error: 'REQUEST_TIMEOUT', message: 'Tempo limite excedido' });
    }
  }, REQUEST_TIMEOUT_MS + 10);

  res.on('finish', () => clearTimeout(timeoutId));
  res.on('close', () => clearTimeout(timeoutId));
  next();
});

const redact = (value) => {
  const s = String(value ?? '');
  if (!s) return s;
  return s
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [REDACTED]')
    .replace(/(x-api-key["':\s]*)([A-Za-z0-9._-]+)/gi, '$1[REDACTED]')
    .replace(/(openrouter_api_key["':\s]*)([A-Za-z0-9._-]+)/gi, '$1[REDACTED]')
    .replace(/(rapidapi_key["':\s]*)([A-Za-z0-9._-]+)/gi, '$1[REDACTED]');
};

const safeLog = (tag, payload = {}) => {
  const clean = JSON.parse(JSON.stringify(payload, (_k, v) => (typeof v === 'string' ? redact(v) : v)));
  console.log(tag, clean);
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && !isAllowedOrigin(origin, req)) {
    return res.status(403).json({ error: 'CORS blocked' });
  }
  if (origin && isAllowedOrigin(origin, req)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY, X-CLIENT-ID');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  return next();
});

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_MODELS = [
  'openai/gpt-oss-120b:free',
  'arcee-ai/trinity-large-preview:free',
  'tngtech/deepseek-r1t2-chimera:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'stepfun/step-3.5-flash:free'
];
const OPENROUTER_MODELS = (process.env.OPENROUTER_MODELS || DEFAULT_MODELS.join(','))
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_HTTP_REFERER = process.env.OPENROUTER_HTTP_REFERER || 'http://localhost';
const OPENROUTER_APP_TITLE = process.env.OPENROUTER_APP_TITLE || 'LuzzIA Engine v2.1';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'instagram-scraper-v21.p.rapidapi.com';
const OUTPUT_TONE = process.env.OUTPUT_TONE || 'professional'; // professional | aggressive
const SCRAPE_CACHE_TTL_MS = Number(process.env.SCRAPE_CACHE_TTL_MS || 300000);
const CACHE_CLEANUP_INTERVAL_MS = Number(process.env.CACHE_CLEANUP_INTERVAL_MS || 60000);
const SLO_MAX_ERROR_RATE = Number(process.env.SLO_MAX_ERROR_RATE || 0.08);
const SLO_MAX_AVG_LATENCY_MS = Number(process.env.SLO_MAX_AVG_LATENCY_MS || 12000);

const PORT = process.env.PORT || 8787;
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 25000);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const rateBuckets = new Map();
const usageBuckets = new Map();
const scrapeCache = new Map();
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || '';
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
const USE_UPSTASH = Boolean(UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN);
let modelCursor = 0;

const PACKAGE_OPTIONS = [3, 10, 30];
const metrics = {
  analyzeRequests: 0,
  analyzeSuccess: 0,
  analyzeFail: 0,
  quotaBlocked: 0,
  scrapeCacheHits: 0,
  modelOutcome: {},
  latencyTotalMs: 0,
  latencyAvgMs: 0
};

const incModelOutcome = (model, key) => {
  if (!metrics.modelOutcome[model]) {
    metrics.modelOutcome[model] = { success: 0, fail: 0 };
  }
  metrics.modelOutcome[model][key] += 1;
};


const metricsDayKey = () => {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const persistDailyMetrics = async () => {
  if (!USE_UPSTASH) return;
  const key = `metrics:${metricsDayKey()}`;
  try {
    await redisExec(['SET', key, JSON.stringify(metrics), 'EX', String(60 * 60 * 24 * 14)]);
  } catch {
    // best effort
  }
};

const readDailyMetrics = async () => {
  if (!USE_UPSTASH) return metrics;
  const key = `metrics:${metricsDayKey()}`;
  try {
    const raw = await redisExec(['GET', key]);
    if (!raw) return metrics;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : metrics;
  } catch {
    return metrics;
  }
};

const redisExec = async (command) => {
  if (!USE_UPSTASH) return null;
  const response = await fetch(UPSTASH_REDIS_REST_URL.replace(/\/$/, '') + '/pipeline', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([command])
  });
  if (!response.ok) throw new Error(`Upstash error ${response.status}`);
  const payload = await response.json();
  return payload?.[0]?.result ?? null;
};

const getClientKey = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
};

const getClientId = (req) => {
  const provided = String(req.headers['x-client-id'] || '').trim();
  if (provided && /^[a-zA-Z0-9._-]{6,80}$/.test(provided)) {
    return provided;
  }
  return `ip:${getClientKey(req)}`;
};

const defaultUsageState = () => ({ freeUsed: false, credits: 0, totalUsed: 0 });

const buildUsagePayload = (state) => ({
  freeUsed: state.freeUsed,
  creditsRemaining: state.credits,
  totalUsed: state.totalUsed,
  packages: PACKAGE_OPTIONS
});

const getUsageState = async (clientId) => {
  if (!USE_UPSTASH) {
    const existing = usageBuckets.get(clientId);
    if (existing) return existing;
    const state = defaultUsageState();
    usageBuckets.set(clientId, state);
    return state;
  }

  const raw = await redisExec(['GET', `usage:${clientId}`]);
  if (!raw) return defaultUsageState();
  try {
    const parsed = JSON.parse(raw);
    return {
      freeUsed: Boolean(parsed.freeUsed),
      credits: Number(parsed.credits || 0),
      totalUsed: Number(parsed.totalUsed || 0)
    };
  } catch {
    return defaultUsageState();
  }
};

const setUsageState = async (clientId, state) => {
  if (!USE_UPSTASH) {
    usageBuckets.set(clientId, state);
    return;
  }
  await redisExec(['SET', `usage:${clientId}`, JSON.stringify(state)]);
};

const checkDiagnosisQuota = async (clientId) => {
  const state = await getUsageState(clientId);
  if (!state.freeUsed) {
    return { ok: true, usage: buildUsagePayload(state), source: 'free' };
  }
  if (state.credits > 0) {
    return { ok: true, usage: buildUsagePayload(state), source: 'credit' };
  }
  return { ok: false, usage: buildUsagePayload(state), source: 'blocked' };
};

const grantCredits = async (clientId, amount) => {
  const state = await getUsageState(clientId);
  state.credits += amount;
  await setUsageState(clientId, state);
  return buildUsagePayload(state);
};

const consumeAfterSuccess = async (clientId, source) => {
  const state = await getUsageState(clientId);
  if (source === 'free' && !state.freeUsed) {
    state.freeUsed = true;
  } else if (source === 'credit' && state.credits > 0) {
    state.credits -= 1;
  }
  state.totalUsed += 1;
  await setUsageState(clientId, state);
  return buildUsagePayload(state);
};

const rateLimit = async (req, res, next) => {
  try {
    const key = getClientKey(req);
    const now = Date.now();
    let entry;

    if (USE_UPSTASH) {
      const raw = await redisExec(['GET', `rate:${key}`]);
      if (raw) {
        try {
          entry = JSON.parse(raw);
        } catch {
          entry = null;
        }
      }
      if (!entry || now > entry.resetAt) {
        entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
      }
      entry.count += 1;
      await redisExec(['SET', `rate:${key}`, JSON.stringify(entry), 'PX', String(Math.max(1000, entry.resetAt - now))]);
    } else {
      entry = rateBuckets.get(key) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
      if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
      }
      entry.count += 1;
      rateBuckets.set(key, entry);
    }

    res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, RATE_LIMIT_MAX - entry.count)));
    res.setHeader('X-RateLimit-Reset', String(entry.resetAt));

    if (entry.count > RATE_LIMIT_MAX) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    return next();
  } catch (error) {
    safeLog('[rate-limit:error]', { details: error instanceof Error ? error.message : String(error) });
    return next();
  }
};

const requireApiKey = (req, res, next) => {
  if (!API_KEY) return next();
  const provided = req.headers['x-api-key'];
  if (!provided || provided !== API_KEY) {
    return res.status(401).json({ error: 'Chave inválida' });
  }
  return next();
};

const requireAdminApiKey = (req, res, next) => {
  if (!ADMIN_API_KEY) {
    // Avoid exposing internal misconfiguration as 500 in public surface
    return res.status(403).json({ error: 'Admin endpoint desabilitado' });
  }
  const provided = req.headers['x-api-key'];
  if (!provided || provided !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Chave admin inválida' });
  }
  return next();
};

const fetchWithTimeout = async (url, options, timeoutMs = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJsonWithRetry = async (url, options, attempts = 3, timeoutMs = 12000) => {
  let lastError = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);
      if (response.ok) {
        return await response.json();
      }
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return await response.json();
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (err) {
      lastError = err;
    }
    if (i < attempts - 1) {
      await sleep(350 * (i + 1));
    }
  }
  throw lastError || new Error('request_failed');
};

const normalizeHandle = (value) => String(value || '').replace('@', '').trim().toLowerCase();

const validateAnalyzeInput = (body) => {
  const handle = normalizeHandle(body?.handle);
  const planDays = Number(body?.planDays) === 30 ? 30 : 7;
  const objective = Number(body?.objective);
  const objectiveSafe = Number.isInteger(objective) && objective >= 1 && objective <= 7 ? objective : 1;
  const isValidHandle = /^[a-z0-9._]{1,30}$/.test(handle);
  if (!handle || !isValidHandle) {
    return { ok: false, error: 'handle inválido' };
  }
  return { ok: true, handle, planDays, objective: objectiveSafe };
};

const OBJECTIVE_LABELS = {
  1: 'AUTORIDADE',
  2: 'POSICIONAMENTO',
  3: 'QUALIFICAÇÃO',
  4: 'CREDIBILIDADE',
  5: 'PRÉ-VENDA',
  6: 'STATUS',
  7: 'RESET'
};

const OBJECTIVE_QUESTIONS = {
  1: 'Isso aumenta domínio ideológico e referência mental em até 30 dias?',
  2: 'Isso torna o perfil impossível de confundir ou comparar?',
  3: 'Isso afasta curiosos e aproxima decisores reais?',
  4: 'Isso aumenta confiança sem prometer resultado?',
  5: 'Isso educa desejo e prepara transação futura?',
  6: 'Isso eleva respeito percebido e reduz acesso irrelevante?',
  7: 'Isso quebra o padrão atual de forma visível e irreversível?'
};

const SYSTEM_PROMPT = (planDays = 7, objective = 1) => `
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

==================================================
REGRAS FINAIS
==================================================

- Gere EXATAMENTE ${planDays} dias
- TODAS as ações servem a ${OBJECTIVE_LABELS[objective]}
- Mínimo obrigatório: 1 queima_ponte, 1 excludente, 1 tensao_maxima, 1 movimento_dinheiro
- Se não conseguir ler o perfil, diga claramente no campo leitura_perfil
- Retorne APENAS JSON válido
`;

const getCachedScrape = async (username) => {
  if (USE_UPSTASH) {
    try {
      const raw = await redisExec(['GET', `scrape:${username}`]);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      metrics.scrapeCacheHits += 1;
      return parsed;
    } catch {
      return null;
    }
  }

  const item = scrapeCache.get(username);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    scrapeCache.delete(username);
    return null;
  }
  metrics.scrapeCacheHits += 1;
  return item.data;
};

const setCachedScrape = async (username, data) => {
  if (USE_UPSTASH) {
    await redisExec(['SET', `scrape:${username}`, JSON.stringify(data), 'PX', String(SCRAPE_CACHE_TTL_MS)]);
    return;
  }
  scrapeCache.set(username, { data, expiresAt: Date.now() + SCRAPE_CACHE_TTL_MS });
};

const cleanupExpiredScrapeCache = () => {
  if (USE_UPSTASH) return;
  const now = Date.now();
  for (const [k, v] of scrapeCache.entries()) {
    if (!v || now > v.expiresAt) scrapeCache.delete(k);
  }
};

const scrapeInstagramProfile = async (username) => {
  const cleanUsername = String(username || '').replace('@', '').trim().toLowerCase();
  const cached = await getCachedScrape(cleanUsername);
  if (cached) return { ...cached, cached: true };

  if (!RAPIDAPI_KEY) {
    return { error: 'RAPIDAPI_KEY não configurada', username: cleanUsername };
  }

  try {
    const userInfoData = await fetchJsonWithRetry(
      `https://${RAPIDAPI_HOST}/api/user-information`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST
        },
        body: JSON.stringify({ username: cleanUsername })
      },
      3,
      12000
    );

    if (userInfoData.status === 'fail' || userInfoData.message) {
      return {
        username: cleanUsername,
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
        error: `API Error: ${userInfoData.message || 'Unknown error'}`
      };
    }

    const user = userInfoData?.data?.user || userInfoData?.user || userInfoData?.data || userInfoData;

    if (!user || (!user.username && !user.full_name)) {
      return {
        username: cleanUsername,
        fullName: null,
        biography: null,
        externalUrl: null,
        followersCount: null,
        followingCount: null,
        postsCount: null,
        isVerified: false,
        isPrivate: true,
        profilePicUrl: null,
        highlightNames: [],
        recentPosts: [],
        scrapedAt: new Date().toISOString(),
        error: 'Perfil não encontrado ou resposta inválida'
      };
    }

    let recentPosts = [];
    try {
      const postsEdges = user.edge_owner_to_timeline_media?.edges || [];
      recentPosts = postsEdges.slice(0, 9).map((edge) => {
        const post = edge.node || edge;
        const caption =
          post.edge_media_to_caption?.edges?.[0]?.node?.text ||
          post.caption?.text ||
          post.caption ||
          '';
        return {
          caption: caption.slice(0, 300),
          likesCount: post.edge_liked_by?.count || post.like_count || 0,
          commentsCount: post.edge_media_to_comment?.count || post.comment_count || 0,
          isVideo: post.__typename === 'GraphVideo' || post.is_video || post.media_type === 2
        };
      });
    } catch {
      // ignore
    }

    let highlightNames = [];
    const userId = user.id || user.pk || user.user_id;
    if (userId) {
      try {
        const highlightsData = await fetchJsonWithRetry(
          `https://${RAPIDAPI_HOST}/api/get-user-highlights`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-rapidapi-key': RAPIDAPI_KEY,
              'x-rapidapi-host': RAPIDAPI_HOST
            },
            body: JSON.stringify({ user_id: String(userId) })
          },
          2,
          12000
        );

        const highlights =
          highlightsData?.data?.items ||
          highlightsData?.items ||
          highlightsData?.data?.tray?.edges?.map((e) => e.node) ||
          [];
        highlightNames = highlights.slice(0, 10).map((h) => h.title || h.name || 'Destaque');
      } catch {
        // ignore
      }
    }

    const result = {
      username: user.username || cleanUsername,
      fullName: user.full_name || null,
      biography: user.biography || user.bio || null,
      externalUrl: user.external_url || user.bio_links?.[0]?.url || null,
      followersCount: user.follower_count || user.edge_followed_by?.count || null,
      followingCount: user.following_count || user.edge_follow?.count || null,
      postsCount: user.media_count || user.edge_owner_to_timeline_media?.count || null,
      isVerified: user.is_verified || false,
      isPrivate: user.is_private || false,
      profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || null,
      highlightNames,
      recentPosts,
      scrapedAt: new Date().toISOString(),
      error: null,
      cached: false
    };
    await setCachedScrape(cleanUsername, result);
    return result;
  } catch (error) {
    return {
      username: cleanUsername,
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
      error: `Erro ao acessar perfil: ${error instanceof Error ? error.message : 'Desconhecido'}`
    };
  }
};

const formatProfileForAI = (profile) => {
  if (profile.error && !profile.biography) {
    return `[ERRO DE LEITURA] ${profile.error}`;
  }

  const parts = [];
  parts.push(`=== DADOS LIDOS DO PERFIL @${profile.username} ===`);
  parts.push(`Leitura realizada em: ${profile.scrapedAt}`);
  parts.push('');

  if (profile.fullName) parts.push(`NOME: ${profile.fullName}`);
  if (profile.isVerified) parts.push('STATUS: ✓ Verificado');
  if (profile.isPrivate) parts.push('VISIBILIDADE: Privado (dados limitados)');

  parts.push('');
  parts.push('--- BIO ---');
  parts.push(profile.biography || '[VAZIA]');

  if (profile.externalUrl) {
    parts.push('');
    parts.push('--- LINK NA BIO ---');
    parts.push(profile.externalUrl);
  }

  parts.push('');
  parts.push('--- MÉTRICAS ---');
  parts.push(`Seguidores: ${profile.followersCount?.toLocaleString?.() || 'N/A'}`);
  parts.push(`Seguindo: ${profile.followingCount?.toLocaleString?.() || 'N/A'}`);
  parts.push(`Posts: ${profile.postsCount?.toLocaleString?.() || 'N/A'}`);

  if (profile.highlightNames?.length > 0) {
    parts.push('');
    parts.push('--- DESTAQUES ---');
    profile.highlightNames.forEach((h) => parts.push(`• ${h}`));
  }

  if (profile.recentPosts?.length > 0) {
    parts.push('');
    parts.push(`--- ÚLTIMOS ${profile.recentPosts.length} POSTS ---`);
    profile.recentPosts.forEach((post, i) => {
      const type = post.isVideo ? '[VÍDEO]' : '[IMAGEM]';
      parts.push(`${i + 1}. ${type} ${post.likesCount} likes, ${post.commentsCount} comentários`);
      parts.push(`   "${post.caption || '[SEM LEGENDA]'}"`);
    });
  }

  if (profile.error) {
    parts.push('');
    parts.push(`[AVISO] ${profile.error}`);
  }

  return parts.join('\n');
};

const isValidStatus = (value) => ['alavanca', 'neutro', 'sabotador'].includes(value);

const isValidResultShape = (obj, planDays) => {
  try {
    if (!obj || typeof obj !== 'object') return false;
    if (!obj.leitura_perfil || !obj.diagnosis || !Array.isArray(obj.plan)) return false;
    if (obj.plan.length !== planDays) return false;

    const d = obj.diagnosis;
    if (!['commodity', 'aspirante', 'autoridade', 'dominador'].includes(d.posicionamento)) return false;
    if (!d.dissecacao) return false;

    const required = ['bio', 'feed', 'stories', 'provas', 'ofertas', 'linguagem'];
    for (const key of required) {
      const item = d.dissecacao[key];
      if (!item || !isValidStatus(item.status) || typeof item.veredicto !== 'string') return false;
    }

    for (const day of obj.plan) {
      if (typeof day.day !== 'number' || typeof day.acao !== 'string' || typeof day.prompt !== 'string') return false;
    }
    return true;
  } catch {
    return false;
  }
};


const normalizeAnalysisResult = (obj, planDays, objective) => {
  const out = obj && typeof obj === 'object' ? JSON.parse(JSON.stringify(obj)) : {};
  out.leitura_perfil = out.leitura_perfil || {
    bio_completa: 'não disponível', posts_analisados: [], destaques_encontrados: [], stories_recentes: 'não disponível',
    metricas_visiveis: { seguidores: null, seguindo: null, posts_total: null }, impressao_geral: 'não disponível'
  };
  out.diagnosis = out.diagnosis || {};
  out.diagnosis.objetivo_ativo = out.diagnosis.objetivo_ativo || OBJECTIVE_LABELS[objective];
  out.diagnosis.pecado_capital = out.diagnosis.pecado_capital || 'Falta clareza estrutural no posicionamento.';
  out.diagnosis.conflito_oculto = out.diagnosis.conflito_oculto || 'O discurso não se converte em prova concreta.';
  out.diagnosis.posicionamento = ['commodity','aspirante','autoridade','dominador'].includes(out.diagnosis.posicionamento)
    ? out.diagnosis.posicionamento : 'aspirante';
  out.diagnosis.acao_alavancagem = out.diagnosis.acao_alavancagem || 'Publicar prova concreta de resultado com contexto e métrica.';
  out.diagnosis.sentenca = out.diagnosis.sentenca || 'Falta prova clara para sustentar autoridade.';
  out.diagnosis.modo_falha = out.diagnosis.modo_falha || 'sem_provas';
  const d = out.diagnosis.dissecacao || {};
  const mk = (v={}) => ({ status: isValidStatus(v.status) ? v.status : 'neutro', veredicto: typeof v.veredicto==='string' ? v.veredicto : 'Ajustar clareza e evidências.'});
  out.diagnosis.dissecacao = {
    bio: mk(d.bio), feed: mk(d.feed), stories: mk(d.stories), provas: mk(d.provas), ofertas: mk(d.ofertas), linguagem: mk(d.linguagem)
  };

  const plan = Array.isArray(out.plan) ? out.plan : [];
  const cleanPlan = plan
    .filter((x) => x && typeof x === 'object')
    .map((x, i) => ({
      day: Number.isFinite(Number(x.day)) ? Number(x.day) : i + 1,
      objetivo_psicologico: typeof x.objetivo_psicologico === 'string' ? x.objetivo_psicologico : `Fortalecer ${OBJECTIVE_LABELS[objective]}`,
      acao: typeof x.acao === 'string' ? x.acao : 'Publicar conteúdo com prova concreta',
      formato: typeof x.formato === 'string' ? x.formato : 'post',
      ferramenta: typeof x.ferramenta === 'string' ? x.ferramenta : 'feed',
      tipo: ['queima_ponte','excludente','tensao_maxima','movimento_dinheiro','padrao'].includes(x.tipo) ? x.tipo : 'padrao',
      prompt: typeof x.prompt === 'string' ? x.prompt : 'Crie um post com prova real de resultado e CTA objetivo.'
    }));

  const fallbackTemplates = [
    { acao: 'Publicar case antes/depois com métrica', formato: 'carrossel', ferramenta: 'feed', tipo: 'tensao_maxima', prompt: 'Crie um carrossel com: contexto inicial, ação aplicada, resultado mensurável e CTA para diagnóstico.' },
    { acao: 'Story com objeção e resposta objetiva', formato: 'story', ferramenta: 'stories', tipo: 'excludente', prompt: 'Escreva 5 stories: objeção comum, quebra de objeção, prova curta, filtro de público e CTA por palavra-chave.' },
    { acao: 'Reel de bastidor de execução', formato: 'reel', ferramenta: 'reels', tipo: 'padrao', prompt: 'Crie roteiro de reel (30-45s) mostrando processo real, diferencial técnico e chamada para ação específica.' },
    { acao: 'Ajustar bio para promessa + prova', formato: 'bio', ferramenta: 'bio', tipo: 'queima_ponte', prompt: 'Reescreva bio em 3 linhas: promessa objetiva, para quem é/não é e prova concreta.' },
    { acao: 'Post de oferta com critério de entrada', formato: 'post', ferramenta: 'feed', tipo: 'movimento_dinheiro', prompt: 'Crie post de oferta com público-alvo explícito, benefício principal, critérios e CTA com prazo real.' },
    { acao: 'Publicar prova social estruturada', formato: 'story', ferramenta: 'stories', tipo: 'padrao', prompt: 'Monte sequência com depoimento: situação inicial, intervenção, resultado e convite para próximo passo.' },
    { acao: 'Checklist de ação semanal', formato: 'carrossel', ferramenta: 'feed', tipo: 'padrao', prompt: 'Crie checklist em 7 passos para executar o objetivo, cada passo com verbo de ação e mini-resultado esperado.' }
  ];

  while (cleanPlan.length < planDays) {
    const n = cleanPlan.length + 1;
    const t = fallbackTemplates[(n - 1) % fallbackTemplates.length];
    cleanPlan.push({
      day: n,
      objetivo_psicologico: `Fortalecer ${OBJECTIVE_LABELS[objective]} com ação prática e evidência.`,
      acao: t.acao,
      formato: t.formato,
      ferramenta: t.ferramenta,
      tipo: t.tipo,
      prompt: t.prompt
    });
  }
  out.plan = cleanPlan.slice(0, planDays).map((x, i) => ({ ...x, day: i + 1 }));
  return out;
};
const parseModelJson = (content) => {
  const cleaned = String(content || '').replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error('invalid_json');
  }
};

const sanitizeText = (value) => {
  const s = String(value || '');
  return s
    .replace(/\b(bloquear publicamente|listar.*nomes|sob pena de banimento)\b/gi, 'aplicar critério claro')
    .replace(/\bzero piedade\b/gi, 'rigor estratégico')
    .replace(/\bsem piedade\b/gi, 'com objetividade')
    .replace(/\bproiba\b/gi, 'evite');
};

const sanitizeAnalysisResult = (obj) => {
  if (OUTPUT_TONE === 'aggressive') return obj;
  if (!obj || typeof obj !== 'object') return obj;
  const safe = JSON.parse(JSON.stringify(obj));
  if (safe?.diagnosis?.sentenca) safe.diagnosis.sentenca = sanitizeText(safe.diagnosis.sentenca);
  if (Array.isArray(safe?.plan)) {
    safe.plan = safe.plan.map((d) => ({
      ...d,
      acao: sanitizeText(d.acao),
      prompt: sanitizeText(d.prompt),
      objetivo_psicologico: sanitizeText(d.objetivo_psicologico)
    }));
  }
  return safe;
};


const buildDissecacaoSummary = (d = {}) => {
  const keys = ['bio', 'feed', 'stories', 'provas', 'ofertas', 'linguagem'];
  return keys.map((k) => `${k}:${d?.[k]?.status || 'neutro'}`).join(' | ');
};

const enrichPlanPromptsWithContext = (result, meta) => {
  if (!result || !Array.isArray(result.plan)) return result;
  const d = result.diagnosis || {};
  const summary = buildDissecacaoSummary(d.dissecacao || {});
  const totalDays = result.plan.length || meta.planDays || 7;

  result.plan = result.plan.map((day, idx) => {
    const header = [
      'CONTEXTO FIXO DO DIAGNÓSTICO (NÃO IGNORAR):',
      `- Perfil: @${meta.handle}`,
      `- Objetivo ativo: ${d.objetivo_ativo || meta.objectiveLabel}`,
      `- Posicionamento atual: ${d.posicionamento || 'aspirante'}`,
      `- Pecado capital: ${d.pecado_capital || 'não informado'}`,
      `- Conflito oculto: ${d.conflito_oculto || 'não informado'}`,
      `- Ação de maior alavancagem: ${d.acao_alavancagem || 'não informado'}`,
      `- Dissecacao resumida: ${summary}`,
      `- Dia do plano: ${idx + 1}/${totalDays}`,
      `- Objetivo psicológico do dia: ${day.objetivo_psicologico || 'não informado'}`,
      '',
      'TAREFA:',
      String(day.prompt || '')
    ].join('\n');

    return {
      ...day,
      prompt: header
    };
  });

  return result;
};

const analyzeProfile = async (handle, planDays = 7, objective = 1, profileData) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY não configurada');
  }
  if (OPENROUTER_MODELS.length === 0) {
    throw new Error('OPENROUTER_MODELS vazio');
  }

  const profileContext = profileData
    ? `\n\n=== DADOS DO PERFIL (LIDOS EM TEMPO REAL) ===\n${profileData}\n=== FIM DOS DADOS ===\n`
    : '\n[AVISO: Dados do perfil não disponíveis.]\n';
  const orderedModels = OPENROUTER_MODELS.map((_, i) => OPENROUTER_MODELS[(modelCursor + i) % OPENROUTER_MODELS.length]);
  const errors = [];

  for (const model of orderedModels) {
    try {
      const response = await fetchWithTimeout(OPENROUTER_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': OPENROUTER_HTTP_REFERER,
          'X-Title': OPENROUTER_APP_TITLE
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT(planDays, objective) },
            {
              role: 'user',
              content: `EXECUTAR ANÁLISE COMPLETA.\n\nALVO: @${handle}\nOBJETIVO PRIMÁRIO: ${OBJECTIVE_LABELS[objective]}\nPLANO: ${planDays} dias\n${profileContext}\nINSTRUÇÕES:\n1. Use os DADOS DO PERFIL acima para preencher leitura_perfil\n2. Diagnostique com base no objetivo ${OBJECTIVE_LABELS[objective]}\n3. Gere plano de ${planDays} dias com prompts viscerais\n\nZERO piedade. ZERO suavização.`
            }
          ],
          temperature: 0.6,
          max_tokens: 7000
        })
      }, 20000);

      if (!response.ok) {
        errors.push(`${model}: HTTP ${response.status}`);
        incModelOutcome(model, 'fail');
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      let parsed;
      try {
        parsed = parseModelJson(content);
      } catch {
        errors.push(`${model}: invalid_json`);
        incModelOutcome(model, 'fail');
        continue;
      }

      const normalized = normalizeAnalysisResult(parsed, planDays, objective);
      if (!isValidResultShape(normalized, planDays)) {
        errors.push(`${model}: invalid_schema`);
        incModelOutcome(model, 'fail');
        continue;
      }

      const sanitized = sanitizeAnalysisResult(normalized);
      incModelOutcome(model, 'success');
      modelCursor = (OPENROUTER_MODELS.indexOf(model) + 1) % OPENROUTER_MODELS.length;
      return { parsed: sanitized, modelUsed: model };
    } catch (error) {
      errors.push(`${model}: ${error instanceof Error ? error.message : 'erro'}`);
      incModelOutcome(model, 'fail');
    }
  }

  const fallback = normalizeAnalysisResult({}, planDays, objective);
  return { parsed: sanitizeAnalysisResult(fallback), modelUsed: 'fallback/local-normalizer' };
};

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    models: OPENROUTER_MODELS,
    quotaEnabled: QUOTA_ENABLED,
    storage: USE_UPSTASH ? 'upstash' : 'memory',
    outputTone: OUTPUT_TONE,
    scrapeCacheTtlMs: SCRAPE_CACHE_TTL_MS,
    scrapeCacheStorage: USE_UPSTASH ? 'upstash' : 'memory',
    release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.RELEASE_SHA || 'local'
  });
});

app.get('/api/usage', rateLimit, requireApiKey, async (req, res) => {
  const clientId = getClientId(req);
  const usage = buildUsagePayload(await getUsageState(clientId));
  return res.json({ clientId, usage });
});

app.get('/api/metrics', requireAdminApiKey, async (req, res) => {
  const currentMetrics = await readDailyMetrics();
  return res.json({
    metrics: currentMetrics,
    storage: USE_UPSTASH ? 'upstash' : 'memory',
    uptimeSec: Math.round(process.uptime()),
    release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.RELEASE_SHA || 'local'
  });
});


app.get('/api/slo', requireAdminApiKey, async (req, res) => {
  const currentMetrics = await readDailyMetrics();
  const total = Number(currentMetrics.analyzeSuccess || 0) + Number(currentMetrics.analyzeFail || 0);
  const errorRate = total ? Number(currentMetrics.analyzeFail || 0) / total : 0;
  const avgLatency = Number(currentMetrics.latencyAvgMs || 0);
  const ok = errorRate <= SLO_MAX_ERROR_RATE && avgLatency <= SLO_MAX_AVG_LATENCY_MS;
  return res.json({
    ok,
    thresholds: {
      maxErrorRate: SLO_MAX_ERROR_RATE,
      maxAvgLatencyMs: SLO_MAX_AVG_LATENCY_MS
    },
    current: {
      errorRate,
      avgLatencyMs: avgLatency,
      samples: total
    },
    source: USE_UPSTASH ? 'upstash-daily' : 'memory' 
  });
});

app.post('/api/grant-credits', requireAdminApiKey, async (req, res) => {
  const clientId = String(req.body?.clientId || '').trim();
  const amount = Number(req.body?.amount);
  if (!clientId) {
    return res.status(400).json({ error: 'clientId obrigatório' });
  }
  if (!Number.isInteger(amount) || !PACKAGE_OPTIONS.includes(amount)) {
    return res.status(400).json({ error: 'amount inválido. Use 3, 10 ou 30' });
  }
  const usage = await grantCredits(clientId, amount);
  return res.json({ clientId, usage });
});

app.post('/api/analyze', rateLimit, requireApiKey, async (req, res) => {
  metrics.analyzeRequests += 1;
  const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  res.setHeader('X-Request-Id', requestId);
  const validation = validateAnalyzeInput(req.body);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error });
  }
  const { handle, planDays, objective } = validation;
  const clientId = getClientId(req);
  const startedAt = Date.now();
  const quota = await checkDiagnosisQuota(clientId);
  if (QUOTA_ENABLED && !quota.ok) {
    metrics.quotaBlocked += 1;
    await persistDailyMetrics();
    return res.status(402).json({
      error: 'QUOTA_EXCEEDED',
      message: 'Créditos esgotados. Escolha um pacote para continuar.',
      clientId,
      usage: quota.usage
    });
  }

  try {
    const rawScrapedData = await scrapeInstagramProfile(handle);
    const formattedProfile = formatProfileForAI(rawScrapedData);
    const { parsed, modelUsed } = await analyzeProfile(handle, planDays, objective, formattedProfile);
    const enriched = enrichPlanPromptsWithContext(parsed, {
      handle,
      planDays,
      objectiveLabel: OBJECTIVE_LABELS[objective]
    });
    const usage = QUOTA_ENABLED
      ? await consumeAfterSuccess(clientId, quota.source)
      : buildUsagePayload(await getUsageState(clientId));

    const elapsedMs = Date.now() - startedAt;
    metrics.analyzeSuccess += 1;
    await persistDailyMetrics();
    metrics.latencyTotalMs += elapsedMs;
    metrics.latencyAvgMs = Math.round(metrics.latencyTotalMs / Math.max(1, metrics.analyzeSuccess + metrics.analyzeFail));
    safeLog('[analyze:ok]', {
      requestId,
      clientId,
      handle,
      ms: elapsedMs,
      modelUsed,
      scrapeCached: Boolean(rawScrapedData?.cached)
    });

    return res.json({
      result: enriched,
      rawScrapedData: DEBUG ? rawScrapedData : null,
      clientId,
      usage,
      meta: { modelUsed, requestId, scrapeCached: Boolean(rawScrapedData?.cached) }
    });
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    metrics.analyzeFail += 1;
    await persistDailyMetrics();
    metrics.latencyTotalMs += elapsedMs;
    metrics.latencyAvgMs = Math.round(metrics.latencyTotalMs / Math.max(1, metrics.analyzeSuccess + metrics.analyzeFail));
    const details = error instanceof Error ? error.message : 'Erro desconhecido';
    safeLog('[analyze:error]', { requestId, details });
    return res.status(500).json({
      error: 'ANALYZE_FAILED',
      message: 'Não foi possível concluir o diagnóstico agora. Tente novamente.',
      requestId,
      ...(DEBUG ? { details } : {})
    });
  }
});

if (process.env.NODE_ENV !== 'test') {
  setInterval(cleanupExpiredScrapeCache, CACHE_CLEANUP_INTERVAL_MS).unref?.();
}

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[server] listening on :${PORT}`);
  });
}

export {
  parseModelJson,
  isValidResultShape,
  sanitizeAnalysisResult,
  validateAnalyzeInput
};

export default app;
