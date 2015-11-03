var mads = function() {
	if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
		this.custTracker = rma.customize.custTracker;
	} else if (typeof custTracker != 'undefined') {
		this.custTracker = custTracker;
	} else {
		this.custTracker = [];
	}
	this.id = this.uniqId();
	this.tracked = [];
	this.bodyTag = document.getElementsByTagName('body')[0];
	this.headTag = document.getElementsByTagName('head')[0];
	this.contentTag = document.getElementById('rma-widget');
	this.path = typeof rma != 'undefined' ? rma.customize.src : '';
}
mads.prototype.uniqId = function() { return new Date().getTime(); }

mads.prototype.linkOpener = function(url) {
	if (typeof url != "undefined" && url != "") {
		if (typeof mraid !== 'undefined') {
			mraid.open(url);
		} else {
			window.open(url);
		}
	}
}

mads.prototype.tracker = function(tt, type, name, value) {
	name = name || type;
	if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
		for (var i = 0; i < this.custTracker.length; i++) {
			var img = document.createElement('img');
			var src = this.custTracker[i].replace('{{type}}', type);
			src = src.replace('{{tt}}', tt);
			if (typeof value == 'undefined') {
				value = '';
			}
			value = '';
			src = src.replace('{{value}}', value);
			img.src = src + '&' + this.id;
			img.style.display = 'none';
			this.bodyTag.appendChild(img);
			this.tracked.push(name);
		}
	}
};

var message = {
	'precipitation_label' : 'Kelembaban',
	'humidity_label' : 'Curah Hujan',
	'precipitation_value' : '99mm',
	'humidity_value' : '89%',
	'sunny' : 'Udara yang lembab membuat rambut<br> Anda lepek.<br>Lakukan perjalanan dari rambut kering<br> dan lepek menuju rambut yang indah<br> dengan New Dove Volume Nourishment',
	'rainy' : 'Udara yang lembab membuat rambut<br> Anda lepek.<br>Lakukan perjalanan dari rambut kering<br> dan lepek menuju rambut yang indah<br> dengan New Dove Volume Nourishment',
	'footerFirst' : {
		'title' : 'Baru<br> Dove Volume Nourishment',
		'text' : 'Meningkatkan volume rambut<br>sampai dengan 95%'
	},
	'footerSecond' : {
		'text' : 'Shake untuk rambut tidak lepek<br> dan terlihat lebih bervolume'
	},
	'links' : {
		'facebook' : 'https://www.facebook.com/doveindonesia',
		'youtube' : 'https://www.youtube.com/watch?v=kFsb7DnPZzQ',
		'landing'	: 'http://m.dove.co.id/id/Produk/Hair/Shampoos/Dove-Volume-Nourishment-Shampo.aspx?StayOnSite=true'
	},
	'location' :{
		'lat' : null,
		'lng' : null
	}
}

mads.prototype.loadJs = function(js, callback) {
	var script = document.createElement('script');
	script.src = js;
	if (typeof callback != 'undefined') {
		script.onload = callback;
	}
	this.headTag.appendChild(script);
}

mads.prototype.loadCss = function(href) {
	var link = document.createElement('link');
	link.href = href;
	link.setAttribute('type', 'text/css');
	link.setAttribute('rel', 'stylesheet');
	this.headTag.appendChild(link);
}

var dove = function(){
	var _this = this;
	this.app = new mads();

	this.adtrackerStart = 0;
	this.adtrackerShake = 0;
	this.adtrackerYoutube = 0;
	this.adtrackerFacebook = 0;
	this.autoTimeout = null;
	this.clickHandler = null;
	
	this.app.loadCss(this.app.path + 'css/style.css');
	// this.app.loadJs(this.app.path + 'js/jquery-1.11.3.min.js');
	var ip2LocationSctipt = document.createElement('SCRIPT');
	ip2LocationSctipt.setAttribute('src', 'http://www.geoplugin.net/javascript.gp');
	ip2LocationSctipt.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('head')[0].appendChild(ip2LocationSctipt);

	var parent = document.getElementById('rma-widget');
	this.firstScreen(parent);
	this.currentLocation();
}

dove.prototype.remove  = function(node){
	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
}

dove.prototype.firstScreen = function(parent){
	var _this = this;
	var screen = document.createElement('DIV');
	screen.setAttribute('id','adscreen');
	screen.setAttribute('class','ad-content');
	parent.appendChild(screen);

	var header = document.createElement('DIV');
	header.setAttribute('class', 'header');
	header.setAttribute('id', 'body-header');
	screen.appendChild(header);

	var widget = document.createElement('DIV');
	widget.setAttribute('class', 'adbody firstFrame');
	widget.setAttribute('id', 'ad_body');
	screen.appendChild(widget);

	var weather = document.createElement('IMG');
	weather.setAttribute('src', _this.app.path + 'img/icons/01d.png');
	weather.setAttribute('class','weather-icon');
	weather.setAttribute('id','weather-img');
	widget.appendChild(weather);

	var humidity = document.createElement('DIV');
	humidity.setAttribute('class','humidity');

	var precip = document.createElement('DIV');
	precip.setAttribute('class','precip');

	widget.appendChild(humidity);
	widget.appendChild(precip);

	var humid_label = document.createElement('P');
	humid_label.setAttribute('class', 'humid-label');
	humid_label.innerHTML = message.humidity_label;

	var humid_value = document.createElement('P');
	humid_value.setAttribute('class', 'humid-value');
	humid_value.setAttribute('id', 'humid-value');
	humid_value.innerHTML = message.humidity_value;

	humidity.appendChild(humid_label);
	humidity.appendChild(humid_value);


	var precip_label = document.createElement('P');
	precip_label.setAttribute('class', 'precip-label');
	precip_label.innerHTML = message.precipitation_label;

	var precip_value = document.createElement('P');
	precip_value.setAttribute('class', 'precip-value');
	precip_value.setAttribute('id', 'precip-value');
	precip_value.innerHTML = message.precipitation_value;

	precip.appendChild(precip_label);
	precip.appendChild(precip_value);

	var suggestions = document.createElement('P');
	suggestions.setAttribute('class', 'suggestions');
	suggestions.setAttribute('id', 'suggestion');
	suggestions.innerHTML = message.sunny
	widget.appendChild(suggestions);

	var button = document.createElement('INPUT');
	button.setAttribute('type', 'button');
	button.setAttribute('value', 'MASUK');
	button.setAttribute('id', 'btnProve');
	widget.appendChild(button);

	this.clickHandler = function(){
		_this.remove(document.getElementById('ad_body'));
		_this.remove(document.getElementById('footer'));
		_this.secondScreen();
	}

	document.getElementById('btnProve').addEventListener('click', _this.clickHandler, false);
	document.getElementById('adscreen').addEventListener('click', _this.clickHandler, false);

	footerFirst();

	function footerFirst(){
		var parent = document.getElementById('adscreen');
		var footer =  document.createElement('DIV');
		footer.setAttribute('class', 'firstScreenFooter');
		footer.setAttribute('id', 'footer');
		parent.appendChild(footer);

		var title = document.createElement('P');
		title.setAttribute('class', 'footer-title');
		title.innerHTML = message.footerFirst.title;

		var text = document.createElement('P');
		text.setAttribute('class', 'footer-text');
		text.innerHTML = message.footerFirst.text;

		footer.appendChild(title);
		footer.appendChild(text);
	}
}

dove.prototype.secondScreen = function(){
	var _this = this;
	document.getElementById('adscreen').removeEventListener('click', _this.clickHandler, false);

	if (typeof _this.app.custTracker != 'undefined' && _this.adtrackerStart == 0) {
		for (var i = 0; i < _this.app.custTracker.length; i++) {
			if (typeof _this.app.custTracker[i] != 'undefined' && _this.app.custTracker[i] != '') {
				_this.adtrackerStart = 1;
				var img = document.createElement('IMG');
				img.setAttribute('style', 'display:none;');
				img.setAttribute('src', _this.app.custTracker[i] + 'dove_next' + '&' + _this.app.id);
				document.getElementsByTagName('BODY')[0].appendChild(img);
			}
		}
	}
	
	var widget = document.getElementById('ad_body');
	widget.setAttribute('class', 'adbody secondFrame fade-in');
	var limp = document.createElement('IMG');
	limp.setAttribute('class', 'hair-limp');
	limp.setAttribute('id', 'hair-limp');
	limp.setAttribute('src', _this.app.path + 'img/hair-limp.png');
	widget.appendChild(limp);

	var complete = document.createElement('IMG');
	complete.setAttribute('class', 'hair-complete');
	complete.setAttribute('id', 'hair-complete');
	complete.setAttribute('src', _this.app.path + 'img/hair-complete.png');
	widget.appendChild(complete);

	var last = document.createElement('IMG');
	last.setAttribute('class', 'last-img');
	last.setAttribute('id', 'last-img');
	last.setAttribute('src', _this.app.path + 'img/last.jpg');
	widget.appendChild(last);

	footer();

	var shaked = false;
	if(!shaked){
		shaked = true;
		if (window.DeviceMotionEvent) {
			window.addEventListener("devicemotion", function (eventData) {
				var rotation = eventData.rotationRate;
				if ((rotation.alpha > 15 || rotation.alpha < -15) || (rotation.beta > 15 || rotation.beta < -15) || (rotation.gamma > 15 || rotation.gamma < -15)) {
		            // adding tracking for shacking
		            if (typeof _this.app.custTracker != 'undefined' && _this.adtrackerShake == 0) {
		            	for (var i = 0; i < _this.app.custTracker.length; i++) {
		            		if (typeof _this.app.custTracker[i] != 'undefined' && _this.app.custTracker[i] != '') {
		            			_this.adtrackerShake = 1;
		            			var img = document.createElement('IMG');
		            			img.setAttribute('style', 'display:none;');
		            			img.setAttribute('src', _this.app.custTracker[i] + 'dove_shake' + '&' + _this.app.id);
		            			document.getElementsByTagName('BODY')[0].appendChild(img);
		            		}
		            	}
		            }

		            bubbles();
		            window.removeEventListener('devicemotion', arguments.callee, false);
		            clearTimeout(_this.autoTimeout);
		          }
		        }, false);
		} else {
			console.log("DeviceMotionEvent is not supported");
		}

		_this.autoTimeout = setTimeout(function(){ bubbles();
		}, 1000);
	}

	function footer(){
		var footer = document.getElementById('footer');
		footer.setAttribute('class', 'secondScreenFooter');

		var text = document.createElement('P');
		text.setAttribute('class', 'footer-text');
		text.innerHTML = message.footerSecond.text;
		footer.appendChild(text);
	}

	function bubbles(){
		var bubbles = document.createElement('DIV');
		bubbles.setAttribute('class', 'bubbles');
		bubbles.setAttribute('id', 'bubbles');
		widget.appendChild(bubbles);
		var bubbles_right = document.createElement('DIV');
		bubbles_right.setAttribute('class', 'bubbles-right');
		bubbles_right.setAttribute('id', 'bubbles-right');
		widget.appendChild(bubbles_right);
		setTimeout(function () {
			widget.removeChild(bubbles);
			widget.removeChild(bubbles_right);
			limp.setAttribute('class', 'hair-limp');
			complete.setAttribute('class', 'hair-complete');
			complete.style.opacity = '1';
			_this.thirdScreen();
		}, 4000);
	}
}

dove.prototype.thirdScreen = function(){
	var _this = this;
	footer();
	function footer(){
		var footer = document.getElementById('footer');
		footer.setAttribute('class', 'thirdScreenFooter');
		footer.innerHTML = '';

		var title = document.createElement('P');
		title.setAttribute('class', 'footer-title');
		title.innerHTML = message.footerFirst.title;
		footer.appendChild(title);

		var text = document.createElement('P');
		text.setAttribute('class', 'footer-text');
		text.innerHTML = message.footerFirst.text;
		footer.appendChild(text);
	}


	function showFinal(){
		var widget = document.getElementById('ad_body');
		var footer = document.getElementById('footer');
		var last = document.getElementById('last-img');
		var limp = document.getElementById('hair-limp');
		var cmplte = document.getElementById('hair-complete');

		last.style.opacity = '1';
		cmplte.style.opacity = '0';
		limp.style.opacity = '0';
		last.style.zIndex = '-1';

		footer.style.visibility = 'hidden';
		footer.style.opacity = '0';		

		var header = document.getElementById('body-header');
		header.style.opacity = '0';

		var video = document.createElement('IMG');
		video.setAttribute('class', 'button-video btn-social');
		video.setAttribute('src',  _this.app.path + 'img/bttn1.jpg');

		var facebook = document.createElement('IMG');
		facebook.setAttribute('class', 'button-fb btn-social');
		facebook.setAttribute('src',  _this.app.path + 'img/bttn2.png');

		var site = document.createElement('IMG');
		site.setAttribute('class', 'button-site btn-social');
		site.setAttribute('src',  _this.app.path + 'img/bttn3.jpg');

		widget.appendChild(video);
		widget.appendChild(facebook);
		widget.appendChild(site);

		var title = document.createElement('P');
		title.setAttribute('class', 'body-title');
		title.innerHTML = message.footerFirst.title;
		widget.appendChild(title);


		var text = document.createElement('P');
		text.setAttribute('class', 'body-text');
		text.innerHTML = message.footerFirst.text;
		widget.appendChild(text);

		setTimeout(function(){
			title.style.opacity = '1';
			text.style.opacity = '1';
			video.style.opacity = '1';
			facebook.style.opacity = '1';
			site.style.opacity = '1';
		}, 1000);

		// var youtube = document.createElement('a');
		// youtube.setAttribute('class', 'video-link');
		// youtube.setAttribute('id', 'btnVideo');
		// youtube.setAttribute('href', message.links.youtube);
		// youtube.setAttribute('target', '_blank');
		// youtube.innerHTML = 'LIHAT VIDEO';
		// widget.appendChild(youtube);

		// var facebook = document.createElement('a');
		// facebook.setAttribute('class', 'fb-link');
		// facebook.setAttribute('id', 'btnFbs');
		// facebook.setAttribute('href', message.links.facebook);
		// facebook.setAttribute('target', '_blank');
		// facebook.innerHTML = 'LIKE FACEBOOK';
		// widget.appendChild(facebook);
		
		site.addEventListener('click', function(e){
			e.preventDefault();
			var url = message.links.landing; //this.getAttribute('href');
			_this.app.linkOpener(url);

			if (typeof _this.app.custTracker != 'undefined' && _this.adtrackerLanding == 0) {
				for (var i = 0; i < _this.app.custTracker.length; i++) {
					if (typeof _this.app.custTracker[i] != 'undefined' && _this.app.custTracker[i] != '') {
						_this.adtrackerFacebook = 1;
						var img = document.createElement('IMG');
						img.setAttribute('style', 'display:none;');
						img.setAttribute('src', _this.app.custTracker[i] + 'dove_site' + '&' + _this.app.id);
						document.getElementsByTagName('BODY')[0].appendChild(img);
					}
				}
			}
		}, false);

		facebook.addEventListener('click', function(e){
			e.preventDefault();
			var url = message.links.facebook; //this.getAttribute('href');
			_this.app.linkOpener(url);

			if (typeof _this.app.custTracker != 'undefined' && _this.adtrackerFacebook == 0) {
				for (var i = 0; i < _this.app.custTracker.length; i++) {
					if (typeof _this.app.custTracker[i] != 'undefined' && _this.app.custTracker[i] != '') {
						_this.adtrackerFacebook = 1;
						var img = document.createElement('IMG');
						img.setAttribute('style', 'display:none;');
						img.setAttribute('src', _this.app.custTracker[i] + 'dove_facebook' + '&' + _this.app.id);
						document.getElementsByTagName('BODY')[0].appendChild(img);
					}
				}
			}
		}, false);

		video.addEventListener('click', function(e){
			e.preventDefault();
			var url = message.links.youtube; //this.getAttribute('href');
			_this.app.linkOpener(url);

			if (typeof _this.app.custTracker != 'undefined' && _this.adtrackerYoutube == 0) {
				for (var i = 0; i < _this.app.custTracker.length; i++) {
					if (typeof _this.app.custTracker[i] != 'undefined' && _this.app.custTracker[i] != '') {
						_this.adtrackerYoutube = 1;
						var img = document.createElement('IMG');
						img.setAttribute('style', 'display:none;');
						img.setAttribute('src', _this.app.custTracker[i] + 'dove_youtube' + '&' + _this.app.id);
						document.getElementsByTagName('BODY')[0].appendChild(img);
					}
				}
			}
		}, false);
	}

	setTimeout(function(){ showFinal() }, 3000);
}

dove.prototype.currentLocation = function(){
	var _this = this;
	setTimeout(function() {
		if (geoplugin_latitude && geoplugin_longitude) {
			message.location.lat = geoplugin_latitude();
			message.location.lng = geoplugin_longitude();
		} else {
			message.location.lat = -4.236856;
			message.location.lng = 122.069092;
		}
		_this.updateWeather();
	}, 1000);
}

dove.prototype.updateWeather = function(){
	var _this = this;

	var weatherIcon = document.getElementById('weather-img');
	var humidityVal = document.getElementById('humid-value');
	var precipitationVal = document.getElementById('precip-value');
	var suggestionVal = document.getElementById('suggestion');
	var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + message.location.lat + '&lon=' + message.location.lng +'&APPID=56d5c262450a9716ebacbfed231dcfa5';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', weatherApiUrl, true);
	xhr.onreadystatechange = function () {
		var obj = JSON.parse(xhr.responseText);
      	if  (obj.cod = 200) { // if we were able to call API successfully then just display it
	        	if (obj.weather[0].icon != '01d' && obj.weather[0].icon != '01n' && obj.weather[0].icon != '02d' && obj.weather[0].icon != '02n') {
	        		suggestionVal.innerHTML = message.rainy;
	        	} else {
	        		suggestionVal.innerHTML = message.sunny;
	        	}
	        	var iconWeather = obj.weather[0].icon;
	        	var humidity = obj.main.humidity;
	        	var precipitation;
	        	if (obj.clouds.rain) {
	        		precipitation = obj.clouds.rain['3h'];
	        	} else if (obj.clouds.all) {
	        		precipitation = obj.clouds.all;
	        	} else {
	        		precipitation = '0';
	        	}
	        	weatherIcon.setAttribute('src', _this.app.path+'img/icons/' + iconWeather + '.png');
	        	weatherIcon.style.opacity = '1';
	        	humidityVal.innerHTML = humidity + '%';
	        	precipitationVal.innerHTML = precipitation + ' mm';
      	} else { // if API call was not successful then display default sunny weather information
	        	weatherIcon.setAttribute('src', path+'img/icons/01d.png');
	        	weatherIcon.style.opacity = '1';
	        	humidityVal.innerHTML = '89%';
	        	precipitationVal.innerHTML = '99 mm';
	        	suggestionVal.innerHTML = msgObj.sunny;
        	}
      };
      xhr.send();
}

var d = new dove();