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
		
		$("<div />", {
			'class': "jarTT menuItem",
			'text': "jarTT Settings"
		})
		.click(jarTT.ui.showSettings)
		.insertBefore($("#menuh > div:last"));
	},
	unload: function() {
		// clean up our ui shit
		$(".jarTT").remove();
		$("#overlay").hide();
	},
	onFinishLoad: function() {
		if (!wasLoaded) {
			// We want to show the help message since this isn't a reload
			jarTT.ui.showSettings();
		}
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
					top: "78px",
					left: "388px",
					display: "none",
					padding: "5px"
				}
			}).fadeIn().delay(10000).fadeOut(1000, function(){$(this).remove();}).appendTo(jarTT.roomDiv);
		}
	},
	showSettings: function() {
		var box = $("<div />", {
			'class': "modal jarTT",
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
	}
};