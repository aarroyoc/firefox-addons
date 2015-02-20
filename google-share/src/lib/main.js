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
function ConfigPage(url){
	/*var addontab = require("addon-page");
    	addontab.open(data.url("changelog.html")); //Config HTML file*/

}
function Configuration(){
		//Provisional
	prefs.openwith = 3; //Number 1->Window Number 2->Tab Number 3->Panel
    	prefs.notify = true; //true: Notify enabled
	prefs.width = 400;
	prefs.height = 200;
}
function Notify(url){
    var myIconURL = data.url("icon64.png");
    var notifications = require("sdk/notifications");
    notifications.notify({
        title: "Google+ Share",
        text: "Sharing "+url,
        iconURL: myIconURL,
        onClick: function (data) {
            //console.log("Click");
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
		height: prefs.height, //Tener configuracion
		width: prefs.width, //Tener configuracion
		contentURL: url

	});
	pluspanel.show();


}
function ShareURL(url){
	var PlusURL="http://plus.google.com/share?url="+encodeURIComponent(url);
	//console.log("Try to open"+PlusURL);
	//console.log(prefs.openwith)
	switch(prefs.openwith){
		case "1":OpenWindow(PlusURL);break;		
		case "2":OpenTab(PlusURL);break;
		case "3":OpenPanel(PlusURL);break; //Default
		default: ConfigPage(PlusURL);//console.log("Error, no preferences set");
	}
	if(prefs.notify){
		Notify(url);
	}
}

exports.main=function(options){

if(options.loadReason=="install"){
	require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons/page/google-share/welcome.html");
	
}
if(options.loadReason=="upgrade"){
	require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons/page/google-share/changelog.html");
}

 var mm = require("sdk/context-menu");
 var menuItem = mm.Item({
  label: "Share on Google+",
  contentScript: 'self.on("click", function () {' +
                 '  self.postMessage(document.URL);' +
                 '});',
  onMessage: function (url) {
    ShareURL(url);
  }
});
var shareHotKey = Hotkey({
  combo: prefs.hotkey,
  //combo: "accel-shift-s",
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
	label: "Google+ Share",
	icon: {
		"32" : data.url("icon32.png"),
		"64" : data.url("icon64.png")
	},
	onClick: function(){
		pluspanel.contentURL="http://plus.google.com/share?url="+encodeURIComponent(tab.activeTab.url);
		pluspanel.show({
				position: pluswidget
		});
	}
});

}
