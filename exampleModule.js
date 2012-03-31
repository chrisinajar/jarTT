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
 
// Example!
// myplugin
 
jarTT.myplugin = {
	load: function() {
		/*
		 * You'll want to hook into evets, do it like this!
		 * 
		 * jarTT.events.registerEvent("newsong", jarTT.myplugin.onNewSong);
		 * 
		 */
	},
	unload: function() {
		/*
		 * Unload your damn event listeners. Eventually this will be handled automatically.
		 * 
		 * jarTT.events.registerEvent("newsong", jarTT.myplugin.onNewSong);
		 * 
		 */
	},
	onNewSong: function(data) {
		/*
		 * Derp!
		 * And don't use console.log, use jarTT.log, it only shows up if debug=true in settings :)
		 * 
		 */
	}
}
