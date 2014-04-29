$(document).ready(function(){
	$('#content').delegate('.text','keydown',function(ev){
		if(ev.keyCode == 13) {
			ev.preventDefault();
			$('#regist').click();
		}
	}).delegate('#username','change',function(){
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
})