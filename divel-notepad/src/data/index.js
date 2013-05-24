/*
* Script for pass data from Addon to Webpage
*/
self.port.on("initScript",function()
{
	var remove=document.getElementById("delete");
	remove.addEventListener("click",function()
	{
		//Pasar UUID para borrar
		var datas=document.getElementsByTagName("input");
		var counter=0;
		while(datas[counter])
		{
			if(datas[counter].checked==1)
			{
				self.port.emit("delete",datas[counter].id);
			}
			counter++;

		}
	});
	
}
);
self.port.on("sendData",function(uuid,title,body)
{
	var main=document.getElementById("main");
	var paragraph=document.createElement("p");
	var data=document.createElement("input");
	data.type="checkbox";
	data.id=uuid;
	var labeltitle=document.createElement("label");
	labeltitle.textContent=title;
	var pre=document.createElement("code");
	var negrita=document.createElement("b");
	var labelbody=document.createElement("label");
	labelbody.textContent=body;
	//labelbody.style="margin-right: 10px;margin-left: 10px;";
	main.appendChild(paragraph);
	paragraph.appendChild(data);
	paragraph.appendChild(negrita);
	negrita.appendChild(labeltitle);
	paragraph.appendChild(pre);
	pre.appendChild(labelbody);
	
});
