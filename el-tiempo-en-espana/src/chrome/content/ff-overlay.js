var el_tiempo_de_espa_a = {
  /**
   * Description
   * @method onLoad
   * @return 
   */
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("el_tiempo_de_espa_a-strings");
  },

  /**
   * Description
   * @method onMenuItemCommand
   * @param {} e
   * @return 
   */
  onMenuItemCommand: function(e) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
								  
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                                .getService(Components.interfaces.nsIPrefBranch);
	//int cp=extensions.el_tiempo_de_espa_a.intpref;
    //promptService.alert(window, this.strings.getString("helloMessageTitle"),
     //                           this.strings.getString("helloMessage"));
	var iframeview = prefManager.getBoolPref("extensions.el_tiempo_de_espa_a.iframeview");
	if(iframeview==false){
	var cp = prefManager.getCharPref("extensions.el_tiempo_de_espa_a.numbercode");
	//if(autorun == true ){promptService.alert(window, "Autorun", "TRUE");}else{promptService.alert(window, "Autorun", "FALSE");}
	//Obteniendo datos del tiempo
	//promptService.alert(window, "XML AEMET", "Debug 0");
	const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
	//var xmlhttp = new window.XMLHttpRequest();
	var URL = "http://www.aemet.es/xml/municipios/localidad_"+cp+".xml";
	var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET",URL,false);
                    xmlhttp.send(null);
                    xmlDoc = xmlhttp.responseXML.documentElement;
					

		var diaXML=xmlDoc.getElementsByTagName('dia');
        //for(var i=0; i< diaXML.length; i++) 
		//{
            var xmlDia=diaXML[0];

            /*fecha=xmlEvento.getElementsByTagName("fecha")[0].firstChild.nodeValue;
            hora=xmlEvento.getElementsByTagName("hora")[0].firstChild.nodeValue;
            comentario=xmlEvento.getElementsByTagName("comentario")[0].firstChild.nodeValue;
            evento = new Evento(fecha,hora,comentario);       
            eventos.push(evento);*/
			//promptService.alert(window, "XML AEMET", "Debug 2 BIS")
			var estadoCielo=xmlDia.getElementsByTagName('estado_cielo')[0].firstChild.nodeValue;
			//promptService.alert(window, "Ciudad", estadoCielo);
        //}  
		//promptService.alert(window, "DEBUG", "Hemos llegado");
		var diaXML=xmlDoc.getElementsByTagName('dia');
		//for(var z=0; z< tempXML.length; z++){
			//promptService.alert(window, "DEBUG", "Se encontro temperatura");
			var xmlTemp=diaXML[0];
			var maxima=xmlTemp.getElementsByTagName('maxima')[0].firstChild.nodeValue;
			var minima=xmlTemp.getElementsByTagName('minima')[0].firstChild.nodeValue;
			//promptService.alert(window, "DEBUG", "Se leyo todo");
		//promptService.alert(window, "Maxima", maxima);
		//promptService.alert(window, "Minima", minima);
		//}
		window.openDialog("chrome://el_tiempo_de_espa_a/content/prediccion.xul", "El Tiempo de Espana -- AEMET", "chrome", maxima, minima);


	}else{
	//New IFRAME View
	var numbercode=prefManager.getCharPref("extensions.el_tiempo_de_espa_a.numbercode");
	var citytext=prefManager.getCharPref("extensions.el_tiempo_de_espa_a.city");
	window.openDialog("chrome://el_tiempo_de_espa_a/content/iframeview.xul","El Tiempo de España -- AEMET","chrome",numbercode,citytext);



	}
	
  },

  /**
   * Description
   * @method onToolbarButtonCommand
   * @param {} e
   * @return 
   */
  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    el_tiempo_de_espa_a.onMenuItemCommand(e);
  }
};

window.addEventListener("load", function () { el_tiempo_de_espa_a.onLoad(); }, false);


/**
 * Description
 * @method onFirefoxLoad
 * @param {} event
 * @return 
 */
el_tiempo_de_espa_a.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e) {
    el_tiempo_de_espa_a.showFirefoxContextMenu(e);
  }, false);
};

/**
 * Description
 * @method showFirefoxContextMenu
 * @param {} event
 * @return 
 */
el_tiempo_de_espa_a.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-el_tiempo_de_espa_a").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { el_tiempo_de_espa_a.onFirefoxLoad(); }, false);
