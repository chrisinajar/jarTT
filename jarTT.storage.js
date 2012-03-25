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
		
		if (!localStorage.jarTT) {
			localStorage.jarTT = {
				settings: {}
			}
		}
	},
	loadSettings: function() {
		if (localStorage.jarTT && localStorage.jarTT.settings) {} else
			return;
		var settings = localStorage.jarTT.settings;
		for (var s in settings) {
			jarTT.settings[s] = settings[s];
		}
	},
	saveSettings: function() {
		localStorage.jarTT.settings = jarTT.settings;
	},
	unload: function() {
		jarTT.storage.saveSettings();
	},
};


