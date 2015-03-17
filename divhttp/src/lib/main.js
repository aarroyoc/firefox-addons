const data=require("sdk/self").data;
const tabs=require("sdk/tabs");
const prefs=require("sdk/simple-prefs").prefs;
var _=require("sdk/l10n").get;
var srv;
exports.main=function(options)
{
	if(options.loadReason=="install"){
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons?utm_source=AddonInstall&utm_campaign=DivHTTP&utm_medium=Addon");
	}
	if(options.loadReason=="upgrade"){
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons?utm_source=AddonUpgrade&utm_campaign=DivHTTP&utm_medium=Addon");
	}
	require("sdk/simple-prefs").on("review",function (){
		tabs.open("http://addons.mozilla.org/en/firefox/addon/divhttp");
	});
	var panel=require("sdk/panel").Panel({
		height: 200,
		width: 500,
		contentURL: data.url("divhttp.html"),
		contentScriptFile: data.url("divhttp.js")
	});
	var ActionButton=require("sdk/ui/button/action").ActionButton;
	var widget=ActionButton({
		id: "divhttp-widget",
		label: _("DivHTTP"),
		icon: {
			"32" : data.url("divhttp32.png"),
			"64" : data.url("divhttp64.png"),
			"128" : data.url("divhttp128.png")
		},
		onClick: function(state){
			panel.show({position: widget});
			panel.port.emit("startUI",prefs.defdir,prefs.defport);
		}

	});
	panel.port.on("startServer",function(dir,port){
		var { startServerAsync } = require("./httpd.js");
		srv = startServerAsync(port, dir);
		if(prefs.notify)
		{
			require("sdk/notifications").notify({
				title: _("DivHTTP"),
				text: _("Server started and listening"),
				iconURL: data.url("divhttp64.png")

			});
		}
		panel.port.emit("stopUI");
		require("sdk/system/unload").when(function cleanup() {
		  srv.stop(function() { 
			//System power-off
		  });
		});

	});
	panel.port.on("stopServer",function(){
		srv.stop(function(){
			//User power-off
			if(prefs.notify)
			{
				require("sdk/notifications").notify({
					title: _("DivHTTP"),
					text: _("Server stoped"),
					iconURL: data.url("divhttp64.png")
				});
			}
			panel.port.emit("startUI",prefs.defdir,prefs.defport);
		});
	});




}
