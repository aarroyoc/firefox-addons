var button=document.getElementById("submit");
button.addEventListener("click",function(){
	self.postMessage(document.getElementById("code").value);
});
