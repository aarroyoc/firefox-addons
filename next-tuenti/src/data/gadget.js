var applyButton=document.getElementById("apply");
var textArea=document.getElementById("gadget");
applyButton.addEventListener("click",function(){
	self.port.emit("apply",textArea.value);
});
self.port.on("default",function(gadget){
	textArea.value=gadget;
});
