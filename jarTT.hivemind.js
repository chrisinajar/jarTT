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
 
// hivemind library loader

jarTT.hivemind = {
	io: {
		socket: null,
		ttfm: null
	},
	load: function() {
		jarTT.events.registerEvent("jarTT_unloaded", jarTT.hivemind.unload);
		flow.exec(
			function() {
				jarTT.hivemind.io.ttfm = io;
				jarTTLoad.loadScript('http://chrisinajar.com:64277/socket.io/socket.io.js', 'socket.io', this, {noload:true});
			}, function() {
				jarTT.hivemind.io.socket = io;
				jarTTLoad.loadScript('https://raw.github.com/chrisinajar/ttfm-hivemind/master/client.js', 'hivemind_raw', this, {noload:true});
			}, function() {
				hivemind.debug = true;
				io = window.io = jarTT.hivemind.io.ttfm;
			}
		);
	},
	unload: function() {
	}
};


