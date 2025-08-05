// ========================================
// 🗄️ NETLIFY NEON POSTGRESQL - ADD COMMENT
// ========================================

const { neon } = require('@netlify/neon');

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
        const comment = JSON.parse(event.body);
        
        // Validação dos campos obrigatórios
        if (!comment.nome || !comment.email || !comment.comentario) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Campos obrigatórios: nome, email, comentario'
                })
            };
        }

        // Validações adicionais
        if (comment.nome.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Nome deve ter pelo menos 2 caracteres'
                })
            };
        }

        if (comment.comentario.length < 10) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Comentário deve ter pelo menos 10 caracteres'
                })
            };
        }

        // Conectar ao banco Neon PostgreSQL
        const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL

        // Criar tabela se não existir
        await sql`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                comentario TEXT NOT NULL,
                data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip VARCHAR(45)
            )
        `;

        // Inserir novo comentário
        const [newComment] = await sql`
            INSERT INTO comments (nome, email, comentario, ip)
            VALUES (${comment.nome.trim()}, ${comment.email.trim()}, ${comment.comentario.trim()}, ${event.headers['x-forwarded-for'] || 'unknown'})
            RETURNING id, nome, email, comentario, data
        `;

        console.log(`✅ Comentário salvo no PostgreSQL! ID: ${newComment.id}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Comentário adicionado com sucesso!',
                id: newComment.id,
                comment: newComment
            })
        };

    } catch (error) {
        console.error('❌ Erro:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            })
        };
    }
};
