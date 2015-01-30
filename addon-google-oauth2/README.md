addon-google-oauth2
===================

Authenticate with Google OAuth2 from Addon SDK. It's useful for developing Firefox addons with jpm and Google services.

## Tutorial

Sample code:

```js

var oauth=require("addon-google-oauth2");

var oauth2_options={
 client_id: "CLIENT_ID",
 client_secret: "CLIENT_SECRET",
 scopes: "https://www.googleapis.com/auth/adsense.readonly" // For example, AdSense Management API in read only mode
};

function callback(token){
	//USE THE token TO CALL Google APIs
}

function start(){
	oauth.refreshToken(oauth2_options,callback);
}
```

It will use the refresh token if available or do a manual login.

If you are sure that the token hasn't exired yet you can call the function `oauth.getToken();` which only returns the last valid token (if any).

In your data/ folder you must put two files for the Google OAuth2 code verification. These files work

__login.html__

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8"/>
		<title>Google AdSense Earnings Login</title>
	</head>
	<body>
		<label for="code">Code from Google:</label>
		<input id="code" type="text">
		<button id="submit">Login</button>
	</body>
</html>
```

__login.js__

```js
var button=document.getElementById("submit");
button.addEventListener("click",function(){
	self.postMessage(document.getElementById("code").value);
});
```

## Used by

* [Google AdSense Earnings](https://addons.mozilla.org/es/firefox/addon/google-adsense-earnings/)
