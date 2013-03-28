var tuenti_share = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("tuenti_share-strings");
  },

  onMenuItemCommand: function(e) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
	var url=window.content.location.href;
	//promptService.alert(window, url,"DEBUG");
	var TuentiURL="http://www.tuenti.com/share?url="+url;
	var OpenTuenti=window.open(TuentiURL,"Tuenti Share","_blank");
  },

  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    tuenti_share.onMenuItemCommand(e);
  }
};

window.addEventListener("load", function () { tuenti_share.onLoad(); }, false);


tuenti_share.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e) {
    tuenti_share.showFirefoxContextMenu(e);
  }, false);
};

tuenti_share.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-tuenti_share").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { tuenti_share.onFirefoxLoad(); }, false);