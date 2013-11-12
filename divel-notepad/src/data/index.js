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
self.port.on("sendData",function(uuid,title,body, code)
{
	var blob=new Blob([body]);
	var main=document.getElementById("main");
	var paragraph=document.createElement("p");
	var data=document.createElement("input");
	data.type="checkbox";
	data.id=uuid;
	var labeltitle=document.createElement("label");
	labeltitle.textContent=title;
	var small=document.createElement("small");
	var exportAsTxt=document.createElement("a");
	exportAsTxt.href=URL.createObjectURL(blob);
	exportAsTxt.download=title+".txt";
	exportAsTxt.textContent="Export as TXT";
	var pre=document.createElement("pre");
	if(code==true)
	{
		pre.className="prettyprint";
	}
	var negrita=document.createElement("b");
	var labelbody=document.createElement("div");
	labelbody.textContent=body;
	main.appendChild(paragraph);
	paragraph.appendChild(data);
	paragraph.appendChild(negrita);
	negrita.appendChild(labeltitle);
	paragraph.appendChild(pre);
	pre.appendChild(labelbody);
	small.appendChild(exportAsTxt);
	paragraph.appendChild(small);
});
