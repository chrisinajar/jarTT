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
 
// storage, anything involving HTML5 storage or whatever else i mutate this into.

jarTT.version = {
	load: function() {
		jarTT.events.registerEvent("jarTT_unloaded", jarTT.version.unload);
		
		var version = jarTT.storage.getNamedData('version');
		if (!version)
			version = 1.11;
		
		var getWord = function(ar) {
			return ar[Math.round(Math.random()*ar.length)];
		}
		
		var horribleColors = [
			"pink",
			"red",
			"blue",
			"#B8B8E0",
			"magenta",
			"gold",
			"yellow"
		];
		
		var howAwesome = [
			"love it.",
			"shit bricks.",
			"fuck some shit up.",
			"die.",
			"do cocain off a hooker just to feel again.",
			"puke on your mom in excitement.",
			"wonder if these superlatives are generated.",
			"become mutually exclusive with unhappiness.",
			"kill everyone you know.",
			"devolve.",
			"probably love it.",
			"be pretty indifferent to it.",
			"fall in love.",
			"found a religion on it.",
			"become a famous rapper.",
			"win a grammy.",
			"become a famous rapper"
		];
		
		var doWhat = [
			"GET EXCITED!",
			"FUCK YES!",
			"SUCK ON DEEZ NUTS!",
			"THE LEMONS!",
			"OH NO YOU DI'NT!",
			"PARENTS DON'T UNDERSTAND!",
			"GIVE ME ALL YOUR MONEY!",
			"KILL IT WITH FIRE!",
			"SAIL!"
		];
		
		var changes = [];
		var notes = "";
		var showSettings = false;
		var hasChanges = false;
		switch(version) {
			case 0.0: // first run
				changes.push("Welcome to the glorious hole that is jarTT. Settings are in the Settings menu!");
				changes.push("This is where the release notes go! Lists of changes are found here!");
				changes.push("Better ui compatibility with Turntable Remix (shoutout to overra)");
				changes.push("Rewrote hide audience support to use their animation system! Added support for opacity based animations, as well.");
				changes.push("Mildly painful to view release notes!");
				
				//version = 1.3;
				// let fall through switch set it...
				showSettings = true;
				hasChanges = true;
			case "1.4.0":
				changes.push("Changed hivemind logic to take into account clock scew. Should fix insane values.");

				version = "1.4.1";
				hasChanges = true;
			case "1.4.1":
				changes.push("Fixed bug with version numbers super expanding and crashing the console.");

				version = "1.4.2";
				hasChanges = true;
			case "1.4.2":
				changes.push("Fixed smiff mode. Heck yeah!");

				version = "1.5.0";
				hasChanges = true;
				showSettings = true;
			case "1.5.0":
				changes.push("Turntable Customs support (kind of)!");
				changes.push("Gangnam Style. That is all.");

				version = "1.6.0";
				hasChanges = true;
				showSettings = true;
			case "1.6.0":
				changes.push("\"I need to get back to the ship, I can't breath.\"");

				version = "1.6.1";
				hasChanges = true;
			case "1.6.1":
				changes.push("Better compatibility with Turntable Remix");

				version = "1.6.2";
				hasChanges = true;
			case "1.6.2":
		};
		if (hasChanges) {
			// jarTT.ui.showSettings();
			var box = jarTT.ui.createBox();
			var br = function() {
				box.append("<br />");
			};
			box.append("<h1>jarTT!!! HI!!</h1><br />");
			box.append($("<p>", {
				html: "Version: " + version,
				css: {
					fontSize: 10,
					marginTop: -20
				}
			}));
			br();
			box.append($("<p>", {
				html: "Welcome! Unless you've already been using jarTT, in which case welcome <i>back</i>! We have some <b style='color: yellow;'>new</b> stuff for you, you're going to " + getWord(howAwesome) + ".<br />",
				css: {
					fontSize: 14,
				}
			}));
			
			br();
			
			// Changes
			if (changes.length > 0) {
				box.append($("<p>", {
					text: "Check out this sweet new shit!",
					css: {
						fontSize: 22,
						fontWeight: "bold",
						marginBottom: 10
					}
				}));
				var rape = function() {
					var color,
					    self = $(this);
						
					self.stop(true);
					while ((color = getWord(horribleColors)) == self.data('lastColor') || (!color));
					self.data('lastColor', color);
					self.animate({color: color}, 2000, "linear", rape);
				};
				for (var i = 0, l = changes.length; i < l; ++i) (function(change) {
					box.append($("<span>", {
						text: change,
						css: {
							display: "block",
							fontSize: 14,
							fontWeight: "bold"
						}
					}).fadeIn(rape));
				})(changes[i]);
				
				br();
			}
			
			// Release notes
			if (notes.length > 0) {
				box.append("Release Notes! Look!");
				br();
				box.append($("<p>", {
					text: notes,
					css: {
						fontSize: 14
					}
				}));
				
				br();
			}
			
			if (showSettings) {
				box.append($("<p>", {
					text: "Some settings have changed!",
					css: {
						color: "red",
						fontWeight: "bold",
						padding: 10,
						fontSize: 20
					}
				}));
				box.append($("<button>", {
					text: "Settings"
				}).button().click(function() {
					box.remove();
					jarTT.ui.showSettings();
				}));
				
				br();
			}
			
			br();
			
			box.append($("<p>", {
				text: getWord(doWhat),
				css: {
					fontSize: 16,
					color: "yellow",
					fontWeight: "bold"
				}
			}));
			
			br();
			
			box.append($("<p>", {
				text: "Thanks! -chrisinajar",
				css: {
					fontSize: 12
				}
			}));
		}
		
		jarTT.storage.setNamedData('version', version);
	},
	unload: function() {
	},
};


