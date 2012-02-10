jarTT.avatars = {
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
	tick: function() {
		jarTT.avatars.hideAudience(jarTT.settings.hideAudience);
		var useSmiff = jarTT.settings.smiffTime || (jarTT.localContext.currentSong != null && (/will ?smi(th|ff)/i).test(jarTT.localContext.currentSong.metadata.artist + jarTT.localContext.currentSong.metadata.song));
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
			//jarTT.replaceAvatar(m[i], 'https://s3.amazonaws.com/static.turntable.fm/roommanager_assets/avatars/35/scaled/65/');
		}

	},
	load: function() {
			jarTT.events.registerEvent("jarTT_unloaded", jarTT.avatars.unload);
			jarTT.events.registerEvent("jarTT_tick", jarTT.avatars.tick);
	},
	unload: function() {
		jarTT.avatars.hideAudience(false);
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
	dj.userId = matches[1];
	dj.userName = matches[2];
	dj.points = matches[3];
	dj.fans = matches[4];

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
	}
	jarTT.callFunction({
		api: "user.info",
		userid: id
	}, function(data) {
		for (var i in data)
			jarTT.userCache[id][i] = data[i];
		jarTT.userCache[id].lastUpdate = new Date();
		c(jarTT.userCache[id]);
	});

	return false;
};

jarTT.avatars.load();

