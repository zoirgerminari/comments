// ========================================
// 📦 CACHE COMPARTILHADO PARA COMENTÁRIOS
// ========================================

// Cache em memória para comentários
let commentsCache = [];

module.exports = {
    getCache: () => commentsCache,
    setCache: (comments) => {
        commentsCache = comments;
    },
    addToCache: (comment) => {
        const commentWithId = {
            id: Date.now(),
            ...comment,
            data: new Date().toISOString()
        };
        commentsCache.unshift(commentWithId);
        console.log('📦 Comentário adicionado ao cache:', commentWithId);
        return commentWithId;
    },
    getCacheSize: () => commentsCache.length
};
