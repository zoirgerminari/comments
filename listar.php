<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Comentários</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, rgb(48, 48, 192), rgb(73, 73, 41));
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .stats {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: center;
            border-left: 4px solid rgb(48, 48, 192);
        }
        .comment {
            border: 1px solid #ddd;
            margin: 15px 0;
            padding: 20px;
            border-radius: 10px;
            background: #fafafa;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .comment:hover {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
            transition: all 0.3s;
        }
        .comment-header {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .name {
            font-weight: bold;
            color: rgb(48, 48, 192);
            font-size: 1.1em;
        }
        .date {
            color: #666;
            font-size: 0.9em;
            float: right;
        }
        .comments-text {
            line-height: 1.6;
            color: #333;
        }
        .btn {
            display: inline-block;
            padding: 12px 25px;
            margin: 10px 5px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: all 0.3s;
        }
        .btn-primary {
            background: linear-gradient(to right, rgb(48, 48, 192), rgb(73, 73, 41));
            color: white;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .no-comments {
            text-align: center;
            padding: 40px;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 Lista de Comentários</h1>
            <a href="form.html" class="btn btn-primary">Adicionar Novo Comentário</a>
        </div>

<?php
<?php
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
    
    // Conta quantos registros existem
    $result = $conexao->query("SELECT COUNT(*) as total FROM comentarios");
    $row = $result->fetchArray();
    $total = $row['total'];
    
    echo "<div class='stats'>";
    echo "<h3>📊 Estatísticas</h3>";
    echo "<p><strong>Total de comentários:</strong> " . $total . "</p>";
    echo "</div>";
    
    if ($total > 0) {
        // Lista todos os dados
        $result = $conexao->query("SELECT * FROM comentarios ORDER BY data DESC");
        
        echo "<h3>💭 Comentários Recentes:</h3>";
        
        while ($row = $result->fetchArray()) {
            echo "<div class='comment'>";
            echo "<div class='comment-header'>";
            echo "<span class='name'>👤 " . htmlspecialchars($row['name']) . "</span>";
            echo "<span class='date'>📅 " . date('d/m/Y H:i', strtotime($row['data'])) . "</span>";
            echo "<div style='clear: both;'></div>";
            echo "</div>";
            echo "<div class='comments-text'>";
            echo "<strong>Comentário:</strong><br>";
            echo nl2br(htmlspecialchars($row['comments']));
            echo "</div>";
            echo "</div>";
        }
    } else {
        echo "<div class='no-comments'>";
        echo "<h3>😔 Nenhum comentário encontrado</h3>";
        echo "<p>Seja o primeiro a deixar um comentário!</p>";
        echo "</div>";
    }
    
    $conexao->close();
    
} catch (Exception $e) {
    echo "<div style='color: red; padding: 20px; border: 1px solid red; border-radius: 5px;'>";
    echo "<strong>Erro na conexão com o banco de dados:</strong><br>";
    echo htmlspecialchars($e->getMessage());
    echo "</div>";
}
?>

    </div>
</body>
</html>