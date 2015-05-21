define(function(require, exports, module) {
	var $ = require('jquery');
	var cookie = require('cookie');
	$(document).ready(function(){
		$('.sidebar li.collapse a').unbind('click').click(function(e){
			e.preventDefault();
			var href = $(this).attr('href');
			cookie.cookie('leftMenuFocus', href);
			window.location = href;
		});
		var pathname = window.location.pathname;
		var leftMenus = $('.sidebar li.collapse a');
		var selected = false;
		$.each(leftMenus, function(index, el) {
			var link = $(el).attr('href');
			if (link && (link == window.location.href || link.substring(link.indexOf(".com/") + 1) == pathname)) {
				var id = $(el).parents('li.collapse').attr('id');
				$('a.accordion-toggle[href="#'+id+'"]').click();
				$(el).addClass('active');
				selected = true;
				return false;
			}
		});
		var href = cookie.cookie('leftMenuFocus');
		if (!selected && href) {
			var el = $('.sidebar li.collapse a[href="'+ href +'"]');
			if(el.length>0){
				var id =  el.parents('li.collapse').attr('id');
				$('a.accordion-toggle[href="#'+id+'"]').click();
				el.addClass('active');
			}
		}
	});
});