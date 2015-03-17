//Main Function
var firefox=false;
var thunderbird=false;
var seamonkey=false;
var fennec=false;
var instantbird=false;
var self=require("sdk/self");
const notifications=require("sdk/notifications");
var _=require("sdk/l10n").get;

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}



function SaveData(title, body, code)
{
	var { indexedDB }=require("sdk/indexed-db");
	var dbVersion=1.1;

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
		"body": body,
		"code" : code
		});
		put.onsuccess=function(){
		notifications.notify({
          title: _("Divel Notepad"),
		  text: _("Note added successfully"),
		  iconURL: self.data.url("save64.png")
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
			title: _("Divel Notepad"),
			text: _("Note deleted successfully"),
			iconURL: self.data.url("open64.png")
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
function QuickNote()
{
	var panel = require("sdk/panel");
	var panelquick=panel.Panel({
	  width: 500,
	  height: 500,
	  contentURL: self.data.url("quicknote.html"),          
	  contentScriptFile: self.data.url("quicknote.js")
	});
	panelquick.port.emit("initQuickNote");
	panelquick.port.on("saveNote",function(title,body,code){
		SaveData(title,body,code);
	});
	panelquick.show();
	
}
function SendData(panelquick)
{
	var { indexedDB }=require("sdk/indexed-db");
	var dbVersion=1.1;
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
					panelquick.port.emit("sendData",cursor.key,cursor.value.title,cursor.value.body, cursor.value.code);
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
		  contentURL: self.data.url("index.html"),          
		  contentScriptFile: self.data.url("index.js")
		});
		panelquick.port.emit("initScript");
		SendData(panelquick);
		panelquick.port.on("delete",function(id,title,body){
			DeleteData(id);	
		});
		panelquick.show();
	}else{
		require("sdk/tabs").open(self.data.url("index.html"));
	}
}

exports.main=function(options)
{
	if(options.loadReason=="install"){
		require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons?utm_source=AddonInstall&utm_campaign=DivelNotepad&utm_medium=Addon");
	}
	if(options.loadReason=="upgrade"){
		notifications.notify({
			title: "Divel Notepad",
			text: "Succesfully upgraded to Divel Notepad 1.7",
			iconURL: self.data.url("open64.png")
		});
		require("sdk/tabs").open("http://adrianarroyocalle.github.io/firefox-addons?utm_source=AddonUpgrade&utm_campaign=DivelNotepad&utm_medium=Addon");
	}
	require("sdk/simple-prefs").on("review",function (){
		require("sdk/tabs").open("http://addons.mozilla.org/en/firefox/addon/divel-notepad");
	});
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
		var mm = require("sdk/context-menu");
 		var quicknote = mm.Item({
 		 label: _("Quick note"),
 		 contentScript: 'self.on("click", function () {' +
                 '  self.postMessage(document.URL);' +
                 '});',
 		 onMessage: function (url) {
 		   QuickNote();
 		 }
		});
		var managenotes = mm.Item({
 		 label: _("View notes"),
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
		var {ActionButton} = require("sdk/ui/button/action");
		var quickWidget=ActionButton({
			id: "divel-notepad-write",
			label: _("Quick note"),
			icon: {
				"32" : self.data.url("save32.png"),
				"64" : self.data.url("save64.png")
			},
			onClick: function(){
				QuickNote();
			}
		});
		var notesWidget=ActionButton({
			id: "divel-notepad-view",
			label: _("View notes"),
			icon: {
				"32" : self.data.url("open32.png"),
				"64" : self.data.url("open64.png")
			},
			onClick: function(){
				ViewNote();
			}
		});
	}
}
