<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dbPath = 'C:/xampp/htdocs/Banco de dados html php/formularioz1.db';

try {
    $conexao = new SQLite3($dbPath);
    
    // Criar tabela se não existir
    $createTable = "CREATE TABLE IF NOT EXISTS comentarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        comments TEXT NOT NULL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $conexao->exec($createTable);
    
    // Buscar os comentários mais recentes (máximo 10)
    $result = $conexao->query("SELECT * FROM comentarios ORDER BY data DESC LIMIT 10");
    
    $comments = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $comments[] = [
            'id' => $row['id'],
            'name' => htmlspecialchars($row['name']),
            'comments' => htmlspecialchars($row['comments']),
            'data' => date('d/m/Y H:i', strtotime($row['data']))
        ];
    }
    
    $conexao->close();
    
    echo json_encode([
        'success' => true,
        'comments' => $comments,
        'total' => count($comments)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'comments' => []
    ]);
}
?>
