<?php
/**
 * Configuração para diferentes ambientes de hospedagem
 */

// Detectar ambiente
function detectEnvironment() {
    // Se estiver em localhost (XAMPP)
    if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false || 
        strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false) {
        return 'local';
    }
    
    // Se estiver em ambiente online
    return 'online';
}

// Configurações por ambiente
function getConfig() {
    $env = detectEnvironment();
    
    $config = [
        'local' => [
            'db_path' => 'C:/xampp/htdocs/Banco de dados html php/comentarios.db',
            'base_url' => 'http://localhost/Banco%20de%20dados%20html%20php/',
            'debug' => true
        ],
        'online' => [
            'db_path' => __DIR__ . '/comentarios.db',
            'base_url' => 'https://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/',
            'debug' => false
        ]
    ];
    
    return $config[$env];
}

// Função para criar conexão com o banco
function createConnection() {
    $config = getConfig();
    
    try {
        $conexao = new SQLite3($config['db_path']);
        
        // Criar tabela se não existir
        $createTable = "CREATE TABLE IF NOT EXISTS comentarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            comments TEXT NOT NULL,
            data DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        $conexao->exec($createTable);
        
        return $conexao;
    } catch (Exception $e) {
        if ($config['debug']) {
            throw $e;
        } else {
            throw new Exception('Erro na conexão com o banco de dados');
        }
    }
}

// Função para salvar comentário
function saveComment($name, $comment) {
    try {
        $conexao = createConnection();
        
        $stmt = $conexao->prepare("INSERT INTO comentarios (name, comments, data) VALUES (?, ?, datetime('now'))");
        $stmt->bindValue(1, trim($name), SQLITE3_TEXT);
        $stmt->bindValue(2, trim($comment), SQLITE3_TEXT);
        
        $result = $stmt->execute();
        $conexao->close();
        
        return $result !== false;
    } catch (Exception $e) {
        return false;
    }
}

// Função para buscar comentários
function getComments($limit = 20) {
    try {
        $conexao = createConnection();
        
        $result = $conexao->query("SELECT * FROM comentarios ORDER BY data DESC LIMIT " . (int)$limit);
        $comments = [];
        
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $comments[] = $row;
        }
        
        $conexao->close();
        return $comments;
    } catch (Exception $e) {
        return [];
    }
}
?>
