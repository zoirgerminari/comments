# 🌐 Sistema de Comentários - Versão Para Servidor PHP

## 📋 Arquivos para Upload

### 📄 **Arquivos Principais:**
- `index-online.php` - Página principal do sistema
- `config-online.php` - Configurações automáticas
- `.htaccess` - Configurações do servidor (opcional)

### 🗄️ **Banco de Dados:**
- `comentarios.db` - Será criado automaticamente

## 🌐 **Hospedagens PHP Gratuitas Recomendadas:**

### 1. **000webhost.com**
- ✅ PHP + SQLite
- ✅ 1GB de espaço
- ✅ SSL gratuito
- 📝 **Cadastro:** Gratuito com email

### 2. **InfinityFree.net**
- ✅ PHP + SQLite  
- ✅ 5GB de espaço
- ✅ SSL gratuito
- 📝 **Cadastro:** Gratuito com email

### 3. **Heroku** (mais avançado)
- ✅ PHP suportado
- ✅ SSL automático
- ❗ Requer adaptação para PostgreSQL

## 🚀 **Como Fazer Upload:**

### **Opção A: 000webhost**
1. Acesse [000webhost.com](https://000webhost.com)
2. Crie conta gratuita
3. Crie um site
4. Vá em "File Manager"
5. Upload dos arquivos para pasta `public_html`
6. Acesse: `https://seusite.000webhostapp.com/index-online.php`

### **Opção B: InfinityFree**
1. Acesse [infinityfree.net](https://infinityfree.net)
2. Crie conta gratuita
3. Crie hosting account
4. Use File Manager ou FTP
5. Upload para pasta `htdocs`
6. Acesse: `https://seusite.infinityfreeapp.com/index-online.php`

## 📁 **Estrutura de Upload:**
```
public_html/ (ou htdocs/)
├── index-online.php
├── config-online.php
├── .htaccess (opcional)
└── comentarios.db (criado automaticamente)
```

## ⚙️ **Configurações Automáticas:**

O sistema detecta automaticamente se está:
- 🏠 **Local (XAMPP):** Usa caminho local
- 🌐 **Online:** Usa caminho relativo

## 🔧 **Funcionalidades:**

- ✅ **Detecção automática** de ambiente
- ✅ **Banco SQLite** criado automaticamente
- ✅ **Design responsivo**
- ✅ **Comentários compartilhados** entre todos os usuários
- ✅ **Proteção XSS** com htmlspecialchars
- ✅ **URLs limpas** após envio

## 🎯 **Teste Local:**
Antes de fazer upload, teste em:
`http://localhost/Banco%20de%20dados%20html%20php/index-online.php`

## 📝 **Dicas:**
- Renomeie `index-online.php` para `index.php` no servidor
- O banco `comentarios.db` tem permissões de escrita automáticas
- Todos os usuários verão os mesmos comentários
- Sistema funciona sem configuração adicional
