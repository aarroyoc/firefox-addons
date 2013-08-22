const data=require("self").data;
const storage=require("simple-storage").storage;
const file=require("file");
function OpenStyleWindow()
{
	var panel=require("panel").Panel({
		width: 800,
		height: 600,
		contentURL: data.url("styles.html"),
		contentScriptFile: data.url("styles.js")
	});
	panel.show();
	panel.port.emit("default",storage.colorHeader,storage.backgroundImage,storage.notificationsColor);
	panel.port.on("apply",function(colorHeader,backgroundImage,notificationsColor){
		storage.colorHeader=colorHeader;
		storage.backgroundImage=backgroundImage;
		storage.notificationsColor=notificationsColor;
	});
}
function SaveImage(imageurl)
{
	var img;
	var {Cc, Ci} = require("chrome");
	var imageXHR = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Ci.nsIJSXMLHttpRequest);
	imageXHR.onload=function(){
		if(imageXHR.readyState==4)
		{
			img=imageXHR.response;
			var desktop=require("system").pathFor("Desk");
			desktop=file.join(desktop,"NextTuenti.jpeg");
			var imgfile=file.open(desktop,"wb");
			imgfile.write(img);
			imgfile.close();
			Notify("Imagen guardada en el escritorio");
		}

	}
	imageXHR.overrideMimeType("text/plain; charset=x-user-defined");
	imageXHR.open("GET",imageurl,true);
	imageXHR.send();
}
function GenerateCSS()
{
	var CSSArray=new Array;
	CSSArray.push(".header{background: "+storage.colorHeader+";}");
	CSSArray.push(".canvas{background-image: url('"+storage.backgroundImage+"');}");
	CSSArray.push(".counter{background: "+storage.notificationsColor+";}");
	return CSSArray;
}
function Notify(text)
{
	var notifications=require("notifications");
	notifications.notify({
		title: "Next Tuenti",
		text: text,
		iconURL: data.url("tuenti64.png")
	});

}
function ShareURL(url)
{
	var TuentiURL="http://tuenti.com/share?url="+encodeURIComponent(url);
	require("tabs").open(TuentiURL);
	Notify("Compartiendo "+url+" en Tuenti");

}
exports.main=function(options)
{
	if(options.loadReason=="install")
	{
		//Create pre-generated CSS
		//storage.colorHeader="#0e87c8";
		storage.colorHeader="#0e87c8";
		storage.backgroundImage=""; //WORKS
		storage.notificationsColor="#0e87c8"; //WORKS
	}
	var cm = require("context-menu");
	var shareItem = cm.Item({
		label: "Compartir en Tuenti",
		contentScript: 'self.on("click", function () {' +
				'  self.postMessage(document.URL);' +
				'});',
		context: cm.PageContext(),
		onMessage: function (url) {
			ShareURL(url);
		}
	});
	var stylesItem = cm.Item({
		label: "Temas para Tuenti",
		contentScript: 'self.on("click", function(){self.postMessage();});',
		onMessage: function (){
			OpenStyleWindow();
		}
	});
	var downloadItem = cm.Item({
		label: "Descargar imagen",
		context: cm.URLContext("*.tuenti.com"),
		contentScript: 'self.on("click",function(){'+
			'self.postMessage(document.getElementById("photo_image").src);'+
			'});',
		onMessage: function(imageurl)
		{
			SaveImage(imageurl);
		}
	});
	var menu=cm.Menu({
		label: "Next Tuenti",
		image: data.url("tuenti64.png"),
		items: [shareItem,stylesItem,downloadItem]

	});
	//PageMod for styles
	var nextMod=require("page-mod").PageMod({
		include: "*.tuenti.com",
		contentStyle: GenerateCSS(),
		contentScript: 'var counter=document.getElementById("notificationsBubbleCount");'+
			'if(counter)'+
			'self.port.emit("notifications",counter.textContent);',
		onAttach: function(worker)
		{
			worker.port.on("notifications",function(number){
				Notify("Tienes "+number+" notificaciones");
			});
		}
	});

}
