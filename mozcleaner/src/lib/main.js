const data=require("self").data;
const { open } = require('sdk/window/utils');
const {Cc, Ci, Cu, Cr} = require("chrome");
var firefox=false;
var thunderbird=false;
var seamonkey=false;
var fennec=false;
var instantbird=false;
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
function instantbirdUI(domWindow)
{
	var document=domWindow.document;
	var context=document.getElementById("contentAreaContextMenu");
	var menuitem=document.createElement("menuitem");
	menuitem.setAttribute("id","mozcleaner-instantbird");
	menuitem.setAttribute("label","mozCleaner");
	menuitem.addEventListener("command", function()
	{
		//Open UI for do cleaning
		//domWindow.open(URL,"DivFind","_blank");
		open("data:text/html,"+readContent(),{
			name: "mozCleaner",
			features: {
				width: 800,
				height: 600,
				chrome: true,
				popup: false
			}
		});
	
	},true);
	context.appendChild(menuitem);
}
function instantbirdSetup()
{
		let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
		var interfaz = {
		  onOpenWindow: function(aWindow) {
		    // Wait for the window to finish loading
		    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
		    domWindow.addEventListener("load", function() {
		      domWindow.removeEventListener("load", arguments.callee, false);
		      instantbirdUI(domWindow);
		    }, false);
		  },
		 
		  onCloseWindow: function(aWindow) {},
		  onWindowTitleChange: function(aWindow, aTitle) {}
		};
		  // Load into any existing windows
		  let windows = wm.getEnumerator("Messenger:convs"); //Messenger:convs for conversations on Instantbird, void for all
		  while (windows.hasMoreElements()) {
		    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
		    instantbirdUI(domWindow);
		  }

		  // Load into any new windows
		  wm.addListener(interfaz);
}
function seaUI(domWindow){
	var document=domWindow.document;
	var context=document.getElementById("contentAreaContextMenu");
	var menuitem=document.createElement("menuitem");
	menuitem.setAttribute("id","mozcleaner-seamonkey");
	menuitem.setAttribute("label","mozCleaner");
	menuitem.addEventListener("command", function()
	{
		//Open UI for do cleaning
		//domWindow.open(URL,"DivFind","_blank");
		open("data:text/html,"+readContent(),{
			name: "mozCleaner",
			features: {
				width: 800,
				height: 600,
				chrome: true,
				popup: false
			}
		});
	
	},true);
	context.appendChild(menuitem);

}
function seamonkeySetup(){
		let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
		var interfaz = {
		  onOpenWindow: function(aWindow) {
		    // Wait for the window to finish loading
		    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
		    domWindow.addEventListener("load", function() {
		      domWindow.removeEventListener("load", arguments.callee, false);
		      seaUI(domWindow);
		    }, false);
		  },
		 
		  onCloseWindow: function(aWindow) {},
		  onWindowTitleChange: function(aWindow, aTitle) {}
		};
		  // Load into any existing windows
		  let windows = wm.getEnumerator("navigator:browser"); //keep it void for all windows
		  while (windows.hasMoreElements()) {
		    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
		    seaUI(domWindow);
		  }

		  // Load into any new windows
		  wm.addListener(interfaz);

}
function thunderUI(domWindow)
{
	document=domWindow.document;
	var context=document.getElementById("mailContext");
	var menuitem=document.createElement("menuitem");
	var tabmail=document.getElementById("tabmail");
	menuitem.setAttribute("id", "mozcleaner-thunderbird");
	menuitem.setAttribute("label", "mozCleaner");
	menuitem.addEventListener("command", function(){
		//Open UI for do cleaning
		//tabmail.openTab("contentTab",{contentPage: data.url("divfind.html?SEARCH=NULL&JSON=NULL")});
		open("data:text/html,"+readContent(),{
			name: "mozCleaner",
			features: {
				width: 800,
				height: 600,
				chrome: true,
				popup: false
			}
		});

	}, true);
	context.appendChild(menuitem);
}
function thunderbirdSetup(){
		let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
		var interfaz = {
		  onOpenWindow: function(aWindow) {
		    // Wait for the window to finish loading
		    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
		    domWindow.addEventListener("load", function() {
		      domWindow.removeEventListener("load", arguments.callee, false);
		      thunderUI(domWindow);
		    }, false);
		  },
		 
		  onCloseWindow: function(aWindow) {},
		  onWindowTitleChange: function(aWindow, aTitle) {}
		};
		  // Load into any existing windows
		  let windows = wm.getEnumerator("mail:3pane"); //navigator:browser in Firefox and Fennec
		  while (windows.hasMoreElements()) {
		    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
		    thunderUI(domWindow);
		  }

		  // Load into any new windows
		  wm.addListener(interfaz);

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
	}else
	{
		instantbird=true;
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
		thunderbirdSetup();
	}
	if(seamonkey)
	{
		//ContextMenu
		seamonkeySetup();
	}
	if(instantbird)
	{
		instantbirdSetup();
	}






}
