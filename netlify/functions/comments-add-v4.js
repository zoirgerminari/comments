// Função ADD comments - versão simplificada
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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Method not allowed' 
            })
        };
    }

    try {
        console.log('💬 ADD Comment V4 - Simplified version');
        console.log('📥 Request body:', event.body);
        
        const comment = JSON.parse(event.body || '{}');
        
        // Validações básicas
        if (!comment.nome || !comment.email || !comment.comentario) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Missing required fields: nome, email, comentario'
                })
            };
        }

        // Simular sucesso (sem banco de dados por enquanto)
        const response = {
            success: true,
            message: 'Comment received successfully',
            id: Date.now(),
            version: 'V4-SIMPLE',
            timestamp: new Date().toISOString(),
            comment: {
                nome: comment.nome,
                comentario: comment.comentario,
                data: new Date().toISOString()
            }
        };

        console.log('✅ Comment processed:', response);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('❌ Error in V4 ADD function:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.message,
                version: 'V4-SIMPLE'
            })
        };
    }
};