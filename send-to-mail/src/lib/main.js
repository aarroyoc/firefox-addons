const {Cc, Ci, Cu, Cr} = require("chrome");
const { open } = require('sdk/window/utils');
const data=require("sdk/self").data;
var firefox=false;
var thunderbird=false;
var seamonkey=false;
var fennec=false;
var instantbird=false;
var nightingale=false;
var bluegriffon=false;
function SendToMailURL(url)
{
	if(firefox){
		require("sdk/tabs").activeTab.url="mailto:?to=&subject="+encodeURIComponent("Send to Mail")+"&body="+encodeURIComponent(url);
		require("sdk/notifications").notify({
			title: "Send to Mail",
			text: "Opened handler for mail",
			iconURL: data.url("haiku/servermaildaemon.png")
		});
	}
}
function firefoxSetup()
{
	var cm = require("sdk/context-menu");
	var shareItem = cm.Item({
		label: "Send to Mail",
		contentScript: 'self.on("click", function () {' +
				'  self.postMessage(document.URL);' +
				'});',
		context: cm.PageContext(),
		onMessage: function (url) {
			SendToMailURL(url);
		}
	});
}
function fennecSetup()
{
	const utils = require('sdk/window/utils');
	const recent = utils.getMostRecentBrowserWindow();
	let selector =  recent.NativeWindow.contextmenus.SelectorContext("*");
	recent.NativeWindow.contextmenus.add("Send to Mail",selector,function (target){
		//var url=target.location.href;
		Cu.import("resource://gre/modules/Services.jsm");
		Cu.import("resource://gre/modules/HelperApps.jsm");
		let window = Services.wm.getMostRecentWindow("navigator:browser");
		var url=window.BrowserApp.selectedTab.browser.currentURI.spec;
		var uri="mailto:?to=&subject="+encodeURIComponent("Send to Mail")+"&body="+encodeURIComponent(url);
		
		//HelperApps.launchURI(uri);
		let apps = HelperApps.getAppsForUri(Services.io.newURI(uri,null,null));

		// Assuming apps.length > 0
		HelperApps.prompt(apps, {
		  title:"Send to Mail",
		  buttons: ["OK", "Cancel"]
		}, function(result) {
		  var index = result.button == 0 ? result.icongrid0 : undefined;
		  if (index != undefined) apps[index].launch();
		});
	});
}
exports.main=function(options)
{
	var system=require("sdk/system/xul-app");
	if(system.name=="Fennec")
	{
		fennec=true;
	}else if(system.name=="Firefox")
	{
		firefox=true;
	}else if(system.name=="SeaMonkey")
	{
		seamonkey=true;
	}else if(system.name=="Thunderbird")
	{
		thunderbird=true;
	}else if(system.name=="Instantbird")
	{
		instantbird=true;
	}else if(system.name=="Nightingale")
	{
		nightingale=true;
	}else if(system.name="BlueGriffon")
	{
		bluegriffon=true;
	}
	if(firefox)
	{
		//Widget, Hotkey, ContextMenu Search
		firefoxSetup();
	}
	if(fennec)
	{
		//ContextMenu Search
		//Menu
		fennecSetup();
	}
	if(thunderbird)
	{
		//ContextMenu
		//thunderbirdSetup();
		require("./XUL_UI").XUL_UI("mail:3pane","mailContext");
	}
	if(seamonkey)
	{
		//ContextMenu
		//seamonkeySetup();
		require("./XUL_UI").XUL_UI("navigator:browser","contentAreaContextMenu");
	}
	if(instantbird)
	{
		//instantbirdSetup();
		require("./XUL_UI").XUL_UI("Messenger:convs","contentAreaContextMenu");
	}
	if(nightingale)
	{
		//Songbird:MediaPage
		require("./XUL_UI").XUL_UI("Songbird:MediaPage","contentAreaContextMenu");
	}
	if(bluegriffon)
	{
		//BLUEGRIFFON
		require("./XUL_UI").XUL_UI("bluegriffon","editorContextMenu");
	}
	if(firefox || fennec)
	{
		if(options.loadReason=="install")
		{
			require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons");
			require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons/page/send-to-mail/welcome.html");
		}
		require("sdk/simple-prefs").on("review",function (){
			require("sdk/tabs").open("http://addons.mozilla.org/en/firefox/addon/send-to-mail");
		});
	}
}
