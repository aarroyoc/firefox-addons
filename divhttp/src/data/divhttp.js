function listenerStart()
{
	var folder=document.getElementById("folder");
	var port=document.getElementById("port");
	var start=document.getElementById("start");
	var portnumber=parseInt(port.value);
	var dirstring=folder.value;
	self.port.emit("startServer",dirstring,portnumber);
	var stop=document.getElementById("stop");
	stop.disabled=false;
	start.disabled=true;

}
function listenerStop()
{
	var start=document.getElementById("start");
	var stop=document.getElementById("stop");
	stop.disabled=true;
	start.disabled=false;
	self.port.emit("stopServer");
}
self.port.on("startUI",function(defdir,defport){	
	var folder=document.getElementById("folder");
	var port=document.getElementById("port");
	var start=document.getElementById("start");
	folder.value=defdir;
	port.value=defport;
	start.addEventListener("click",listenerStart);


});
self.port.on("stopUI",function(){
	var stop=document.getElementById("stop");
	stop.addEventListener("click",listenerStop);
	
	
});
