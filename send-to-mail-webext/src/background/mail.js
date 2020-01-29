function SendToMail(){
	chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
		var activeTab = arrayOfTabs[0];
		var activeTabUrl = activeTab.url;
		var activeTabTitle = activeTab.title;
		chrome.tabs.create({
			url: "mailto:?to=&subject="+encodeURIComponent(activeTabTitle)+"&body="+encodeURIComponent(activeTabUrl)
		},function(){
			chrome.notifications.create({
				"type": "basic",
				"iconUrl": chrome.extension.getURL("icons/servermaildaemon.png"),
				"title": "Send to Mail",
				"message": "Opening mail handler"
			});	 
		});
});
}


chrome.browserAction.onClicked.addListener(SendToMail);

chrome.contextMenus.create({
	id: "send-to-mail-ctx",
	title: "Send this page via mail",
	onclick: SendToMail,
	contexts: ["all"]
});
