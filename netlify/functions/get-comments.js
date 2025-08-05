// ========================================
// 🚀 NETLIFY FUNCTION - LISTAR COMENTÁRIOS
// ========================================

const sqlite3 = require('sqlite3').verbose();

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
        // Conectar ao banco
        const db = await initDatabase();

        // Buscar comentários
        return new Promise((resolve) => {
            db.all(
                'SELECT id, nome, comentario, data_criacao FROM comentarios ORDER BY data_criacao DESC LIMIT 50',
                [],
                (err, rows) => {
                    db.close();
                    
                    if (err) {
                        console.error('Erro ao buscar comentários:', err);
                        resolve({
                            statusCode: 500,
                            headers,
                            body: JSON.stringify({
                                success: false,
                                message: 'Erro interno do servidor'
                            })
                        });
                    } else {
                        console.log(`Encontrados ${rows.length} comentários`);
                        resolve({
                            statusCode: 200,
                            headers,
                            body: JSON.stringify({
                                success: true,
                                comentarios: rows,
                                total: rows.length
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
