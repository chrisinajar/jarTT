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
 
// modulebrowser
 
jarTT.modulebrowser = {
	load: function() {
	},
	unload: function() {
	},
	showModuleBrowser: function() {
		var box = jarTT.ui.createBox();
		box.append("<h1>jarTT Modules</h1>");
		box.append("<p style='font-size: 14px;'>Browse and install modules to jarTT. These modules will be preserved between sessions</p>");
		box.append("<p style='font-size: 14px;'>This module system is in its infancy. Use at your own risk, and please don't use it while DJing. You might need to F5.</p>");
		var modules = jarTT.modulebrowser.modules,
			mod_ar = [],
			mods_enabled = jarTT.storage.getNamedData('modules');
		mods_enabled=mods_enabled?mods_enabled:[];
		
		for (var mod in modules) {
			if (!modules[mod].options)
				modules[mod].options = {};
			if (modules[mod].options.required) // don't bother showing any of the modules that aren't optional
				continue;
			mod_ar.push(mod);
			var checked = ($.inArray(mod, mods_enabled) != -1);
		}
	}
}
