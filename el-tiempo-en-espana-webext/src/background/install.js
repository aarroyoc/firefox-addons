if(chrome.runtime.onInstalled){
	chrome.runtime.onInstalled.addListener(function(details){
		if(details.reason == "install"){
			chrome.tabs.create({
				url: "http://adrianarroyocalle.github.io/norax/es?utm_source=AddonInstall&utm_campaign=ElTiempoEnEspana&utm_medium=Addon",
				url: "http://adrianarroyocalle.github.io/norax/es/addon/el-tiempo-en-espana?utm_source=AddonInstall&utm_campaign=ElTiempoEnEspana&utm_medium=Addon"
			});
		}else if(details.reason == "update"){
			chrome.tabs.create({
				url: "http://adrianarroyocalle.github.io/norax/es?utm_source=AddonUpgrade&utm_campaign=ElTiempoEnEspana&utm_medium=Addon"
			});
		}
	});
	chrome.runtime.setUninstallURL("http://adrianarroyocalle.github.io/norax/es?utm_source=AddonUninstall&utm_campaign=ElTiempoEnEspana&utm_medium=Addon");
}
