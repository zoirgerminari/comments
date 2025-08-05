// ========================================
// 🧪 TEST FUNCTION - GET COMMENTS (NO CACHE)
// ========================================

const { neon } = require('@netlify/neon');

exports.handler = async (event, context) => {
    // Headers CORS + no cache
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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
        console.log('🧪 TEST FUNCTION - Starting...');
        console.log('📅 Timestamp:', new Date().toISOString());
        console.log('🔗 Database URL exists:', !!process.env.NETLIFY_DATABASE_URL);
        
        // Conectar ao banco Neon PostgreSQL
        const sql = neon(); // automatically uses env NETLIFY_DATABASE_URL

        console.log('✅ Connected to Neon database');

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

        console.log('✅ Table created/verified');

        // Buscar comentários
        const comments = await sql`
            SELECT id, nome, comentario, data 
            FROM comments 
            ORDER BY data DESC 
            LIMIT 100
        `;

        console.log(`📄 Found ${comments.length} comments in PostgreSQL`);
        console.log('🔍 Comments details:', JSON.stringify(comments, null, 2));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                comments: comments,  // ⚠️ USING 'comments' NOT 'comentarios'
                total: comments.length,
                timestamp: new Date().toISOString(),
                function_name: 'test-get',
                debug: {
                    hasTable: true,
                    queryExecuted: true,
                    databaseConnected: true,
                    environment: process.env.NODE_ENV || 'unknown'
                }
            })
        };

    } catch (error) {
        console.error('❌ Error in test function:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                function_name: 'test-get'
            })
        };
    }
};
