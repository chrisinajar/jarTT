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

var oldJarTT = {};
var jarTTLoad = function(){};
(function() {

var baseUrl = "https://raw.github.com/cannjeff/jarTT/master/";

if (localStorage.jarTT_devurl)
	baseUrl = localStorage.jarTT_devurl;


/*********************************
 ****** THIRD PARTY MODULES ******
 *********************************/

var modules = {
	'flow': {
		deps: [],
		url: 'https://raw.github.com/chrisinajar/flow-js/master/flow.js',
		options: {
			noload: true
		},
		author: 'chrisinajar',
		version: '1.0.0'
	},
	'bopomatic': {
		deps: [], // doesn't use jarTT api..
		url: 'https://turntablefm-autobop.googlecode.com/svn/trunk/ttfmautobop.js',
		options: {
			noload: true
		},
		author: 'Google',
		version: '1.0.1'
	},
	'socket.io': {
		deps: [],
		url: 'http://chrisinajar.com:64277/socket.io/socket.io.js',
		options: {
			noload: true
		},
		author: null,
		version: null
	},
	'hivemind_raw': {
		deps: ['socket.io', 'ttObjects'],
		url: 'https://raw.github.com/chrisinajar/ttfm-hivemind/master/client.js',
		options: {
			noload: true
		},
		author: null,
		version: null
	},
	'ttObjects': {
		deps: [],
		url: 'https://raw.github.com/ttdevelopers/ttObjects/master/ttObjects.js',
		options: {
			noload: true,
			required: true
		},
		author: null,
		version: null
	},
	// main jarTT, most of the code is here
	'main': {
		deps: ['ttObjects'],
		url: baseUrl+ 'jarTT.main.js',
		options: {
			required: true
		},
		author: null,
		version: null
	},
	// Ability to hook onto events along with the basic event driven stuff like idle timers
	'events': {
		deps: ['main'],
		url: baseUrl+ 'jarTT.events.js',
		options: {
			required: true
		},
		author: null,
		version: null
	},
	// Avatar related stuff, basically anything that uses identifyDiv
	'avatar': {
		deps: ['events'],
		url: baseUrl+ 'jarTT.avatar.js',
		options: {
			required: true
		},
		author: null,
		version: null
	},
	// HTML5 storage
	'storage': {
		deps: ['events'],
		url: baseUrl+ 'jarTT.storage.js',
		options: {
			required: true
		},
		author: null,
		version: null
	},
	// UI shit
	'ui': {
		deps: ['events', 'storage'],
		url: baseUrl+ 'jarTT.ui.js',
		options: {
			required: true
		},
		author: null,
		version: null
	},
	'version': {
		deps: ['ui'],
		url: baseUrl+ 'jarTT.version.js',
		options: {
			required: true
		},
		author: null,
		version: null
	},
	// hivemind realtime communication
	'hivemind': {
		deps: ['ttObjects', 'flow', 'events'],
		url: baseUrl+ 'jarTT.hivemind.js',
		options: {
		},
		author: null,
		version: null
	},
	'modulebrowser': {
		deps: ['version'],
		url: baseUrl+ 'jarTT.modulebrowser.js',
		options: {
			required: true
		},
		author: null,
		version: null
	},
	'testmodule': {
		deps: ['modulebrowser'],
		url: baseUrl+ 'exampleModule.js',
		options: {
			noload: true
		},
		author: 'Frank Smith',
		version: '1.2.3'
	},
	'muteonlame': {
		deps: ['events'],
		url: baseUrl+ 'jarTT.muteonlame.js',
		optione: {
			required: true
		},
		author: 'Pete Jones',
		version: '0.0.1'
	}
	/*
	myplugin: {
		deps: ['events', 'storage'],
		url: https://github.com/chrisinajar/myplugin.js
	},
	 */
};

var autoLoad = [
	'main',
	'events',
	'avatar',
	'ui',
	'storage',
	'version',
	'hivemind',
	'muteonlame',
	'modulebrowser'
];

if (localStorage.jarTT_modules) {
	var module_ar = JSON.parse(localStorage.jarTT_modules);
	autoLoad = autoLoad.concat(module_ar);
}

/*
 * Load  modules like this:
 * 

jarTTLoad.loadScript('http://www.awesomemod.com/test/awesomemod.js', 'awesomemod', function(){
	jarTT.log("That worked!");
});

 * 
 * You'll notice that it doesn't work, try this out though:
 * 

jarTT.settings.debug = true;

 * 
 * There's no need to argue, parents just don't understand.
 */





// This file is just a big complicated loader.
// no longer true --v
// The majority of this code is creating an object called jarTTLoad which can take either an 
// object or a string, and a success handler as the second parameter. The object works just like
// the "comp" variable like 10 lines down from here, and the string will just be a dependencyless string value
// that is loaded without any additional checking. Don't do that. I should probably make it private.

var wasLoaded = false;

// The following code is hideous, but makes the other code cleaner.
/* First we unload any existing jarTT instances */
if (typeof jarTT != "undefined" && jarTT != null) {
	wasLoaded = true;
	oldJarTT = jarTT;
	jarTT.unload();
	jarTT = null;
}

jarTTLoad = function(mod, cb) {
	if (!cb)
		cb = function(){};
	if (mod in modules) {
		jarTTLoad.dependency(mod, cb);
	} else {
		jarTTLoad.loadScript(baseUrl + 'jarTT.' + mod + '.js', mod, cb);
	}
};

jarTTLoad.dependency = (function(c, h) {
	if ($.inArray(c, jarTTLoad.ld) != -1)
		h();
	var module = modules[c];
	var toLoad = []
	for (var i = 0, l = module.deps.length; i<l; ++i) (function(i) {
		if ($.inArray(module.deps[i], jarTTLoad.ld) == -1)
			toLoad.push(module.deps[i]);
	})(i);
	
	var count = toLoad.length;
	var complete = function() {
		jarTTLoad.l(c, h);
	};
	if (count == 0)
		return complete();
	var cur = 0;
	for (var i = 0; i < count; ++i) {
		jarTTLoad.dependency(toLoad[i], function() {
			cur++;
			if (cur == count)
				complete();
		});
	}
});

jarTTLoad.ld = []; // loaded
jarTTLoad.cl = {}; // currently loading

jarTTLoad.l = (function (name, cb, d) {
	if (typeof name != "string")
		return;
	if (!isNaN(name))
		return;
	if ($.inArray(name, jarTTLoad.ld) != -1)
		return cb?cb(d):null;
	
	if (name in jarTTLoad.cl) {
		var oldcb = jarTTLoad.cl[name];
		jarTTLoad.cl[name] = function() {oldcb(); cb(d);};
		return;
	}
	else
		jarTTLoad.cl[name] = function() {cb(d);};
	
	jarTTLoad.loadScript(modules[name].url, name, function() {
		jarTTLoad.cl[name]();
		delete jarTTLoad.cl[name];
	}, modules[name].options);
});
// Code borrowed and altered from LABjs, http://labjs.com/
// Specifically: https://gist.github.com/603980
// Credit where credit is due.
jarTTLoad.loadScript = (function(script, name, h, options) {
	var global = window;
	var oDOC = document;
    var head = oDOC.head || oDOC.getElementsByTagName("head");
	options = options?options:{};
	
	var handler = function() {
		if (!options.noload)
			jarTT[name].load();
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

(function(autoLoad) {
var count = autoLoad.length;
var cur = 0;

for (var i = 0; i < count; ++i) {
	jarTTLoad(autoLoad[i], function() {
		cur++;
		if (cur == count) {
			if (jarTT.modulebrowser)
				jarTT.modulebrowser.modules = modules;
			jarTT.events.dispatchEvent("jarTT_loaded");
		}
	});
};

})(autoLoad);

})();

