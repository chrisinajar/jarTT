// Just loads jarTT


/* First we unload any existing jarTT instances */
var wasLoaded = false;
var oldJarTT = {};
(function() {
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
else
	jarTTBaseUrl = "https://raw.github.com/chrisinajar/jarTT/master/";

var ld = [];
var l = function(){};
var n = function(){};
var i = 0;
var s = 1;
for (tl in comp) s++;
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
	$.getScript(jarTTBaseUrl + 'jarTT.' + name + '.js', function() {
		//n();
		setTimeout(n, 500);
	});
}
n();
})();

