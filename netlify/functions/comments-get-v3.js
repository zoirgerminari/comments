// ========================================
// 🔥 NEW CLEAN FUNCTION - GET COMMENTS V3
// ========================================

import { neon } from '@netlify/neon';

export default async (request, context) => {
    // Headers CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
    };

    console.log('🔥 NEW FUNCTION V3 RUNNING!');
    console.log('📅 Timestamp:', new Date().toISOString());

    // Preflight request
    if (request.method === 'OPTIONS') {
        return new Response(JSON.stringify({ message: 'OK' }), {
            status: 200,
            headers
        });
    }

    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ 
            success: false, 
            message: 'Método não permitido' 
        }), {
            status: 405,
            headers
        });
    }

    try {
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

        console.log('🔍 Querying comments...');
        const comments = await sql`
            SELECT id, nome, comentario, data 
            FROM comments 
            ORDER BY data DESC 
            LIMIT 100
        `;

        console.log(`📄 Found ${comments.length} comments in PostgreSQL`);
        console.log('🔍 Comments details:', JSON.stringify(comments, null, 2));

        const response = {
            success: true,
            comments: comments,  // ⚠️ EXPLICITLY 'comments' NOT 'comentarios'
            total: comments.length,
            version: 'V3-CLEAN',
            timestamp: new Date().toISOString(),
            debug: {
                functionName: 'comments-get-v3',
                hasTable: true,
                queryExecuted: true,
                postgresqlConnected: true
            }
        };

        console.log('📤 Sending response:', JSON.stringify(response, null, 2));

        return new Response(JSON.stringify(response), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('❌ Error in V3 function:', error);
        
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
