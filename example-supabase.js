// ========================================
// 🚀 NETLIFY FUNCTION - COM SUPABASE
// ========================================

// Para usar Supabase (PostgreSQL gratuito):
// 1. npm install @supabase/supabase-js
// 2. Criar conta em supabase.com
// 3. Adicionar SUPABASE_URL e SUPABASE_ANON_KEY

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { nome, email, comentario } = JSON.parse(event.body);
    
    const { data, error } = await supabase
      .from('comentarios')
      .insert([
        { nome, email, comentario }
      ]);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
