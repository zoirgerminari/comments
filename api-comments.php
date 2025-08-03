<?php
// Simple API for comments system
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://zoirgerminari.github.io');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database path (Railway will create this automatically)
$dbPath = __DIR__ . '/comentarios.db';

try {
    // Create/connect to database
    $db = new SQLite3($dbPath);
    
    // Create table if not exists
    $db->exec("CREATE TABLE IF NOT EXISTS comentarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        comments TEXT NOT NULL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle POST requests (save comment)
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        // Fallback to $_POST if JSON decode fails
        if (!$data) {
            $data = $_POST;
        }
        
        $name = isset($data['name']) ? trim($data['name']) : '';
        $comments = isset($data['comments']) ? trim($data['comments']) : '';
        
        if (empty($name) || empty($comments)) {
            echo json_encode(['success' => false, 'message' => 'Nome e comentário são obrigatórios']);
            exit();
        }
        
        // Insert comment
        $stmt = $db->prepare("INSERT INTO comentarios (name, comments, data) VALUES (?, ?, datetime('now'))");
        $stmt->bindValue(1, $name, SQLITE3_TEXT);
        $stmt->bindValue(2, $comments, SQLITE3_TEXT);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Comentário salvo com sucesso!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao salvar comentário']);
        }
        
    } else {
        // Handle GET requests (fetch comments)
        $result = $db->query("SELECT * FROM comentarios ORDER BY data DESC LIMIT 20");
        $comments = [];
        
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $comments[] = [
                'id' => $row['id'],
                'name' => htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'),
                'comments' => htmlspecialchars($row['comments'], ENT_QUOTES, 'UTF-8'),
                'data' => date('d/m/Y H:i', strtotime($row['data']))
            ];
        }
        
        echo json_encode([
            'success' => true,
            'comments' => $comments,
            'total' => count($comments)
        ]);
    }
    
    $db->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage(),
        'comments' => []
    ]);
}
?>
