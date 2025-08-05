// ========================================
// 📦 CACHE COMPARTILHADO PARA COMENTÁRIOS
// ========================================

const path = require('path');
const fs = require('fs');

// Arquivo temporário para compartilhar dados entre funções
const CACHE_FILE = '/tmp/comments-cache.json';

function readCache() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.warn('⚠️ Erro ao ler cache:', error);
    }
    return [];
}

function writeCache(comments) {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(comments, null, 2));
        console.log('💾 Cache salvo:', comments.length, 'comentários');
    } catch (error) {
        console.error('❌ Erro ao salvar cache:', error);
    }
}

module.exports = {
    getCache: () => {
        const cache = readCache();
        console.log('📦 Lendo cache:', cache.length, 'comentários');
        return cache;
    },
    
    setCache: (comments) => {
        writeCache(comments);
    },
    
    addToCache: (comment) => {
        const cache = readCache();
        const commentWithId = {
            id: Date.now(),
            nome: comment.nome,
            comentario: comment.comentario,
            data: new Date().toISOString(),
            ...comment
        };
        
        cache.unshift(commentWithId);
        writeCache(cache);
        
        console.log('📦 Comentário adicionado ao cache:', commentWithId);
        return commentWithId;
    },
    
    getCacheSize: () => {
        return readCache().length;
    }
};
