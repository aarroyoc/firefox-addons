if(chrome.runtime.onInstalled){
	//var lang = navigator.language.substring(0,2);
	var lang = chrome.i18n.getUILanguage().substring(0,2);
	var langIndex = lang;
	if(lang == "en"){
		langIndex = "";
	}
	if(lang != "es" && lang != "fr" && lang != "de" && lang != "zh" && lang != "ja" && lang != "ru"){
		langIndex = "";
		lang = "en";
	}
	chrome.runtime.onInstalled.addListener(function(details){
		if(details.reason == "install"){
			chrome.tabs.create({url: "http://adrianarroyocalle.github.io/norax/"+langIndex+"?utm_source=AddonInstall&utm_campaign=SendToMail&utm_medium=Addon"});
			chrome.tabs.create({url: "http://adrianarroyocalle.github.io/norax/"+lang+"/addon/send-to-mail?utm_source=AddonInstall&utm_campaign=SendToMail&utm_medium=Addon"});
		}else if(details.reason == "update"){
			chrome.tabs.create({
				url: "http://adrianarroyocalle.github.io/norax/"+langIndex+"?utm_source=AddonUpgrade&utm_campaign=SendToMail&utm_medium=Addon"
			});
		}
	});
	chrome.runtime.setUninstallURL("http://adrianarroyocalle.github.io/norax/"+langIndex+"?utm_source=AddonUninstall&utm_campaign=SendToMail&utm_medium=Addon");
}
