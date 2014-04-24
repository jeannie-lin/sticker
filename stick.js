$(document).ready(function(){
	var fall = function(opts){
		var options = $.extend({
				width : 220,
				vOffset : 15,
				hOffset : 20,
				delay : 0,
				align : 'center',
				container : '#main',
				owner : '.stick',
				adder : '#new',
				deler : '.close',
				nrow : 0,
				ncol : 0,
				conHeight : 0,
				index : 0,
				timer : []
			},opts)

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
			var top = options.vOffset;
			var owner = $(options.owner);
			var nrow = Math.floor(index / options.ncol);

			index %= options.ncol;

			for(var r=0;r<nrow;r++) {
				top += parseInt(owner.eq(r*options.ncol+index).height(),10) +30 + options.vOffset;
			}

			owner = null;
			return top;
		}

		function left(index) {
			var nrow = Math.floor(index / options.ncol);
			return (index - options.ncol * nrow )*(options.width+options.hOffset) + options.hOffset;
		}

		function conHeight() {
			var start = options.nrow * options.ncol;
			var count = options.index % options.ncol + 1;
			var heights = [parseInt($('body').height())-190];
			var owner = $(options.owner);
			var container = $(options.container);
			var current;

			for(var i=0;i<count;i++) {
				current = owner.get(start+i);
				current && heights.push(parseInt(current.style.top)+current.clientHeight + options.vOffset)
			}

			owner = container = current = null;
			return Math.max.apply(null,heights);
		}

		function conWidth() {
			return options.ncol  * (options.width+options.hOffset) + options.hOffset;
		}

		function init() {
			options.ncol = Math.floor($('body').width() / (options.width + options.hOffset));
			options.nrow = 0;
			repaint(0);
		}

		function clearTimer() {
			options.timer.map(function(v,i,arr){
				clearInterval(v);
			})
			options.timer = [];
		}

		function add(idx) {
			$(options.adder).before('<div class="stick"><p class="edit" contenteditable="true"></p><p class="time"></p><div class="close">X</div></div>');
			$(options.owner).eq(idx).css({'background-color':color()}).find('.time').html('--'+date()).end().find(options.deler).click(
				function(){
					var idx = $(this.parentNode).index();
					$(options.owner).eq(idx).remove();
					options.index -= 1;
					$(options.container).hasClass('scroll') ? reset():!$(options.container).hasClass('random') && layout(function(index){return index > idx-1});

				}).end().find('.edit').bind('input',function(){
					var idx = $(this.parentNode).index();
					layout(function(index){
						return index > idx && (idx % options.ncol === index % options.ncol)
					})
					
				});

			options.nrow = Math.floor(idx/options.ncol);
			options.index += 1;
			repaint(idx);
			options.nrow = Math.floor((idx+1)/options.ncol);
			repaint(idx+1);
		}

		function repaint(idx) {
			$(options.owner).eq(idx).css({'top':top(idx)+'px','left':left(idx)+'px'});
			$(options.container).css({height:conHeight()+'px',width:conWidth()+'px'});
		}

		function layout(filter) {
			var filter = filter || function(){return true;}

			options.ncol = Math.floor($('body').width() / (options.width + options.hOffset));
			options.nrow = Math.floor($('#new').index()/options.ncol);

			$(options.owner).filter(filter).each(function(){
				repaint($(this).index());
			})
		}

		function reset() {
			clearTimer()
			$(options.container).removeClass('circle book scroll random rotate');
			$(options.owner).transform('none')
			layout();
		}

		function onRandom() {
			clearTimer()
			$(options.container).addClass('random')
			$(options.owner).each(function(){
				var p = $(this.parentNode);
				$(this).css({left:random(p.width()-$(this).width()-options.hOffset,1),top:random(p.height()-$(this).height()-options.vOffset,1)});
			})
		}

		function rotate() {
			clearTimer()
			$(options.container).addClass('rotate')
			$(options.owner).each(function(){
				$(this).transform('rotate',random(35)+'deg')
			})
		}

		function circle() {
			clearTimer()
			$(options.container).removeClass('book scroll random rotate').addClass('circle');
			$(options.owner).transform('none')
		}

		function book() {
			clearTimer()
			$(options.container).removeClass('circle scroll random rotate').addClass('book');
			$(options.owner).transform('none')
		}

		function scroll() {
			var t;

			if ($(options.container).hasClass('scroll')) {
				return;
			}

			reset();
			$(options.container).addClass('scroll');

			for(var i=0;i<options.ncol;i++) {
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
				idx <= options.index && heights.push(owner.eq(idx).height() + 30 + options.vOffset);
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

				if(top <= options.vOffset) {
					return 0
				}

				for(var i=l;i>=0;i--) {
					val += hs[i] + options.vOffset;
					if (val >= top) {
						return i
					}
				}

				return 0
			}

			function last() {
				var top = parseInt($(options.owner).get(col).style.top);
				var val = 0,l=hs.length-1;

				if(top <= options.vOffset) {
					return l
				}

				for(var i=l;i>=0;i--) {
					val += hs[i] + options.vOffset;
					if (val >= top) {
						return (i < 1) ? l : i-1;
					}
				}

				return l
			}

			function top(top) {
				if (up) {
					return (top > options.vOffset) ? top - hs[f] : h - hs[i] + options.vOffset
				} else {
					return (top + hs[f] < h) ? top + hs[f] : options.vOffset
				}
			}

			for(i=0;i<=options.nrow;i++) {
				idx = col+i*options.ncol;
				if (idx > options.index)
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

		return {
			layout: layout,
			add : add,
			reset: reset,
			rotate : rotate,
			random :onRandom,
			book : book,
			scroll : scroll,
			shake : shake
		}

	}();

	$('#new').click(function(){fall.add($(this).index());});
	$('#rotate').click(fall.rotate);
	$('#reset').click(fall.reset);
	$('#random').click(fall.random);
	$('#shake').click(fall.shake);
	$('#circle').click(fall.circle);
	$('#book').click(fall.book);
	$('#scroll').click(fall.scroll);

	window.onresize = function() {
		fall.layout();
	};
})