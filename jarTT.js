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

// Just loads jarTT

/* First we unload any existing jarTT instances */
var wasLoaded = false;
var oldJarTT = {};
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
};


// The following code is hideous, but makes the other code cleaner.
if (typeof jarTT != "undefined" && jarTT != null) {
	wasLoaded = true;
	oldJarTT = jarTT;
	jarTT.unload();
	jarTT = null;
}

var jarTTBaseUrl = null;
if (wasLoaded && typeof oldJarTT.settings.baseUrl != "undefined")
	jarTTBaseUrl = oldJarTT.settings.baseUrl;
else {
	jarTTBaseUrl = "https://raw.github.com/chrisinajar/jarTT/master/";
}

var ld = [];
var cl = [];
var l = function(){};
var n = function(){};
var dl = function(){};
var i = 0;
var s = 1;
for (tl in comp) s++;
n = (function() {
	i++;
	if (i == s) {
		// We're done
		jarTT.events.dispatchEvent("jarTT_loaded");
		return;
	}
	for (tl in comp) if ($.inArray(tl, ld) == -1) {
		l(tl, n);
	}
});
// Code borrowed and altered from LABjs, http://labjs.com/
// Specifically: https://gist.github.com/603980
// Credit where credit is due.
l = (function (name) {
	if (!isNaN(name))
		return;
	if ($.inArray(name, ld) != -1)
		return;
	if ($.inArray(name, cl) != -1)
		return;
	var canGo = true;
	for (r in comp[name]) {
		r = comp[name][r];
		if ($.inArray(r, ld) == -1) {
			l(r);
			canGo = false;
		}
	}
	if (!canGo)
		return;
	cl.push(name);
	var script = jarTTBaseUrl + 'jarTT.' + name + '.js';
	var global = window;
	var oDOC = document;
    var head = oDOC.head || oDOC.getElementsByTagName("head");
	
	var handler = function() {
		var exec = "jarTT." + name + ".load()";
		eval(exec);
		ld.push(name);
		n();
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
        scriptElem.src = script;
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
n();
})();

