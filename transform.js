(function($,context){
	$.fn.transform = function(name) {
		var pre = ['-webkit-','-moz-','-o-',''];
		var val = name + '(' + Array.prototype.slice.call(arguments,1).join(',')+')';

		return $(this).each(function(){
			var old = this.style.transform || this.style.webkitTransform || this.style.mozTransform || this.style.oTransform || '';
			var css = {},i,l;
			var fnd = false;
			
			if ( name === 'none' ) {
				for(i=0,l=pre.length;i<l;i++) {
					css[pre[i]+'transform'] = 'none';
				}

				$(this).css(css);
				return $(this);
			}

			old = old.split(') ').map(function(v,i,a) {return (i==a.length-1) ? v : v+')'});
			for(i=0,l=old.length;i<l;i++) {
				if (old[i].indexOf(name+'(') != -1) {
					old[i] = val;
					fnd = true;
					break;
				}
			}

			if (!fnd) {
				old.push(val)
			}

			for(i=0,l=pre.length;i<l;i++) {
				css[pre[i]+'transform'] = old.join(' ');
			}

			$(this).css(css);
			return $(this);
		})
	}

}(jQuery,this))