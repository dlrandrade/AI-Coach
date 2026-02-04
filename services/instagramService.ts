// Instagram Profile Scraper Service
// Uses RapidAPI's Instagram Scraper v21

const RAPIDAPI_KEY = "009bc562d8mshe1370b6cd5321c9p1683dejsne9fed0c163df";
const RAPIDAPI_HOST = "instagram-scraper-v21.p.rapidapi.com";

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

    try {
        // Step 1: Get user info by username
        console.log('[Scraper] Fetching user info for:', cleanUsername);
        const userInfoResponse = await fetch(
            `https://${RAPIDAPI_HOST}/api/get-user-info-by-username`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': RAPIDAPI_HOST
                },
                body: JSON.stringify({ username: cleanUsername })
            }
        );

        if (!userInfoResponse.ok) {
            throw new Error(`User info fetch failed: ${userInfoResponse.status}`);
        }

        const userInfoData = await userInfoResponse.json();
        console.log('[Scraper] User info response:', userInfoData);

        // Extract user data from response
        const user = userInfoData?.data?.user || userInfoData?.user || userInfoData;

        if (!user || !user.id) {
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
                error: "Perfil não encontrado ou resposta inválida"
            };
        }

        const userId = user.id || user.pk;

        // Step 2: Get recent posts
        let recentPosts: InstagramProfileData['recentPosts'] = [];
        try {
            console.log('[Scraper] Fetching posts for user_id:', userId);
            const postsResponse = await fetch(
                `https://${RAPIDAPI_HOST}/api/get-user-posts`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-key': RAPIDAPI_KEY,
                        'x-rapidapi-host': RAPIDAPI_HOST
                    },
                    body: JSON.stringify({ user_id: userId })
                }
            );

            if (postsResponse.ok) {
                const postsData = await postsResponse.json();
                console.log('[Scraper] Posts response:', postsData);
                const posts = postsData?.data?.items || postsData?.items || [];

                recentPosts = posts.slice(0, 9).map((post: any) => ({
                    caption: (post.caption?.text || post.caption || '').slice(0, 200),
                    likesCount: post.like_count || post.likes_count || 0,
                    commentsCount: post.comment_count || post.comments_count || 0,
                    isVideo: post.media_type === 2 || post.is_video || false
                }));
            }
        } catch (e) {
            console.warn("[Scraper] Could not fetch posts:", e);
        }

        // Step 3: Get highlights (if available)
        let highlightNames: string[] = [];
        try {
            const highlightsResponse = await fetch(
                `https://${RAPIDAPI_HOST}/api/get-user-highlights`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-key': RAPIDAPI_KEY,
                        'x-rapidapi-host': RAPIDAPI_HOST
                    },
                    body: JSON.stringify({ user_id: userId })
                }
            );

            if (highlightsResponse.ok) {
                const highlightsData = await highlightsResponse.json();
                console.log('[Scraper] Highlights response:', highlightsData);
                const highlights = highlightsData?.data?.items || highlightsData?.items || [];
                highlightNames = highlights.slice(0, 10).map((h: any) => h.title || h.name || 'Destaque');
            }
        } catch (e) {
            console.warn("[Scraper] Could not fetch highlights:", e);
        }

        return {
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
            error: null
        };

    } catch (error) {
        console.error("[Scraper] Error:", error);
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
