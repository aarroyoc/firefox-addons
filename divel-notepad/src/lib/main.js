//Main Function
var firefox=false;
var thunderbird=false;
var seamonkey=false;
var fennec=false;
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
// Create an objectStore
    //console.log("Creating objectStore");
    dataBase.createObjectStore("NOTE",{keyPath: 'id', autoIncrement: true});
    
},
 
putData = function () {
    //console.log("Putting elephants in IndexedDB");
 
// Open a transaction to the database
    //var transaction = db.transaction(["NOTE"], IDBTransaction.READ_WRITE);
    var transaction = db.transaction(["NOTE"], "readwrite");
 
// Put the blob into the dabase
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
    //transaction.objectStore("NOTE").delete(1);
 
// Retrieve the file that was just stored
    /*transaction.objectStore("NOTE").get("title").onsuccess = function (event) {
    var imgFile = event.target.result;
    if(imgFile)
    {
        console.log("Got elephant! " + imgFile.value.title);
    }
    };*/
    //console.log("Consulting database");
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
function DeleteData(id)
{
var { indexedDB }=require("sdk/indexed-db");
var dbVersion=1.0;

var request = indexedDB.open("QuickNotes", dbVersion),
db,
createObjectStore = function (dataBase) {
// Create an objectStore
    //console.log("Creating objectStore");
    dataBase.createObjectStore("NOTE",{keyPath: 'id', autoIncrement: true});
    
},
 
putData = function () {
 
// Open a transaction to the database
    //var transaction = db.transaction(["NOTE"], IDBTransaction.READ_WRITE);
    var transaction = db.transaction(["NOTE"], "readwrite");
 
// Put the blob into the dabase
    /*var put = transaction.objectStore("NOTE").put({
    "id": guid(),
    "title": title,
    "body": body
    });*/
    //console.log("Deleting");
    var del=transaction.objectStore("NOTE").delete(id);
    del.onsuccess=function(){
	notifications.notify({
		text: "Note deleted successfully",
		iconURL: data.url("open32.png")
	});
    }
    //console.log("Deleted");
 
// Retrieve the file that was just stored
    /*transaction.objectStore("NOTE").get("title").onsuccess = function (event) {
    var imgFile = event.target.result;
    if(imgFile)
    {
        console.log("Got elephant! " + imgFile.value.title);
    }
    };*/
    //console.log("Consulting database");
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
	//console.log("Starting QuickNOTE");
	
	var panel = require("sdk/panel");
 
	var panelquick=panel.Panel({
	  width: 500,
	  height: 500,
	  contentURL: data.url("quicknote.html"),          
	  contentScriptFile: data.url("quicknote.js")
	  /*onMessage: function(message) {
	    /*worker.port.emit("initQuickNote","NOTHING");
	    worker.port.on("saveNote", function(title) {
		console.log(title+"\n");
		//Save the data in a IndexedDB
		SaveData(title,"BODY TEST");
	  });}
	  },
	  onShow: function()
		{
			this.postMessage("hello");
		}*/
	});
	panelquick.port.emit("initQuickNote");
	panelquick.port.on("saveNote",function(title,body){
		//console.log("Title: "+title+" Body: "+body);
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
// Create an objectStore
    //console.log("Creating objectStore");
    dataBase.createObjectStore("NOTE",{keyPath: 'id', autoIncrement: true});
    
},
 
putData = function () {
    //console.log("Putting elephants in IndexedDB");
 
// Open a transaction to the database
    //var transaction = db.transaction(["NOTE"], IDBTransaction.READ_WRITE);
    var transaction = db.transaction(["NOTE"], "readwrite");
 
// Put the blob into the dabase
    /*var put = transaction.objectStore("NOTE").put({
    "id": guid(),
    "title": title,
    "body": body
    });*/
    
    //transaction.objectStore("NOTE").delete(id);
 
// Retrieve the file that was just stored
    /*transaction.objectStore("NOTE").get("title").onsuccess = function (event) {
    var imgFile = event.target.result;
    if(imgFile)
    {
        console.log("Got elephant! " + imgFile.value.title);
    }
    };*/
    //console.log("Consulting database");
                       var transaction2 = db.transaction(["NOTE"], "readwrite");
                    var objectStore2 = transaction2.objectStore("NOTE");
                    var nothing="";
 
                    var request2 = objectStore2.openCursor();
                    request2.onsuccess = function(evt) {  
                        var cursor = evt.target.result;  
                        if (cursor) {  
                            //nothing += "id: " + cursor.key + 
                            //           " with title " + cursor.value.title + " and body "+ cursor.value.body;
                            panelquick.port.emit("sendData",cursor.key,cursor.value.title,cursor.value.body);
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
function ViewNote()
{
	if(firefox==true)
	{
		/*var addontab = require("sdk/addon-page");
		
		require("sdk/tabs").open(data.url("index.html"));*/
		
	var panel = require("sdk/panel");
 
	var panelquick=panel.Panel({
	  width: 800,
	  height: 600,
	  contentURL: data.url("index.html"),          
	  contentScriptFile: data.url("index.js")
	  /*onMessage: function(message) {
	    /*worker.port.emit("initQuickNote","NOTHING");
	    worker.port.on("saveNote", function(title) {
		console.log(title+"\n");
		//Save the data in a IndexedDB
		SaveData(title,"BODY TEST");
	  });}
	  },
	  onShow: function()
		{
			this.postMessage("hello");
		}*/
	});
	panelquick.port.emit("initScript");
	//Read database and send TODO
	SendData(panelquick);
	
	panelquick.port.on("delete",function(id,title,body){
		//console.log("Title: "+title+" Body: "+body);
		//Delete from DATABASE TODO
		DeleteData(id);
		
	});
	panelquick.show();



	}else{
		require("sdk/tabs").open(data.url("index.html"));
	}

}


exports.main=function(options)
{
	//Check XUL App - define specific mode
	if(options.loadReason=="install"){
		require("tabs").open(data.url("welcome.html")); //Welcome HTML file
		require("tabs").open("http://sites.google.com/site/divelmedia");
		//Configurar con pagina XUL o HTML o Javascript
	
	}
	if(options.loadReason=="upgrade"){
		require("tabs").open(data.url("changelog.html")); //Changelog HTML file
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
	//Create UI for every XUL App
	if(firefox==true)
	{
		//Context menu for Mozilla Firefox
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
	/*
	When the preferences bug dissapear, this part will be functional. Also use oldpackage.json in doc folder	
	require("simple-prefs").on("review",function (){
		require("tabs").open("http://addons.mozilla.org/en/firefox/addon/divel-notepad");
	});*/
	if(firefox==true)
	{

		var widget=require("widget");
		var pluswidget=widget.Widget({
			id: "divel-notepad-view",
			label: "Quick Note",
			contentURL: data.url("save32.png"), 	
			//panel: pluspanel,
			onClick: function() {
				//pluspanel.contentURL=data.url("quicknote.html");
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
