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
 
// avatar, anything involving fucking with the avatar images or avatar system code in TTfm.

jarTT.avatar = {
	hideAudience: function(toggle) {
		jarTT.roomDiv.children().each(function(i,obj) {
			obj = $(obj);
			if (obj.children().length < 1)
				return;
			var child = $(obj.children()[0]);
			if (toggle == (child.css('display') == 'none'))
				return;
			if (jarTT.identifyDiv(obj) == null)//if (obj.css('top') == '30px' || !obj.is("div") || (typeof obj.attr('class') != "undefined") || (typeof obj.attr('id') != "undefined"))
				return;

			if (child.hasClass('jarTT_talking'))
				return;
			
			if (toggle)
				child.hide();
			else
				child.show();
		});
	},
	showUser: function(id) {
		if ($.inArray(id, jarTT.localContext.djIds) != -1)
			return;

		if (!jarTT.settings.hideAudience)
			return;

		jarTT.getUserInfo(id, function(user) {
			var dj = user.getDj();
			jarTT.log(dj);
			if (dj == null)
				return;
			var obj = dj.div;
			var child = $(obj.children()[0])
			
			child.stop(true);
			child.attr('class', 'jarTT_talking');
			child.css({opacity:1, display:'block'});
			var tid = child.data('jarTT_speakTimer');
			if (tid)
				clearTimeout(tid);
			
			child.data('jarTT_speakTimer', setTimeout(function() {
				child.animate({opacity: 0}, 1000, function() {
					child.removeAttr('class');
					child.hide();
					child.css({opacity:1});
				});
			}, 10000));
		});
	},
	tick: function() {
		jarTT.avatar.hideAudience(jarTT.settings.hideAudience);
		var useSmiff = jarTT.settings.smiffTime || (jarTT.localContext.currentSong != null && (/((skr|w)ill ?smi(th|ff)|fresh ?prince|bel[- ]?air)/i).test(jarTT.localContext.currentSong.metadata.artist + jarTT.localContext.currentSong.metadata.song));
		if (useSmiff || jarTT.settings.lastSmiffTime) {
			jarTT.settings.lastSmiffTime = useSmiff;
			jarTT.roomDiv.children().each(function(i,obj) {
				obj = $(obj);
				if (obj.css('display') == 'none' || obj.css('top') != '30px')
					return;
				var par = $(obj.children()[0]);
				obj.find("img").each(function(i,obj) {
					obj = $(obj);
					if (obj.css('display') == 'none')
						return;
					if (obj.attr('src').substr('-13') != "headfront.png")
						return;
					if (typeof obj.data('originalImage') == "undefined") {
						obj.data('originalImage', obj.attr('src'));
						par.data('originalTop', par.css('top'));
						par.data('originalMargin', par.css('marginTop'));
					}
					if (useSmiff) {
						obj.attr('src', 'http://chrisinajar.com/headfront.png');
						par.css({
							'top': '-20px'
						});
						// jitters
						if (Math.random()>0.85)
							par.css({'marginTop': ((Math.random()*4)-2) + 'px'});
						
					} else {
						obj.attr('src', obj.data('originalImage'));
						par.css({
							'top': par.data('originalTop'),
							'marginTop': par.data('originalMargin')
						});
					}
				});
			});
		}

		var m = jarTT.settings.avatarTest;
		for (var i = 0, l = m.length; i < l; ++i) {
			//jarTT.replaceAvatar(m[i], 'https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatar/35/scaled/65/');
		}

	},
	showUserEvent: function(data) {
		jarTT.avatar.showUser(data.userid);
	},
	load: function() {
			jarTT.events.registerEvent("jarTT_loaded", jarTT.avatar.initCache);
			jarTT.events.registerEvent("jarTT_unloaded", jarTT.avatar.unload);
			jarTT.events.registerEvent("jarTT_tick", jarTT.avatar.tick);
			jarTT.events.registerEvent("speak", jarTT.avatar.showUserEvent);
			jarTT.events.registerEvent("snagged", jarTT.avatar.showUserEvent);
	},
	initCache: function() {
		if (jarTT.hivemind && !hivemind)
			return setTimeout(jarTT.avatar.initCache, 50);
		// Fetch user cache from another user!
		var wantsCache = true;
		setTimeout(function() {
			jarTT.log('Didn\'t get a fresh user cache in time, no longer listening for one.');
			wantsCache = false;
		}, 5000);
		if (hivemind) {
			hivemind.on('room.jarTT', function(msg) {
				jarTT.log("THE HIVE HUNGERS!");
				jarTT.log(msg);
				if (msg.from == msg.to) // We don't care about the self-broadcast
					return;
				if (msg.msg.api == "getUserCache") {
					hivemind.send(msg.from, {
						api: 'userCache',
						cache: jarTT.userCache
					});
					return;
				}
			});
			hivemind.on('message.jarTT', function(msg) {
				jarTT.log("Msg from " + msg.from);
				jarTT.log(msg);
				if (wantsCache && msg.msg.api == "userCache") {
					wantsCache = false;
					var cache = msg.msg.cache;
					for (var user in cache) {
						jarTT.log('Loading cache for user: ' + user);
						jarTT.userCache[user] = msg.msg.cache[user];
					}
					return;
				}
			});
			hivemind.sendRoom({
				module: 'jarTT',
				api: 'getUserCache'
			});
		}
	},
	unload: function() {
		jarTT.avatar.hideAudience(false);
		if (hivemind) {
			hivemind.off('room.jarTT');
			hivemind.off('message.jarTT');
		}
	},
};

jarTT.replaceAvatar = function(id, baseUrl) {
};
// girllookatthatbody
jarTT.identifyDiv = function(div) {
	div=$(div);
	
	if (typeof div.data("tipsy") == "undefined")
		return null;

	if (div.css('top') == '30px' || !div.is("div") || typeof div.attr("id") != "undefined" || typeof div.attr("class") != "undefined")
		return null;

	// We want to fill this object with all of the information we find on this object...
	// it's functions are at the bottom of this.
	var dj = {
		'div': div,
		body: {}
	};

	div.find("img").each(function(i,obj) {
		obj=$(obj);
		var img = obj.attr('src');
		var bodyPart = img.substr(1+img.lastIndexOf("/"));
		bodyPart = bodyPart.substr(0,bodyPart.length-4);
		dj.body[bodyPart] = obj;
	});
	
	// important..
	var matches = (new RegExp(",'([a-z0-9]+)'\\)\"><b>(.*)</b><br>([0-9,]+) DJ points?<br>([0-9,]+) fan", "i")).exec(div.data("tipsy").getTitle());
	if ("length" in matches && matches.length == 5) {
		dj.userId = matches[1];
		dj.userName = matches[2];
		dj.points = matches[3];
		dj.fans = matches[4];
	} else {
		jarTT.log(div.data("tipsy").getTitle());
		jarTT.log("why u no work!?");
		// panic?
	}

	// functions!
	dj.getUserInfo = function(callback) {
		jarTT.getUserInfo(dj.userId, callback);
	}

	// I work out...
	return dj;
};
jarTT.userCache = {};
jarTT.getUserInfo = function(id, c) {
	if (!(id in jarTT.userCache)) {
		jarTT.userCache[id] = {
			lastUpdate: 0,
			lastMessage: 0,
			createdTime: (new Date()),
			getIdle: function() {
				var me = jarTT.userCache[id];
				return (new Date()) - (me.lastMessage == 0 ? me.createdTime : me.lastMessage);
			},
			getDj: function() {
				var ret = null;
				var child = jarTT.roomDiv.children();
				for (var i = 0, l = child.length; i < l; ++i) {
					var obj = $(child[i]);
					var dj = jarTT.identifyDiv(obj);
					if (dj == null)
						continue;

					if (dj.userId == id) {
						ret = dj;
						break;
					}
				}
				return ret;
			}
		};
	}
	if (((new Date()) - jarTT.userCache[id].lastUpdate) < 10000) {
		c(jarTT.userCache[id]);
		return true;
	} else {
		jarTT.userCache[id].lastUpdate = new Date();
		
		jarTT.callFunction({
			api: "user.info",
			userid: id
		}, function(data) {
			for (var i in data)
				jarTT.userCache[id][i] = data[i];
			c(jarTT.userCache[id]);
		});
	}
	
	return false;
};
