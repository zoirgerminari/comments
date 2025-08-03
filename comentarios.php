<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Comentários</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-image: linear-gradient(to right, rgb(48, 48, 192), rgb(73, 73, 41));
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            display: flex;
            gap: 30px;
            max-width: 1200px;
            margin: 0 auto;
            align-items: flex-start;
            justify-content: center;
            min-height: calc(100vh - 40px);
        }
        .box {
            background-color: rgba(13, 4, 78, 0.6);
            padding: 25px;
            border-radius: 15px;
            width: 400px;
            color: white;
            margin-top: 50px;
        }
        .comments-section {
            background-color: rgba(13, 4, 78, 0.6);
            padding: 25px;
            border-radius: 15px;
            width: 500px;
            color: white;
            margin-top: 50px;
            max-height: 600px;
            overflow-y: auto;
        }
        fieldset {
            border: 3px solid dodgerblue;
        }
        legend {
            border: 1px solid dodgerblue;
            padding: 10px;
            text-align: center;
            background-color: rgb(9, 38, 66);
            border-radius: 5px;
        }
        .inputBox {
            position: relative;
        }
        .inputUser {
            background: none;
            border: none;
            border-bottom: 1px solid white;
            outline: none;
            color: aliceblue;
            font-size: 15px;
            width: 100%;
            letter-spacing: 2px;
        }
        .labelInput {
            position: absolute;
            top: 0px;
            left: 0px;
            pointer-events: none;
            transition: .5s;
        }
        .inputUser:focus ~ .labelInput,
        .inputUser:valid ~ .labelInput {
            top: -20px;
            font-size: 12px;
            color: rgb(22, 77, 205);
        }
        #submit {
            background-image: linear-gradient(to right, rgb(48, 48, 192), rgb(73, 73, 41));
            width: 100%;
            border: none;
            padding: 15px;
            border-radius: 10px;
            color: aliceblue;
            font-size: 15px;
            cursor: pointer;
        }
        #submit:hover {
            background-image: linear-gradient(to right, rgb(65, 65, 155), rgb(116, 116, 44));
        }
        .comment-item {
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin: 15px 0;
            padding: 15px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .comment-name {
            font-weight: bold;
            color: rgb(22, 77, 205);
            margin-bottom: 8px;
        }
        .comment-text {
            margin-bottom: 8px;
            line-height: 1.4;
            color: white;
        }
        .comment-date {
            font-size: 0.85em;
            color: rgba(255, 255, 255, 0.7);
        }
        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 10px 15px;
            border-radius: 5px;
            margin-bottom: 15px;
            border: 1px solid #c3e6cb;
            text-align: center;
            display: none;
        }
        h3 {
            text-align: center;
            margin-bottom: 20px;
            color: white;
        }
        @media (max-width: 768px) {
            .container {
                flex-direction: column;
                align-items: center;
            }
            .box, .comments-section {
                width: 90%;
                max-width: 400px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Formulário de Comentários -->
        <div class="box">
            <div id="success-message" class="success-message">
                ✅ Comentário enviado com sucesso!
            </div>
            
            <form id="commentForm">
                <fieldset>
                    <legend><b>Adicionar Comentário</b></legend>
                    <br>
                    <div class="inputBox">
                        <input type="text" name="name" id="name" class="inputUser" required>
                        <label for="name" class="labelInput">Nome</label>
                    </div>
                    <br><br>
                    <div class="inputBox">
                        <input type="text" name="comments" id="comments" class="inputUser" required>
                        <label for="comments" class="labelInput">Comentário</label>
                    </div>
                    <br><br>
                    <input type="submit" name="submit" id="submit" value="Enviar Comentário">
                </fieldset>
            </form>
        </div>

        <!-- Lista de Comentários -->
        <div class="comments-section">
            <h3>💬 Comentários</h3>
            <div id="comments-container">
                <!-- Os comentários serão carregados aqui -->
            </div>
        </div>
    </div>

    <?php
    // Configuração do banco de dados
    $dbPath = 'C:/xampp/htdocs/Banco de dados html php/comentarios.db';

    // Processar formulário se foi enviado
    if ($_POST) {
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
            
            if (isset($_POST['name']) && isset($_POST['comments'])) {
                $name = trim($_POST['name']);
                $comments = trim($_POST['comments']);
                
                if (!empty($name) && !empty($comments)) {
                    $stmt = $conexao->prepare("INSERT INTO comentarios (name, comments, data) VALUES (?, ?, datetime('now'))");
                    $stmt->bindValue(1, $name, SQLITE3_TEXT);
                    $stmt->bindValue(2, $comments, SQLITE3_TEXT);
                    
                    if ($stmt->execute()) {
                        echo "<script>
                            document.addEventListener('DOMContentLoaded', function() {
                                document.getElementById('success-message').style.display = 'block';
                                setTimeout(function() {
                                    document.getElementById('success-message').style.display = 'none';
                                }, 3000);
                            });
                        </script>";
                    }
                }
            }
            $conexao->close();
        } catch (Exception $e) {
            echo "<script>alert('Erro: " . $e->getMessage() . "');</script>";
        }
    }

    // Carregar comentários para exibição
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
        
        $result = $conexao->query("SELECT * FROM comentarios ORDER BY data DESC LIMIT 10");
        $comments = [];
        
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $comments[] = $row;
        }
        $conexao->close();
        
    } catch (Exception $e) {
        $comments = [];
    }
    ?>

    <script>
        // Dados dos comentários do PHP
        const comments = <?php echo json_encode($comments); ?>;
        
        // Função para exibir comentários
        function displayComments() {
            const container = document.getElementById('comments-container');
            
            if (comments.length > 0) {
                container.innerHTML = comments.map(comment => `
                    <div class="comment-item">
                        <div class="comment-name">👤 ${comment.name}</div>
                        <div class="comment-text">${comment.comments}</div>
                        <div class="comment-date">📅 ${new Date(comment.data).toLocaleString('pt-BR')}</div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.7); padding: 40px;">😔 Nenhum comentário ainda</div>';
            }
        }
        
        // Carregar comentários quando a página carregar
        document.addEventListener('DOMContentLoaded', displayComments);
        
        // Processar formulário via AJAX para não recarregar a página
        document.getElementById('commentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(window.location.href, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                // Recarregar a página para mostrar o novo comentário
                window.location.reload();
            })
            .catch(error => {
                alert('Erro ao enviar comentário');
            });
        });
    </script>
</body>
</html>
