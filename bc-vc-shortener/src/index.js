var self = require("sdk/self");
var tabs = require("sdk/tabs");
var cm = require("sdk/context-menu");
var request = require("sdk/request");
var clipboard = require("sdk/clipboard");
var simplePrefs = require("sdk/simple-prefs");

function CopyToClipboard(url){
	clipboard.set(url);
}

function ShortenLink(url){
	var apiKey=simplePrefs.prefs.apiKey;//"6256ed64ce9c6cae6b3ca09034ae3eaa";
	var uid=simplePrefs.prefs.uid;//"96749";
	var apiUrl="http://bc.vc/api.php?key="+apiKey+"&uid="+uid+"&url="+encodeURIComponent(url);
	var req=request.Request({
		url: apiUrl,
		onComplete: function(response){
			var shortenLink=response.text;
			CopyToClipboard(shortenLink);
		}
	});
	req.get();
}

exports.main=function(options){
	if(options.loadReason=="install"){
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons?utm_source=AddonInstall&utm_campaign=BcVcShorthener&utm_medium=Addon");
		tabs.open("http://adrianarroyocalle.github.io?utm_source=AddonInstall&utm_campaign=BcVcShorthener&utm_medium=Addon");
	}
	if(options.loadReason=="upgrade"){
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons?utm_source=AddonUpgrade&utm_campaign=BcVcShorthener&utm_medium=Addon");
		tabs.open("http://adrianarroyocalle.github.io?utm_source=AddonUpgrade&utm_campaign=BcVcShorthener&utm_medium=Addon");
	}
	
	cm.Item({
		label: "Shorten tab's URL and copy to clipboard",
		contentScript: "self.on('click',function(){self.postMessage(document.URL);});",
		onMessage: function(url){
			ShortenLink(url);
		}
	});
}
