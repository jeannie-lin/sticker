<?php
	require_once('commen.php');
	session_start();

	if(isset($_SESSION['name'])){
		$tb = $_SESSION['name'];
		$id = isset($_POST['id']) ? $_POST['id'] : '';
		$rm = isset($_POST['remove']) ? true : false;
		$sql = new MySql();

		if ($rm && $id) {
			$sql->delete($tb,"id=$id");
			$sql->close();
			echo "{}";
		} else if(!$rm) {
			$dt = $_POST['data'];
			$tm = $_POST['date'];
			if ($id){
				$sql->update($tb,"data='$dt',date='$tm'","id=$id");
			} else {
				$id = $sql->insert($tb,"data,date","'$dt','$tm'");
			}

			$row = $sql->select($tb,"id,data,date","id=$id");
			echo json_encode($row[0]);
		} else
			echo '{}';
	} 
?>