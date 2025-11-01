// Função GET comments - versão simplificada
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

    if (event.httpMethod !== 'GET') {
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
        console.log('🔍 GET Comments V4 - Simplified version');
        
        // Por enquanto, retornar comentários vazios mas funcionais
        const response = {
            success: true,
            comments: [],
            total: 0,
            version: 'V4-SIMPLE',
            timestamp: new Date().toISOString(),
            message: 'Comments system online - no database yet'
        };

        console.log('📤 Sending response:', response);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('❌ Error in V4 function:', error);
        
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