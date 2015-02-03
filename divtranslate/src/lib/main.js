var firefox=false;
var fennec=false;
const data=require("sdk/self").data;
const tabs=require("sdk/tabs");
const pageMod=require("sdk/page-mod");
const request=require("sdk/request");
const notifications=require("sdk/notifications");
const cm=require("sdk/context-menu");
const prefs=require("sdk/simple-prefs").prefs;

//var endpoint="http://api.apertium.org/json"; //Java ScaleMT API - Down
var endpoint="http://apy.projectjj.com"; //APY in Python 3

function TranslateUI()
{
	var pMod=pageMod.PageMod({
		include: data.url("divtranslate.html"),
		contentScriptFile: data.url("divtranslate.js"),
		onAttach: function(worker)
		{

			worker.port.on("translate",function(page,user,text){
				Translate(page,user,text);

			});
		}
	});
	if(firefox)
	{
		tabs.open(data.url("divtranslate.html"));
	}
	if(fennec)
	{
		//Do a tab
		tabs.open(data.url("divtranslate.html"));
	}
}
function Translate(page,user,text)
{
	var req=request.Request({
		url: endpoint+"/translate?q="+encodeURIComponent(text)+"&langpair="+encodeURIComponent(page+"|"+user),
		onComplete: function(response)
		{
			if(response.json.responseStatus==200)
			{
				var text=response.json.responseData.translatedText;
				notifications.notify({
					title: "DivTranslate",
					text: text,
					iconURL: data.url("divtranslate64.png")
				});
			}		
		}
	}).get();

}
function firefoxSetup()
{

	var qt=cm.Item({
	label: "QuickTrans",
	context: cm.SelectionContext(),
	contentScript: "self.on('click',function(){self.postMessage(window.getSelection().toString())});",
	onMessage: function(text){
		var userlang=prefs.userlang;
		var pagelang=prefs.pagelang;
		Translate(pagelang,userlang,text);

	}
	});
	var st=cm.Item({
		label: "Simple Translation",
		contentScript: "self.on('click',function(){self.postMessage();});",
		onMessage: function()
		{
			TranslateUI();
		}
	});

}
function fennecSetup()
{
	const utils = require('sdk/window/utils');
	var win = utils.getMostRecentBrowserWindow();
	win.SelectionHandler.addAction({
		label: "DivTranslate",
		id: "divtranslate-button",
		icon: data.url("divtranslate.svg"),
		action: function(){
			TranslateUI();
		},
		selector: {
			matches: function(){
				return true;
			}
		}
	});
}
exports.main=function(options)
{
	var system=require("sdk/system/xul-app");
	if(system.name=="Firefox")
		firefox=true;
	if(system.name=="Fennec")
		fennec==true;
	require("sdk/simple-prefs").on("review",function (){
		tabs.open("http://addons.mozilla.org/en/firefox/addon/divtranslate");
	});
	if(options.loadReason=="install")
	{
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons");
	}
	if(options.loadReason=="upgrade")
	{
		//Do something with the changelog
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons");
	}
	if(firefox)
		firefoxSetup();
	if(fennec)
		fennecSetup();
	
}
