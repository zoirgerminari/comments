<?php
// Configuração do banco de dados
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
    
    // Verificar se o formulário foi enviado
    if ($_POST && isset($_POST['name']) && isset($_POST['comments'])) {
        $name = trim($_POST['name']);
        $comments = trim($_POST['comments']);
        
        if (!empty($name) && !empty($comments)) {
            // Preparar e executar a query de inserção
            $stmt = $conexao->prepare("INSERT INTO comentarios (name, comments, data) VALUES (?, ?, datetime('now'))");
            $stmt->bindValue(1, $name, SQLITE3_TEXT);
            $stmt->bindValue(2, $comments, SQLITE3_TEXT);
            
            if ($stmt->execute()) {
                // Redirecionar de volta para o formulário com sucesso
                header('Location: form.html?success=1');
                exit();
            } else {
                $message = "Erro ao salvar comentário.";
                $messageType = "error";
            }
        } else {
            $message = "Por favor, preencha todos os campos.";
            $messageType = "error";
        }
    }
    
    $conexao->close();
    
} catch (Exception $e) {
    $message = "Erro na conexão com o banco de dados: " . $e->getMessage();
    $messageType = "error";
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultado</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, rgb(48, 48, 192), rgb(73, 73, 41));
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .message {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .buttons {
            text-align: center;
            margin-top: 20px;
        }
        .btn {
            display: inline-block;
            padding: 12px 25px;
            margin: 0 10px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: all 0.3s;
        }
        .btn-primary {
            background: linear-gradient(to right, rgb(48, 48, 192), rgb(73, 73, 41));
            color: white;
        }
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Resultado do Envio</h2>
        
        <?php if (isset($message)): ?>
            <div class="message <?php echo $messageType; ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        
        <div class="buttons">
            <a href="form.html" class="btn btn-primary">Novo Comentário</a>
            <a href="listar.php" class="btn btn-secondary">Ver Comentários</a>
        </div>
    </div>
</body>
</html>
