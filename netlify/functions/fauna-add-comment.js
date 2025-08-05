// ========================================
// 🦋 FAUNA DB - ADD COMMENT FUNCTION
// ========================================

const faunadb = require('faunadb');
const q = faunadb.query;

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
        // Verificar se a chave do FaunaDB existe
        if (!process.env.FAUNADB_SECRET) {
            throw new Error('FaunaDB secret não configurado');
        }

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

        if (comentario.length < 10) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Comentário deve ter pelo menos 10 caracteres'
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

        // Conectar ao FaunaDB
        const client = new faunadb.Client({
            secret: process.env.FAUNADB_SECRET
        });

        // Criar comentário no FaunaDB
        const result = await client.query(
            q.Create(
                q.Collection('comments'),
                {
                    data: {
                        nome: nome.trim(),
                        email: email.trim(),
                        comentario: comentario.trim(),
                        data: new Date().toISOString(),
                        ip: event.headers['client-ip'] || 'unknown'
                    }
                }
            )
        );

        console.log('✅ Comentário salvo no FaunaDB:', result.ref.id);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Comentário adicionado com sucesso',
                id: result.ref.id
            })
        };

    } catch (error) {
        console.error('❌ Erro:', error);
        
        // Se for erro de collection não existe, criar automaticamente
        if (error.message.includes('Collection') && error.message.includes('does not exist')) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Banco de dados não configurado. Execute o setup primeiro.'
                })
            };
        }

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
