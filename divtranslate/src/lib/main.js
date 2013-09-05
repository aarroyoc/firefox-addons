var firefox=false;
var fennec=false;
const data=require("self").data;
function TranslateUI()
{
	var pageMod=require("page-mod").PageMod({
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
		//Do a panel
		/*var panel=require("panel").Panel({
			width: 500,
			height: 500,
			contentURL: data.url("divtranslate.html")
		});
		panel.show();*/
		require("tabs").open(data.url("divtranslate.html"));
	}
	if(fennec)
	{
		//Do a tab
		require("tabs").open(data.url("divtranslate.html"));
	}
}
function Translate(page,user,text)
{
	var request=require("request").Request({
		url: "http://api.apertium.org/json/translate?q="+encodeURIComponent(text)+"&langpair="+encodeURIComponent(page+"|"+user),
		onComplete: function(response)
		{
			if(response.json.responseStatus==200)
			{
				var text=response.json.responseData.translatedText;
				require("notifications").notify({
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

	var qt=require("context-menu").Item({
	label: "QuickTrans",
	context: require("context-menu").SelectionContext(),
	contentScript: "self.on('click',function(){self.postMessage(window.getSelection().toString())});",
	onMessage: function(text){
		var userlang=require("simple-prefs").prefs.userlang;
		var pagelang=require("simple-prefs").prefs.pagelang;
		Translate(pagelang,userlang,text);

	}
	});
	var st=require("context-menu").Item({
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
	const utils = require('api-utils/window/utils');
	const recent = utils.getMostRecentBrowserWindow();
	let selector =  recent.NativeWindow.contextmenus.SelectorContext("*");
	recent.NativeWindow.contextmenus.add("Simple Translation",selector,function (target){
		TranslateUI();
	});
}
exports.main=function(options)
{
	var system=require("sdk/system/xul-app");
	if(system.name=="Firefox")
		firefox=true;
	if(system.name=="Fennec")
		fennec==true;
	require("simple-prefs").on("review",function (){
			require("tabs").open("http://addons.mozilla.org/en/firefox/addon/divtranslate");
	});
	var date=new Date();
	if(date.getMonth()+1==9 && date.getDay()==25)
	{
		//Easter egg for birthday
		require("tabs").open("http://adrianarroyocalle.github.io/firefox-addons/birthday.html");
	}
	if(date.getMonth()+1==12 && date.getDay()==28)
	{
		//Easter egg for 28th December
		require("tabs").open("http://adrianarroyocalle.github.io/firefox-addons/joke.html");
	}
	if(date.getMonth()+1==4 && date.getDay()==1)
	{
		//Easter egg for April Fool's day
		require("tabs").open("http://adrianarroyocalle.github.io/firefox-addons/joke.html");
	}
	if(options.loadReason=="install")
	{
		require("tabs").open("http://adrianarroyocalle.github.io/firefox-addons");
	}
	if(options.loadReason=="upgrade")
	{
		//Do something with the changelog
	}
	if(firefox)
		firefoxSetup();
	if(fennec)
		fennecSetup();
	
}
