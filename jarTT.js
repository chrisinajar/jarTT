// Just loads jarTT


/* First we unload any existing jarTT instances */
var wasLoaded = false;
var oldJarTT = {};
$(function() {
// These are dependancies. To add a new file, add it here, and list anything that needs to be loaded first (usually just main)
var comp = {
	'events': ['main'],
	'avatar': ['main', 'events'],
	'main': [],
};
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
var l = function(){};
var n = function(){};
var dl = function(){};
var i = 0;
var s = 1;
for (tl in comp) s++;
// Code borrowed and altered from LABjs, http://labjs.com/
// Specifically: https://gist.github.com/603980
// Credit where credit is due.
dl = (function (script, handler) {
	var global = window;
	var oDOC = document;
    var head = oDOC.head || oDOC.getElementsByTagName("head");

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
})
n = function() {
	i++;
	if (i == s) {
		// We're done
		jarTT.events.dispatchEvent("jarTT_loaded");
		return;
	}
	for (tl in comp) if ($.inArray(tl, ld) == -1) {
		l(tl);
	}
}
l = function(name) {
	if (!isNaN(name))
		return;
	if ($.inArray(name, ld) != -1)
		return;
	var canGo = true;
	for (r in comp[name]) {
		r = comp[name][r];
		if (isNaN(r) && $.inArray(r, ld) == -1) {
			l(r);
			canGo = false;
		}
	}
	if (!canGo)
		return;
	ld.push(name);
	//console.log("loading " + name);
	dl(jarTTBaseUrl + 'jarTT.' + name + '.js', n);
}
n();
});

