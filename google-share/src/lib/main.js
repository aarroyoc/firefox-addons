const contextMenu=require("context-menu");
const data=require("self").data;
const widget=require("widget");
const panel=require("panel");
const pref=require("simple-storage");
const tab=require("tabs");
const win=require("windows").browserWindows;
const addontab=require("addon-page");
const prefs=require("simple-prefs").prefs;
const _ = require("l10n").get;
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
    var notifications = require("notifications");
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
	require("tabs").open(data.url("welcome.html")); //Welcome HTML file
	//Configurar con pagina XUL o HTML o Javascript
	
}
if(options.loadReason=="upgrade"){
	require("tabs").open(data.url("changelog.html")); //Changelog HTML file
}

 var mm = require("context-menu");
 var menuItem = mm.Item({
  label: "Share on Google+",
  contentScript: 'self.on("click", function () {' +
                 '  self.postMessage(document.URL);' +
                 '});',
  onMessage: function (url) {
    ShareURL(url);
  }
});

require("simple-prefs").on("review",function (){
	require("tabs").open("http://addons.mozilla.org/en/firefox/addon/google-share");
});


var pluspanel=panel.Panel({
	height: prefs.height,
	width: prefs.width,
	contentURL: "about:blank"

});

var pluswidget=widget.Widget({
	id: "google-share-widget",
	label: "Google+ Share",
	contentURL: data.url("icon64.png"), 	
	panel: pluspanel,
	onClick: function() {
		pluspanel.contentURL="http://plus.google.com/share?url="+tab.activeTab.url;		
	}
});


}
