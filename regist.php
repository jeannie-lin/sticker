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
<!--[if IE]>
	<div class="suggest">
		<h1>Unsupported!</h1>
		<p>Please use IE10+,Firefox,Chrome,Opera,Safari to use sticker system!</p>
	</div>
<![endif]-->
<!--[if !IE]><!-->
	<div class="wrap w">
		<header>
			<h1>Lovely Sticker</h1>
			<div class="logo-bg">
				<span class="stick ibk bg-pnk op5 mn-sm br50 bs-b2 scale">S</span>
				<span class="stick ibk bg-grn op5 mn-sm br50 bs-b2">t</span>
				<span class="stick ibk bg-ylw op5 mn-sm br50 bs-b2">i</span>
				<span class="stick ibk bg-blu op5 mn-sm br50 bs-b2">c</span>
				<span class="stick ibk bg-grn op5 mn-sm br50 bs-b2">k</span>
				<span class="stick ibk bg-ylw op5 mn-sm br50 bs-b2">e</span>
				<span class="stick ibk bg-pnk op5 mn-sm br50 bs-b2">r</span>
			</div>
		</header>
		<section class="content" id="content">
			<fieldset>
				<label class="label" for="username">Username:</label>
				<input class="text" id="username" name="username" type="text" maxlength="30" autofocus>
				<span class="tip ibk w tr fs14" id="nm-tip">5-30 characters:a-z,A-Z,-,0-9!</span>
				<label class="label" for="password">Password:</label>
				<input class="text" id="password" name="password" type="password" maxlength="30">
				<span class="tip ibk w tr fs14 op0" id="pwd-tip">5-30 characters!</span>
				<span class="ibk w tr fs0">
					<input class="btn" id="regist" name="regist" type="button" value="Regist">
					<input class="btn" id="cancel" name="cancel" type="button" value="Cancel" onclick="location.href='login.php';">
				</span>
			</fieldset>
		</section>
		<footer>
			copyright <time datetime="2014.4">2014</time>
		</footer>
	</div>
<script src="/min/?b=sticker/js&f=jquery-1.11.0.js,regist.js"></script>
<!--script src="js/jquery-1.11.0.js"></script>
<script src="js/regist.js"></script-->
<!--<!--[endif]>-->
</body>
</html>