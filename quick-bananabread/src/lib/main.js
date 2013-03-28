function QuickBananaBread(url)
{
	if(require("simple-prefs").prefs.notify==true)
	{
		var myIconURL = require("self").data.url("QBB64.png");
    		var notifications = require("notifications");
    		notifications.notify({
        		title: "Quick BananaBread",
        		text: "Ready for the action?",
        		iconURL: myIconURL
    		});
	}
	require("tabs").open("http://developer.mozilla.org/es/demos/detail/bananabread/launch");
}

exports.main=function(options){

if(options.loadReason=="install"){
	require("tabs").open("http://sites.google.com/site/divelmedia"); //Welcome HTML file
	
}
if(options.loadReason=="upgrade"){
	require("tabs").open(data.url("changelog.html")); //Changelog HTML file
	require("tabs").open("http://sites.google.com/site/divelmedia");
}
var mm = require("context-menu");
 var menuItem = mm.Item({
  label: "Quick BananaBread",
  contentScript: 'self.on("click", function () {' +
                 '  self.postMessage(document.URL);' +
                 '});',
  onMessage: function (url) {
   QuickBananaBread(url);
  }
});

require("simple-prefs").on("review",function (){
	require("tabs").open("http://addons.mozilla.org/en/firefox/addon/quick-bananabread");
});


var pluspanel=require("panel").Panel({
	height: require("simple-prefs").prefs.height,
	width: require("simple-prefs").prefs.width,
	contentURL: "http://developer.mozilla.org/es/demos/detail/bananabread/launch"

});

var pluswidget=require("widget").Widget({
	id: "quick-bananabread-widget",
	label: "Quick BananaBread",
	contentURL: require("self").data.url("QBB32.png"), 	
	panel: pluspanel
});



}
