function shareURL(){
	chrome.tabs.query({active: true},function(tabs){
		var tab = tabs[0];
		var url = "https://plus.google.com/share?url="+encodeURIComponent(tab.url);
		chrome.windows.create({
			url: url,
			width: 400,
			height: 500,
			type: "popup"
		},(win)=>{
			chrome.tabs.onUpdated.addListener((tabId,changeInfo) =>{
				if(tabId === win.tabs[0].id){
					if(changeInfo.url){
						if(changeInfo.url == "https://plus.google.com/"){
							chrome.windows.remove(win.id);
						}
					}
				}
			});
		});
	});
}

chrome.contextMenus.create({
	id: "google-share",
	title: "Share on Google+",
	onclick: function(){
		shareURL();
	},
	contexts: ["all"]
});

chrome.browserAction.onClicked.addListener(() => {
	shareURL();
});
