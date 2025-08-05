// ========================================
// 🚀 SISTEMA DE COMENTÁRIOS - NETLIFY
// ========================================

class ComentariosNetlify {
    constructor() {
        // URL base para as Netlify Functions
        this.API_BASE_URL = '/.netlify/functions';
        this.init();
    }

    init() {
        console.log('🚀 Iniciando sistema de comentários...');
        this.setupEventListeners();
        this.loadComments();
    }

    setupEventListeners() {
        const form = document.getElementById('comentarioForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const comentario = {
            nome: formData.get('nome').trim(),
            email: formData.get('email').trim(),
            comentario: formData.get('comentario').trim()
        };

        // Validação básica
        if (!this.validateForm(comentario)) {
            return;
        }

        const submitBtn = event.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Mostrar loading
            submitBtn.innerHTML = '<span>⏳ Enviando...</span>';
            submitBtn.disabled = true;

            await this.submitComment(comentario);
            
            // Sucesso
            this.showMessage('✅ Comentário enviado com sucesso!', 'success');
            event.target.reset();
            await this.loadComments(); // Recarregar comentários
            
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            this.showMessage('❌ Erro ao enviar comentário. Tente novamente.', 'error');
        } finally {
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(data) {
        if (!data.nome || data.nome.length < 2) {
            this.showMessage('❌ Nome deve ter pelo menos 2 caracteres.', 'error');
            return false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            this.showMessage('❌ Email inválido.', 'error');
            return false;
        }

        if (!data.comentario || data.comentario.length < 5) {
            this.showMessage('❌ Comentário deve ter pelo menos 5 caracteres.', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async submitComment(comentario) {
        const response = await fetch(`${this.API_BASE_URL}/add-comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comentario)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return await response.json();
    }

    async loadComments() {
        const lista = document.getElementById('comentarios-lista');
        
        try {
            // Mostrar loading
            lista.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Carregando comentários...</p>
                </div>
            `;

            const response = await fetch(`${this.API_BASE_URL}/get-comments`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.renderComments(data.comentarios || []);
            
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            lista.innerHTML = `
                <div class="error-message">
                    ❌ Erro ao carregar comentários. Verifique sua conexão.
                </div>
            `;
        }
    }

    renderComments(comentarios) {
        const lista = document.getElementById('comentarios-lista');
        
        if (!comentarios || comentarios.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                </div>
            `;
            return;
        }

        const html = comentarios.map(comentario => `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-author">👤 ${this.escapeHtml(comentario.nome)}</div>
                    <div class="comment-date">📅 ${this.formatDate(comentario.data_criacao)}</div>
                </div>
                <div class="comment-text">
                    ${this.escapeHtml(comentario.comentario)}
                </div>
            </div>
        `).join('');

        lista.innerHTML = html;
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Data inválida';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'info') {
        // Remove mensagens existentes
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        // Criar nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;

        // Inserir antes do formulário
        const formSection = document.querySelector('.form-section');
        formSection.insertBefore(messageDiv, formSection.firstChild);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// ========================================
// 🎯 INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM carregado, inicializando aplicação...');
    new ComentariosNetlify();
});

// ========================================
// 🔧 UTILITÁRIOS GLOBAIS
// ========================================
window.comentariosApp = {
    refresh: () => {
        console.log('🔄 Recarregando comentários...');
        if (window.comentariosInstance) {
            window.comentariosInstance.loadComments();
        }
    }
};
