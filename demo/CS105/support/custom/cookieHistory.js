var app = {};
app.cookie = {
	/* set cookies */
	setCookie: function(name, value, exp, inMinutes) {
		var exp = exp == null? 7 : exp;
		var exdate = new Date();
			if(inMinutes != null && inMinutes == true){
				exdate.setMinutes(exdate.getMinutes() + exp);
			} else {
				exdate.setDate(exdate.getDate() + exp);
			}
		var cookieValue = escape(value) + ((exp == null) ? "" : "; expires="+exdate.toUTCString());
		document.cookie = name + "=" + cookieValue;
	},

	/* retrieve the value of a cookie */
	getCookie: function(name) {
		var i,x,y,ARRcookies = document.cookie.split(";");
		for (i=0;i<ARRcookies.length;i++){
			x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
			x = x.replace(/^\s+|\s+$/g,"");
			if (x==name){
				var value = unescape(y);
				return value;
			}
		}
		return null;
	}, 

	/* delete cookies (set expiration time in the past) */
	deleleCookie: function() {
		this.setCookie(name, '', -365);
	}
};


/* Before the page is show, check the cookie and the list of URLs */
//$(document).bind('pagebeforeshow', redirectToLastPage);