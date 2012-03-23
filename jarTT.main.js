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

// Core jarTT, all deobfuscation, all interfaces to turntable code, all convenience functions that do not rely on a sub-module

var jarTT = {
	settings: {
		'loaded': false,
		'hideAudience': false,
		'fixAnimations': false,
		'autoBop': false,
		'smiffTime': false,
		'lastSmiffTime': false,
		'debug': false,
		'idleLimit': 300,
		'avatarTest': ['4e42c21b4fe7d02e6107b1ff', '4e2376eca3f751213d006700']
	},
	log: function(){
		
	},
	findProp: {
		original: CSS3Helpers.findProperty,
		optimized: function(a,b){
			if(b=="transform" && (typeof $(a).attr('id') == "undefined"))
				return;
			return jarTT.findProp.original(a,b);
		}
	},
	roomDiv: {},
	timerId: {},
	idleSigns: [null,null,null,null,null],
	ticking: false,
	tickFunction: function(jarTT) {
		if (jarTT.ticking || !jarTT.settings.loaded)
			return;
		jarTT.ticking = true;

		jarTT.events.dispatchEvent("jarTT_tick");
		// idle timer
		var djs = jarTT.localContext.djIds;
		var a=function(id,i) {
			jarTT.getUserInfo(id, function(user) {
				var idle = user.getIdle();
				var idleText = Math.floor(idle/60000) + ':' + Math.floor(idle/1000)%60;
				if ((idleText.length - idleText.indexOf(':')) == 2)
					idleText = idleText.substr(0,idleText.length-1) + '0' + idleText.substr(-1);
				var div = jarTT.idleSigns[i];
				if (idle > (jarTT.settings.idleLimit * 1000)) {
					if (div == null) {
						div = $("<div />", {
							id: 'jarTT_timer' + i,
							'class': 'jarTT jarTT_timerDiv ui-corner-all',
							css: {
								opacity: 0.7,
								width: '40px',
								height: '15px',
								border: '4px solid #150f0f',
								backgroundColor: '#ccc',
								fontWeight: 'bold',
								position: 'absolute',
								top: '103px',
								zIndex: '400', //fuck the spotlight
								left: (85*(i+1)-15)+'px',
								textAlign: 'center',
								fontSize: '12px'
							},
							text: idleText
						}).appendTo(jarTT.roomDiv);
						jarTT.idleSigns[i] = div;
					} else {
						if (div.text() != idleText) {
							div.show();
							div.text(idleText);
						}
					}
				} else {
					if (div != null)
						div.hide();
				}
			});
		}
		for (var j = 0, l = djs.length; j < l; ++j) {
			var i = j
			var id = (djs[i]);
			a(id,i);
		}
		jarTT.ticking = false;
	},
	load: function() {
		if (oldJarTT && 'settings' in oldJarTT) for (var i in oldJarTT.settings) {
			jarTT.settings[i] = oldJarTT.settings[i];
		}

		if (typeof oldJarTT.userCache != "undefined")
			jarTT.userCache = $.extend(true, oldJarTT.userCache);
		else
			jarTT.log("asd");

		oldJarTT = null;

		if (window.console && console.log)
			jarTT.log = function(msg){if(jarTT.settings.debug)console.log(msg);};
		else
			jarTT.log = function(msg){};
		
		jarTT.roomDiv = $($(".roomView > div")[1]);
		
		for (i in turntable) if (turntable[i] && turntable[i].djIds) {
			jarTT.localContext = turntable[i];
			break;
		}
		
		for (i in jarTT.localContext) if (jarTT.localContext[i] && jarTT.localContext[i].callback) {
			jarTT.callback = jarTT.localContext[i].callback;
			break;
		}
	},
	unload: function() {
		// Kill the ticker right away
		clearTimeout(jarTT.timerId);
		
		// turn off our settings and re-run the ticker
		jarTT.settings.smiffTime = false;
		jarTT.tickFunction(jarTT);
		// disable loaded in case of accidental premature eventulation
		jarTT.settings.loaded = false;
		
		// reenable the normal turntabl CSS3Helpers thing
		CSS3Helpers.findProperty = jarTT.findProp.original;
		
		jarTT.events.dispatchEvent("jarTT_unloaded");
		
		jarTT.log("jarTT successfully unloaded!");
		jarTT = null;
	},
	// This is copy and pasted from the TTfm source code, I couldn't find a good way to deobfuscate it...
	callFunction: function (c, a) {
		if (c.api == "room.now") {
			return;
		}
		c.msgid = turntable.messageId;
		turntable.messageId += 1;
		c.clientid = turntable.clientId;
		if (turntable.user.id && !c.userid) {
			c.userid = turntable.user.id;
			c.userauth = turntable.user.auth;
		}
		var d = JSON.stringify(c);
		if (turntable.socketVerbose) {
			//jarTT.log(util.nowStr() + " Preparing message " + d);
		}
		var b = $.Deferred();
		turntable.whenSocketConnected(function () {
			if (turntable.socketVerbose) {
				//jarTT.log(util.nowStr() + " Sending message " + c.msgid + " to " + turntable.socket.host);
			}
			if (turntable.socket.transport.type == "websocket") {
				turntable.socketLog(turntable.socket.transport.sockets[0].id + ":<" + c.msgid);
			}
			turntable.socket.send(d);
			turntable.socketKeepAlive(true);
			turntable.pendingCalls.push({
				msgid: c.msgid,
				handler: a,
				deferred: b,
				time: util.now()
			});
		});
		return b.promise();
	},
	localContext: {}
};
jarTT.main = {
	load: jarTT.load
};
