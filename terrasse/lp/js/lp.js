
(function ($) {

var $ua = navigator.userAgent.toUpperCase();
var $sp = ($ua.indexOf( 'IPHONE' ) != -1) || ($ua.indexOf( 'ANDROID' ) != -1 || ($ua.indexOf( 'IPAD' ) != -1));

var self = $.lp = {
	
	
	
	init: function () {
		self.gnav();
		self.viewDetail();
		self.footer();
		self.map();
		self.anchor();
		self.form_action();

		$( window ).resize( function () {
			self.resize();
		});

		if ( $sp ) {
			$( 'body' ).attr( 'id', 'sp' );
		}
	},
	
	
	
	gnav: function () {
		var nav     = $( "nav#gnav" );
		var trigger = $( 'a.menu-trigger' );
		
		TweenMax.from( nav, 2.0, { x: 165, ease: Expo.easeInOut });
		
		$( "nav#gnav ul li a" ).click( function(){
			if ( trigger.attr( "class" ).indexOf( "active" ) >= 0 ) {
				TweenMax.to( nav, 0.8, { x: 0, ease: Expo.easeOut });
				trigger.toggleClass( "active" );
			}
		});
		
		trigger.click(function () {
			if ( trigger.attr( "class" ).indexOf( "active" ) >= 0 ) {
				TweenMax.to( nav, 0.8, { x: 0, ease: Expo.easeOut });
			}
			else {
				TweenMax.to( nav, 1.0, { x: -165, ease: Expo.easeOut });
			}
			trigger.toggleClass( "active" );
		});
	},
	
	
	
	resize: function () {
		var w       = $( window ).width();
		var bp      = 768;
		var trigger = $( "a.menu-trigger" );
		var active  = trigger.attr( "class" ).indexOf( "active" ) >= 0;
		var nav     = $( "nav#gnav" );
		
		if ( w > bp && active ) {
			trigger.toggleClass( "active" );
			TweenMax.to( nav, 0, { x: 0, ease: Expo.easeInOut });
		}
	},
	
	
	
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
				var title = $(this).attr('title');
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
	
	footer: function () {
		var obj = $( "div#footer_sp" );
		var h   = obj.height();
		var f   = true;
		var st;
		var y;
		
		$( window ).scroll(function () {
			y  = $( "article#reservation" ).offsetTop - 100;
			st = $( document ).scrollTop();
			
			if ( st > y && f ) {
				f = false;
				TweenMax.to( obj, 0.8, { y: h, ease: Expo.easeOut });
			}
			
			if ( st < y && f == false ) {
				f = true;
				TweenMax.to( obj, 0.8, { y: 0, ease: Expo.easeOut });
			}
			
		});
	},
	
	
	// GoogleMaps
	map: function () {

		var map = $('#map');

		if( map.length )
		{
			google.maps.event.addDomListener(window, 'load', function () {
			google.maps.visualRefresh = false;
			var latlng = new google.maps.LatLng( 34.817715, 135.536854, 14 );
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
		} 
	},
	
	
	
	anchor: function() {
		$('a[href^=#].anc').click(function(e) {
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
				$('html, body').animate({scrollTop: t.offset().top}, 700, 'easeOutExpo');
			}
		});
	},
	

	form_action: function() {
		if( $("form.wpcf7-form").length )
		{
			var for_subject;
			var insert_subject = $("#hidden_field");
			$('form.wpcf7-form [name=your-name]').bind('change', function() {
				for_subject = $(this).val();
				for_subject = for_subject + "様からのお問合せ";
				insert_subject.val(for_subject);
			});

			var time = $('#time input[type="radio"]');
			var othertime = $('#othertime');
			time.click(function() {
				seleted = $(this).val();
				if( seleted === "その他の時間帯" )
				{
					othertime.show(400,"linear");
				}
				else
				{
					othertime.hide(400,"linear");
					$('#other-time input[type="radio"]').attr("checked",false);
				}
			});
		}
	}
	
}
$(function () { self.init(); });
})(jQuery);