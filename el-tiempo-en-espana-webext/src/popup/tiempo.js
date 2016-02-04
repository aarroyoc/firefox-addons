/* Opciones guardadas */
/* Guardar municipios añadidos extra */
/* Botón añadir municipio desde AEMET */
/* Estilo y presentación, tiene que ser bonito y funcional */

var dias = new Array;
var diaSeleccionado = 0;

function aemetToUnicode(code){
	switch(code){
		case "11": return "\uf00d"; // Despejado
		case "11n": return "\uf02e"; // Despejado noche
		case "12" :  
		case "12n" : return "\uf00c"; // Poco nuboso
		case "13": return "\uf002"; // Nuboso
		case "13n" : return "\uf086" // Nuboso noche
		case "14" : 
		case "14n" : return "\uf041"; // Nuboso
		case "15" : 
		case "15n" : return "\uf013"; // Muy Nuboso
		case "16" : 
		case "16n" : return "\uf013"; // Cubierto
		case "17" : 
		case "17n" : return "\uf07d"; // Nubes altas
		case "23" :
		case "27" : 
		case "24" : return "\uf008"; // Intervalos de lluvia
		case "25" :
		case "26" : return "\uf019"; // Lluvia
		case "33" :
		case "34" : return "\uf00a"; // Intervalos de Nieve
		case "35" :
		case "71" :
		case "72" :
		case "73" :
		case "74" :
		case "36" : return "\uf01b"; // Nieve
		case "51" :
		case "52" :
		case "53" :
		case "61" :
		case "62" :
		case "63" :
		case "64" :
		case "65" :
		case "54" : return "\uf01e"; // tormenta
		case "43" :
		case "44" :
		case "45" : 
		case "46" : return "\uf008";
		default: return "\uf075 - "+code; // ALIEN
	}
}

function mostrarPrediccion(index){
	var dia = dias[index];
	var fecha = new Date(dia.getAttribute("fecha"));
	document.getElementById("dia").textContent=fecha.toLocaleDateString();
	
	/* Intervalos */
	
	var intervalo = document.getElementById("intervalo");
	while(intervalo.firstChild) intervalo.removeChild(intervalo.firstChild);
	var td = document.createElement("td");
	td.textContent = "\uf08d";
	td.style.fontSize = "20px";
	td.style.color = "white";
	intervalo.appendChild(td);
	var lluvia = dia.getElementsByTagName("prob_precipitacion");
	for(var i=0;i<lluvia.length;i++){
		var periodo = lluvia[i].getAttribute("periodo");
		if(lluvia[i].textContent.length > 0) {
			var td = document.createElement("td");
			if(periodo == null)
				periodo = "00-24";
			td.textContent=periodo  + " h";
			intervalo.appendChild(td);
		}
	}
	
	/* lluvia */
	
	var precipitacion = document.getElementById("precipitacion");
	while (precipitacion.firstChild) precipitacion.removeChild(precipitacion.firstChild);
	var td = document.createElement("td");
	td.textContent = "\uf04e";
	td.style.fontSize = "20px";
	td.style.color = "cyan";
	precipitacion.appendChild(td);
	var lluvia=dia.getElementsByTagName("prob_precipitacion");
	for(var i=0;i<lluvia.length;i++){
		var periodo = lluvia[i].getAttribute("periodo");
		if(lluvia[i].textContent.length > 0) {
			var td = document.createElement("td");
			td.textContent=lluvia[i].textContent;
			precipitacion.appendChild(td);
		}
	}
	
	/* Nieve */
	
	var nieve = document.getElementById("nieve");
	while (nieve.firstChild) nieve.removeChild(nieve.firstChild);
	var td = document.createElement("td");
	td.textContent = "\uf01b";
	td.style.fontSize="20px";
	td.style.color="white";
	nieve.appendChild(td);
	var cota=dia.getElementsByTagName("cota_nieve_prov");
	for(var i=0;i<cota.length;i++){
		if(cota[i].textContent.length > 0) {
			var td = document.createElement("td");
			td.textContent=cota[i].textContent;
			precipitacion.appendChild(td);
		}
	}
	
	/* Temperatura */
	var temp = document.getElementById("temp");
	while (temp.firstChild) temp.removeChild(temp.firstChild);
	var td = document.createElement("td");
	td.textContent = "\uf055";
	td.style.fontSize = "20px";
	td.style.color = "red";
	temp.appendChild(td);
	var temperaturaA=dia.getElementsByTagName("temperatura")[0];
	var temperatura = temperaturaA.getElementsByTagName("dato");
	for(var i=0;i<temperatura.length;i++){
		if(temperatura[i].textContent.length > 0) {
			var td = document.createElement("td");
			td.textContent=temperatura[i].textContent;
			temp.appendChild(td);
		}
	}
	/* MinMax */
	var minmax = document.getElementById("minmax");
	var temperatura = dia.getElementsByTagName("temperatura")[0];
	var min = temperatura.getElementsByTagName("minima")[0].textContent;
	var max = temperatura.getElementsByTagName("maxima")[0].textContent;
	minmax.textContent = "Mínima: "+min+" ºC - Máxima: "+max+" ºC";
	
	/* Iconos */
	var icono = document.getElementById("icono");
	while (icono.firstChild) icono.removeChild(icono.firstChild);
	var cielo = dia.getElementsByTagName("estado_cielo");
	var td = document.createElement("td");
	td.textContent = "";
	icono.appendChild(td);
	for(var i=0;i<cielo.length;i++){
		if(cielo[i].textContent.length > 0) {
			var td = document.createElement("td");
			var p = document.createElement("p");
			var small = document.createElement("small");
			p.textContent=aemetToUnicode(cielo[i].textContent);
			small.textContent = cielo[i].getAttribute("descripcion");
			td.appendChild(p);
			td.appendChild(small);
			icono.appendChild(td);
		}
	}
	
}

function nuevaPrediccion(id){
	var xhr = new XMLHttpRequest();
	xhr.open("GET","http://www.aemet.es/xml/municipios/localidad_"+id+".xml");
	xhr.addEventListener("load",function(){
		var xml = xhr.responseXML;
		document.getElementById("municipio-title").textContent = xml.getElementsByTagName("nombre")[0].textContent;
		var prediccion = xml.getElementsByTagName("prediccion")[0];
		dias = [];
		for(var i=0;i<prediccion.children.length;i++){
			var dia = prediccion.children[i];
			dias.push(dia);
		}
		mostrarPrediccion(0);
	});
	xhr.send();
}

var select = document.getElementById("municipio");
select.addEventListener("change",function(){
	var id = select.value;
	if(id == 0) {
		document.getElementById("otro").style.display="block";
	} else {
		document.getElementById("otro").style.display="none";
	}
	localStorage.setItem("id",id);
	nuevaPrediccion(id);
});

document.getElementById("prev").addEventListener("click",function(){
	diaSeleccionado--;
	if(diaSeleccionado < 0)
		diaSeleccionado = 0;
	mostrarPrediccion(diaSeleccionado);
});
document.getElementById("next").addEventListener("click",function(){
	diaSeleccionado++;
	if(diaSeleccionado == dias.length)
		diaSeleccionado = dias.length - 1;
	mostrarPrediccion(diaSeleccionado);
});
document.getElementById("nuevo-municipio").addEventListener("click",function(){
	var otroMunicipio = document.getElementById("otro-municipio").value;
	var id = otroMunicipio.substr(otroMunicipio.length -5,5);
	localStorage.setItem("id",0);
	localStorage.setItem("cId",id);
	nuevaPrediccion(id);
});

window.addEventListener("load",function(){
	var id = localStorage.getItem("id");
	if(id == 0){
		select.value = 0;
		var cId = localStorage.getItem("cId");
		nuevaPrediccion(cId);
	}else if(id > 0) {
		nuevaPrediccion(id);
		select.value = id;
	}else{
		nuevaPrediccion(28079);
	}
});
