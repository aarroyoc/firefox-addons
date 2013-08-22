var counter=document.getElementById("notificationsBubbleCount");
if(counter)
	self.port.emit("notifications",counter.textContent);
self.port.on("gadget",function(gadget){
	var feed=document.getElementById("eventManagementModule");
	if(feed)
	{
		var iframe=document.createElement("iframe");
		iframe.style.border="none";
		iframe.style.width="100%";
		iframe.src="data:text/html, "+gadget;
		feed.parentElement.insertBefore(iframe,feed);
	}
});
