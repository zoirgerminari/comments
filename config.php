<?$dbPath = 'C:/xampp/htdocs/Banco de dados html php/formularioz1.db';hp

$dbPath = 'C:/ZoirLap/Zoir/INFORMATICA/Visual studio code/Banco de dados html php/formulaioz1.db';

$conexao = new SQLite3($dbPath);

if ($conexao) {
    echo "conexao sucesso";
} else {
    echo "Erro na conexão";
}
?>