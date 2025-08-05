// ========================================
// 🗄️ NETLIFY NEON POSTGRESQL - ADD COMMENT
// ========================================

import { neon } from '@netlify/neon';

export default async (request, context) => {
    // Headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Preflight request
    if (request.method === 'OPTIONS') {
        return new Response(JSON.stringify({ message: 'OK' }), {
            status: 200,
            headers
        });
    }

    // Apenas POST permitido
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'Método não permitido' 
        }), {
            status: 405,
            headers
        });
    }

    try {
        // Parse do body
        const comment = await request.json();
        
        // Validação dos campos obrigatórios
        if (!comment.nome || !comment.email || !comment.comentario) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Campos obrigatórios: nome, email, comentario'
            }), {
                status: 400,
                headers
            });
        }

        // Validações adicionais
        if (comment.nome.length < 2) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Nome deve ter pelo menos 2 caracteres'
            }), {
                status: 400,
                headers
            });
        }

        if (comment.comentario.length < 10) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Comentário deve ter pelo menos 10 caracteres'
            }), {
                status: 400,
                headers
            });
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
            VALUES (${comment.nome.trim()}, ${comment.email.trim()}, ${comment.comentario.trim()}, ${request.headers.get('x-forwarded-for') || 'unknown'})
            RETURNING id, nome, email, comentario, data
        `;

        console.log(`✅ Comentário salvo no PostgreSQL! ID: ${newComment.id}`);
        console.log('💾 Comentário completo:', newComment);

        return new Response(JSON.stringify({
            success: true,
            message: 'Comentário adicionado com sucesso!',
            id: newComment.id,
            comment: newComment,
            debug: {
                timestamp: new Date().toISOString(),
                tableCreated: true,
                insertExecuted: true,
                functionType: 'netlify-add-comment-v2'
            }
        }), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('❌ Erro:', error);
        
        return new Response(JSON.stringify({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        }), {
            status: 500,
            headers
        });
    }
};
