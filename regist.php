<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Lovely Sticker</title>
	<meta name="keywords" content="Lovely Sticker">
	<meta name="description" content="">
	<link rel="stylesheet" href="css/reset.css">
	<link rel="stylesheet" href="css/commen.css">
	<link rel="stylesheet" href="css/login.css">
</head>
<body>
	<div class="wrap w">
		<header>
			<h1>Lovely Sticker</h1>
			<div class="logo-bg">
				<span class="stick ibk bg-pnk op-5 mn-sm br50 bs-b2 scale">S</span>
				<span class="stick ibk bg-grn op-5 mn-sm br50 bs-b2">t</span>
				<span class="stick ibk bg-ylw op-5 mn-sm br50 bs-b2">i</span>
				<span class="stick ibk bg-blu op-5 mn-sm br50 bs-b2">c</span>
				<span class="stick ibk bg-grn op-5 mn-sm br50 bs-b2">k</span>
				<span class="stick ibk bg-ylw op-5 mn-sm br50 bs-b2">e</span>
				<span class="stick ibk bg-pnk op-5 mn-sm br50 bs-b2">r</span>
			</div>
		</header>
		<section class="content" id="content">
			<!--form id="regist" name="regist" action="regist.php" method="post"-->
				<fieldset>
					<label class="label" for="username">Username:</label>
					<input class="text" id="username" name="username" type="text" autofocus>
					<span class="tip" id="nm-tip">4-30 charecters:a-z,A-Z,-,0-9!</span>
					<label class="label" for="password">Password :</label>
					<input class="text" id="password" name="password" type="password">
					<span class="tip" id="pwd-tip">4-30 charecters!</span>
					<span class="btns">
						<input class="btn" id="regist" name="regist" type="button" value="Regist">
						<input class="btn" id="cancel" name="cancel" type="button" value="Cancel" onclick="location.href='login.php';">
					</span>
				</fieldset>
			<!--/form-->
		</section>
		<footer>
			copyright <time datetime="2014.4">2014</time>
		</footer>
	</div>
<script src="js/jquery-1.11.0.js"></script>
<script src="js/login.js"></script>
<script>
	$('#content').delegate('#username','change',function(){
		$.ajax({
			url:'check.php',
			type : 'post',
			dataType : 'json',
			data:{
					'key':'regist',
					'name':$('#username').val()
				}
		}).done(function(data){
			if(data.value){
				$('#nm-tip').html(data.value).css('color','red');
				$('#pwd-tip').css('opacity','0');
			} else {
				$('#nm-tip').html('Valid name').css('color','green');
				$('#pwd-tip').css('opacity','1');
			}
		}).fail(function(data){
			alert('Can not check data from ajax!');
		})
	}).delegate('#password','change',function(){
		$.ajax({
			url:'check.php',
			type : 'post',
			dataType : 'json',
			data:{
					'key':'login',
					'name':$('#username').val(),
					'password':$('#password').val()
				}
		}).done(function(data){
			if(data.value){
				$('#pwd-tip').html(data.value).css('color','red');
			} else {
				$('#pwd-tip').html('');
			}
		}).fail(function(data){
			alert('Can not check data from ajax!');
		})
	}).delegate('#regist','click',function(){
		$.ajax({
			url:'check.php',
			type : 'post',
			dataType : 'json',
			data:{'submit':true,
					'key':'regist',
					'name':$('#username').val(),
					'password':$('#password').val()
				}
		}).done(function(data){
			if(data.match){
				location.href = 'index.php';
			} else {
				if(data.name){
					$('#nm-tip').html(data.name).css('color','red');
					$('#pwd-tip').css('opacity','0');
				} else {
					$('#nm-tip').html('Valid name').css('color','green');
					$('#pwd-tip').css('opacity','1');
				}
				if(data.password) {
					$('#pwd-tip').html(data.password).css('color','red');
				} else {
					$('#pwd-tip').html('Valid password').css('color','green');
				}
			}
		}).fail(function(data){
			alert('Can not check data from ajax!');
		})
	});
</script>
</body>
</html>