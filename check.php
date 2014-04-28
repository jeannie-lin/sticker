<?php
	require_once('commen.php');
	session_start();

	function insert($name,$password){
		$name = addslashes($password);
		$password = $password ? md5($password) : '';

		$sql = new mySql();
		$row = $sql->insert("user","name,password","'$name','$password'");
		$sql->create($name,"id int primary key auto_increment,data text,date char(10)");
		$sql->close();
		return $row;
	}

	function login($name,$password) {
		$out = array('name'=>'','password'=>'','match'=>false);
		if(!valid($name,4,30)) {
			$out['name'] = "4-30 charactors:a-z,A-Z,-,0-9!";
		} else if(!valid($password,4,30,0)) {
			$out['password'] = "4-30 charactors!";
		} else {
			$password = $password ? md5($password) : '';
			$row = search($name,$password);
			if (!$row){
				$out['name'] = "Can not find user $name!";
			} else if($row['password'] == $password) {
				$out['match'] = true;
			} else {
				$out['password'] = "Password unmatched!";
			}
		}
		return $out;
	}

	function regist($name,$password) {
		$out = array('name'=>'','password'=>'','match'=>false);

		if(!valid($name,4,30)) {
			$out['name'] = "4-30 charactors:a-z,A-Z,-,0-9!";
		} else if(search($name)){
			$out['name'] = "User $name already existed!";
		} else if(!valid($password,4,30,0)) {
			$out['password'] = "4-30 charactors!";
		} else {
			insert($name,$password);
			$out['match'] = true;
		}

		return $out;
	}

	if (isset($_POST['key'])) {
		$key = $_POST['key'];

		if(isset($_POST['submit'])){
			$name = $_POST['name'];
			$password = $_POST['password'];
			$out = ($key == 'login') ? login($name,$password) : regist($name,$password);
			if ($out['match']) {
				$_SESSION['name'] = $name;
			}

			echo json_encode($out);
		} else {
			$log = ($key == 'login') ? 1 : 0;
			$flag = isset($_POST['password']) ? 1 : 0;
			$name =  $_POST['name'];
			$password = $flag ? $_POST['password'] : '';
			$out = array('value'=>'');

			if ($log && !$flag) {
				if(!valid($name,4,30)) {
					$out['value'] = "4-30 charactors:a-z,A-Z,-,0-9!";
				} else if(!search($name)){
					$out['value'] = "Can not find user $name!";
				}

			} else if ($log && $flag) {
				if(!valid($password,4,30,0)) {
					$out['value'] = '4-30 charactors!';
				} else {
					$row = search($name);
					$password = $password ? md5($password) : '';
					if($row && $row['password'] != $password) {
						$out['value'] = "Password unmatched!";
					}
				}

			} else if (!$log && !$flag) {
				if(!valid($name,4,30)) {
					$out['value'] = "4-30 charactors:a-z,A-Z,-,0-9!";
				} else if(search($name)){
					$out['value'] = "User $name already existed!";
				}

			} else if (!$log && $flag && !valid($password,4,30,0)) {
				$out['value'] = '4-30 charactors!';
			}
			echo  json_encode($out);
		}
	} else {
		echo '{match:true}';
	}
?>