(function ($) {

$ua  = window.navigator.appVersion.toUpperCase();
$bp  = 1060;
$win = "";
$mv  = false;
$wheel_e = null;

var self = $.lp = {
	
	
	
	init: function () {
		self.def();
		self.map();
		self.anchor();
		self.scroll();
		self.scroll_position();
		self.viewDetail();
		self.bnav();
		self.board();
		
		$win = $( window ).width() > $bp;
		
		$( window ).resize( function () {
			self.resize();
		});
		self.resize();
		
		$( window ).load( function() {
			$( ".fix_height > *" ).matchHeight();
		});
	},
	
	
	
	// 初期設定
	def: function () {
		var article = $( "article" );
		
		for ( var i = 0; i < article.length; i++ ) {
			var obj = article.eq( i );
			var str = '<div id="' + obj.attr( "id" ) + '_" class="point"></div>';
			
			obj.prepend( str );
		};
		
	},
	
	
	
	// リサイズ
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
	},
	
	
	
	// スクロール
	scroll: function () {
		
		// グロナビ：スクロール
		$( 'nav#bnav ul' ).localScroll({
			target:   'body',
			duration: 1500,
			easing:   'easeOutExpo',
			onBefore: function( e, anchor, $target ){
				$mv = true;
				self.wheel();
			},
			onAfter: function( anchor, settings ){
				self.del_wheel();
			}
		});
		
		
		// グロナビ：アクティブ
		$( 'nav#bnav ul li a' ).click(function () {
			var _this = $( this ).parent();
			var id    = $( "nav#bnav ul li" ).index( _this );
			
			self.change_nav( id - 0 );
		});
		
		
		// ブライダルフェア／バナー
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
	
	
	
	// コンテンツの位置とスクロール設定
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
	
	
	
	// スクロール中のマウスホイール監視
	wheel: function () {
		$wheel_e = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		
		$( "html" ).on( $wheel_e, function( e ){
			e.preventDefault();
			self.del_wheel();
		});
	},
	
	
	
	// マウスホイールイベント削除
	del_wheel: function () {
		$( "html" ).unbind();
		$wheel_e = null;
		$mv      = false;
	},
	
	
	
	// ナビのアクティブ処理
	change_nav: function ( id ) {
		var obj = $( "nav#bnav ul li:eq(" + (id + 0) + ")" );
		$( "nav#bnav ul li" ).removeClass( 'on' );
		obj.addClass( 'on' );
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
	
	
	
	// ナビゲーション
	bnav: function () {
		var obj = $( "nav#bnav" );
		var h   = obj.outerHeight();
		var win_h = $( window ).height();
		var flg   = false;
		
		var t   = new TimelineMax();
		var obj = $( "nav#bnav div.entry img" );
		
		setInterval( function() {
			t.to( obj, 0.3, { scale: 1.2, ease: Circ.easeOut })
			 .to( obj, 0.5, { scale: 1,   ease: Elastic.easeOut });
		}, 3000 );
		
		/*obj.css({ "top" : win_h + 55});
		TweenMax.to( obj, 1, { delay: 1, y : -h - 55, ease: Expo.easeOut });
		
		obj.css({ "top" : win_h-h});
		
		$( window ).scroll( function () {
			var point = obj.offset().top;
			console.log(point);
			if ( $( this ).scrollTop() > point ) {
				if ( flg == false ) {
					flg = true;
					obj.addClass( "bnav_fix" );
				}
			}
			else {
				if ( flg ) {
					flg = false;
				}
			}
		});*/
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
	
	
	
	// ボードの昼夜
	board: function () {
		var mode = "day";
		
		$( "#board_btn a" ).click( function(){
			var str   = $( this ).attr( "class" );
			var board = $( "div.board" );
			
			for ( var i = 0; i < board.length; i++ ) {
				var obj   = board.eq( i );
				var day   = $( ">img", obj ).eq( 0 );
				var night = $( ">img", obj ).eq( 1 );
				var on    = str == "day" ? day : night;
				var off   = str == "day" ? night : day;
				
				if ( mode != str ) {
					on.css({ "z-index"  : 1 });
					off.css({ "z-index" : 2 });
					TweenMax.to( on,  1, { autoAlpha : 1 });
					TweenMax.to( off, 1, { autoAlpha : 0, delay : 0.5 });
				}
			}
			
			mode = str;
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
				$('html, body').animate({scrollTop: t.offset().top}, 1000, 'easeOutExpo');
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
	event.target.playVideo();
	event.target.mute();
}
