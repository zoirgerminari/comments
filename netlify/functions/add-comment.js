// ========================================
// 🚀 NETLIFY FUNCTION - ADICIONAR COMENTÁRIO
// ========================================

const sqlite3 = require('sqlite3').verbose();
const sharedCache = require('./shared-cache');
const path = require('path');

// Configuração do banco
const DB_PATH = '/tmp/comentarios.db';

// Lista temporária para persistir comentários durante a sessão
let commentsCache = [];

// Função para salvar no cache e tentar no banco
async function saveComment(comment) {
    // Adicionar ao cache primeiro
    const commentWithId = {
        id: Date.now(),
        ...comment,
        data_criacao: new Date().toISOString()
    };
    
    commentsCache.unshift(commentWithId);
    console.log('💾 Comentário salvo no cache:', commentWithId);
    
    // Tentar salvar no banco também
    try {
        const db = await initDatabase();
        return new Promise((resolve) => {
            db.run(
                'INSERT INTO comentarios (nome, email, comentario) VALUES (?, ?, ?)',
                [comment.nome, comment.email, comment.comentario],
                function(err) {
                    db.close();
                    if (!err) {
                        console.log('✅ Comentário também salvo no banco SQLite');
                    }
                    // Sempre resolve com sucesso se chegou no cache
                    resolve(commentWithId);
                }
            );
        });
    } catch (error) {
        console.warn('⚠️ Banco SQLite falhou, mas comentário salvo no cache');
        return commentWithId;
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
                    console.log('✅ Tabela comentarios criada/verificada com sucesso');
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
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Apenas POST permitido
    if (event.httpMethod !== 'POST') {
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
        // Parse do body
        const data = JSON.parse(event.body);
        const { nome, email, comentario } = data;

        // Validação
        if (!nome || !email || !comentario) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Todos os campos são obrigatórios'
                })
            };
        }

        if (nome.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Nome deve ter pelo menos 2 caracteres'
                })
            };
        }

        if (comentario.length < 5) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Comentário deve ter pelo menos 5 caracteres'
                })
            };
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Email inválido'
                })
            };
        }

        // Salvar comentário
        const result = sharedCache.addToCache({ nome, email, comentario });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Comentário adicionado com sucesso',
                id: result.id
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
