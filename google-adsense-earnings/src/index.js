var self = require('sdk/self');
var tabs = require("sdk/tabs");
var ui = require("sdk/ui");
var pageMod = require("sdk/page-mod");
var ss = require("sdk/simple-storage");
var request = require("sdk/request");
var timers = require("sdk/timers");
var frame = require("sdk/frame/hidden-frame");
var widget;
var oauth=require("addon-google-oauth2");
var oauth_options={
	client_id: "561939088422-0rebgvffes76ccapb8svfub5fsnfdihu.apps.googleusercontent.com",
	client_secret: "0KMmav-8bQEFibcg8VxErvim",
	scopes: "https://www.googleapis.com/auth/adsense.readonly",
	callback: updateWidget
};

function drawWidget(earnings)
{
	frame.add(frame.HiddenFrame({
		onReady: function() {
			var canvas = this.element.contentDocument.createElement("canvas");
			canvas.width=128;
			canvas.height=128;
			var img= this.element.contentDocument.createElement("img");
			img.src=self.data.url("adsense-64.png");
			var ctx=canvas.getContext("2d");
			ctx.drawImage(img,0,0);
			ctx.font="60px serif";
			ctx.fillText(""+earnings,0,64);
			
			widget.icon=canvas.toDataURL("image/png");
		}
	}));
}

function formatTime(date)
{
	return date.toISOString().substring(0, 10);
}

function updateWidget(token)
{
	var today=new Date();
	var yesterday=new Date();
	request.Request({
		url: "https://www.googleapis.com/adsense/v1.4/reports",
		content: {
			access_token: token,
			endDate: formatTime(today),
			startDate: formatTime(yesterday),
			metric: "EARNINGS"
		},
		onComplete: function(response){
			if(response.json.error)
			{
				oauth.refreshToken(oauth_options, updateWidget);
			}else{
				var earnings=0;
				for(var i=0;i<response.json.totals.length;i++)
				{
					earnings+=parseFloat(response.json.totals[i]);
				}
				drawWidget(earnings);
			}
		}
	}).get();
}

exports.main=function(options){
	if(options.loadReason=="install")
	{
		tabs.open("http://adrianarroyocalle.github.io/firefox-addons/");
	}
	
	widget=ui.ActionButton({
		id: "google-adsense-earnings",
		label: "Google AdSense Earnings",
		icon: self.data.url("adsense-64.png"), //TODO, CANVAS GENERATED PNG
		onClick: function(state){
			
		}
	});
	oauth.refreshToken(oauth_options, updateWidget);
	
	timers.setInterval(function(){
		updateWidget(oauth.getToken());
	},1000*60 /* Every minute */);
}
