/*
TODO: Icons
Review preference button
install.rdf.merge
Changelog page
Change index.html img/logo.png
*/

const data=require("self").data;
var firefox=false;
var fennec=false;
var seamonkey=false;
var thunderbird=false;
var instantbird=false;
var bluegriffon=false;

function FirefoxSetup()
{
	var cm=require("context-menu").Item({
		label: "DivMixer",
		contentScript: "self.on('click',function(){self.postMessage();});",
		onMessage: function()
		{
			require("tabs").open(data.url("index.html"));	
		}
	});
}
function FennecSetup()
{
	const utils = require('api-utils/window/utils');
	const recent = utils.getMostRecentBrowserWindow();
	let selector =  recent.NativeWindow.contextmenus.SelectorContext("*");
	recent.NativeWindow.contextmenus.add("DivMixer",selector,function (target){
		require("tabs").open(data.url("index.html"));
	});
}
exports.main=function()
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
	}else if(system.name=="BlueGriffon")
	{
		bluegriffon=true;
	}
	if(firefox)
	{
		FirefoxSetup();
	}
	if(fennec)
	{
		FennecSetup();
	}
	if(thunderbird)
	{
		// We must create XUL_UI_2 with a callback function
		//ThunderbirdSetup();
		require("./XUL_UI_2").XUL_UI("mail:3pane","mailContext",function(dom){
			var tabmail=dom.document.getElementById("tabmail");
			tabmail.openTab("contentTab",{contentPage: data.url("index.html")});
		});
	}
	if(seamonkey)
	{
		//XUL_UI_2
		//SeaMonkeySetup();
		require("./XUL_UI_2").XUL_UI("navigator:browser","contentAreaContextMenu",function(dom){
			dom.open(data.url("index.html"),"DivMixer","_blank");
		});
	}
	if(instantbird)
	{
		require("./XUL_UI_2").XUL_UI("Messenger:convs","contentAreaContextMenu",function(dom){
			dom.open(data.url("index.html"),"DivMixer","_blank");
		});
	}
	if(bluegriffon)
	{
		require("./XUL_UI_2").XUL_UI("bluegriffon","editorContextMenu",function(dom){
			dom.open(data.url("index.html"),"DivMixer","_blank");
		});
	}
	if(fennec || firefox)
	{
		if(options.loadReason=="install"){
		require("tabs").open("http://adrianarroyocalle.github.io/firefox-addons");	
		}
		if(options.loadReason=="upgrade"){
		 //require("tabs").open(data.url("changelog.html")); //Changelog HTML file
		 //require("tabs").open("http://sites.google.com/site/divelonline");	
		}

	}
}
