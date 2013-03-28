var Dupdater = {
	onLoad: function() {
	this.initialized = true;
	},
	UpdateDivelUpdater: function() {
		alert("Es mejor actualizar por el sistema de Mozilla Firefox");
		var w = window.open("http://addons.mozilla.org/en-US/firefox/addon/divel-updater","Divel Updater","");
	},
	UpdateDivelStoreSearch: function() {
		var a = window.external.AddSearchProvider("https://addons.mozilla.org/firefox/downloads/file/160923/divel_store_search-20120727.xml?src=dp-btn-primary","Divel Store Search","");
	},
	UpdateDivelMediaSearch: function() {
		var b = window.external.AddSearchProvider("https://addons.mozilla.org/firefox/downloads/file/160933/divel_media-20120727.xml?src=dp-btn-primary","Divel Media Search","");
	},
	UpdateIESZorrillaSearch: function() {
		var c = window.external.AddSearchProvider("https://addons.mozilla.org/firefox/downloads/file/160929/ies_zorrilla-20120727.xml?src=dp-btn-primary","IES Zorrilla","");
	},
	UpdateDivelSO: function() {
		alert("Necesitaras un CD");
		var v = window.open("http://susestudio.com/u/aarroyo","Divel SO","");
	},
	Options: function() {
		alert("Todavía no hay un sistema de opciones implementado");
	},
	UpdateAgendaCorreos: function() {
		var d= window.open("http://sites.google.com/site/divelstore/agenda-de-correos","Agenda de Correos de Divel SO","");
	}};
window.addEventListener("load", function(e) { Dupdater.onLoad(e); }, false); 
