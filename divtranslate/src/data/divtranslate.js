function get(id)
{
	return document.getElementById(id);
}
var translate=get("translate");
var original=get("original");
var from=get("from");
var to=get("to");
translate.addEventListener("click",function(){
	self.port.emit("translate",from.value,to.value,original.value);
});
