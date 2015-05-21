seajs.config({
	alias : {
		'jquery' : 'lib/jquery.js',
		'bootstrap' : 'lib/bootstrap.js',
		'menu' : 'lib/menu.js',
		'cookie' : 'lib/plugin/jquery.cookie.seajs.js',
		'uploadify':'lib/uploadify/jquery.uploadify.min.js',
		"validation": "second-topic/validation.js"
	},
	base : '/s/js/op'
});  
seajs.use('menu');
seajs.use('bootstrap');
