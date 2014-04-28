$(document).ready(function(){
	var options = {
		timer:null,
	}

	function scroll(idx){
		var len = $('.stick').length;
		var cur = $('.scale').index();
		var nxt = idx || ((cur == len -1) ? 0 : (cur+1))

		$('.stick').removeClass('scale').eq(nxt).addClass('scale');
	}

	options.timer = setInterval(scroll,1500);
	
})