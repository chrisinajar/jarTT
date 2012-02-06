/* First we unload any existing jarTT instances */
var wasLoaded = false;
var oldJarTT = {};
if (typeof jarTT != "undefined" && jarTT != null) {
	wasLoaded = true;
	oldJarTT = jarTT;
	jarTT.unload();
	jarTT = null;
}
//javascript:(function(){$.getScript('http://chrisinajar.com/jarTT.js');})();
/* Initialize the jarTT system and create all the elements/functions needed */
var jarTT = {
	log: function(){},
	findProp: {
		original: CSS3Helpers.findProperty,
		optimized: function(a,b){
			if(b=="transform" && (typeof $(a).attr('id') == "undefined"))
				return;
			return jarTT.findProp.original(a,b);
		}
	},
	settingsButton: {},
	roomDiv: {},
	hideAudience: function(toggle) {
		jarTT.roomDiv.children().each(function(i,obj) {
			obj = $(obj);
			if (toggle == (obj.css('display') == 'none'))
				return;
			if (obj.css('top') == '30px' || !obj.is("div") || (typeof obj.attr('class') != "undefined") || (typeof obj.attr('id') != "undefined"))
				return;
			if (obj.css('display') != 'none')
				obj.data('jarTT_wasShown', true);
			else if (typeof obj.data('jarTT_wasHidden') == "undefined")
				obj.data('jarTT_wasShown', false);
			
			if (toggle)
				obj.hide();
			else
				obj.show();
		});
	},
	settings: {
		'loaded': false,
		'hideAudience': false,
		'fixAnimations': false,
		'autoBop': true,
		'smiffTime': false,
		'lastSmiffTime': false,
		'idleLimit': 540000,
		'avatarTest': ['4e42c21b4fe7d02e6107b1ff', '4e2376eca3f751213d006700']
	},
	// not used, but maybe!
	showHelpMessage: function() {
		var box = $("<div />", {
			'class': "modal",
			'id': 'jarTT_HelpBox',
			'css': {
				'marginTop': '100px'
			}
		}).append($("<div />", {
			'class': "close-x"
		}).click(function() {
			box.remove();
			$("#overlay").hide();
		}));
		box.append("<h1>Welcome to jarTT</h1>");
		box.appendTo($("#overlay"));
		$("#overlay").show();
	},
	showSettings: function() {
		var box = $("<div />", {
			'class': "modal",
			'id': 'jarTT_Settings',
			'css': {
				'marginTop': '100px'
			}
		}).append($("<div />", {
				'class': "close-x"
			}).click(function() {
				box.remove();
				$("#overlay").hide();
			})
		);
		box.append("<h1>jarTT Settings</h1>");
		box.append("<br />Speed up Animations: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.fixAnimations
			}).click(function() {
				jarTT.settings.fixAnimations = this.checked;
				if (this.checked) {
					CSS3Helpers.findProperty = jarTT.findProp.optimized;
				} else {
					CSS3Helpers.findProperty = jarTT.findProp.original;
				}
			})
		);

		box.append("<br />Hide Audience: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.hideAudience
			}).click(function() {
				jarTT.settings.hideAudience = this.checked;
			})
		);

		box.append("<br />AutoBop: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.autoBop
			}).click(function() {
				jarTT.settings.autoBop = this.checked;
			})
		);

		box.append("<br />Dj Idle Threshhold");
		box.append($("<input />", {
			type: 'text',
			value: jarTT.settings.idleLimit,
			'class': 'ui-corner-all',
			css: {
				width: (jarTT.settings.idleLimit.toString().length*10)+5+'px',
				textAlign: 'center',
				marginLeft: '10px'
			}
			}).keyup(function() {
				var val = Math.floor($(this).val());
				val = (val > 0?val:0);
				if (val.toString() != $(this).val())
					$(this).val(val);

				var width = ((val.toString().length*10)+5+'px');
				if (width != $(this).css('width'))
					$(this).css({width: width});

				jarTT.settings.idleLimit = val;
			})
		);

		box.append("<br /><br />SMIFF IT BITCH: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.smiffTime
			}).click(function() {
				jarTT.settings.smiffTime = this.checked;
			})
		);
		box.append("<br />");
		box.append("<br />");
		box.append($("<button />", {
				'text': 'Unload jarTT'
			}).button().click(jarTT.unload)
		);
		box.append("<br /><br /><br /><p>This mod is optimized and based entirely on the suggestions of the <a href=\"http://codingsoundtrack.com\">Coding Soundtrack</a> family.</p>");
		box.append("<p><span style=\"font-size: 8px;\"><i>(who are a bunch of creepy gingers and should not be trusted).<i></span></p>");
		box.appendTo($("#overlay"));
		$("#overlay").show();
	},
	timerId: {},
	idleSigns: [null,null,null,null,null],
	ticking: false,
	tickFunction: function(jarTT) {
		if (jarTT.ticking || !jarTT.settings.loaded)
			return;
		jarTT.ticking = true;

		jarTT.hideAudience(jarTT.settings.hideAudience);
		
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
							'class': 'jarTT_timerDiv ui-corner-all',
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
	replaceAvatar: function(id, baseUrl) {
		jarTT.getUserInfo(id, function(user) {
		

		});
		/*
		jarTT.roomDiv.children().each(function(i,obj) {
			obj = $(obj);
			var dj = jarTT.identifyDiv(obj);
			if (dj == null || dj.userId != id) {
				return;
			}

			
		});
		*/
	},
	openSeatStartTime: 0,
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
			var dj = user.getDj();
			if (dj == null)
				return;
			var obj = dj.div;
			
			obj.stop(true);
			if (typeof obj.attr('class') == "undefined") {
				obj.attr('class', 'jarTT_talking');
				obj.css({opacity:0, display: 'block'});
				obj.animate({opacity: 1}, 500);
			} else {
				obj.animate({opacity: 1}, 200);
			}
			obj.delay(10000).animate({opacity: 0}, 1000, function() {
				obj.removeAttr('class');
				obj.css({display: 'none',opacity:1});
			});
		});
		
	},
	eventMap: {},
	socketEvent: function(event) {
		var data = JSON.parse(event);
		if (!data.command || typeof data.command == "undefined")
			return;
		if (data.command in jarTT.eventMap) {
			if (jarTT.eventMap[data.command] instanceof Array) {
				for (var i = 0; i < jarTT.eventMap[data.command].length; ++i) {
					jarTT.eventMap[data.command][i](data);
				}
			} else {
				jarTT.eventMap[data.command](data);
			}
		} else {
			jarTT.log("Unkown message type (" + data.command + ")");
			jarTT.log(data);
		}
	},
	// girllookatthatbody
	identifyDiv: function(div) {
		div=$(div);
		
		if (typeof div.data("tipsy") == "undefined")
			return null;

		if (div.css('top') == '30px' || !div.is("div") || typeof div.data("tipsy") == "undefined")
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
	},
	userCache: {},
	getUserInfo: function(id, c) {
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
	},
	load: function() {
		if (window.console && console.log)
			jarTT.log = function(msg){console.log(msg);};
		else
			jarTT.log = function(msg){};
		
		jarTT.settingsButton = $("<div />", {
			'class': "menuItem",
			'text': "jarTT Settings"
		});
		jarTT.settingsButton.click(jarTT.showSettings);
		jarTT.roomDiv = $($(".roomView > div")[1]);
		$("#menuh > div:last").before(jarTT.settingsButton);
		
		for (i in window) if (window[i] && window[i].callback) {
			jarTT.callback = window[i].callback;
			break;
		}
		for (i in turntable) if (turntable[i] && turntable[i].djIds) {
			jarTT.localContext = turntable[i];
			break;
		}

		jarTT.eventMap = {
			"newsong": [jarTT.onNewSong],
			"add_dj": [jarTT.onDjAdd],
			"rem_dj": [jarTT.onDjRemove],
			"speak": [jarTT.onSpeak]
		};
		
		if (!wasLoaded) {
			// We want to show the help message since this isn't a reload
			jarTT.showSettings();
		} else {
			// preserve settings
			if (typeof oldJarTT.settings != "undefined") for (var i in oldJarTT.settings) {
				jarTT.settings[i] = oldJarTT.settings[i];
			}

			if (typeof oldJarTT.userCache != "undefined")
				jarTT.userCache = $.extend(true, oldJarTT.userCache);
			else
				jarTT.log("asd");

			oldJarTT = null;
		}

		if (jarTT.settings.fixAnimations)
			CSS3Helpers.findProperty = jarTT.findProp.optimized;

		turntable.socket.on("message", jarTT.socketEvent);
		jarTT.settings.loaded = true;
		
		jarTT.timerId = setInterval(function(){jarTT.tickFunction(jarTT)}, 100);
		jarTT.log("jarTT successfully loaded!");
	},
	unload: function() {
		// Kill the ticker right away
		clearTimeout(jarTT.timerId);
		
		// turn off our settings and re-run the ticker
		jarTT.settings.smiffTime = false;
		jarTT.tickFunction(jarTT);
		// disable loaded in case of accidental premature eventulation
		jarTT.settings.loaded = false;

		// unregister the event handler from whatever "socket" is
		turntable.socket.removeEvent("message", jarTT.socketEvent);
		
		// clean up our ui shit
		jarTT.settingsButton.remove();
		$("#jarTT_Settings").remove();
		$("#jarTT_HelpBox").remove();
		$("#overlay").hide();
		$("#jarTT_slotTimer").remove();
		$(".jarTT_timerDiv").remove();
		// reenable the normal turntabl CSS3Helpers thing
		CSS3Helpers.findProperty = jarTT.findProp.original;
		// Show the audience. this can take a second...
		jarTT.hideAudience(false);
		
		jarTT.log("jarTT successfully unloaded!");
		jarTT = null;
	},
	// OBFUSCATORZZZZZ
	localContext: {},
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
	}
};
jarTT.load();

