var self = require('sdk/self');
var tabs = require("sdk/tabs");
var system = require("sdk/system");
var pageWorker = require("sdk/page-worker");
var pageMod = require("sdk/page-mod");

function searchForPhone(phone)
{
	var page=pageWorker.Page({
		contentURL: "http://wiki.nmn900.net/index.php?search="+phone+"&title=Especial%3ABuscar",
		contentScriptFile: self.data.url("wiki-search.js"),
		contentScriptWhen: "ready",
		onMessage: function(url){
			//SELECT PHONE WITH PAGEMOD
			pageMod.PageMod({
				include: url,
				contentScriptFile: self.data.url("mark-search.js"),
				onAttach: function(worker){
					worker.port.emit("phone",phone);
				}
			});
			tabs.open(url);
		}
	});
}

function parseText(text)
{
	/* REGEX (\d{3}(\s|-)\d{3}(\s|-)\d{3}|\d{3}(\s|-)\d{2}(\s|-)\d{2}(\s|-)\d{2}) */
	var reg=/(\d{3}(\s|-)\d{3}(\s|-)\d{3}|\d{3}(\s|-)\d{2}(\s|-)\d{2}(\s|-)\d{2})/g;
	var result=reg.exec(text);
	if(result==null || result.index<0)
	{
		//Not a phone number
	}else{
		//Get the first
		var phone=result[0];
		searchForPhone(phone);
	}
}

function firefoxUI()
{
	var selection=require("sdk/selection");
	var cm = require("sdk/context-menu");
	cm.Item({
		label: "Buscar número alternativo",
		context: cm.SelectionContext(),
		contentScript: "self.on('click',function(){self.postMessage(window.getSelection().toString())});",
		onMessage: function(text){
			parseText(text);
		}
	});
}

function fennecUI()
{
	var { Cu } = require("chrome");
	Cu.import("resource://gre/modules/Services.jsm");
	var window = Services.wm.getMostRecentWindow("navigator:browser");
	window.SelectionHandler.addAction({
      label: "Buscar número alternativo",
      id: "no-mas-900",
      icon: self.data.url("data/no-mas-900-64.png"),
      action: function(element){
		var text=window.BrowserApp.selectedTab.window.getSelection().toString();
		parseText(text);
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
	if(options.loadReason=="install")
	{
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons");
	}
	if(system.name=="Firefox")
	{
		firefoxUI();
	}
	if(system.name=="Fennec")
	{
		fennecUI();
	}
}
