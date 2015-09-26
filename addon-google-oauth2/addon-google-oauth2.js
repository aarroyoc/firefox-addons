var ss=require("sdk/simple-storage");
var request=require("sdk/request");
var tabs = require("sdk/tabs");
var self = require("sdk/self");

module.exports={
	getToken: function(){
		return ss.storage.access_token;
	},
	login: function(options,callback){
		/* options should have scopes,client id, client secret, callback*/
		var url="https://accounts.google.com/o/oauth2/auth?scope="+options.scopes+"&response_type=code&redirect_uri=urn:ietf:wg:oauth:2.0:oob:auto&client_id="+options.client_id;
        tabs.on('ready', function(tab){
            var title = tab.title;
            // When authorization finishes, the title will contain the code
            // The user doesn't need to copy it to the other tab or close any tab
            if (title.contains("code=")){
                var code = title.substr(title.indexOf("code=")+5);
                request.Request({
                    url: "https://www.googleapis.com/oauth2/v3/token",
                    content: {
                        code: code,
                        client_id: options.client_id,
                        client_secret: options.client_secret,
                        grant_type: "authorization_code",
                        redirect_uri: "urn:ietf:wg:oauth:2.0:oob:auto"
                    },
                    onComplete: function(response){
                        ss.storage.access_token=response.json.access_token;
                        ss.storage.refresh_token=response.json.refresh_token;
                        callback(ss.storage.access_token);
                    }
                }).post();
                tab.close();
            }
        });
        tabs.open(url);
	},
	refreshToken: function(options, callback){
		if(ss.storage.refresh_token == undefined){
            this.login(options, callback);
		}else{
			request.Request({
				url: "https://www.googleapis.com/oauth2/v3/token",
				content: {
					refresh_token: ss.storage.refresh_token,
					client_id: options.client_id,
					client_secret: options.client_secret,
					grant_type: "refresh_token"
				},
				onComplete: function(response){
					ss.storage.access_token=response.json.access_token;
					callback(ss.storage.access_token);
				}
			}).post();
		}
	},
}
