const { open } = require('sdk/window/utils');
const {Cc, Ci, Cu, Cr} = require("chrome");
const data=require("self").data;

function XUL_Setup(windowType, contentAreaContextMenu, callback)
{
		let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
		var interfaz = {
		  onOpenWindow: function(aWindow) {
		    // Wait for the window to finish loading
		    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindow);
		    domWindow.addEventListener("load", function() {
		      domWindow.removeEventListener("load", arguments.callee, false);
		      XUL_CreateUI(domWindow, contentAreaContextMenu, callback);
		    }, false);
		  },
		 
		  onCloseWindow: function(aWindow) {},
		  onWindowTitleChange: function(aWindow, aTitle) {}
		};
		  // Load into any existing windows
		  let windows = wm.getEnumerator(windowType); //keep it void for all windows
		  while (windows.hasMoreElements()) {
		    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
		    XUL_CreateUI(domWindow, contentAreaContextMenu, callback);
		  }

		  // Load into any new windows
		  wm.addListener(interfaz);

}
function XUL_CreateUI(domWindow, contentAreaContextMenu,callback)
{
	var document=domWindow.document;
	var context=document.getElementById(contentAreaContextMenu);
	var menuitem=document.createElement("menuitem");
	menuitem.setAttribute("id","divmixer-menuitem");
	menuitem.setAttribute("label","DivMixer");
	menuitem.addEventListener("command", function()
	{
		callback(domWindow);	
	},true);
	context.appendChild(menuitem);

}
exports.XUL_UI=XUL_Setup;
//Standard XUL UI for SeaMonkey, Thunderbird, Instantbird, Nightingale, BlueGriffon and more
