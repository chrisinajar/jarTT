
# jarTT
### A turntable.fm modification
jarTT is a series of tools to make turntable.fm run fast and in a more informative manner.
By design it does not touch the song queue or chat box in an attempt to keep compatibility 
with other turntable mods.

# Try it out
This mod supports being unloaded, it cleans up all event handlers and removes all dom elements added and unsets it's global variable. Loading the mod more than once will make it automatically unload the old version. This means you can update without refreshing the pagem, or remove it if you don't like it.

## Bookmarklet
<a class="minibutton" href="javascript:(function(){$.getScript('https://raw.github.com/chrisinajar/jarTT/master/jarTT.js');})();">jarTT</a>

