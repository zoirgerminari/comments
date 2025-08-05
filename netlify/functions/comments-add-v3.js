// ========================================
// 🔥 NEW CLEAN FUNCTION - ADD COMMENT V3
// ========================================

import { neon } from '@netlify/neon';

export default async (request, context) => {
    // Headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
    };

    console.log('🔥 NEW ADD FUNCTION V3 RUNNING!');
    console.log('📅 Timestamp:', new Date().toISOString());

    // Preflight request
    if (request.method === 'OPTIONS') {
        return new Response(JSON.stringify({ message: 'OK' }), {
            status: 200,
            headers
        });
    }

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
        console.log('📥 Parsing request body...');
        const comment = await request.json();
        console.log('💬 Comment data:', JSON.stringify(comment, null, 2));

        // Validações
        if (!comment.nome || !comment.email || !comment.comentario) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Campos obrigatórios: nome, email, comentario'
            }), {
                status: 400,
                headers
            });
        }

        if (comment.nome.length < 2 || comment.comentario.length < 10) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Nome min 2 chars, comentario min 10 chars'
            }), {
                status: 400,
                headers
            });
        }

        console.log('🔗 Connecting to Neon PostgreSQL...');
        const sql = neon();

        console.log('🏗️ Creating table if not exists...');
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

        console.log('💾 Inserting new comment...');
        const [newComment] = await sql`
            INSERT INTO comments (nome, email, comentario, ip)
            VALUES (${comment.nome.trim()}, ${comment.email.trim()}, ${comment.comentario.trim()}, ${request.headers.get('x-forwarded-for') || 'unknown'})
            RETURNING id, nome, email, comentario, data
        `;

        console.log(`✅ Comment saved! ID: ${newComment.id}`);
        console.log('💾 Full comment:', JSON.stringify(newComment, null, 2));

        const response = {
            success: true,
            message: 'Comentário adicionado com sucesso!',
            id: newComment.id,
            comment: newComment,
            version: 'V3-CLEAN',
            timestamp: new Date().toISOString(),
            debug: {
                functionName: 'comments-add-v3',
                tableCreated: true,
                insertExecuted: true,
                postgresqlConnected: true
            }
        };

        console.log('📤 Sending response:', JSON.stringify(response, null, 2));

        return new Response(JSON.stringify(response), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('❌ Error in V3 add function:', error);
        
        return new Response(JSON.stringify({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message,
            version: 'V3-CLEAN',
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers
        });
    }
};
