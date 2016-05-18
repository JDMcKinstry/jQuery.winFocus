/*	winFocus()	*/
;(function() {
	var callBacks = { blur: [], focus: [], blurFocus: [] },
		hidden = "hidden"
	
	function winFocus() {
		var args = Array.prototype.slice.call(arguments, 0)
			init = true, initMethods = [], methods = []
		
		for (var x in args) {
			switch (typeof args[x]) {
				case 'boolean':
					init: args[x];
					break;
				case 'function':
					methods.push(args[x]);
					break;
				case 'object':
					if (args[x].hasOwnProperty('init')) init = args[x]["init"];
					if (args[x]["blur"]) {
						callBacks.blur.push(args[x]["blur"]);
						if (init) initMethods.push(args[x]["blur"]);
					}
					if (args[x]["focus"]) {
						callBacks.focus.push(args[x]["focus"]);
						if (init) initMethods.push(args[x]["focus"]);
					}
					if (args[x]["blurFocus"]) {
						callBacks.blurFocus.push(args[x]["blurFocus"]);
						if (init) initMethods.push(args[x]["blurFocus"]);
					}
					break;
			}
		}
		
		if (methods && methods.length) {
			if (init) initMethods.concat(methods);
			switch (methods.length) {
				case 1:
					callBacks.blurFocus.push(methods[0]);
					break;
				case 2:
					callBacks.blur.push(methods[0]);
					callBacks.focus.push(methods[1]);
					break;
				default:
					for (var x in methods) {
						switch (x%3) {
							case 0:
								callBacks.blur.push(methods[x]);
								break;
							case 1:
								callBacks.focus.push(methods[x]);
								break;
							case 2:
								callBacks.blurFocus.push(methods[x]);
								break;
						}
					}
			}
		}
		
		if (init && initMethods.length) for (var x in initMethods) initMethods[x].apply(window, [{ hidden: document[hidden] }]);
	}
	
	function onChange(e) {
		var eMap = { focus: false, focusin: false, pageshow: false, blur: true, focusout: true, pagehide: true };
		e = e || window.event;
		if (e) {
			e.hidden = e.type in eMap ? eMap[e.type] : document[hidden];
			window.visible = !e.hidden;
			exeCB(e);
		}
		else {
			try { onChange.call(document, new Event('visibilitychange')); }
			catch(err) {  }
		}
	}
	
	function exeCB(e) {
		if (e.hidden && callBacks.blur.length) for (var x in callBacks.blur) callBacks.blur[x].apply(window, [e]);
		if (!e.hidden && callBacks.focus.length) for (var x in callBacks.focus) callBacks.focus[x].apply(window, [e]);
		if (callBacks.blurFocus.length) for (var x in callBacks.blurFocus) callBacks.blurFocus[x].apply(window, [e, !e.hidden]);
	}
	
	function initWinFocus() {
		if (console && console['log']) console.log('Initializing winFocus()');
		//	Standard initialization
		if (hidden in document)	//	IE10 | FF20+
			document.addEventListener("visibilitychange", onChange);
		else if ((hidden = "mozHidden") in document)	//	Older FF Versions (?)
			document.addEventListener("mozvisibilitychange", onChange);
		else if ((hidden = "webkitHidden") in document)	//	Chrome
			document.addEventListener("webkitvisibilitychange", onChange);
		else if ((hidden = "msHidden") in document)	//	IE 4-6
			document.addEventListener("msvisibilitychange", onChange);
		else if ((hidden = "onfocusin") in document)	//	IE7-9
			document.onfocusin = document.onfocusout = onChange;
		else	//	All others:
			window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onChange;
	}
	
	winFocus.clear = function(what) {
		if (what && callBacks[what]) callBacks[what] = [];
		else if (void 0 == what || what == 'all') for (var x in callBacks) callBacks[x] = [];
		return callBacks;
	}
	
	winFocus.getCallBacks = function(what) {
		if (what && callBacks[what]) return callBacks[what];
		return callBacks;
	}
	
	if (document.readyState == "complete") initWinFocus();
	window.onload = initWinFocus;
	
	//	add as window variable
	window.hasOwnProperty("winFocus")||(window.winFocus=winFocus);
	
	
	//	add as a jQuery extension
	try {
		if (window.hasOwnProperty('jQuery') && jQuery) {
			jQuery.winFocus || (jQuery.extend({
				winFocus: function() {
					var args = Array.prototype.slice.call(arguments, 0);
					
					if (args[0] && /^clear/i.test(args[0])) return winFocus.clear.apply(jQuery);
					if (args[0] && /^callbacks$/i.test(args[0])) {
						args = Array.prototype.slice.call(arguments, 1);
						return winFocus.getCallBacks.apply(window, args);
					}
					
					return winFocus.apply(window, args);
				}
			}))
		}
	}
	catch (err) {}
})();
