const data=require("self").data;
const { open } = require('sdk/window/utils');
const {Cc, Ci, Cu, Cr} = require("chrome");
var firefox=false;
var thunderbird=false;
var seamonkey=false;
var fennec=false;
var instantbird=false;
var nightingale=false;
var bluegriffon=false;
function readContent()
{
	return data.load("mozCleaner.html");
}
function firefoxSetup()
{
	var foxwidget=require("widget").Widget({
		id: "mozcleaner-widget",
		label: "mozCleaner",
		contentURL: data.url("mozCleaner-64.png"), 	
		onClick: function() {
			//Open UI for do a cleaning
			open("data:text/html,"+readContent(),{
			name: "mozCleaner",
			features: {
				width: 800,
				height: 600,
				chrome: true,
				popup: false
			}
		});
			
		}
	});

}
function fennecSetup()
{
	const utils = require('api-utils/window/utils');
	const recent = utils.getMostRecentBrowserWindow();
	let selector =  recent.NativeWindow.contextmenus.SelectorContext("*");
	recent.NativeWindow.contextmenus.add("mozCleaner",selector,function (target){
		//Open UI for do a cleaning
		openDialog("data:text/html,"+readContent(),{
			name: "mozCleaner",
			features: {
				width: 800,
				height: 600,
				chrome: true,
				popup: false
			}
		});
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






}
