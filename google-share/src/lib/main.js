const contextMenu=require("sdk/context-menu");
const data=require("sdk/self").data;
const panel=require("sdk/panel");
const pref=require("sdk/simple-storage");
const tab=require("sdk/tabs");
const win=require("sdk/windows").browserWindows;
const prefs=require("sdk/simple-prefs").prefs;
const _ = require("sdk/l10n").get;
const { Hotkey } = require("sdk/hotkeys");
var height=600;
var width=800;

function Notify(url){
    var myIconURL = data.url("icon64.png");
    var notifications = require("sdk/notifications");
    notifications.notify({
        title: _("Google+ Share"),
        text: _("Sharing")+" "+url,
        iconURL: myIconURL,
        onClick: function (data) {
			
        }
    });
}
function OpenWindow(url){
	win.open(url);
}
function OpenTab(url){
	tab.open(url);
}
function OpenPanel(url){
	var pluspanel=panel.Panel({
		height: prefs.height,
		width: prefs.width,
		contentURL: url
	});
	pluspanel.show();
}
function ShareURL(url){
	var PlusURL="http://plus.google.com/share?url="+encodeURIComponent(url);
	switch(prefs.opener){
		case 0:OpenWindow(PlusURL);break;		
		case 1:OpenTab(PlusURL);break;
		case 2:
		default:
		OpenPanel(PlusURL);break;
	}
	if(prefs.notify){
		Notify(url);
	}
}

exports.main=function(options){

	if(options.loadReason=="install"){
		require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons/page/google-share/welcome.html");
		require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons?utm_source=AddonInstall&utm_campaign=GoogleShare&utm_medium=Addon");
	}
	if(options.loadReason=="upgrade"){
		require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons/page/google-share/changelog.html");
		require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons?utm_source=AddonUpgrade&utm_campaign=GoogleShare&utm_medium=Addon");
	}

	var mm = require("sdk/context-menu");
	var menuItem = mm.Item({
	 label: _("Share on Google+"),
	 contentScript: 'self.on("click", function () {' +
					'  self.postMessage(document.URL);' +
					'});',
	 onMessage: function (url) {
	   ShareURL(url);
	 }
	});
	
	var shareHotKey = Hotkey({
	  combo: prefs.hotkey,
	  onPress: function() {
		ShareURL(tab.activeTab.url);
	  }
	});

	require("sdk/simple-prefs").on("review",function (){
		require("sdk/tabs").open("http://addons.mozilla.org/en/firefox/addon/google-share");
	});


	var pluspanel=panel.Panel({
		height: prefs.height,
		width: prefs.width,
		contentURL: "about:blank"

	});
	var { ActionButton }=require("sdk/ui/button/action");
	var pluswidget=ActionButton({
		id: "google-share-widget",
		label: _("Share on Google+"),
		icon: {
			"32" : data.url("icon32.png"),
			"64" : data.url("icon64.png")
		},
		onClick: function(){
			var PlusURL="http://plus.google.com/share?url="+encodeURIComponent(tab.activeTab.url);
			switch(prefs.opener){
				case 0:OpenWindow(PlusURL);break;
				case 1:OpenTab(PlusURL);break;
				case 2:
				default:
					pluspanel.contentURL=PlusURL;
					pluspanel.show({
						position: pluswidget
					});
			}
		}
	});

}
