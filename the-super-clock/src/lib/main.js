var { ActionButton } = require("sdk/ui/button/action");
var panels = require("sdk/panel");
var data = require("sdk/self").data;


exports.main=function()
{
	var panel = panels.Panel({
			//width: 40, //1280/5
			//height: 39, //1248/5
			contentURL: data.url("clock.html")
		});
	var button = ActionButton({
		id: "clock",
		label: "The Super Clock",
		icon: {
		  "16": data.url("clock.png"),
		  "32": data.url("clock.png"),
		  "64" : data.url("clock.png")
		},
		onClick: function(state) {
			panel.show({
				position: button
			});
		}
	});
}
