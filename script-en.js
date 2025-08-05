// ========================================
// 🚀 COMMENTS SYSTEM - NETLIFY (ENGLISH)
// ========================================

class CommentsNetlify {
    constructor() {
        // Base URL for Netlify Functions
        this.API_BASE_URL = '/.netlify/functions';
        this.init();
    }

    init() {
        console.log('🚀 Initialising comments system...');
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
        const comment = {
            nome: formData.get('nome').trim(),
            email: formData.get('email').trim(),
            comentario: formData.get('comentario').trim()
        };

        // Basic validation
        if (!this.validateForm(comment)) {
            return;
        }

        const submitBtn = event.target.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading
            submitBtn.innerHTML = '<span>⏳ Submitting...</span>';
            submitBtn.disabled = true;

            await this.submitComment(comment);
            
            // Success
            this.showMessage('✅ Comment submitted successfully!', 'success');
            event.target.reset();
            await this.loadComments(); // Reload comments
            
        } catch (error) {
            console.error('Error submitting comment:', error);
            this.showMessage('❌ Error submitting comment. Please try again.', 'error');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(data) {
        if (!data.nome || data.nome.length < 2) {
            this.showMessage('❌ Name must have at least 2 characters.', 'error');
            return false;
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            this.showMessage('❌ Invalid email address.', 'error');
            return false;
        }

        if (!data.comentario || data.comentario.length < 5) {
            this.showMessage('❌ Comment must have at least 5 characters.', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async submitComment(comment) {
        const response = await fetch(`${this.API_BASE_URL}/add-comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(comment)
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
            // Show loading
            lista.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading comments...</p>
                </div>
            `;

            const response = await fetch(`${this.API_BASE_URL}/get-comments`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            this.renderComments(data.comentarios || []);
            
        } catch (error) {
            console.error('Error loading comments:', error);
            lista.innerHTML = `
                <div class="error-message">
                    ❌ Error loading comments. Please check your connection.
                </div>
            `;
        }
    }

    renderComments(comments) {
        const lista = document.getElementById('comentarios-lista');
        
        if (!comments || comments.length === 0) {
            lista.innerHTML = `
                <div class="empty-state">
                    No comments yet. Be the first to comment!
                </div>
            `;
            return;
        }

        const html = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-author">👤 ${this.escapeHtml(comment.nome)}</div>
                    <div class="comment-date">📅 ${this.formatDate(comment.data_criacao)}</div>
                </div>
                <div class="comment-text">
                    ${this.escapeHtml(comment.comentario)}
                </div>
            </div>
        `).join('');

        lista.innerHTML = html;
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;

        // Insert before form
        const formSection = document.querySelector('.form-section');
        formSection.insertBefore(messageDiv, formSection.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// ========================================
// 🎯 INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, initialising application...');
    new CommentsNetlify();
});

// ========================================
// 🔧 GLOBAL UTILITIES
// ========================================
window.commentsApp = {
    refresh: () => {
        console.log('🔄 Reloading comments...');
        if (window.commentsInstance) {
            window.commentsInstance.loadComments();
        }
    }
};
