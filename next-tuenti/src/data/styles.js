var applyButton=document.getElementById("apply");
var colorHeader=document.getElementById("colorHeader");
var backgroundImage=document.getElementById("backgroundImage");
var notificationsColor=document.getElementById("notificationsColor");
applyButton.addEventListener("click",function(){
	self.port.emit("apply",colorHeader.value,backgroundImage.value,notificationsColor.value);
});
self.port.on("default",function(ch,bi,nc){
	colorHeader.value=ch;
	backgroundImage.value=bi;
	notificationsColor.value=nc;
});
