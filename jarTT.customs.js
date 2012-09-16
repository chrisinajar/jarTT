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
 
// show ttcustoms avatars. heck yeah!

jarTT.customs = {
	loadAvatars: function(data) {
		for (var userid in data) (function(userid, avatar) {
			userid = avatar.userid;
			//if (userid == "4e26e4214fe7d05f3a07a176")
				//userid = '4f9ab294eb35c15fda0002b6';

			var user = ttObjects.room.users[userid];
			if (!user)
				return;

			if (avatar.baseid)
				user.avatarid = avatar.baseid;

			console.log("Avatar ", avatar);

			if (avatar.processing) {
				for (var i in avatar.processing) (function(i, swap) {
					console.log('heres a swap ', swap);

					if (!jarTT.avatar.swapmap[userid])
						jarTT.avatar.swapmap[userid] = {};
					var img = util.createImageWithLoader(swap[1]);
					var deff = img[1];
					img = img[0];

					deff.done(function() {
						var scaleFactor = 2;//1+(avatar.scale/100);
						img.width *= scaleFactor;
						img.height *= scaleFactor;
						img.x *= scaleFactor;
						img.y *= scaleFactor;
						jarTT.avatar.swapmap[userid][swap[0]] = img;
					}).fail(function() {

					});
				})(i, avatar.processing[i]);
			}

			ttObjects.room.refreshRoomUser(user);
		})(userid, data[userid]);
	},
	load: function() {
		$.ajax({
			dataType: 'json', 
			url: 'http://turntablecustoms.com/mods/customavatardatabasenew.php',
			success: function(data) {
				jarTT.customs.loadAvatars(data);
			}
		});
	}
}
