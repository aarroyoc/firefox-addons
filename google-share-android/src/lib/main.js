var data=require("sdk/self").data;
var tabs=require("sdk/tabs");

exports.main=function(options){
	
	if(options.loadReason=="install"){
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons/page/google-share-android/welcome.html");
	}
	if(options.loadReason=="upgrade"){
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons/page/google-share-android/changelog.html"); //Changelog HTML file
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons");
	}
	require("sdk/simple-prefs").on("review",function (){
		tabs.open("http://addons.mozilla.org/en/mobile/addon/google-share-android");
	});
	var utils = require('sdk/window/utils');
	var win = utils.getMostRecentBrowserWindow();
	win.SelectionHandler.addAction({
		label: "Share on Google+",
		id: "google-share-android",
		icon: data.url("icon64.png"),
		action: function(){
			tabs.open("http://plus.google.com/share?url="+encodeURIComponent(win.BrowserApp.selectedTab.window.location.href));
		},
		selector: {
			matches: function(){
				return true;
			}
		}
	});
	/*let selector =  recent.NativeWindow.contextmenus.SelectorContext("*");
	recent.NativeWindow.contextmenus.add("Google+ Share",selector,function (target){
		require("tabs").open("http://plus.google.com/share?url="+encodeURIComponent(recent.BrowserApp.selectedTab.window.location.href));
	});*/
}
