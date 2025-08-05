// Sistema de Comentários - JavaScript
// URL da API - VERCEL
const API_URL = 'https://zoir-html-2025.vercel.app';

// Função para carregar comentários
async function loadComments() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        const container = document.getElementById('comments-container');
        
        if (data.success && data.comments.length > 0) {
            container.innerHTML = data.comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-name">👤 ${comment.name}</div>
                    <div class="comment-text">${comment.comments}</div>
                    <div class="comment-date">📅 ${comment.data}</div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.7); padding: 40px;">😔 Ainda não há comentários</div>';
        }
    } catch (error) {
        document.getElementById('comments-container').innerHTML = 
            '<div style="text-align: center; color: rgba(255,255,255,0.7); padding: 40px;">❌ Erro ao carregar comentários</div>';
    }
}

// Função para enviar comentário
async function submitComment(name, comments) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, comments })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, message: 'Erro de conexão' };
    }
}

// Event listener para o formulário
document.getElementById('commentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const comments = document.getElementById('comments').value.trim();
    
    if (!name || !comments) {
        showMessage('error', 'Por favor, preencha todos os campos');
        return;
    }
    
    // Desabilitar botão durante envio
    const submitBtn = document.getElementById('submit');
    submitBtn.disabled = true;
    submitBtn.value = 'Enviando...';
    
    const result = await submitComment(name, comments);
    
    if (result.success) {
        showMessage('success', 'Comentário enviado com sucesso!');
        document.getElementById('commentForm').reset();
        loadComments(); // Recarregar comentários
    } else {
        showMessage('error', result.message || 'Erro ao enviar comentário');
    }
    
    // Reabilitar botão
    submitBtn.disabled = false;
    submitBtn.value = 'Enviar Comentário';
});

// Função para mostrar mensagens
function showMessage(type, message) {
    const successEl = document.getElementById('success-message');
    const errorEl = document.getElementById('error-message');
    
    // Esconder ambas
    successEl.style.display = 'none';
    errorEl.style.display = 'none';
    
    if (type === 'success') {
        successEl.textContent = message;
        successEl.style.display = 'block';
        setTimeout(() => successEl.style.display = 'none', 5000);
    } else {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => errorEl.style.display = 'none', 5000);
    }
}

// Carregar comentários quando a página carregar
window.addEventListener('load', loadComments);

// Recarregar comentários a cada 30 segundos
setInterval(loadComments, 30000);
