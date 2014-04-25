(function($,context){
	$.fn.transform = function(name) {
		var pre = ['-webkit-','-moz-','-o-','-ms-',''];
		var val = name + '(' + Array.prototype.slice.call(arguments,1).join(',');
		var css = {},i,l;

		if (name === 'none') {
			for(i=0,l=pre.length;i<l;i++) {
				css[pre[i]+'transform'] = 'none';
			}

			$(this).css(css);
			return $(this);
		}

		return $(this).each(function(){
			var old = this.style.transform || this.style.webkitTransform || this.style.mozTransform || this.style.oTransform || '';
			var fnd = false;

			old = (old ==='none') ? []: old.slice(0,-1).split(')').filter(function(v,i,a){return !!v;});
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
				css[pre[i]+'transform'] = old.join(')') + ')';
			}

			$(this).css(css);
			return $(this);
		})
	}

}(jQuery,this))