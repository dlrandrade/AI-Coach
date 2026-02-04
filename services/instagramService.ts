// Instagram Profile Scraper Service
// Uses RapidAPI's Instagram Scraper API

// NOTE: Replace with your own RapidAPI key
// Get one free at: https://rapidapi.com/arraybobo/api/instagram-scraper-2022
const RAPIDAPI_KEY = "009bc562d8mshe1370b6cd5321c9p1683dejsne9fed0c163df";
const RAPIDAPI_HOST = "instagram-scraper-api2.p.rapidapi.com";

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

export const scrapeInstagramProfile = async (username: string): Promise<InstagramProfileData> => {
    const cleanUsername = username.replace('@', '').trim().toLowerCase();

    // API key is configured - proceed with real scraping

    try {
        // Fetch profile info
        const profileResponse = await fetch(
            `https://${RAPIDAPI_HOST}/v1/info?username_or_id_or_url=${cleanUsername}`,
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                }
            }
        );

        if (!profileResponse.ok) {
            throw new Error(`Profile fetch failed: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        const user = profileData.data;

        if (!user) {
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
                error: "Perfil não encontrado ou privado"
            };
        }

        // Fetch recent posts
        let recentPosts: InstagramProfileData['recentPosts'] = [];
        try {
            const postsResponse = await fetch(
                `https://${RAPIDAPI_HOST}/v1.2/posts?username_or_id_or_url=${cleanUsername}`,
                {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': RAPIDAPI_KEY,
                        'x-rapidapi-host': RAPIDAPI_HOST
                    }
                }
            );

            if (postsResponse.ok) {
                const postsData = await postsResponse.json();
                const posts = postsData.data?.items || [];

                recentPosts = posts.slice(0, 9).map((post: any) => ({
                    caption: (post.caption?.text || '').slice(0, 200),
                    likesCount: post.like_count || 0,
                    commentsCount: post.comment_count || 0,
                    isVideo: post.media_type === 2
                }));
            }
        } catch (e) {
            console.warn("Could not fetch posts:", e);
        }

        // Extract highlight names if available
        const highlightNames: string[] = [];
        if (user.highlight_reel_count > 0) {
            // Note: Would need separate API call for highlight details
            highlightNames.push(`${user.highlight_reel_count} destaques encontrados`);
        }

        return {
            username: user.username || cleanUsername,
            fullName: user.full_name || null,
            biography: user.biography || null,
            externalUrl: user.external_url || null,
            followersCount: user.follower_count || null,
            followingCount: user.following_count || null,
            postsCount: user.media_count || null,
            isVerified: user.is_verified || false,
            isPrivate: user.is_private || false,
            profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || null,
            highlightNames,
            recentPosts,
            scrapedAt: new Date().toISOString(),
            error: null
        };

    } catch (error) {
        console.error("Instagram scraping error:", error);
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

// Simulation mode when API key is not configured
const simulateProfileData = (username: string): InstagramProfileData => {
    return {
        username,
        fullName: `[SIMULAÇÃO] Usuário ${username}`,
        biography: `[SIMULAÇÃO] Bio de @${username} não pôde ser lida. Configure sua API key do RapidAPI para leitura real.`,
        externalUrl: null,
        followersCount: Math.floor(Math.random() * 10000) + 1000,
        followingCount: Math.floor(Math.random() * 1000) + 100,
        postsCount: Math.floor(Math.random() * 200) + 50,
        isVerified: false,
        isPrivate: false,
        profilePicUrl: null,
        highlightNames: ["[SIM] Sobre", "[SIM] Serviços", "[SIM] Depoimentos"],
        recentPosts: [
            { caption: "[SIM] Post genérico sobre o nicho sem posicionamento claro", likesCount: 45, commentsCount: 3, isVideo: false },
            { caption: "[SIM] Conteúdo motivacional sem profundidade", likesCount: 78, commentsCount: 5, isVideo: false },
            { caption: "[SIM] Dicas básicas que qualquer um dá", likesCount: 32, commentsCount: 2, isVideo: true },
        ],
        scrapedAt: new Date().toISOString(),
        error: "API key não configurada. Usando dados simulados."
    };
};

// Helper to format scraped data for AI prompt
export const formatProfileForAI = (profile: InstagramProfileData): string => {
    if (profile.error && !profile.biography) {
        return `[ERRO DE LEITURA] ${profile.error}`;
    }

    const parts: string[] = [];

    parts.push(`=== DADOS LIDOS DO PERFIL @${profile.username} ===`);
    parts.push(`Leitura realizada em: ${profile.scrapedAt}`);
    parts.push('');

    if (profile.fullName) parts.push(`NOME: ${profile.fullName}`);
    if (profile.isVerified) parts.push(`STATUS: ✓ Verificado`);
    if (profile.isPrivate) parts.push(`VISIBILIDADE: Privado (dados limitados)`);

    parts.push('');
    parts.push(`--- BIO ---`);
    parts.push(profile.biography || '[VAZIA]');

    if (profile.externalUrl) {
        parts.push('');
        parts.push(`--- LINK NA BIO ---`);
        parts.push(profile.externalUrl);
    }

    parts.push('');
    parts.push(`--- MÉTRICAS ---`);
    parts.push(`Seguidores: ${profile.followersCount?.toLocaleString() || 'N/A'}`);
    parts.push(`Seguindo: ${profile.followingCount?.toLocaleString() || 'N/A'}`);
    parts.push(`Posts: ${profile.postsCount?.toLocaleString() || 'N/A'}`);

    if (profile.highlightNames.length > 0) {
        parts.push('');
        parts.push(`--- DESTAQUES ---`);
        profile.highlightNames.forEach(h => parts.push(`• ${h}`));
    }

    if (profile.recentPosts.length > 0) {
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
