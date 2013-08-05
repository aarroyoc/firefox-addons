
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getSearchEngines(callback)
{
	var jsonstr=atob(getUrlVars()["JSON"]);
	if(jsonstr=="" || jsonstr=="NULL" || jsonstr==undefined)
	{
		callback("NULL");
	}else{
		try{
			var search_engines=JSON.parse(jsonstr);
			//return search_engines;
			callback(search_engines);
		}catch(e){
			callback("NULL");		
		}
	}
	
}
function add()
{

	window.location="add.html?JSON="+getUrlVars()["JSON"];
}
function edit()
{
	var id=prompt("Insert the ID number of the search engine to be removed");
	var request=indexedDB.open("SearchEngines",2);
	request.onsuccess=function(evt){
		var db=evt.target.result;
		var request = db.transaction(["search-engine"], "readwrite")
                .objectStore("search-engine")
                .delete(id);
		request.onsuccess = function(event) {
		  console.log("Successfully removed the Search Engine with ID:",id);
		};

	}
}
window.addEventListener("DOMContentLoaded",function(){
	var retur=document.getElementById("return");
	retur.addEventListener("click",function(){
		window.location="divfind.html?JSON="+getUrlVars()["JSON"];
	});
	/* First check Native Search Engines */
	var divfind=new Array;
	getSearchEngines(function(se){
		
		if(se!="NULL")
		{
			console.log(se);
			
			for(var key in se.directories)
			{
				var engines=se.directories[key].engines;
				for(var i=0;i<engines.length;i++)
				{
					//For every search engine
					var eng=engines[i];
					var name=eng._name;
					var favicon=eng._iconURL;
					var description=eng.description;					
					var count=eng._urls.length-1;
					var url=eng._urls[count].template;
					var find={
						"name" : name,
						"favicon" : favicon,
						"description" : description,
						"url" : url
					};
					divfind.push(find);
				}
			}
		}
		
	});
	/* Second: IndexedDB SearchEngines */
	try{
	var request=indexedDB.open("SearchEngines",2);
	request.onerror=function(){
		console.log("Error opening the database");
	}
	request.onupgradeneeded=function(evt){
		var db=evt.target.result;
                if(!db.objectStoreNames.contains("search-engine"))
		{
                        var object=db.createObjectStore("search-engine",{keyPath: "id",autoIncrement: true});
		}

	}
	request.onsuccess=function(evt)
	{
                var db=evt.target.result;
                var objectStore = db.transaction("search-engine").objectStore("search-engine");
		objectStore.openCursor().onsuccess=function(event)
		{
			var cursor = event.target.result;
			if (cursor) {
				var find=cursor.value;
				divfind.push(find);
				cursor.continue();
	
			}else{
				createUI(divfind);
			}
		}
	}
	}catch(e){
		createUI(divfind);
	}

	
	



});
function createUI(divfind)
{
/*Create UI*/
				var article=document.getElementById("main");
				var section=document.createElement("section");
				section.setAttribute("data-type","list");
				var nativeHeader=document.createElement("header");
				nativeHeader.textContent="Search Engines";
				section.appendChild(nativeHeader);
				var list=document.createElement("ul");
				for(var e=0;e<divfind.length;e++)
				{
					var li=document.createElement("li");
					var aside=document.createElement("aside");
					aside.setAttribute("class","pack-end");
					var xicon=new Image();
					xicon.src=divfind[e].favicon;
					xicon.alt="Favicon";
					aside.appendChild(xicon);
					li.appendChild(aside);
					var a=document.createElement("a");
					a.href=divfind[e].url;
					li.appendChild(a);
					var pname=document.createElement("p");
					pname.textContent=divfind[e].name;
					var pdescription=document.createElement("p");		
					pdescription.textContent=divfind[e].description+"|ID: "+divfind[e].id;
					a.appendChild(pname);
					a.appendChild(pdescription);
	
					list.appendChild(li);
				}
				section.appendChild(list);
				article.appendChild(section);

}
