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
 
// storage, anything involving HTML5 storage or whatever else i mutate this into.

jarTT.storage = {
	load: function() {
		jarTT.events.registerEvent("jarTT_unloaded", jarTT.storage.unload);
		jarTT.storage.loadSettings();
	},
	getData: function() {
		return JSON.parse(localStorage.jarTT);
	},
	setData: function(d) {
		localStorage.jarTT = JSON.stringify(d);
	},
	getNamedData: function(name) {
		if (!localStorage["jarTT_"+name])
			return;
		
		if (name == "version") {
			if (localStorage["jarTT_"+name].toString().length > 5)
				localStorage["jarTT_"+name] = "1.4.0";
			return localStorage["jarTT_"+name];
		}
		return JSON.parse(localStorage["jarTT_"+name]);
		
	},
	setNamedData: function(name, d) {
		try {
			if (name == "version") {
				return localStorage["jarTT_"+name] = d;
			}
			localStorage["jarTT_"+name] = JSON.stringify(d);
		} catch (e) {
			//console.log(d);
			//console.log(localStorage["jarTT_"+name]);
			//console.log(JSON.stringify(d));
		}
	},
	/*
	getNamedData: function(name) {
		var d = jarTT.storage.getData();
		if (!d)
			return;
		return d[name];
	},
	setNamedData: function(name, val) {
		var d = jarTT.storage.getData();
		if (!d)
			return;
		d[name] = val;
		jarTT.storage.setData(d);
		return d[name];
	},
	*/
	loadSettings: function() {
		var settings = jarTT.storage.getNamedData('settings');
		if (settings) {} else
			return;

		for (var s in settings) {
			jarTT.settings[s] = settings[s];
		}
	},
	saveSettings: function() {
		jarTT.storage.setNamedData('settings', jarTT.settings);
	},
	unload: function() {
		jarTT.storage.saveSettings();
	},
};


