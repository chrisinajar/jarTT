// Just loads jarTT

/* First we unload any existing jarTT instances */
var wasLoaded = false;
var oldJarTT = {};
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
console.log(jarTTBaseUrl + "jarTT.main.js");
$.getScript(jarTTBaseUrl + "jarTT.main.js");
$.getScript(jarTTBaseUrl + "jarTT.events.js");
