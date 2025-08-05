// ========================================
// 🚀 NETLIFY FUNCTION - LISTAR COMENTÁRIOS
// ========================================

const sqlite3 = require('sqlite3').verbose();
const sharedCache = require('./shared-cache');

// Configuração do banco
const DB_PATH = '/tmp/comentarios.db';

// Lista temporária compartilhada (funciona durante a sessão do Netlify)
let commentsCache = [];

// Função para obter comentários do cache e banco
async function getComments() {
    console.log('🔍 Buscando comentários...');
    console.log('📦 Cache atual:', commentsCache);
    
    // Se há comentários no cache, usar eles
    if (commentsCache.length > 0) {
        console.log('✅ Retornando comentários do cache');
        return commentsCache;
    }
    
    // Tentar buscar do banco SQLite
    try {
        const db = await initDatabase();
        return new Promise((resolve) => {
            db.all(
                'SELECT id, nome, comentario, data_criacao as data FROM comentarios ORDER BY data_criacao DESC LIMIT 50',
                [],
                (err, rows) => {
                    db.close();
                    if (!err && rows.length > 0) {
                        console.log('✅ Comentários encontrados no banco SQLite:', rows.length);
                        commentsCache = rows; // Atualizar cache
                        resolve(rows);
                    } else {
                        console.log('📭 Nenhum comentário encontrado');
                        resolve([]);
                    }
                }
            );
        });
    } catch (error) {
        console.warn('⚠️ Erro ao acessar banco SQLite:', error);
        return [];
    }
}

// Inicializar banco
function initDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Erro ao conectar ao banco:', err);
                reject(err);
                return;
            }
            
            // Criar tabela se não existir
            db.run(`
                CREATE TABLE IF NOT EXISTS comentarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    email TEXT NOT NULL,
                    comentario TEXT NOT NULL,
                    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    console.error('❌ Erro ao criar tabela:', err);
                    reject(err);
                } else {
                    console.log('✅ Tabela comentarios criada/verificada com sucesso (get-comments)');
                    resolve(db);
                }
            });
        });
    });
}

exports.handler = async (event, context) => {
    // Headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'OK' })
        };
    }

    // Apenas GET permitido
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Método não permitido' 
            })
        };
    }

    try {
        // Buscar comentários do cache
        const comments = sharedCache.getCache();
        console.log('📦 Comentários do cache:', comments.length);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                comments: comments,
                total: comments.length
            })
        };

    } catch (error) {
        console.error('Erro geral:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Erro interno do servidor'
            })
        };
    }
};
