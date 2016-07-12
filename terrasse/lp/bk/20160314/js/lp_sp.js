(function ($) {

$ua  = window.navigator.appVersion.toUpperCase();
$bp  = 1060;
$win = "";

var self = $.lp = {
	
	
	
	init: function () {
		self.gnav();
		self.map();
		self.viewDetail();
		self.anchor();
		
		$( window ).resize( function () {
			self.resize();
		});
		self.resize();
		
		$( window ).load( function() {
			$( ".fix_height > *" ).matchHeight();
		});
	},
	
	
	// リサイズ
	resize: function () {
		var circle = $( "article#party div.bg" );
		circle.height( circle.width() );
	},
	
	
	
	// スマホナビ出現
	gnav: function () {
		
		$( 'div#trigger a, nav#gnav a' ).click(function () {
			$( "nav#gnav" ).fadeToggle( 500 );
			$( "div#trigger a" ).toggleClass( "close" );
		});
	},
	
	
	
	// GoogleMaps
	map: function () {
		google.maps.event.addDomListener(window, 'load', function () {
		google.maps.visualRefresh = false;
		var latlng = new google.maps.LatLng( 34.8160711,135.5248502, 14 );
		var myOptions = {
			zoom:         16,
			center:       latlng,
			mapTypeId:    google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: false,
			panControl:       false,
			zoomControl:      true,
			scaleControl:     false,
			scrollwheel:      false,
			streetViewControl:false,
			mapTypeControll:  false
		};
		
		var map = new google.maps.Map( document.getElementById( "map" ), myOptions );
		var marker = new google.maps.Marker({
				position : latlng,
				map      : map,
				title    : "terrasse"
			});
		});
	},
	
	
	
	// pjax
	viewDetail: function () {
		var obj  = $( "#load_contents_frame" );
		var home = location.href;
		
		$( document ).pjax( 'a.load_btn', {
			container: obj,
			fragment:  '#load_contents',
			timeout :  3000,
			scrollTo:  true,
			load: {
				head: 'base, meta, link',
				css: true
			}
		});
		
		$(document).on('pjax:beforeSend', function() {
			obj.show();
			$( "body" ).addClass( "scroll_none" );
		});
		
		$(document).on('pjax:end', function() {
			obj.addClass( "open" );
		});
		
		$(document).on('pjax:success', function() {
			
			$( "a.detail_close" ).click( function(){
				obj.removeClass( "open" );
				history.pushState( 'testButton', null, home );
				var t = setTimeout( fin, 650 );
			});

			$(window).on( "popstate", function(event){
				obj.removeClass( "open" );
				var t = setTimeout( fin, 650 );
			});

			function fin () {
				obj.hide();
				obj.empty();
				$( "body" ).removeClass( "scroll_none" );
			}
		});
	},
	
	
	
	// ページ内リンク
	anchor: function() {
		$('a[href^=#]').click(function(e) {
			e.preventDefault();
			var h = $(this).attr('href');
			var t = null;

			if (0 < $(h).size()) {
				t = $(h);
			}
			else {
				t = h.slice(1);
				t = $('a[name=' + t + ']');
			}
			if (h === '#top') {
				t = $('body');
			}
			if (0 < t.size()) {
				$('html, body').animate({scrollTop: t.offset().top - 60}, 700, 'easeOutExpo');
			}
		});
	}
	
	
	
}
$(function () { self.init(); });
})(jQuery);



var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
	player = new YT.Player( 'player', {
		width:   '710',
		height:  '399',
		videoId: '62YHZ5BWDFI',
		wmode:   'transparent',
		playerVars:{
			'loop':     '0',
			'rel':      '0',
			'showinfo': '0' 
		},
		events: {
			'onReady': onPlayerReady
			}
		}
	);
}

function onPlayerReady(event) {
	event.target.mute();
}