// ========================================
// 🦋 FAUNA DB - GET COMMENTS FUNCTION
// ========================================

const faunadb = require('faunadb');
const q = faunadb.query;

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
        // Verificar se a chave do FaunaDB existe
        if (!process.env.FAUNADB_SECRET) {
            throw new Error('FaunaDB secret não configurado');
        }

        // Conectar ao FaunaDB
        const client = new faunadb.Client({
            secret: process.env.FAUNADB_SECRET
        });

        // Buscar comentários (ordenados por data, mais recentes primeiro)
        const result = await client.query(
            q.Map(
                q.Paginate(
                    q.Reverse(
                        q.Documents(q.Collection('comments'))
                    ),
                    { size: 50 }
                ),
                q.Lambda(
                    'ref',
                    q.Let(
                        {
                            doc: q.Get(q.Var('ref'))
                        },
                        {
                            id: q.Select(['ref', 'id'], q.Var('doc')),
                            nome: q.Select(['data', 'nome'], q.Var('doc')),
                            comentario: q.Select(['data', 'comentario'], q.Var('doc')),
                            data: q.Select(['data', 'data'], q.Var('doc'))
                        }
                    )
                )
            )
        );

        console.log(`📄 Encontrados ${result.data.length} comentários no FaunaDB`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                comments: result.data,
                total: result.data.length
            })
        };

    } catch (error) {
        console.error('❌ Erro:', error);
        
        // Se for erro de collection não existe, retornar array vazio
        if (error.message.includes('Collection') && error.message.includes('does not exist')) {
            console.log('⚠️ Collection não existe, retornando lista vazia');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    comments: [],
                    total: 0,
                    message: 'Collection não existe ainda'
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
