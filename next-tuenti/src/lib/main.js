const data=require("self").data;
const storage=require("simple-storage").storage;
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
function GenerateCSS()
{
	var CSSArray=new Array;
	CSSArray.push(".header{background: "+storage.colorHeader+";}");
	CSSArray.push(".canvas{background-image: url('"+storage.backgroundImage+"');}");
	CSSArray.push(".notifs{background: "+storage.notificationsColor+";}");
	return CSSArray;
}
function ShareURL(url)
{
	var TuentiURL="http://tuenti.com/share?url="+encodeURIComponent(url);
	require("tabs").open(TuentiURL);
	var notifications = require("notifications");
	notifications.notify({
		title: "Next Tuenti",
		text: "Compartiendo "+url+" en Tuenti",
		iconURL: data.url("tuenti64.png"),
		onClick: function (data) {
		    //console.log("Click");
		}
	});

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
	var menu=cm.Menu({
		label: "Next Tuenti",
		image: data.url("tuenti64.png"),
		items: [shareItem,stylesItem]

	});
	//PageMod for styles
	var nextMod=require("page-mod").PageMod({
		include: "*.tuenti.com",
		contentStyle: GenerateCSS()
	});
}
