$(document).ready(function(){
	var fall = function(opts){
		var options = $.extend({
				stage : '#stage',
				container : '#container',
				top: 164,
				bottom : 45,

				owner : '.stick',
				width : 220,
				offsetX : 20,
				offsetY : 15,

				nrow : 0,
				ncol : 0,
				count : 0,
				timer : [],

			},opts);


		function date() {
			var time = new Date();
			return time.getFullYear()+'.'+(time.getMonth()+1)+'.'+time.getDate();
		}

		function color() {
			var clrs = ['#EEAAAA','#AAEEAA','#AAAAEE','#FFF3AF'];
			var idx  = Math.round(100*Math.random()%clrs.length);

			return clrs[idx];
		}

		function random(max,pos) {
			var tmp = Math.round((100+max)*Math.random())%(max+1)
			var idx = Math.round(100*Math.random())%2;

			return (pos || idx)? tmp : -tmp;
		}

		function top(index) {
			var index = index || 0;
			var top = options.offsetY;
			var owner = $(options.owner);
			var nrow = Math.floor(index / options.ncol);

			index %= options.ncol;

			for(var r=0;r<nrow;r++) {
				top += owner.get(r*options.ncol+index).clientHeight + options.offsetY;
			}

			owner = null;
			return top;
		}

		function left(index) {
			var nrow = Math.floor(index / options.ncol);
			return (index - options.ncol * nrow )*(options.width+options.offsetX) + options.offsetX;
		}

		function conHeight() {
			var start = options.nrow * options.ncol;
			var count = options.count % options.ncol + 1;
			var heights = [parseInt($('body').height())-options.top - options.bottom];
			var owner = $(options.owner);
			var container = $(options.container);
			var current;

			for(var i=0;i<count;i++) {
				current = owner.get(start+i);
				current && heights.push(parseInt(current.style.top)+current.clientHeight + options.offsetY);
			}

			owner = container = current = null;
			return Math.max.apply(null,heights);
		}

		function conWidth() {
			return options.ncol  * (options.width+options.offsetX) + options.offsetX;
		}

		function bindEvents(){
			$(document).delegate('.circle .stick','click',function(){
				var deg = -360.0/(options.count+1) * $(this).index();
				$('.circle').transform('rotateY',deg + 'deg');

			})

			$(options.container).delegate('#new','click',function(){
				if ($(options.container).hasClass('scroll') ||  $(options.container).hasClass('circle')) {
					return;
				}

				var idx = $(this).index();
				$(this).before('<div class="stick"><p class="display"></p> \
				<p class="date">--'+date()+'</p> \
				<p class="close">X</p></div>');

				$(options.owner).eq(idx).css({'background-color':color()});
				options.nrow = Math.floor(idx/options.ncol);
				options.count += 1;
				repaint(idx);
				options.nrow = Math.floor((idx+1)/options.ncol);
				repaint(idx+1);

			}).delegate('.display','click',function(){
				if ($(options.container).hasClass('scroll') || $(options.container).hasClass('circle')) {
					return;
				}

				var val = $(this).html().replace(/&lt;/g,'<').replace(/&gt;/g,'>');
				$(this).after('<textarea id="edit" class="edit"></textarea>').hide().siblings('#edit').val(val).focus().end()

			}).delegate('.edit','focus',function(){
				$(this).trigger('height');
				if(this.createTextRange) {
					var txt = this.createTextRange();
					txt.moveStart('character',this.value.length);
					txt.select();
				} else {
					this.selectionStart = this.value.length;
				}
			}).delegate('.edit','input',function(){
				$(this).trigger('height');
			}).delegate('.edit','change',function(){
				var p = $(this.parentNode);
				$.ajax({
					url:'update.php',
					type:'post',
					dataType:'json',
					data:{data:$(this).val(),date:date(),id:p.attr('data-id')},
				}).done(function(data){
					p.attr('data-id',data.id);
					$(this).val(data.data).siblings('.date').html('--'+data.date);
				}).fail(function(data){
					alert('failed to set!');
				})

			}).delegate('.edit','blur',function(){
				var val = $(this).val().replace(/</g,'&lt;').replace(/>/g,'&gt;');
				var idx = $(this.parentNode).index();

				$(this).siblings('.display').html(val).show().end().remove();
				!$(options.container).hasClass('random') && layout(function(index){
					return index >= idx && (idx % options.ncol === index % options.ncol);
				})

			}).delegate('.edit','height',function(){
				$(this).height(this.scrollHeight)

			}).delegate('.close','click',function(){
				var p = $(this.parentNode);
				var idx = p.index();

				$.ajax({
					url:'update.php',
					type:'post',
					dataType:'json',
					data:{remove:true,id:p.attr('data-id')},
				}).done(function(data){
					$(options.owner).eq(idx).remove();
					options.count -= 1;
					!$(options.container).hasClass('random') && layout(function(index){return index > idx-1});
					
				}).fail(function(data){
					alert('failed to remove!');
				})
			})
		}

		function insert(data,index){
			var html = '';
			var index = index || 0;

			html += '<div class="stick" data-id="'+data.id+'"><p class="display">'+data.data+'</p> \
						<p class="date">--'+data.date+'</p> \
						<p class="close">X</p></div>'
			$(options.container).append(html);
			$(options.owner).eq(index).css({'background-color':color()});
		}

		function init() {
			$.ajax({
				url:'load.php?',
				type:'get',
				dataType:'json'
			}).done(function(data){
				for(var i=0,l=data.length;i<l;i++){
					insert(data[i],i);
					options.count += 1;
				}

				$(options.container).append('<div class="stick new" id="new"></div>');
				layout();
			}).fail(function(data){
				$(options.container).append('<div class="stick new" id="new"></div>');
				layout();
			})
		}

		function clearTimer() {
			options.timer.map(function(v,i,arr){
				clearInterval(v);
			})
			options.timer = [];
		}

		function repaint(idx) {
			$(options.owner).eq(idx).css({'top':top(idx)+'px','left':left(idx)+'px'});
			$(options.stage).css({height:conHeight()+'px',width:conWidth()+'px'});

			if ($(options.container).hasClass('book')) {
				var col = (idx % options.ncol) % 2;
				$(options.owner).eq(idx).transform('skewY',col == 0 ? '-35deg':'35deg')
			}
		}

		function layout(filter) {
			var filter = filter || function(){return true;}

			options.ncol = Math.floor($('body').width() / (options.width + options.offsetX));
			options.nrow = Math.floor($('#new').index()/options.ncol);

			$(options.owner).filter(filter).each(function(){
				repaint($(this).index());
			})
		}

		function removeCircle() {
			$(options.container).removeClass('circle').transform('translateZ','none').transform('rotateY','none')
		}

		function reset() {
			clearTimer();
			removeCircle();
			$(options.container).removeClass('circle book scroll random')
			$(options.owner).transform('none')
			layout();
		}

		function onRandom() {
			if ($('.circle').length) {
				reset()
			} else {
				clearTimer();
				removeCircle();
				$(options.container).removeClass('book scroll')
			}
			$(options.container).addClass('random')
			$(options.owner).transform('skewY','none').each(function(){
				var p = $(options.stage);
				$(this).css({
					left:random(p.width()-$(this).width()-options.offsetX,1),
					top:random(p.height()-$(this).height()-options.offsetY,1)
				});
			})
		}

		function rotate() {
			if ($('.circle').length) {
				reset()
			} else {
				clearTimer();
				removeCircle();
				$(options.container).removeClass('book scroll')
			}
			
			$(options.owner).transform('skewY','none').each(function(){
				$(this).transform('rotate',random(32)+'deg')
			})
		}

		function circle() {
			var deg = 360.0/(options.count+1);
			var tra,scl,w;

			w = $(document).width();
			tra = (options.width)/2/Math.tan(deg/360 * Math.PI);
			tra >0 && (scl=w/3.5/(tra)) || (tra = 0,scl=1.5);
			scl > 1.6 && (scl = 1.5)
			tra = tra * scl + 30;

			clearTimer();
			$(options.stage).css({height:0,width:w});
			$(options.container).removeClass('book scroll random').addClass('circle');
			$(options.owner).css({top:'0',left:'0'}).transform('none').each(function(){
				var idx = $(this).index();
				$(this).transform('rotateY',idx*deg + 'deg')}).transform('scale',scl+'',scl+'').transform('translateZ',tra + 'px')
		}

		function book() {
			reset();
			$(options.container).addClass('book').find(options.owner).each(function(){
				var col = ($(this).index() % options.ncol) % 2;
				$(this).transform('skewY',col == 0 ? '-35deg':'35deg')
			});

		}

		function scroll() {
			var t;

			if ($(options.container).hasClass('scroll')) {
				return;
			}

			reset();
			$(options.container).addClass('scroll');

			for(var i=0;i<options.ncol;i++) {
				if (i >= options.count - 1)
					break;

				t = setInterval(function(i,up) {
					return function() {
						slide(i,up)
					}
				}(i,random(1,1)), 2500+random(1000));

				options.timer.push(t);
			}
		}

		function heights(col) {
			var heights = [];
			var owner = $(options.owner);
			var idx;

			for(var i=0;i<=options.nrow;i++) {
				idx = i*options.ncol+col;
				idx <= options.count && heights.push(owner.eq(idx).height() + 30 + options.offsetY);
			}

			return heights;
		}

		function slide(col,up) {
			var idx;
			var owner = $(options.owner);
			var hs = heights(col);
			var h = hs.reduce(function(pre,cur){return pre+cur;});
			var f = up ? first() : last();

			function first() {
				var top = parseInt($(options.owner).get(col).style.top);
				var val = 0,l=hs.length-1;

				if(top <= options.offsetY) {
					return 0
				}

				for(var i=l;i>=0;i--) {
					val += hs[i] + options.offsetY;
					if (val >= top) {
						return i
					}
				}

				return 0
			}

			function last() {
				var top = parseInt($(options.owner).get(col).style.top);
				var val = 0,l=hs.length-1;

				if(top <= options.offsetY) {
					return l
				}

				for(var i=l;i>=0;i--) {
					val += hs[i] + options.offsetY;
					if (val >= top) {
						return (i < 1) ? l : i-1;
					}
				}

				return l
			}

			function top(top) {
				if (up) {
					return (top > options.offsetY) ? top - hs[f] : h - hs[i] + options.offsetY
				} else {
					return (top + hs[f] < h) ? top + hs[f] : options.offsetY
				}
			}

			for(i=0;i<=options.nrow;i++) {
				idx = col+i*options.ncol;
				if (idx > options.count)
					break

				owner.eq(idx).css({'top':top(parseInt(owner.get(idx).style.top))});
			}

			owner = hs = h = idx = f = null;
		}

		function shake() {
			$(options.owner).each(function(){
				var idx = $(this).index()%5;
				var cnt = 0;

				for(var i=0;i<30;i++) {
					setTimeout(function(){
						$(this).transform('translate3d',random(50)+'px',random(50)+'px','0')
					}.bind(this),i*50)
				}

				setTimeout(function(){
					$(this).transform('translate3d','0','0','0')
				}.bind(this),30*50)
			})
		}

		init();
		bindEvents();

		return {
			layout: layout,
			reset: reset,
			rotate : rotate,
			random :onRandom,
			book : book,
			scroll : scroll,
			circle : circle,
			shake : shake
		}

	}();

	$('#rotate').click(fall.rotate);
	$('#reset').click(fall.reset);
	$('#random').click(fall.random);
	$('#shake').click(fall.shake);
	$('#circle').click(fall.circle);
	$('#book').click(fall.book);
	$('#scroll').click(fall.scroll);

	window.onresize = function() {
		if (!$('#container').hasClass('circle')) {
			fall.layout();
		} else {
			fall.circle();
		}
			
	};
})