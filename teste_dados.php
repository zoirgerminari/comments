<?php
// Script para testar a inserção de dados

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
    
    echo "<h2>🧪 Teste de Inserção de Dados</h2>";
    
    // Dados de teste
    $testData = [
        ['nome' => 'João Silva', 'comentario' => 'Este é um comentário de teste muito interessante!'],
        ['nome' => 'Maria Santos', 'comentario' => 'Adorei o sistema, muito fácil de usar.'],
        ['nome' => 'Pedro Oliveira', 'comentario' => 'Teste de funcionalidade do banco de dados.']
    ];
    
    $successCount = 0;
    
    foreach ($testData as $data) {
        $stmt = $conexao->prepare("INSERT INTO comentarios (name, comments, data) VALUES (?, ?, datetime('now'))");
        $stmt->bindValue(1, $data['nome'], SQLITE3_TEXT);
        $stmt->bindValue(2, $data['comentario'], SQLITE3_TEXT);
        
        if ($stmt->execute()) {
            echo "✅ Inserido: " . $data['nome'] . "<br>";
            $successCount++;
        } else {
            echo "❌ Erro ao inserir: " . $data['nome'] . "<br>";
        }
    }
    
    echo "<br><strong>Resultado:</strong> $successCount de " . count($testData) . " registros inseridos com sucesso.<br><br>";
    
    // Verificar quantos registros existem agora
    $result = $conexao->query("SELECT COUNT(*) as total FROM comentarios");
    $row = $result->fetchArray();
    echo "<strong>Total de registros no banco:</strong> " . $row['total'] . "<br><br>";
    
    echo "<a href='listar.php' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Ver Lista de Comentários</a> ";
    echo "<a href='form.html' style='background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;'>Adicionar Novo</a>";
    
    $conexao->close();
    
} catch (Exception $e) {
    echo "<div style='color: red; padding: 20px; border: 1px solid red;'>";
    echo "Erro: " . $e->getMessage();
    echo "</div>";
}
?>
