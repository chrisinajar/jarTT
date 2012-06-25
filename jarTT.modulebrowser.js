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
 
// modulebrowser
 
jarTT.modulebrowser = {
	load: function() {
	},
	unload: function() {
	},
	createBox: function() {
		$('#jarTT_Settings').hide();
		var overlay = $("#overlay"),
		    box = $("<div />", {
			'class': "modal jarTT",
			'id': 'jarTT_module_browser',
			'css': {
				'marginTop': '100px',
				'textAlign': 'center'
			}
		});
		box.append($("<div />", {
				'class': "close-x"
			}).click(function() {
				box.remove();
				$('#jarTT_Settings').show();
			})
		);
		setTimeout(function() {
			box.appendTo(overlay);
			overlay.show();
		}, 10);
		return box;
	},
	showModuleBrowser: function() {
		var box = jarTT.modulebrowser.createBox();
		
		box.width(600);
		box.height(500);

		box.append('<h1>jarTT Module Manager</h1>');
		box.append($('<table />', {
			css: { border:'5px solid #FBD863', width: '100%', height: '90%' }
			}).append($('<tr />', { // this row contains top of side_bar, Module title, version, author and install button
				css: { height: '20%' }
			}).append($('<td />', {
				css: { width: '152px' }, // don't worry about it
				html: jarTT.modulebrowser.getModuleList()
			}).attr('rowspan', '2')).append($('<td />', {
				html: $('<div />', { id: 'jarTT_module_header', html: '<h3>Welcome friend!</h3>' }),
				css: { border: '1px solid #FBD863', padding: '5px' }
			}))).append($('<tr />', { // this row contains details
			}).append($('<td />', {
				html: $('<div />', { id:'jarTT_module_details', html:'<h4>Check out all the cool stuff over on the side bar <.<</h4>' }),
				css: { border: '1px solid #FBD863' }
			}).attr('valign', 'top'))));
	},
	getModuleList: function() {
		var sideBarWrapper = $('<div />', {
			id: 'wrapper',
			css: { overflow: 'hidden' }
		});
		var sideBar = $('<div />', {
			id: 'jarTT_module_side_bar',
			css: { overflowY: 'scroll', height: '450px', border: '1px solid #FBD863' }
		}).appendTo(sideBarWrapper);

		var modules = jarTT.modulebrowser.modules,
			mod_ar = [],
			mods_enabled = jarTT.storage.getNamedData('modules');
		mods_enabled=mods_enabled?mods_enabled:[];
		
		for (var mod in modules) {
			jarTT.log('testing ' + mod);
			if (!modules[mod].options)
				modules[mod].options = {};
			if (modules[mod].options.required) // don't bother showing any of the modules that aren't optional
				continue;
			jarTT.log('testing ' + mod);
			mod_ar.push(mod);
			var checked = ($.inArray(mod, mods_enabled) != -1);

			// Not worth trying to comprehend
			$('<div />', {
				id: 'jarTT_module_item_'+mod,
				css: { width: '150px', height: '75px', borderBottom: '1px solid #FBD863' }
			}).data('mod', mod).click(function() {
				// Couldn't hurt to check if all deps are met before installing this bitch (inform the morons on these deps, auto-install?)
				var m = $(this).data('mod');
				$('#jarTT_module_header').html(jarTT.modulebrowser.getModuleHeader(m));
				$('#jarTT_module_details').html(jarTT.modulebrowser.getModuleDetails(m));
			}).hover(function() {
				$(this).animate({ 
					backgroundColor: '#FBD863',
					color: 'black'
				}, 200);
			}, function() {
				$(this).stop(true);
				$(this).css({ 
					backgroundColor: 'transparent',
					color: 'white'
				});
			}).append($('<div />', { 
					html: mod//,
					//css: { position:'absolute', top:'0px', left:'0px' }
			})).append($('<input />', { 
					type: 'checkbox',
					'checked': checked
					//css: { position:'absolute', bottom:'0px', right:'0px' }
			}).attr('disabled', 'disabled')).appendTo(sideBar);
		}

		return sideBarWrapper;
	},
	getModuleHeader: function(m) {
		var mod = jarTT.modulebrowser.modules[m];
		var mods_enabled = jarTT.storage.getNamedData('modules');
		mods_enabled=mods_enabled?mods_enabled:[];
		var checked = ($.inArray(m, mods_enabled) != -1);
		var headerWrapper = $('<div />', {
			id: 'header_wrapper'
		}).append($('<div />', {
			css: { float: 'left', textAlign: 'left' }
		}).append($('<span />', {
			id: 'jarTT_selected_mod_title',
			html: m,
			css: { fontSize: '20px', display: 'block' }
		})).append($('<span />', {
			id: 'jarTT_selected_mod_version',
			html: mod.version?'v '+mod.version:'No version # provided',
			css: { fontSize: '12px', display: 'block' }
		})).append($('<span />', {
			id: 'jarTT_select_mod_author',
			html: mod.author?mod.author:'No one wants credit for this module',
			css: { fontSize: '12px', display: 'block' }
		}))).append($('<button />', {
			id: 'jarTT_module_install_btn',
			text: checked?'Uninstall':'Install',
			css: { float: 'right', 
				color: '#646464',
				backgroundColor: '#FBD863',
				textAlign: 'center',
				height: '52px',
				width: '130px',
				lineHeight: '1em',
				fontSize: '1.5em',
				fontWeight: 'bold',
				textShadow: 'white 0px 1px 0, black 0 -1px 0' 
			}
		}).button().click(function() {
			if (!$('#jarTT_module_item_'+m+'> :checkbox').attr('checked')) {
				jarTTLoad.loadScript(mod.url, m, function() { // Load script
					jarTT.log('Loading module - '+m);
				}, mod.options);
				jarTT.storage.setNamedData('modules', jarTT.storage.getNamedData('modules').concat(m)); // add that bitch
				$('#jarTT_module_item_'+m+'> :checkbox').attr('checked', 'checked');
				$(this).text('Uninstall');
			} else {
				var modules = jarTT.storage.getNamedData('modules')
				modules.splice(modules.indexOf(m), 1); // remove that bitch
				jarTT.storage.setNamedData('modules', modules);
				$('[src*="'+mod.url+'"]').remove(); // remove script from DOM
				$('#jarTT_module_item_'+m+'> :checkbox').removeAttr('checked');
				$(this).text('Install');
			}
		}));

		return headerWrapper;
	},
	getModuleDetails: function(m) {
		var mod = jarTT.modulebrowser.modules[m];
		var dets = $('<div />', {
			css: { fontSize: '16px' }
		});

		dets.append('<h3><u>Details</u></h3>');
		dets.append((mod.details?mod.details:'No details provided, check the source if you\'re curious'));
		dets.append('</br></br>Source: <a href="'+mod.url+'" target="_blank">clicky!</a>');

		return dets;
	}
}
