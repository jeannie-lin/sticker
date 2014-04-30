$(document).ready(function(){
	var sticker = function(opts){
		var options = $.extend({
				container : $('#container'),
				top: 168,
				bottom : 45,

				selecter : '.stick',
				width : 220,
				offsetX : 20,
				offsetY : 15,
			},opts,{
				nrow : 0,
				ncol : 0,
				count : 0,
				timer : []
			});


		function date() {
			var time = new Date();
			return time.getFullYear()+'.'+(time.getMonth()+1)+'.'+time.getDate();
		}

		function random(max,pos) {
			var tmp = Math.round((10+max)*Math.random())%(max+1)
			var idx = Math.round(10*Math.random())%2;

			return (pos || idx)? tmp : -tmp;
		}

		function top(idx) {
			var idx = idx || 0;
			var top = 0;
			var els = $(options.selecter);
			var row = Math.floor(idx / options.ncol);

			idx %= options.ncol;

			for(var r=0;r<row;r++) {
				top += els.get(r*options.ncol+idx).clientHeight + options.offsetY;
			}

			els = null;
			return top;
		}

		function left(idx) {
			var row = Math.floor(idx / options.ncol);
			return (idx - options.ncol * row )*(options.width+options.offsetX);
		}

		function height() {
			var start = options.nrow * options.ncol;
			var count = options.count % options.ncol + 1;
			var hts = [parseInt($('body').height())-options.top - options.bottom];
			var els = $(options.selecter);
			var cur;

			for(var i=0;i<count;i++) {
				cur = els.get(start+i);
				cur && hts.push(parseInt(cur.style.top)+cur.clientHeight + options.offsetY);
			}

			els = cur = null;
			return Math.max.apply(null,hts);
		}

		function width() {
			return options.ncol * options.width + (options.ncol-1)*options.offsetX;
		}

		/* Slide any column up/down */
		function heights(col) {
			var hts = [];
			var els = $(options.selecter);
			var idx,cur;

			for(var i=0;i<=options.nrow;i++) {
				idx = i*options.ncol+col;
				cur = els.get(idx);
				idx < options.count && (cur = els.get(idx),cur && hts.push(cur.clientHeight+options.offsetY));
			}

			els = idx = cur = null;
			return hts;
		}

		function slide(col,hts,up) {
			var idx;
			var els = $(options.selecter);
			var h = hts.reduce(function(pre,cur){return pre+cur;});
			var f = up ? first() : last();

			function first() {
				var top = parseInt($(options.selecter).get(col).style.top);
				var val = 0,l=hts.length-1;

				if(top <= 0) {
					return 0
				}

				for(var i=l;i>=0;i--) {
					val += hts[i];
					if (val >= top) {
						return i
					}
				}

				return 0
			}

			function last() {
				var top = parseInt($(options.selecter).get(col).style.top);
				var val = 0,l=hts.length-1;

				if(top <= 0) {
					return l
				}

				for(var i=l;i>=0;i--) {
					val += hts[i];
					if (val >= top) {
						return (i < 1) ? l : i-1;
					}
				}

				return l
			}

			function top(top) {
				if (up) {
					return (top > 0) ? top - hts[f] : h - hts[i];
				} else {
					return (top + hts[f] < h) ? top + hts[f] : 0;
				}
			}

			for(i=0;i<=options.nrow;i++) {
				idx = col+i*options.ncol;
				if (idx > options.count)
					break

				els.eq(idx).css({'top':top(parseInt(els.get(idx).style.top))});
			}

			els = hts = h = idx = f = null;
		}

		function insert(data){
			var html = '';

			html += '<div class="stick bg'+random(3,1)+'" data-id="'+data.id+'"><p class="display">'+data.data+'</p> \
						<p class="date">--'+data.date+'</p> \
						<p class="close">X</p></div>'
			options.container.find('#new').before(html);
		}

		function repaint(idx) {
			$(options.selecter).eq(idx).css({'top':top(idx)+'px','left':left(idx)+'px'});
			options.container.css({height:height()+'px',width:width()+'px'});

			if (options.container.hasClass('book')) {
				var col = (idx % options.ncol) % 2;
				$(options.selecter).eq(idx).transform('skewY',col == 0 ? '-35deg':'35deg')
			}
		}

		function onLayout(filter) {
			var filter = filter || function(){return true;}

			options.ncol = Math.floor($('body').width() / (options.width + options.offsetX));
			options.nrow = Math.floor($('#new').index()/options.ncol);

			$(options.selecter).filter(filter).each(function(){
				repaint($(this).index());
			})
		}

		function onReset() {
			unScroll();
			options.container.removeClass('circle book scroll random').transform('none').find(options.selecter).transform('none');
			onLayout();
		}

		function onRandom() {
			if (options.container.hasClass('circle')) {
				onReset()
			} else {
				unScroll();
				options.container.removeClass('book scroll')
			}
			$(options.container).addClass('random')
			$(options.selecter).transform('skewY','none').each(function(){
				$(this).css({
					left:random(options.container.width()-this.clientWidth,1),
					top:random(options.container.height()-this.clientHeight,1)
				});
			})
		}

		function onRotate() {
			if (options.container.hasClass('circle')) {
				onReset()
			} else {
				unScroll();
				options.container.removeClass('book scroll')
			}
			
			$(options.selecter).transform('skewY','none').each(function(){
				$(this).transform('rotate',random(32)+'deg')
			})
		}

		function onCircle() {
			var deg = 360.0/options.count;
			var tra,scl;

			unScroll();
			tra = (options.width)/2/Math.tan(deg/360 * Math.PI);
			tra >0 && (scl=$('body').width()/3.5/(tra)) || (tra = 0,scl=1.5);
			scl > 1 && (scl = 1)
			tra = tra * scl + 20;

			options.container.removeClass('book scroll random').addClass('circle').css({
				height:'0',
				width:'220px'
			}).find(options.selecter).css({
				top:'0',
				left:'0'
			}).transform('none').each(function(){
				var idx = $(this).index();
				$(this).transform('rotateY',idx*deg + 'deg')}).transform('scale',scl+'',scl+'').transform('translateZ',tra + 'px')
		}

		function onBook() {
			onReset();
			options.container.addClass('book').find(options.selecter).each(function(){
				var col = ($(this).index() % options.ncol) % 2;
				$(this).transform('skewY',col == 0 ? '-35deg':'35deg')
			});

		}

		function unScroll() {
			options.timer.map(function(v,i,arr){
				clearInterval(v);
			})
			options.timer = [];
		}

		function onScroll() {
			var t,hts;

			if (options.container.hasClass('scroll')) {
				return;
			}

			onReset();
			options.container.addClass('scroll');

			for(var i=0;i<options.ncol;i++) {
				if (i >= options.count - 1)
					break;

				hts = heights(i);
				t = setInterval(function(i,hts,up) {
					return function() {
						slide(i,hts,up)
					}
				}(i,hts,random(1,1)), 2500+random(1000));

				options.timer.push(t);
			}
		}

		function onShake() {
			$(options.selecter).each(function(){
				var idx = $(this).index()%5;
				var cnt = 0;

				for(var i=0;i<30;i++) {
					setTimeout(function(){
						$(this).transform('translate3d',random(50)+'px',random(50)+'px','0')
					}.bind(this),i*80)
				}

				setTimeout(function(){
					$(this).transform('translate3d','0','0','0')
				}.bind(this),30*80)
			})
		}

		function bindEvents(){
			$(window).on('resize',function(){
				if (!options.container.hasClass('circle')) {
					onLayout();
				} else {
					onCircle();
				}
			});
			options.container.delegate('.stick','click',function(){
				if(options.container.hasClass('circle')){
					var deg = -360.0/options.count * $(this).index();
					options.container.transform('rotateY',deg + 'deg');
				}
			}).delegate('#new','click',function(){
				var idx = $(this).index();
				$(this).before('<div class="stick bg'+random(3,1)+'"><p class="display"></p> \
				<p class="date">--'+date()+'</p> \
				<p class="close">X</p></div>');

				options.nrow = Math.floor(idx/options.ncol);
				options.count += 1;
				repaint(idx);
				options.nrow = Math.floor((idx+1)/options.ncol);
				repaint(idx+1);

			}).delegate('.display','click',function(){
				if (options.container.hasClass('scroll') || options.container.hasClass('circle')) {
					return;
				}

				var val = $(this).html().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
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
					data:{data:$(this).val().replace(/</g,'&lt;').replace(/>/g,'&gt;'),date:date(),id:p.attr('data-id')},
				}).done(function(data){
					p.attr('data-id',data.id);
					$(this).val(data.data).siblings('.date').html('--'+data.date);
				}).fail(function(data){
					//alert('failed to update data!');
				})

			}).delegate('.edit','blur',function(){
				var val = $(this).val().replace(/</g,'&lt;').replace(/>/g,'&gt;');
				var idx = $(this.parentNode).index();

				$(this).siblings('.display').html(val).show().end().remove();
				!options.container.hasClass('random') && onLayout(function(index){
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

				}).fail(function(data){
					//alert('failed to delete data!');
				}).always(function(data){
					$(options.selecter).eq(idx).remove();
					options.count -= 1;
					!options.container.hasClass('random') && onLayout(function(index){return index > idx-1});
				})
			})
		}

		function init() {
			options.container.append('<div class="stick new" id="new"></div>');
			onLayout();

			$.ajax({
				url:'load.php',
				type:'get',
				dataType:'json'
			}).done(function(data){
				for(var i=0,l=data.length;i<l;i++){
					insert(data[i],i);
					options.count += 1;
				}

				onLayout();
			}).fail(function(xhr,status,error){

			})
		}

		init();
		bindEvents();

		return {
			reset: onReset,
			rotate : onRotate,
			random :onRandom,
			book : onBook,
			scroll : onScroll,
			circle : onCircle,
			shake : onShake
		}

	};

	$.fn.sticker = function(opts,ctrls){
		var s = sticker($.extend({
			selecter:'.stick',
			width:220,
			offsetX:15,
			offsetY:15
		},{
			container:this
		}));
		var ctrls = $.extend({
			reset:'',
			rotate:'',
			random:'',
			circle:'',
			scroll:'',
			book:'',
			shake:''
		},ctrls);

		ctrls.reset && $(ctrls.reset).click(s.reset);
		ctrls.rotate && $(ctrls.rotate).click(s.rotate);
		ctrls.random && $(ctrls.random).click(s.random);
		ctrls.circle && $(ctrls.circle).click(s.circle);
		ctrls.scroll && $(ctrls.scroll).click(s.scroll);
		ctrls.book && $(ctrls.book).click(s.book);
		ctrls.shake && $(ctrls.shake).click(s.shake);

		return this;
	}

	$('#container').sticker({
		selecter:'.stick',
		width:220,
		offsetX:15,
		offsetY:15
	},{
		reset:'#reset',
		rotate:'#rotate',
		random:'#random',
		circle:'#circle',
		scroll:'#scroll',
		book:'#book',
		shake:'#shake'
	})
})