/*
 * jarTT: A turntable.fm mod. Chris "inajar" Vickery <chrisinajar@gmail.com>
 * javascript:(function(){$.getScript('https://raw.github.com/chrisinajar/jarTT/master/jarTT.js');})();
 *
 * Redistribution and use in source, minified, binary, or any other forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * Neither the name, jarTT, nor the names of its contributors may be 
 *    used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * No disclaimer, just don't be a dick.
 *
 */

// This file is just a big complicated loader.
// The majority of this code is creating an object called jarTTLoad which can take either an 
// object or a string, and a success handler as the second parameter. The object works just like
// the "comp" variable like 10 lines down from here, and the string will just be a dependencyless string value
// that is loaded without any additional checking. Don't do that. I should probably make it private.

var wasLoaded = false;
var oldJarTT = {};
var jarTTLoad = function(){};
(function() {
// These are dependancies. To add a new file, add it here, and list anything that needs to be loaded first (usually just main and events)
var comp = {
	// main jarTT, most of the code is here
	'main': [],
	// Ability to hook onto events along with the basic event driven stuff like idle timers
	'events': ['main'],
	// Avatar related stuff, basically anything that uses identifyDiv
	'avatar': ['main', 'events'],
	// UI shit
	'ui': ['main', 'events'],
	'storage': ['main', 'events', 'ui'],
};


// The following code is hideous, but makes the other code cleaner.
/* First we unload any existing jarTT instances */
if (typeof jarTT != "undefined" && jarTT != null) {
	wasLoaded = true;
	oldJarTT = jarTT;
	jarTT.unload();
	jarTT = null;
} else {
	oldJarTT.settings = {};
}

if (typeof oldJarTT.settings.baseUrl != "string")
	oldJarTT.settings.baseUrl = "https://raw.github.com/chrisinajar/jarTT/master/";
	
jarTTLoad = function(arg1,arg2) {
	if (typeof arg1 == "object")
		jarTTLoad.dependency(arg1, arg2);
	else if (typeof arg1 == "string")
		jarTTLoad.loadScript(arg1, arg2);
};
jarTTLoad.ld = [];
jarTTLoad.cl = [];

jarTTLoad.n = (function(data) {
	if (++data.i == data.s) {
		// We're done
		data.callback();
		return;
	}
	for (tl in data.comp) if ($.inArray(tl, jarTTLoad.ld) == -1) {
		jarTTLoad.l(tl, data);
	}
});

jarTTLoad.l = (function (name, data) {
	if (typeof name != "string")
		return;
	if (!isNaN(name))
		return;
	if ($.inArray(name, jarTTLoad.ld) != -1)
		return;
	if ($.inArray(name, jarTTLoad.cl) != -1)
		return;
	var canGo = true;
	for (r in data.comp[name]) {
		r = data.comp[name][r];
		if ($.inArray(r, jarTTLoad.ld) == -1) {
			jarTTLoad.l(r, data);
			canGo = false;
		}
	}
	if (!canGo)
		return;
	jarTTLoad.cl.push(name);
	jarTTLoad(name, function() {
		jarTTLoad.n(data);
	});
});
jarTTLoad.dependency = (function(c, h) {
	var data = {
		i: 0,
		s: (function() {
			var s = 0;
			for (tl in c) s++;
			return s;
		})(),
		comp: c,
		callback: h
	};
	jarTTLoad.n(data);
});
// Code borrowed and altered from LABjs, http://labjs.com/
// Specifically: https://gist.github.com/603980
// Credit where credit is due.
jarTTLoad.loadScript = (function(name, h) {
	var script = (oldJarTT == null ? jarTT.settings.baseUrl : oldJarTT.settings.baseUrl) + 'jarTT.' + name + '.js';
	var global = window;
	var oDOC = document;
    var head = oDOC.head || oDOC.getElementsByTagName("head");
	
	var handler = function() {
		var exec = "jarTT." + name + ".load()";
		eval(exec);
		jarTTLoad.ld.push(name);
		h();
	};

	// Everything after this is stolen from LABjs, I never checked their license but lets just pretend it's definitely something friendly like GPL
    // loading code borrowed directly from LABjs itself
    setTimeout(function () {
        if ("item" in head) { // check if ref is still a live node list
            if (!head[0]) { // append_to node not yet ready
                setTimeout(arguments.callee, 25);
                return;
            }
            head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
        }
        var scriptElem = oDOC.createElement("script"),
            scriptdone = false;
        scriptElem.onload = scriptElem.onreadystatechange = function () {
            if ((scriptElem.readyState && scriptElem.readyState !== "complete" && scriptElem.readyState !== "loaded") || scriptdone) {
                return false;
            }
            scriptElem.onload = scriptElem.onreadystatechange = null;
            scriptdone = true;
            handler();
        };
        scriptElem.src = script + '?_=' + (new Date()).getTime();
        head.insertBefore(scriptElem, head.firstChild);
    }, 0);

    // required: shim for FF <= 3.5 not having document.readyState
    if (oDOC.readyState == null && oDOC.addEventListener) {
        oDOC.readyState = "loading";
        oDOC.addEventListener("DOMContentLoaded", handler = function () {
            oDOC.removeEventListener("DOMContentLoaded", handler, false);
            oDOC.readyState = "complete";
        }, false);
    }
});
jarTTLoad(comp, function() {
	jarTT.events.dispatchEvent("jarTT_loaded");
});
})();

