<?php
	require_once('commen.php');
	session_start();

	if(isset($_SESSION['name'])){
		$usr = $_SESSION['name'];
		//if(isset($_GET['page'])){
			//$limit = isset($_GET['count']) ? (int)$_GET['limit'] : 10;
			//$start = (int)($_GET['page']);
			//$end = $start + $limit;
			$sql = new MySql();
			$row = $sql->select($usr,"id,data,date");
			$sql->close();
			echo json_encode($row);
		/*} else if(isset($_GET['count'])) {
			$sql = new MySql();
			$row = $sql->select($usr,"count(*)");
			$cnt = count($row);
			$sql->close();
			echo "{count:$cnt}";
		} else
			echo "{}";*/
	}
?>