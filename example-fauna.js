// ========================================
// 🚀 NETLIFY FUNCTION - COM FAUNADB
// ========================================

// Para usar FaunaDB (banco permanente):
// 1. npm install faunadb
// 2. Criar conta em fauna.com
// 3. Adicionar FAUNA_SECRET nas variáveis do Netlify

const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { nome, email, comentario } = JSON.parse(event.body);
    
    const result = await client.query(
      q.Create(
        q.Collection('comentarios'),
        {
          data: {
            nome,
            email,
            comentario,
            data_criacao: new Date().toISOString()
          }
        }
      )
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: result.ref.id })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
