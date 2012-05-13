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
 
// Click LAME twice to mute until the next song starts!
 
jarTT.muteonlame = {
	load: function() {
		jarTT.events.registerEvent("error", jarTT.muteonlame.onError);
		jarTT.events.registerEvent("newsong", jarTT.muteonlame.onNewSong);

		// Don't unmute if the user is manually muted
		jarTT.muteonlame.unmutenext = false;
	},
	unload: function() {
		jarTT.events.unregisterEvent("error", jarTT.muteonlame.onError);
		jarTT.events.unregisterEvent("newsong", jarTT.muteonlame.onNewSong);
	},
	onError: function(data) {
		if (jarTT.settings.muteonlame && data.err == "User has already voted down") {
			jarTT.muteonlame.unmutenext = true;
			jarTT.mute();
		}
	},
	onNewSong: function(data) {
		if (jarTT.muteonlame.unmutenext) {
			jarTT.muteonlame.unmutenext = false;
			jarTT.unmute();
		}
	}
}
