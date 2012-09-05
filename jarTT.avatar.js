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
	draw: function(c, d, b) {
		if (this.hidden) {
			return true;
		}
		if (!this.imagesLoaded) {
			return false;
		}
		var e = {};
		if (this.animating && this.animation && !b) {
			e = this.tween(d - this.startTime);
		}
		var k = true;
		var q = this.data.states[this.state];
		var l = q.length;
		for (var j = 0; j < l; j++) {
			var r = q[j],
				p = r[0],
				h = this.parts[p];
			if (!b && (p in e) && e[p].swap) {
				h = this.parts[e[p].swap];
			}
			if (!h.width || !h.height) {
				k = false;
				break;
			}
			if (this.opacity === undefined) {
				this.opacity = 1;
			}
			var opacity = this.opacity;
			var g = h.width / 2;
			var m = h.height / 2;
			var o = r[1];
			var n = r[2];
			var f = 0;
			if (p in e) {
				if (e[p].opacity) {
					opacity = this.opacity = e[p].opacity;
				}
				o += e[p].x || 0;
				n += e[p].y || 0;
				f = (e[p].angle || 0) * Math.PI / 180;
			}
			if (b) {
				h = this.colorizedParts[p];
			}
			if (h) {
				if (f) {
					c.save();
					c.translate(o + g, n + m);
					c.rotate(f);
					c.globalAlpha = opacity;
					c.drawImage(h, - g, - m, h.width, h.height);
					c.restore();
					c.globalAlpha = 1;
				} else {
					c.globalAlpha = opacity;
					c.drawImage(h, o, n, h.width, h.height);
					c.globalAlpha = opacity;
				}
			} else {
				k = false;
			}
		}
		return k;
	},
	hideAudience: function(toggle) {
		if (!jarTT.settings.hideAudience)
			return;
		var dancerMap = ttObjects.manager.dancerMap;
		for (var id in dancerMap) {
			var tinyDancer = dancerMap[id];
			if (!tinyDancer.jarTT) {
				// initialize extra jarTT shit
				jarTT.avatar.holdClosely(tinyDancer);
			}
			if (id.length !== 24)
				continue;
			if (id in ttObjects.manager.djs_uid) {
				tinyDancer.hidden = false;
				continue;
			}

			if (tinyDancer.hideAudience !== toggle) {
				tinyDancer.setAnimation(toggle ? 'fadeOut' : 'fadeIn', true);
				tinyDancer.tween(2000);
				
				(function(tinyDancer) {
					setTimeout(function() {
						tinyDancer.setAnimation(toggle ? 'fadeOut' : 'fadeIn', true);
						tinyDancer.start();
					}, 5000);
					setTimeout(function() {
						tinyDancer.opacity = toggle ? 0 : 1;
					}, 6000);
				})(tinyDancer);
				tinyDancer.hideAudience = toggle;
			}
		}
	},
	holdClosely: function(tinyDancer) {
		if (!jarTT.settings.hideAudience)
			return;
		tinyDancer.jarTT = true;

		tinyDancer.add_source_animation(
			"this isn't used, i don't know why the first variable is here. It's " +
			"supposed to be the name, but then the implementation simply iterates " +
			"over the map for the name, ever even referencing this. Not that it's " +
			"a bad thing, I've done that before, it's just funny.", 

			jarTT.avatar.extraAnimations);

		tinyDancer.draw = jarTT.avatar.draw;
		$.each(["Out", "In"], function(i, state){
			var lstate = state.toLowerCase();
			tinyDancer["fade"+state] = function() {
				if (tinyDancer.fadestate == lstate)
					return;
				if (!tinyDancer.fadestate) {
					tinyDancer.fadestate = true;
					tinyDancer.setAnimation("fade"+state);
					tinyDancer.tween(1000);
					setTimeout(function() {
						tinyDancer["fade"+state]();
					}, 1000);
					return;
				}
				tinyDancer.fadestate = lstate;
				tinyDancer.setAnimation("fade"+state);
				tinyDancer.start();
				setTimeout(function() {
					tinyDancer.opacity = i;
				}, 1000);
			};
		});

		return tinyDancer;
	},
	showUser: function(id) {
		if (id in ttObjects.manager.djs_uid)
			return;

		if (!jarTT.settings.hideAudience)
			return;

		var tinyDancer = ttObjects.manager.dancerMap[id];
		tinyDancer.fadeIn();

		setTimeout(function() {
			tinyDancer.fadeOut();
		}, 10000)
	},
	tick: function() {
		jarTT.avatar.hideAudience(jarTT.settings.hideAudience);
		var useSmiff = jarTT.settings.smiffTime || (jarTT.localContext.currentSong != null && (/((skr|w)ill ?smi(th|ff)|fresh ?prince|bel[- ]?air|wild wild west)/i).test(jarTT.localContext.currentSong.metadata.artist + jarTT.localContext.currentSong.metadata.song));
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
	extraAnimations: {
		fadeIn: {
			id: "fadeIn",
			keyframes: [{
				"headback,headfront": {
					opacity: 0
				},
				duration: 1
			},{
				"headback,headfront": {
					opacity: 1
				},
				duration: 1000
			}]
		},
		fadeOut: {
			id: "fadeOut",
			keyframes: [{
				"headback,headfront": {
					opacity: 1
				},
				duration: 1
			},{
				"headback,headfront": {
					opacity: 0
				},
				duration: 1000
			}]
		}
	},
	load: function() {


			jarTT.events.registerEvent("jarTT_loaded", jarTT.avatar.initCache);
			jarTT.events.registerEvent("jarTT_unloaded", jarTT.avatar.unload);
			jarTT.events.registerEvent("jarTT_tick", jarTT.avatar.tick);
			jarTT.events.registerEvent("speak", jarTT.avatar.showUserEvent);
			jarTT.events.registerEvent("snagged", jarTT.avatar.showUserEvent);
	},
	initCache: function() {
		if ("hivemind" in jarTT) {
			if (typeof window.hivemind !== 'object')
				return setTimeout(jarTT.avatar.initCache, 50);
		} else { // we don't use hivemind...
			return;
		}
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
						cache: jarTT.userCache,
						time: (new Date()).getTime()
					});
					return;
				}
			});
			hivemind.on('message.jarTT', function(msg) {
				jarTT.log("Msg from " + msg.from);
				jarTT.log(msg);
				if (wantsCache && msg.msg.api == "userCache") {
					//wantsCache = false;
					var cache = msg.msg.cache;
					var scew = (msg.msg.time || (new Date()).getTime()) - (new Date()).getTime();

					var fixTimes = function(user, timeIndex) {
						if (typeof jarTT.userCache[user][timeIndex] !== 'number')
							jarTT.userCache[user][timeIndex] = (new Date(jarTT.userCache[user][timeIndex])).getTime();
						jarTT.userCache[user][timeIndex] -= scew;
						jarTT.userCache[user][timeIndex] = new Date(jarTT.userCache[user][timeIndex]);
					};
					for (var user in cache) {
						jarTT.log('Loading cache for user: ' + user);
						jarTT.userCache[user] = msg.msg.cache[user];
						
						fixTimes(user, "createdTime");
						fixTimes(user, "lastMessage");
						fixTimes(user, "lastUpdate");

						jarTT.fixCachePrototype(user);
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
		if (window.hivemind) {
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
jarTT.fixCachePrototypes = function() {
	for (var id in jarTT.userCache)
		jarTT.fixCachePrototype(id);
}
jarTT.fixCachePrototype = function(id) {
	jarTT.userCache[id].getIdle = function() {
		var me = jarTT.userCache[id];
		return (new Date()).getTime() - (me.lastMessage == 0 ? me.createdTime : me.lastMessage).getTime();
	};
	jarTT.userCache[id].getDj = function() {
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
	};
}
jarTT.getUserInfo = function(id, c) {
	if (!(id in jarTT.userCache)) {
		jarTT.userCache[id] = {
			lastUpdate: 0,
			lastMessage: 0,
			updating: false,
			createdTime: (new Date())
		};
	}
	if (!("getDj" in jarTT.userCache[id]))
		jarTT.fixCachePrototype(id);
	
	var age = ((new Date()) - jarTT.userCache[id].lastUpdate);
	if (age < 20000) {
		c(jarTT.userCache[id]);
		return true;
	} else if (age < 120000) {
		if (!jarTT.userCache[id].updating) {
			jarTT.userCache[id].updating = true;
			jarTT.callFunction({
				api: "user.info",
				userid: id
			}, function(data) {
				jarTT.userCache[id].updating = false;
				jarTT.userCache[id].lastUpdate = new Date();
				for (var i in data)
					jarTT.userCache[id][i] = data[i];
			});
		}
		c(jarTT.userCache[id]);
	} else {
		jarTT.callFunction({
			api: "user.info",
			userid: id
		}, function(data) {
			jarTT.userCache[id].lastUpdate = new Date();
			for (var i in data)
				jarTT.userCache[id][i] = data[i];
			c(jarTT.userCache[id]);
		});
	}
	
	return false;
};
