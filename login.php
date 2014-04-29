<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Lovely Sticker</title>
	<meta name="keywords" content="Lovely Sticker">
	<meta name="description" content="">
	<link rel="stylesheet" href="/min/?b=sticker/css&f=reset.css,commen.css,login.css">
	<!--link rel="stylesheet" href="css/reset.css">
	<link rel="stylesheet" href="css/commen.css">
	<link rel="stylesheet" href="css/login.css"-->
</head>
<body>
	<div class="wrap w">
		<header>
			<h1>Lovely Sticker</h1>
			<div class="logo-bg">
				<span class="stick ibk bg-pnk op5 mn-sm br50">S</span>
				<span class="stick ibk bg-grn op5 mn-sm br50">t</span>
				<span class="stick ibk bg-ylw op5 mn-sm br50">i</span>
				<span class="stick ibk bg-blu op5 mn-sm br50">c</span>
				<span class="stick ibk bg-grn op5 mn-sm br50">k</span>
				<span class="stick ibk bg-ylw op5 mn-sm br50">e</span>
				<span class="stick ibk bg-pnk op5 mn-sm br50">r</span>
			</div>
		</header>
		<section class="content" id="content">
			<fieldset>
				<label class="label" for="username">Username:</label>
				<input class="text" id="username" name="username" type="text" maxlength="30" placeholder="any" autofocus>
				<span class="tip ibk w tr fs14" id="nm-tip">4-30 charecters:a-z,A-Z,-,0-9!</span>
				<label class="label" for="password">Password:</label>
				<input class="text" id="password" name="password" type="password" maxlength="30">
				<span class="tip  ibk w tr fs14 op0" id="pwd-tip">4-30 charecters!</span>
				<span class="ibk w tr fs0">
					<input class="btn" id="login" name="login" type="button" value="Login">
					<input class="btn" id="regist" name="regist" type="button" value="Regist" onclick="location.href='regist.php'">
				</span>
			</fieldset>
		</section>
		<footer>
			copyright <time datetime="2014.4">2014</time>
		</footer>
	</div>
<script src="/min/?b=sticker/js&f=jquery-1.11.0.js,login.js"></script>
<!--script src="js/jquery-1.11.0.js"></script>
<script src="js/login.js"></script-->
<script>
	
</script>
</body>
</html>