jarTT.events = {
	eventMap: {},
	registerEvent: function(type, func) {
		if (!(type in jarTT.events.eventMap))
			jarTT.events.eventMap[type] = [];
		jarTT.events.eventMap[type].push(func);
	},
	socketEvent: function(event) {
		var data = JSON.parse(event);
		if (!data.command || typeof data.command == "undefined")
			return;
		jarTT.events.dispatchEvent(data.command, data);
	},
	dispatchEvent: function(eventName, data) {
		if (eventName in jarTT.events.eventMap) {
			if (jarTT.events.eventMap[eventName] instanceof Array) {
				for (var i = 0; i < jarTT.events.eventMap[eventName].length; ++i) {
					jarTT.events.eventMap[eventName][i](data);
				}
			} else {
				jarTT.events.eventMap[eventName](data);
			}
		} else {
			jarTT.log("Unkown event type (" + eventName + ")");
			jarTT.log(data);
		}
	},
	load: function() {
			jarTT.events.registerEvent("newsong", jarTT.events.onNewSong);
			jarTT.events.registerEvent("add_dj", jarTT.events.onDjAdd);
			jarTT.events.registerEvent("rem_dj", jarTT.events.onDjRemove);
			jarTT.events.registerEvent("speak", jarTT.events.onSpeak);
			jarTT.events.registerEvent("jarTT_loaded", jarTT.events.onFinishLoad);
			jarTT.events.registerEvent("jarTT_unloaded", jarTT.events.unload);
	},
	unload: function() {
		turntable.socket.removeEvent("message", jarTT.events.socketEvent);
	},
	onFinishLoad: function(data) {
		if (jarTT.settings.fixAnimations)
			CSS3Helpers.findProperty = jarTT.findProp.optimized;

		turntable.socket.on("message", jarTT.events.socketEvent);
		jarTT.settings.loaded = true;

		jarTT.timerId = setInterval(function(){jarTT.tickFunction(jarTT)}, 100);

		if (!wasLoaded) {
			// We want to show the help message since this isn't a reload
			jarTT.showSettings();
		}
		jarTT.log("jarTT successfully loaded!");
	},
	onNewSong: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if (jarTT.settings.autoBop) {
			setTimeout(function() {
				jarTT.callback("upvote");
			},(Math.random() * 10000)+5000);
		}
	},
	onDjRemove: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if ($(".avatar_laptop").length == 4) {
			jarTT.openSeatStartTime = new Date();
		}
	},
	onDjAdd: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if (jarTT.openSeatStartTime != 0 && $(".avatar_laptop").length == 5) {
			var now = new Date();
			var before = jarTT.openSeatStartTime;
			jarTT.openSeatStartTime = 0;
			jarTT.log("Slot was open for: " + (now - before));
			$("<div />", {
				html: "<center>Slot was open for<br />" + (now - before) + "ms</center>",
				id: "jarTT_slotTimer",
				'class': "ui-corner-all",
				css: {
					backgroundColor: "white",
					border: "1px solid black",
					position: "absolute",
					zIndex: "1001",
					fontSize: "10px",
					top: "78px",
					left: "388px",
					display: "none",
					padding: "5px"
				}
			}).fadeIn().delay(10000).fadeOut(1000, function(){$(this).remove();}).appendTo(jarTT.roomDiv);
		}
	},
	onSpeak: function(data) {
		jarTT.log(data);
		id = data.userid;

		jarTT.getUserInfo(id, function(user) {
			user.lastMessage = new Date();
		});

		if ($.inArray(id, jarTT.localContext.djIds) != -1)
			return;

		if (!jarTT.settings.hideAudience)
			return;

		jarTT.getUserInfo(id, function(user) {
			jarTT.log("doing my thing");
			var dj = user.getDj();
			jarTT.log(dj);
			if (dj == null)
				return;
			var obj = dj.div;
			jarTT.log("wtf");
			var child = $(obj.children()[0])
			jarTT.log(child);
			jarTT.log("classy: " + (typeof child.attr('class')));
			
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
}
jarTT.events.load();
