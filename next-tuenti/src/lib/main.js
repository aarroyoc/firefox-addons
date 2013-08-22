const data=require("self").data;
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
	var mm = require("context-menu");
	var menuItem = mm.Item({
		label: "Share on Google+",
		contentScript: 'self.on("click", function () {' +
				'  self.postMessage(document.URL);' +
				'});',
		onMessage: function (url) {
			ShareURL(url);
		}
	});

}
