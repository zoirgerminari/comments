// ========================================
// 🚀 NETLIFY FUNCTION - ADICIONAR COMENTÁRIO
// ========================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuração do banco
const DB_PATH = '/tmp/comentarios.db';

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
                    console.error('Erro ao criar tabela:', err);
                    reject(err);
                } else {
                    console.log('Banco inicializado com sucesso');
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

        // Conectar ao banco
        const db = await initDatabase();

        // Inserir comentário
        return new Promise((resolve) => {
            db.run(
                'INSERT INTO comentarios (nome, email, comentario) VALUES (?, ?, ?)',
                [nome.trim(), email.trim(), comentario.trim()],
                function(err) {
                    db.close();
                    
                    if (err) {
                        console.error('Erro ao inserir comentário:', err);
                        resolve({
                            statusCode: 500,
                            headers,
                            body: JSON.stringify({
                                success: false,
                                message: 'Erro interno do servidor'
                            })
                        });
                    } else {
                        console.log('Comentário inserido com ID:', this.lastID);
                        resolve({
                            statusCode: 200,
                            headers,
                            body: JSON.stringify({
                                success: true,
                                message: 'Comentário adicionado com sucesso',
                                id: this.lastID
                            })
                        });
                    }
                }
            );
        });

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
