jQuery.winFocus
===================
This cross-browser solution will better help you make callbacks whenever a Browser Window (Current Tab)  loses or gains focus. It also seeks to tackle such issues as: duplicate calls, delaying trigger on page load, and Browser Window losing focus due to selection of another App (such as opening Calculator).

----------

#Example Uses

**Most Basic Use:**

	//	isVisible param in callback is TRUE or FALSE based on whether the Browser Window(Current Tab) has focus
	$.winFocus(function(event, isVisible) {
		console.log("Combo\t\t", isVisible);
	});
	
**Delay Start:**

	//	passing `false` through will cause the callback to wait until first `blur`
	$.winFocus(function(event, isVisible) {
		console.log("Combo\t\t", isVisible);
	}, false);

**Using 2 Callbacks**

When using 2 callbacks, the first becomes *lost focus*, whereas the second becomes *gained focus*

	$.winFocus(function(event) {
		console.log("Blur\t\t", event);
	},
	function(event) {
		console.log("Focus\t\t", event);
	});

**Object Callbacks:**

Callbacks ***blur***, ***focus***, and ***blurFocus*** can be passed in an object. All 3 can be passed at once, if you desire such, but `blurFocus` is the only one with a *isVisible* parameter.

	$.winFocus({
		//	will only fire when current tab loses focus
		blur: function(event) {
			console.log("Blur");
		},
		//	will only fire when current tab gains focus
		focus: function(event) {
			console.log("Focus");
		},
		//	will fire whenever current tab's focus changes
		blurFocus: function(event, isVisible) {
			console.log("Combo\t\t", isVisible);
		}
	});
	
