//Share.js
self.port.on("init",function(image){
if(window.location.hostname!="plus.google.com"){
	document.body.innerHTML=document.body.innerHTML+"<img src=\""+image+"\" alt=\"Share on Google+\" style=\"width: 32px; height: 32px;\" id=\"google-share-android\">";
	var boton=document.getElementById("google-share-android");
	boton.addEventListener("click",function(){
		self.port.emit("sharing",document.URL);
	});
}
});
