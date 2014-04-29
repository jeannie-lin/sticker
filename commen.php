<?php

	function timestamp(){
		$tm = time();
		$_SESSION['timestamp'] = $tm;
		return md5($tm);
	}

	function duplicate(){
		if(isset($_SESSION['timestamp']) && isset($_POST['timestamp']) && md5($_SESSION['timestamp']) == $_POST['timestamp']) {
			$_SESSION['timestamp'] = '';
			return false;
		}
		return true;
	}

	function valid($str,$min=4,$max=30,$wrd = 1) {
		$reg = $wrd ? "/^\w{4,30}$/" : "/^.{4,30}$/";
		return preg_match($reg, $str);
	}

	function search($name){
		$name = addslashes($name);
		$sql = new mySql();
		$row = $sql->select("user","name,password","name='$name'");
		$sql->close();
		return $row ? $row[0] : [];
	}

	class MySql {
		private $host;
		private $db;
		private $usr;
		private $pwd;
		private $con;

		function __construct($host='localhost',$db='stick',$usr='stick',$pwd='123456'){
			$this->host = $host;
			$this->db = $db;
			$this->usr = $usr;
			$this->pwd = $pwd;
			$this->connect();
		}

		function connect(){
			$this->con = mysql_connect($this->host,$this->usr,$this->pwd);
			if(!mysql_select_db($this->db,$this->con)){
				$this->error("Invalid database:",$this->db);
			}
			mysql_query("SET NAMES 'utf-8'");
		}

		function close(){
			mysql_close($this->con);
		}

		function query($sql){
			if(!$sql){
				$this->error("Invalid query:","Query string is null!");
			}
			$res = mysql_query($sql,$this->con);
			if(!$res) {
				$this->error("Error query:",$sql);
			}

			return $res;
		}

		function create($tb,$val){
			$this->query("create table if not exists $tb($val)");
		}

		function select($tb,$col="*",$condition='',$limit=''){
			$out = array();
			$condition = $condition ? ' Where '.$condition : null;
			$res = $this->query("select $col from $tb $condition $limit");
			while($row = mysql_fetch_array($res,MYSQL_ASSOC)){
				array_push($out, $row);
			}
			return $out;
		}

		function insert($tb,$col,$val){
			$this->query("insert into $tb ($col) values($val)");
			return mysql_insert_id();
		}

		function update($tb,$mod,$condition){
			if($this->query("update $tb set $mod where $condition")){

			}
		}

		function delete($tb,$condition){
			$this->query("delete from $tb where $condition");
		}

		function count($tb,$col,$condition){

		}

		function error($key,$val){
			echo $key;
			echo $val;
		}
	}
?>