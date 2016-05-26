<?php
$DBServer = 'mysql-sample';
$DBUser = 'root';
$DBPass = 'username1';
$DBName = 'test';

$db = new mysqli($DBServer, $DBUser, $DBPass, $DBName);

$rs = $db->query('SELECT * FROM posts;');

$data = [];

while ($data[] = $rs->fetch_assoc()) {
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Test App</title>
    </head>
    <body>
        <?php foreach ($data as $row) { ?>
        <?php echo $row['title']; ?><br />
        <?php } ?>
    </body>
</html>
