# jarTT
### A turntable.fm modification
jarTT is a series of tools to make turntable.fm run fast and in a more informative manner.
By design it does not touch the song queue or chat box in an attempt to keep compatibility 
with other turntable mods.

# Try it out
This mod supports being unloaded, it cleans up all event handlers and removes all dom elements added and unsets it's global variable. Loading the mod more than once will make it automatically unload the old version. This means you can update without refreshing the pagem, or remove it if you don't like it.

## Chrome Extension
By far the easiest way to get things done in Chrome. Go here, install it: http://userscripts.org/scripts/show/125950
https://chrome.google.com/webstore/detail/jartt/cohnlgocahnimdhmbooiohlccomcdjam

## GreaseMonkey
By far the easiest way to get things done for the non-chrome users. Go here, install it: http://userscripts.org/scripts/show/125950

## Bookmarklet
(The hard way)
Bookmark the following link and click on it from the turntable.fm window: <a href="javascript:(function(){$.getScript('https://raw.github.com/chrisinajar/jarTT/master/jarTT.js');})();" > jarTT </a>

## Code
For those who are interested, here is the manual javascript to load it:
<code>
(function(){$.getScript('https://raw.github.com/chrisinajar/jarTT/master/jarTT.js');})();
</code>