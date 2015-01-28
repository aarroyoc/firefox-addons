var self = require('sdk/self');
var tabs = require("sdk/tabs");
var ui = require("sdk/ui");
var pageMod = require("sdk/page-mod");
var ss = require("sdk/simple-storage");
var request = require("sdk/request");
var timers = require("sdk/timers");
var frame = require("sdk/frame/hidden-frame");
var widget;

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
				login();
			}else{
				var earnings=0;
				for(var i=0;i<response.json.totals.length;i++)
					earnings+=parseFloat(response.json.totals[i]);
				drawWidget(earnings);
			}
		}
	}).get();
	
	//reports.generate
}

function getToken(code)
{
	request.Request({
		url: "https://www.googleapis.com/oauth2/v3/token",
		content: {
			code: code,
			client_id: "561939088422-0rebgvffes76ccapb8svfub5fsnfdihu.apps.googleusercontent.com",
			client_secret: "0KMmav-8bQEFibcg8VxErvim",
			grant_type: "authorization_code",
			redirect_uri: "urn:ietf:wg:oauth:2.0:oob"
		},
		onComplete: function(response){
			ss.storage.access_token=response.json.access_token;
			ss.storage.refresh_token=response.json.refresh_token;
			updateWidget(ss.storage.access_token);
		}
	}).post();
}

function login(){
	var url="https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/adsense.readonly&response_type=code&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_id=561939088422-0rebgvffes76ccapb8svfub5fsnfdihu.apps.googleusercontent.com";
	tabs.open(url);
	pageMod.PageMod({
		include: self.data.url("login.html"),
		contentScriptFile: self.data.url("login.js"),
		onMessage: function(code){
			getToken(code);
		}
	});
	tabs.open(self.data.url("login.html"));
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
	updateWidget(ss.storage.access_token);
	timers.setInterval(function(){
		updateWidget(ss.storage.access_token);
	},1000*60 /* Every minute */);
}
