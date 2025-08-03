# 🚀 Deploy do Sistema de Comentários

## 📋 **Arquivos para Deploy:**

### 🌐 **Para Railway (Backend PHP):**
- `api-comments.php` - API principal
- `package.json` - Configuração do Railway

### 📄 **Para GitHub Pages (Frontend):**
- `comentarios-github.html` - Página HTML estática

## 🎯 **Passo a Passo:**

### **1. Deploy do Backend no Railway:**

1. **Acesse:** [railway.app](https://railway.app)
2. **Faça login** com GitHub
3. **Clique em "New Project"**
4. **Selecione "Deploy from GitHub repo"**
5. **Crie um novo repositório** ou use um existente
6. **Faça upload dos arquivos:**
   - `api-comments.php`
   - `package.json`
7. **Railway detectará** automaticamente como projeto PHP
8. **Anote a URL** gerada (ex: `https://seu-projeto.railway.app`)

### **2. Atualizar Frontend:**

1. **Edite** `comentarios-github.html`
2. **Linha 126:** Altere a URL da API:
   ```javascript
   const API_URL = 'https://SEU-PROJETO.railway.app/api-comments.php';
   ```
3. **Substitua** `SEU-PROJETO` pela URL real do Railway

### **3. Upload para GitHub Pages:**

1. **Vá para seu repositório:** `zoirgerminari.github.io`
2. **Crie uma pasta:** `comentarios/`
3. **Faça upload** do arquivo `comentarios-github.html`
4. **Renomeie** para `index.html` dentro da pasta
5. **Acesse:** `https://zoirgerminari.github.io/comentarios/`

### **4. Integrar ao seu site:**

No seu `index.html` principal, adicione um link:
```html
<a href="comentarios/">💬 Sistema de Comentários</a>
```

## 🔧 **Alternativas de Hospedagem PHP:**

### **Railway (Recomendado):**
- ✅ Gratuito
- ✅ Deploy automático
- ✅ HTTPS incluído
- ✅ Fácil configuração

### **Vercel:**
- ✅ Gratuito
- ✅ Deploy via GitHub
- ❗ Requer adaptação para Serverless

### **Heroku:**
- ✅ Gratuito (com limitações)
- ✅ Suporte completo PHP
- ❗ Dorme após inatividade

## 📝 **Estrutura Final:**

```
https://zoirgerminari.github.io/
├── index.html (seu site atual)
├── comentarios/
│   └── index.html (sistema de comentários)
└── outros arquivos...

https://seu-projeto.railway.app/
└── api-comments.php (backend)
```

## 🎯 **Vantagens:**

- ✅ **Frontend grátis** no GitHub Pages
- ✅ **Backend grátis** no Railway
- ✅ **Todos veem** os mesmos comentários
- ✅ **Dados persistentes** em banco SQLite
- ✅ **CORS configurado** para seu domínio
- ✅ **HTTPS** automático

## 🚨 **Importante:**
Após o deploy no Railway, **teste a API** acessando:
`https://seu-projeto.railway.app/api-comments.php`

Deve retornar um JSON com comentários (mesmo que vazio).
