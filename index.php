<?php
	require_once('commen.php');

	session_start();
	if(!isset($_SESSION['name'])){
		header("Location: login.php");
	}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Lovely Sticker</title>
	<meta name="keywords" content="Lovely Sticker">
	<meta name="description" content="">
	<link rel="stylesheet" href="css/reset.css">
	<link rel="stylesheet" href="css/commen.css">
	<link rel="stylesheet" href="css/stick.css">
</head>
<body>
<!--[if IE]>
	<div class="suggest">
		<h1>Unsupported!</h1>
		<p>Please use IE10+,Firefox,Chrome,Opera,Safari to use sticker system!</p>
	</div>
<![endif]-->
<!--[if !IE]><!-->
<div class="wrap w">
	<header>
		<ul class="menu justify">
			<li class="bg-pnk op5 mn-sm br50 bd-g2 bs-b2" id="reset">Reset</li>
			<li class="bg-grn op5 mn-lg br50 bd-g2 bs-b2" id="rotate">Rotate</li>
			<li class="bg-ylw op5 mn-md br50 bd-g2 bs-b2" id="random">Random</li>
			<li class="bg-grn op5 mn-lg br50 bd-g2 bs-b2" id="circle">Circle</li>
			<li class="bg-blu op5 mn-sm br50 bd-g2 bs-b2" id="book">Book</li>
			<li class="bg-pnk op5 mn-md br50 bd-g2 bs-b2" id="scroll">Scroll</li>
			<li class="bg-ylw op5 mn-sm br50 bd-g2 bs-b2" id="shake">Shake</li>
		</ul>
	</header>
	<section class="content" id="content">
		<div class="stage" id="stage">
			<div class="container" id="container">
					<!-- stickers -->
			</div>
		</div>
	</section>
	<aside>
		<a href="#">顶部</a>
		<a href="logout.php">注销</a>
	</aside>
	<footer>
		copyright <time datetime="2014.4">2014</time>
	</footer>
</div>
<script src="js/jquery-1.11.0.js"></script>
<script src='js/transform.js'></script>
<script src='js/stick.js'></script>
<!--<![endif]>-->
</body>
</html>