/*
 * jarTT.js, a turntable.fm mod
 *
 * Author: Chris "inajar" Vickery <chrisinajar@gmail.com>
 *
 * javascript:(function(){$.getScript('https://raw.github.com/chrisinajar/jarTT/master/jarTT.js');})();
 *
 */
 
/* Initialize the jarTT system and create all the elements/functions needed */
var jarTT = {
	settings: {
		'loaded': false,
		'hideAudience': false,
		'fixAnimations': false,
		'autoBop': true,
		'smiffTime': false,
		'lastSmiffTime': false,
		'debug': false,
		'idleLimit': 300,
		'baseUrl': "https://raw.github.com/chrisinajar/jarTT/master/",
		'avatarTest': ['4e42c21b4fe7d02e6107b1ff', '4e2376eca3f751213d006700']
	},
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
				marginLeft: '5px',
				marginRight: '5px'
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
		box.append("seconds");

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
	openSeatStartTime: 0,
	load: function() {
		if (wasLoaded) {
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

		if (window.console && console.log && jarTT.settings.debug)
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
	},
	unload: function() {
		// Kill the ticker right away
		clearTimeout(jarTT.timerId);
		
		// turn off our settings and re-run the ticker
		jarTT.settings.smiffTime = false;
		jarTT.tickFunction(jarTT);
		// disable loaded in case of accidental premature eventulation
		jarTT.settings.loaded = false;
		
		// clean up our ui shit
		jarTT.settingsButton.remove();
		$("#jarTT_Settings").remove();
		$("#jarTT_HelpBox").remove();
		$("#overlay").hide();
		$("#jarTT_slotTimer").remove();
		$(".jarTT_timerDiv").remove();
		// reenable the normal turntabl CSS3Helpers thing
		CSS3Helpers.findProperty = jarTT.findProp.original;
		
		jarTT.events.dispatchEvent("jarTT_unloaded");
		
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
