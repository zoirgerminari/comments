# 💬 Comments System - GitHub Pages Version

A modern, responsive comments system designed for GitHub Pages.

## 🌟 Features

- **Beautiful Design**: Modern gradient background with responsive layout
- **Local Storage**: Comments are saved in browser's localStorage
- **Form Validation**: Email and content validation
- **Real-time Updates**: Comments appear immediately after submission
- **Mobile Friendly**: Responsive design works on all devices

## 🚀 Live Demo

Visit: **https://zoirgerminari.github.io/comments/**

## ⚠️ Important Notes

This is the **GitHub Pages version** that uses localStorage for comment storage.

- ✅ **Works**: Comment form, validation, display
- ✅ **Persists**: Comments saved in browser localStorage
- ❌ **Limitation**: Comments are local to each browser/device

## 🔄 Full Version

For a complete version with permanent cloud storage, visit:
**https://glowing-froyo-8fd8be.netlify.app**

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: localStorage (GitHub Pages version)
- **Hosting**: GitHub Pages
- **Design**: CSS Grid, Flexbox, CSS Variables

## 📱 Browser Compatibility

- ✅ Chrome/Edge 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Mobile browsers

## 🎨 Design Features

- Glassmorphism effects
- Smooth animations
- Hover transitions
- Responsive typography
- Mobile-first design

---

**Made with ❤️ for GitHub Pages**
- ✅ **Validação** de formulários
- ✅ **Mensagens** de feedback em tempo real

## 📁 Estrutura do Projeto

```
/
├── index-netlify.html          # Página principal (renomear para index.html no deploy)
├── netlify.toml               # Configuração do Netlify
├── package.json               # Dependências do projeto
└── netlify/
    └── functions/
        ├── add-comment.js     # Função para adicionar comentários
        └── get-comments.js    # Função para listar comentários
```

## 🛠️ Como Usar

### 1. **Deploy no Netlify**

1. Faça upload dos arquivos para o GitHub
2. Conecte o repositório ao Netlify
3. Renomeie `index-netlify.html` para `index.html`
4. Deploy automático!

### 2. **Desenvolvimento Local**

```bash
# Instalar dependências
npm install

# Instalar Netlify CLI globalmente
npm install -g netlify-cli

# Executar localmente
npm run dev
# ou
netlify dev
```

### 3. **Configuração**

O sistema está pronto para uso! Não precisa de configuração adicional.

## 🔧 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Netlify Functions (Node.js)
- **Banco**: SQLite
- **Deploy**: Netlify

## 📱 Recursos

### ✨ Interface
- Design gradient moderno
- Formulário com labels flutuantes
- Animações suaves
- Totalmente responsivo

### 🔐 Validação
- Nome: mínimo 2 caracteres
- E-mail: formato válido
- Comentário: mínimo 10 caracteres

### 💾 Persistência
- Banco SQLite automático
- Comentários ordenados por data
- Backup automático no Netlify

## 🌟 Funcionalidades

1. **Adicionar Comentários**
   - Formulário validado
   - Feedback visual
   - Limpeza automática após envio

2. **Visualizar Comentários**
   - Lista em tempo real
   - Ordenação por data
   - Design moderno

3. **Responsividade**
   - Desktop: Layout em duas colunas
   - Mobile: Layout stacked

## 🚀 Deploy Rápido

1. **Faça fork deste projeto**
2. **Conecte ao Netlify**
3. **Renomeie o arquivo**:
   - `index-netlify.html` → `index.html`
4. **Deploy automático!** 🎉

## 📞 Suporte

Sistema totalmente funcional e pronto para produção. Ideal para:

- Sites pessoais
- Blogs
- Portfólios
- Páginas de projetos

---

**✅ Pronto para usar • 🚀 Deploy em segundos • 💪 Zero configuração**
