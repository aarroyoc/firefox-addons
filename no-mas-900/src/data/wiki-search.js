/* wiki-search.js */

var query=document.querySelectorAll("div > ul > li > div > a");
if(query.length>0)
{
	var link=query.item(0);
	self.postMessage(link.href);
}
