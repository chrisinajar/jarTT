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
 
// ui, i put most of the awful dom shit here
 
jarTT.ui = {
	load: function() {
		jarTT.log("ui is loading");
		jarTT.events.registerEvent("jarTT_loaded", jarTT.ui.onFinishLoad);
		jarTT.events.registerEvent("jarTT_unloaded", jarTT.ui.unload);
		jarTT.events.registerEvent("add_dj", jarTT.ui.onDjAdd);
		jarTT.events.registerEvent("rem_dj", jarTT.ui.onDjRemove);
		jarTT.events.registerEvent("jarTT_tick", jarTT.ui.redrawUpDown);
		jarTT.events.registerEvent("jarTT_tick", jarTT.ui.killBubbles);
		
		// jarTT.events.registerEvent("update_votes", jarTT.ui.redrawUpDown);
		// jarTT.events.registerEvent("newsong", jarTT.ui.redrawUpDown);
		
		$("<div />", {
			'class': "jarTT menuItem",
			'text': "jarTT Settings"
		})
		.click(jarTT.ui.showSettings)
		.insertBefore($("#menuh > div:last"));
	},
	unload: function() {
		// remove event listeners
		$(".avatar_laptop").off('mouseover.jarTT');
		
		// clean up our ui shit
		$(".jarTT").remove();
		$("#overlay").hide();
	},
	killBubbles: function() {
		if (!jarTT.settings.killbubbles)
			return;

		//$(".laptopCanvas").hide();
		$("#zoomView").hide();
		
		$(".avatar_laptop").each(function(){
			var self = $(this);
			
			self.off('mouseover.jarTT');
			self.on('mouseover.jarTT', function() {
				jarTT.ui.laptopHover(self);
			});
		});
	},
	laptopHover: function(self) {
		if (!jarTT.settings.killbubbles)
			return;
		self.next().find('img[src$="headfront.png"]').mouseover();
		$("#zoomView").hide();
	},
	onFinishLoad: function() {
	},
	openSeatStartTime: 0,
	onDjRemove: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if ($(".avatar_laptop").length == 4) {
			jarTT.ui.openSeatStartTime = new Date();
		}
	},
	onDjAdd: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if (jarTT.ui.openSeatStartTime != 0 && $(".avatar_laptop").length == 5) {
			var now = new Date();
			var before = jarTT.ui.openSeatStartTime;
			jarTT.ui.openSeatStartTime = 0;
			jarTT.log("Slot was open for: " + (now - before));
			$("<div />", {
				html: "<center>Slot was open for<br />" + (now - before) + "ms</center>",
				id: "jarTT_slotTimer",
				'class': "jarTT ui-corner-all",
				css: {
					backgroundColor: "white",
					border: "1px solid black",
					position: "absolute",
					zIndex: "1001",
					fontSize: "10px",
					top: "144px",
					left: "388px",
					display: "none",
					padding: "5px"
				}
			}).fadeIn().delay(10000).fadeOut(1000, function(){$(this).remove();}).appendTo(jarTT.roomDiv);
		}
	},
	redrawUpDown: function() {
		if ($(".jarTT_updown").length == 1 && 
			$(".jarTT_up").html() == jarTT.events.room.upvotes &&
			$(".jarTT_down").html() == jarTT.events.room.downvotes) { // an attempt to not redraw this 40 billion million times.
			return;
		}
		$(".jarTT_updown").remove();
		$(".point_display[style!='display: none; ']").append($("<div />", {
			'class': "jarTT jarTT_updown ui-state-default",
			'height': "16px"
			})
			.append($('<span />', {
				'class': "jarTT jarTT_up",
				'html': jarTT.events.room.upvotes
			}))
			.append($('<div />', {
				'class': "jarTT",
				'css': {
					backgroundImage: 'url(https://s3.amazonaws.com/static.turntable.fm/images/down_arrow.png)',
					display: 'inline-block',
					marginTop: '3px',
					transform: 'rotate(180deg)',
					MozTransform: 'rotate(180deg)',
					WebkitTransform: 'rotate(180deg)',
					MsTransform: 'rotate(180deg)',
				},
				'width': '12px',
				'height': '10px',
			}))
			.append($('<div />', {
				'class': "jarTT",
				'css': {
					backgroundImage: 'url(https://s3.amazonaws.com/static.turntable.fm/images/down_arrow.png)',
					display: 'inline-block',
					marginTop: '3px',
				},
				'width': '12px',
				'height': '10px',
			}))
			.append($('<span />', {
				'class': "jarTT jarTT_down",
				'html': jarTT.events.room.downvotes
			}))
		)
	},
	saveSettings: function() {
		if (!jarTT.storage)
			return;
		
		jarTT.storage.saveSettings();
	},
	createBox: function() {
		var overlay = $("#overlay"),
		    box = $("<div />", {
			'class': "modal jarTT",
			'id': 'jarTT_Settings',
			'css': {
				'marginTop': '100px',
				'textAlign': 'center'
			}
		});
		box.append($("<div />", {
				'class': "close-x"
			}).click(function() {
				box.remove();
				overlay.hide();
			})
		);
		setTimeout(function() {
			box.appendTo(overlay);
			overlay.show();
		}, 10);
		return box;
	},
	showSettings: function() {
		var box = jarTT.ui.createBox();
		box.append("<h1>jarTT Settings</h1>");
		box.append("<br />Speed up Animations: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.fixAnimations
			}).click(function() {
				jarTT.settings.fixAnimations = this.checked;
				jarTT.ui.saveSettings();
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
				jarTT.ui.saveSettings();
			})
		);
		
		box.append("<br />Kill Bubbles: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.killbubbles
			}).click(function() {
				jarTT.settings.killbubbles = this.checked;
				jarTT.ui.saveSettings();
				
				if (!jarTT.settings.killbubbles)
					$(".laptopCanvas").show();
			})
		);
		
		box.append("<br />Mute on double lame: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.muteonlame
			}).click(function() {
				jarTT.settings.muteonlame = this.checked;
				jarTT.ui.saveSettings();
			})
		);

		var youSure = false; // you're so damn uncertain
		box.append("<br />AutoBop: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.autoBop
			}).click(function(e) {
				if (!youSure) {
					$(this).prev().after("<b><span style='color: red'>Warning! Turntable.fm staff strongly discourages the use of auto-bop.<br /><span style='font-size: 8px;'>(because they hate fun).</span></span><br />");
					youSure = true;
					return (!this.checked);
				}
				
				jarTT.settings.autoBop = this.checked;
				jarTT.ui.saveSettings();
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
				jarTT.ui.saveSettings();
			})
		);
		box.append("seconds");

		box.append("<br /><br />SMIFF IT BITCH: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.smiffTime
			}).click(function() {
				jarTT.settings.smiffTime = this.checked;
				jarTT.ui.saveSettings();
			})
		);
		
		box.append("<br />");
		box.append("<br />");
		box.append($("<button />", {
				'text': 'Unload jarTT'
			}).button().click(jarTT.unload)
		);
		box.append("<br /><br /><br /><p>This mod is optimized and based entirely on the suggestions of the <a href=\"http://codingsoundtrack.com\" target=\"_blank\">Coding Soundtrack</a> family.</p>");
		box.append("<p><span style=\"font-size: 8px;\"><i>(who are a bunch of creepy gingers and should not be trusted).<i></span></p>");
		box.append("<p><span style=\"font-size: 8px;\"><i>(Thanks to @cannjeff for the heroics and <a href=\"http://tinyurl.com/6q8ed8v\" target=\"_blank\">GM script</a>).<i></span></p>");
	}
};
