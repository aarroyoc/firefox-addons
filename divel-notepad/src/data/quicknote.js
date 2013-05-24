/*
*	quicknote.js: Communicate webpage with addon
*/
self.port.on("initQuickNote", function() {
	//console.log("Welcome to Divel Notepad");
	var titleelement=document.getElementById("title");
	var bodyelement=document.getElementById("note");
	var button=document.getElementById("savenote");
	button.addEventListener("click",function()
	{
		//console.log("Click it");
		if(titleelement.value!="")
		{
			//console.log("Sending");
			self.port.emit("saveNote", titleelement.value,bodyelement.value);
		}
	}
	);
	
    
});
