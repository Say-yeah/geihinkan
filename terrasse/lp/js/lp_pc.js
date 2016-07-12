$mv = false;

(function ($) {

$ua      = window.navigator.appVersion.toUpperCase();
$bp      = 1060;
$win     = "";
$wheel_e = null;
$f_bnav  = false;

var self = $.lp = {
	
	
	
	init: function () {
		self.def();
		self.map();
		self.anchor();
		self.scroll();
		//self.scroll_position();
		self.viewDetail();
		self.bnav();
		self.board();
		self.form_action();
		
		$win = $( window ).width() > $bp;
		
		$( window ).resize( function () {
			self.resize();
		});
		self.resize();
		
		$( window ).load( function() {
			$( ".fix_height > *" ).matchHeight();
		});
	},
	
	
	
	def: function () {
		var article = $( "article" );
		
		for ( var i = 0; i < article.length; i++ ) {
			var obj = article.eq( i );
			var str = '<div id="' + obj.attr( "id" ) + '_" class="point"></div>';
			
			obj.prepend( str );
		};
		
	},
	
	
	
	resize: function () {
		var w = $( window ).width();
		
		if ( w < $bp && $win ) {
			$( "body" ).addClass( "min" );
			$win = false;
		}
		else if ( w > $bp && $win == false ) {
			$( "body" ).removeClass( "min" );
			$win = true;
		}
		
		if ( $f_bnav == false ) {
			$( "nav#bnav" ).css({ "top" : $( window ).height() - $( "nav#bnav" ).outerHeight() });
		}
	},
	
	
	
	scroll: function () {
		
		$( 'nav#bnav ul' ).localScroll({
			target:   'body',
			duration: 1500,
			easing:   'easeOutExpo',
			onBefore: function( e, anchor, $target ){
				$target.stop();
				$mv = true;
				self.wheel();
			},
			onAfter: function( anchor, settings ){
				self.del_wheel();
			}
		});
		
		
		$( 'nav#bnav ul li a' ).click(function () {
			var _this = $( this ).parent();
			var id    = $( "nav#bnav ul li" ).index( _this );
			
			self.change_nav( id - 0 );
		});
		
		
		$( window ).scroll( function () {
			
			$( '.bnr_fear' ).each( function(){
				var pos    = $( this ).offset().top;
				var scroll = $( window ).scrollTop();
				var wh     = $( window ).height();
				
				if ( scroll > pos - wh + 200 && $( this ).attr( "class" ).indexOf( "add" ) < 0 ) {
					TweenMax.to( $( this ), 1, { autoAlpha : 1 });
					$( this ).addClass( "add" );
				}
			});
		});
	},
	
	
	
	scroll_position: function () {
		var unit = $( 'article' );
		
		unit.waypoint( function ( dir ) {
			
			if ( $mv == false ) {
				var active = $( this );
				var num    = unit.index( this );
						num    = dir === 'up' ? num - 1 : num;
				
				self.change_nav( num );
			}
		},{
			offset: '0'
		});
	},
	
	
	
	wheel: function () {
		$wheel_e = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		
		$( "html" ).on( $wheel_e, function( e ){
			e.preventDefault();
			self.del_wheel();
		});
	},
	
	
	
	del_wheel: function () {
		$( "html" ).unbind();
		$wheel_e = null;
		$mv      = false;
	},
	
	
	
	change_nav: function ( id ) {
		var obj = $( "nav#bnav ul li:eq(" + (id + 0) + ")" );
		$( "nav#bnav ul li" ).removeClass( 'on' );
		obj.addClass( 'on' );
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
	
	
	
	bnav: function () {
		var obj   = $( "nav#bnav" );
		var h     = obj.outerHeight();
		var win_h = $( window ).height();
		var t     = new TimelineMax();
		var entry = $( "nav#bnav div.entry img" );
		
		var f_interval;
		function scale () {
			t.to( entry, 0.3, { scale: 1.2, ease: Circ.easeOut })
			 .to( entry, 0.5, { scale: 1,   ease: Elastic.easeOut });
		}
		function interval () {
			f_interval = setInterval( scale, 3000 );
		}
		
		$(window).focus();
		interval();
		
		$( window ).bind( "focus", function() {
			clearInterval( f_interval );
			interval();
		}).bind( "blur", function(){
			clearInterval( f_interval );
		});
		
		
		
		obj.css({ "top" : "auto" });
		TweenMax.fromTo( obj, 0.5,
			{ top: win_h + 55 },
			{ top: win_h - h, ease: Expo.easeOut }
		);
		/*
		$( window ).scroll( function () {
			var point = win_h - h;
			
			if ( $( this ).scrollTop() > point ) {
				if ( $f_bnav == false ) {
					$f_bnav = true;
					obj.addClass( "fix" );
				}
			}
			else {
				if ( $f_bnav ) {
					$f_bnav = false;
					obj.removeClass( "fix" );
					obj.css({ "top" : $( window ).height() - h });
				}
			}
		});
		*/
	},
	
	
	
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
	
	
	
	board: function () {
		var obj     = $( "div.board" );
		var day     = $( ">img", obj ).eq( 0 );
		var night   = $( ">img", obj ).eq( 1 );
		var hall    = $( ">img", obj ).eq( 2 );
		var mode    = "day";
		var current = day;
		var fade    = false;
		
		$( "#board_btn a" ).click( function(){
			var str   = $( this ).attr( "class" );
			if ( mode != str && fade == false ) {
				var on = (str == "day") ? day : (str == "night" ? night : hall);
				
				on.css({ "z-index"  : 1 });
				current.css({ "z-index" : 2 });
				
				TweenMax.to( on,      1, { autoAlpha : 1 });
				TweenMax.to( current, 1, { 
					autoAlpha : 0, 
					delay : 0.5, 
					onComplete :  function(){fade = false;} , 
				});
				
				fade = true;
				function fin () { fade = false; }
				
				current = on;
				mode = str;
			}
		});
	},
	
	
	
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
				$('html, body').animate({scrollTop: t.offset().top}, 1000, 'easeOutExpo');
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
			var othertime = $('#other-time');
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



var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
	player = new YT.Player( 'player', {
		width:   '710',
		height:  '408',
		videoId: 'ziwedac32qk',
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
	event.target.playVideo();
	event.target.mute();
}
