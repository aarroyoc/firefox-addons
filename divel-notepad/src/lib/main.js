//Main Function
var firefox=false;
var thunderbird=false;
var seamonkey=false;
var fennec=false;
var instantbird=false;
const data = require("sdk/self").data;
const notifications=require("notifications");

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}



function SaveData(title, body)
{
	var { indexedDB }=require("sdk/indexed-db");
	var dbVersion=1.0;

	var request = indexedDB.open("QuickNotes", dbVersion),
	db,
	createObjectStore = function (dataBase) {

	    dataBase.createObjectStore("NOTE",{keyPath: 'id', autoIncrement: true});
	    
	},
	 
	putData = function () {

		var transaction = db.transaction(["NOTE"], "readwrite");

		var put = transaction.objectStore("NOTE").put({
		"id": guid(),
		"title": title,
		"body": body
		});
		put.onsuccess=function(){
		notifications.notify({
		  text: "Note added successfully",
		  iconURL: data.url("save32.png")
		});
		}
	var transaction2 = db.transaction(["NOTE"], "readwrite");
	var objectStore2 = transaction2.objectStore("NOTE");
	var nothing="";
	 
	var request2 = objectStore2.openCursor();
	request2.onsuccess = function(evt) {  
		var cursor = evt.target.result;  
		if (cursor) {  
			nothing += "id: " + cursor.key + 
			" with title " + cursor.value.title + " and body "+ cursor.value.body;
			cursor.continue();  
		}else{}  
	};  

	};
 
request.onerror = function (event) {
//console.log("Error creating/accessing IndexedDB database");
};
 
request.onsuccess = function (event) {
    //console.log("Success creating/accessing IndexedDB database");
    db = request.result;
   
    db.onerror = function (event) {
        //console.log("Error creating/accessing IndexedDB database");
    };
     putData();
    };

// For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
        //putData();
        
    };
}
function DeleteData(id)
{
var { indexedDB }=require("sdk/indexed-db");
var dbVersion=1.0;

var request = indexedDB.open("QuickNotes", dbVersion),
db,
createObjectStore = function (dataBase) {
    dataBase.createObjectStore("NOTE",{keyPath: 'id', autoIncrement: true});
    
},
 
putData = function () {
    var transaction = db.transaction(["NOTE"], "readwrite");
 
    var del=transaction.objectStore("NOTE").delete(id);
    del.onsuccess=function(){
	notifications.notify({
		text: "Note deleted successfully",
		iconURL: data.url("open32.png")
	});
    }

                       var transaction2 = db.transaction(["NOTE"], "readwrite");
                    var objectStore2 = transaction2.objectStore("NOTE");
                    var nothing="";
 
                    var request2 = objectStore2.openCursor();
                    request2.onsuccess = function(evt) {  
                        var cursor = evt.target.result;  
                        if (cursor) {  
                            nothing += "id: " + cursor.key + 
                                        " with title " + cursor.value.title + " and body "+ cursor.value.body;
                            //console.log(nothing);
                            cursor.continue();  
                        }  
                        else {  
                            //console.log("No more entries!");  
                        }  
                    };  

};
 
request.onerror = function (event) {
//console.log("Error creating/accessing IndexedDB database");
};
 
request.onsuccess = function (event) {
    //console.log("Success creating/accessing IndexedDB database");
    db = request.result;
   
    db.onerror = function (event) {
        //console.log("Error creating/accessing IndexedDB database");
    };
     putData();
    };

// For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
        //putData();
        
    };
}
function QuickNote()
{
	var panel = require("sdk/panel");
 
	var panelquick=panel.Panel({
	  width: 500,
	  height: 500,
	  contentURL: data.url("quicknote.html"),          
	  contentScriptFile: data.url("quicknote.js")
	});
	panelquick.port.emit("initQuickNote");
	panelquick.port.on("saveNote",function(title,body){
		SaveData(title,body);
	});
	panelquick.show();
	
}
function SendData(panelquick)
{
	var { indexedDB }=require("sdk/indexed-db");
	var dbVersion=1.0;
	var request = indexedDB.open("QuickNotes", dbVersion),
	db,
	createObjectStore = function (dataBase) {
		dataBase.createObjectStore("NOTE",{keyPath: 'id', autoIncrement: true});
	},
	putData = function () {
		var transaction = db.transaction(["NOTE"], "readwrite");
		var transaction2 = db.transaction(["NOTE"], "readwrite");
		var objectStore2 = transaction2.objectStore("NOTE");
		var nothing="";
 
		var request2 = objectStore2.openCursor();
		request2.onsuccess = function(evt) {  
			var cursor = evt.target.result;  
				if (cursor) {
					panelquick.port.emit("sendData",cursor.key,cursor.value.title,cursor.value.body);
					cursor.continue();  
				}else{}  
		};
	};
	 
	request.onerror = function (event) {
	};

	request.onsuccess = function (event) {
    	db = request.result;
    	db.onerror = function (event) {
		};
		putData();
    };

    request.onupgradeneeded = function (event) {
        createObjectStore(event.target.result);
    };
}
function ViewNote()
{
	if(firefox==true)
	{
		var panel = require("sdk/panel");
	 
		var panelquick=panel.Panel({
		  width: 800,
		  height: 600,
		  contentURL: data.url("index.html"),          
		  contentScriptFile: data.url("index.js")
		});
		panelquick.port.emit("initScript");
		SendData(panelquick);
		panelquick.port.on("delete",function(id,title,body){
			DeleteData(id);	
		});
		panelquick.show();

	}else{
		require("sdk/tabs").open(data.url("index.html"));
	}

}


exports.main=function(options)
{
	if(options.loadReason=="install"){
		require("tabs").open("http://adrianarroyocalle.github.io/firefox-addons/page/divel-notepad/welcome.html");
		require("tabs").open("http://sites.google.com/site/divelmedia");	
	}
	if(options.loadReason=="upgrade"){
		require("tabs").open("http://adrianarroyocalle.github.io/firefox-addons/page/divel-notepad/changelog.html");
		require("tabs").open("http://sites.google.com/site/divelmedia");
	}
	var xulapp=require("sdk/system/xul-app");
	if(xulapp.name=="Firefox")
	{
		firefox=true;
	}
	if(xulapp.name=="Fennec")
	{
		fennec=true;
	}
	if(xulapp.name=="SeaMonkey")
	{
		seamonkey=true;
	}
	if(xulapp.name=="Thunderbird")
	{
		thunderbird=true;
	}
	if(firefox==true)
	{
		var mm = require("context-menu");
 		var quicknote = mm.Item({
 		 label: "Quick Note",
 		 contentScript: 'self.on("click", function () {' +
                 '  self.postMessage(document.URL);' +
                 '});',
 		 onMessage: function (url) {
 		   QuickNote();
 		 }
		});
		var managenotes = mm.Item({
 		 label: "View notes",
 		 contentScript: 'self.on("click", function () {' +
                 '  self.postMessage(document.URL);' +
                 '});',
 		 onMessage: function (url) {
 		   ViewNote();
 		 }
		});
	}
	if(firefox==true)
	{

		var widget=require("widget");
		var pluswidget=widget.Widget({
			id: "divel-notepad-view",
			label: "Quick Note",
			contentURL: data.url("save32.png"),
			onClick: function() {
				QuickNote();	
			}
		});
		var managewidget=widget.Widget({
			id: "divel-notepad-manage",
			label: "View notes",
			contentURL: data.url("open32.png"), 	
			onClick: function() {
				ViewNote();
			}
		});

	}

}
