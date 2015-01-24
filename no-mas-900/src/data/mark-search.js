/* mark-search.js */

self.port.on("phone",function(phone){
	//var element=document.documentElement.innerHTML.indexOf(phone);
	document.designMode = "on";
	var sel = window.getSelection();
	sel.collapse(document.body, 0);
	while (window.find(phone)) {
        document.execCommand("HiliteColor", false, "red");
        sel.collapseToEnd();
    }
    document.designMode = "off";
});
