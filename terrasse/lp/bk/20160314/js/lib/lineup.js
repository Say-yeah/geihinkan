/*--------------------------------------------------------------------------*
 *  
 *  heightLine JavaScript Library beta4
 *  
 *  MIT-style license. 
 *  
 *  2007 Kazuma Nishihata 
 *  http://www.webcreativepark.net
 *  
 *--------------------------------------------------------------------------*/
new function(){
	
	function heightLine(){
	
		this.className="heightLine";
		this.parentClassName="fix_height"
		reg = new RegExp(this.className+"-([a-zA-Z0-9-_]+)", "i");
		objCN =new Array();
		var objAll = document.getElementsByTagName ? document.getElementsByTagName("*") : document.all;
		for(var i = 0; i < objAll.length; i++) {
			var eltClass = objAll[i].className.split(/\s+/);
			for(var j = 0; j < eltClass.length; j++) {
				if(eltClass[j] == this.className) {
					if(!objCN["main CN"]) objCN["main CN"] = new Array();
					objCN["main CN"].push(objAll[i]);
					break;
				}else if(eltClass[j] == this.parentClassName){
					if(!objCN["parent CN"]) objCN["parent CN"] = new Array();
					objCN["parent CN"].push(objAll[i]);
					break;
				}else if(eltClass[j].match(reg)){
					var OCN = eltClass[j].match(reg)
					if(!objCN[OCN]) objCN[OCN]=new Array();
					objCN[OCN].push(objAll[i]);
					break;
				}
			}
		}
		
		//check font size
		var e = document.createElement("div");
		var s = document.createTextNode("S");
		e.appendChild(s);
		e.style.visibility="hidden"
		e.style.position="absolute"
		e.style.top="0"
		document.body.appendChild(e);
		var defHeight = e.offsetHeight;
		
		changeBoxSize = function(){
			for(var key in objCN){
				if (objCN.hasOwnProperty(key)) {
					//parent type
					if(key == "parent CN"){
						for(var i=0 ; i<objCN[key].length ; i++){
							var max_height=0;
							var CCN = objCN[key][i].childNodes;
							for(var j=0 ; j<CCN.length ; j++){
								if(CCN[j] && CCN[j].nodeType == 1){
									CCN[j].style.height="auto";
									max_height = max_height>CCN[j].offsetHeight?max_height:CCN[j].offsetHeight;
								}
							}
							for(var j=0 ; j<CCN.length ; j++){
								if(CCN[j].style){
									var stylea = CCN[j].currentStyle || document.defaultView.getComputedStyle(CCN[j], '');
									var newheight = max_height;
									if(stylea.paddingTop)newheight -= stylea.paddingTop.replace("px","");
									if(stylea.paddingBottom)newheight -= stylea.paddingBottom.replace("px","");
									if(stylea.borderTopWidth && stylea.borderTopWidth != "medium")newheight-= stylea.borderTopWidth.replace("px","");
									if(stylea.borderBottomWidth && stylea.borderBottomWidth != "medium")newheight-= stylea.borderBottomWidth.replace("px","");
									CCN[j].style.height =(newheight+0)+"px";
									
									/**/
								}
							}
						}
					}else{
						var max_height=0;
						for(var i=0 ; i<objCN[key].length ; i++){
							objCN[key][i].style.height="auto";
							max_height = max_height>objCN[key][i].offsetHeight?max_height:objCN[key][i].offsetHeight;
						}
						for(var i=0 ; i<objCN[key].length ; i++){
							if(objCN[key][i].style){
								var stylea = objCN[key][i].currentStyle || document.defaultView.getComputedStyle(objCN[key][i], '');
									var newheight = max_height;
									if(stylea.paddingTop)newheight-= stylea.paddingTop.replace("px","");
									if(stylea.paddingBottom)newheight-= stylea.paddingBottom.replace("px","");
									if(stylea.borderTopWidth && stylea.borderTopWidth != "medium")newheight-= stylea.borderTopWidth.replace("px","")
									if(stylea.borderBottomWidth && stylea.borderBottomWidth != "medium")newheight-= stylea.borderBottomWidth.replace("px","");
									objCN[key][i].style.height =newheight+"px";
									/**/
							}
						}
					}
				}
			}
		}
		
		checkBoxSize = function(){
			if(defHeight != e.offsetHeight){
				changeBoxSize();
				defHeight= e.offsetHeight;
			}
		}
		changeBoxSize();
		setInterval(checkBoxSize,1000)
		window.onresize=changeBoxSize;
	}
	
	function addEvent(elm,listener,fn){
		try{
			elm.addEventListener(listener,fn,false);
		}catch(e){
			elm.attachEvent("on"+listener,fn);
		}
	}
	//addEvent(window,"load",heightLine);
}

(function($){

    /**
     * LineUp
     * ------
     * Fix heights of the cols in the same row
     *
     * @class
     * @param String selector
     * @param Object option
     */
    var LineUp = function(/* selector, options */){
        this.init.apply(this, arguments);
    };

    $.extend(LineUp.prototype, {

        EVENT_FONT_RESIZE: "lineup.fontresize",

        /**
         * Defaults Options
         *
         * - onFontResize      :Boolean  ... Refresh when font resized or not
         * - onResize          :Boolean  ... Refresh when window resized or not
         * - checkFontInterval :Integer  ... Interval time for checking font size
         * - fontSamplerName   :String   ... ID name for font sampler element
         * - hook              :Function ... Function called when columns' height refreshed
         */
        defaults: {
            onFontResize : true,
            onResize : true,
            checkFontInterval : 10,
            fontSamplerName : "lineup-font-size-sampler",
            hook: $.noop
        },

        options: {},
        nodes: null,
        sampler: null,

        /**
         * Initialize with selector
         *
         * @constructor
         * @param String selector
         * @param Object options
         */
        init: function(selector, options){
        	
            // configure, initialize
            this.nodes = $(selector);
            this.options = {};
            this.config(this.defaults).config(options);
            this.refresh();

            // handlers
            if(this.get("onResize")){
                $(window).on("resize", $.proxy(this.refresh, this));
            }
            if(this.get("onFontResize")){
                this.sampler = this.getFontSampler();
                this.sampler.on(this.EVENT_FONT_RESIZE, $.proxy(this.refresh, this));
            }
        },

        /**
         * Configure options
         *
         * @param Object option
         */
        config: function(options){
            $.extend(this.options, options);
            return this;
        },

        /**
         * Getter for options
         *
         * @param String key
         */
        get: function(key){
            return this.options[key];
        },

        /**
         * Refresh the heights of elements for the selector
         *
         * @return LineUp
         */
        refresh: function(){
            var nodes, items, currentTop, hook, fixHeight;

            nodes = this.nodes.toArray();
            items = [];
            currentTop = null;
            hook = this.get("hook");
            
            // sort by offset
            nodes.sort(function(a, b){
                return $(a).offset().top - $(b).offset().top;
            });

            // fix column size by row
            fixHeight = function(){
                var max = 0;
                var max_head = 0;
                var f_head = false;
                
                $(items).each(function(){
                    if ( $( this ).find( ".head" ).length ) {
                      var obj = $( this ).find( ".head" );
                      max_head = Math.max(max_head, obj.height());
                      f_head = true;
                    }
                })
                .each(function(){
                    if ( f_head ) {
                      $( this ).find( ".head" ).height(max_head);
                    }
                })
                .each(function(){
                    max = Math.max(max, $(this).height());
                })
                .each(function(){
                    $(this).height(max);
                });
                
                items = [];
            };
            this.reset();

            $.each(nodes, function(){
                var node = $(this);

                if(currentTop !== null && node.offset().top !== currentTop){
                    fixHeight();
                }
                currentTop = node.offset().top;
                items.push(this);
            });
            fixHeight();

            if($.isFunction(hook)){
                hook(this);
            }
            return this;
        },

        /**
         * Reset all the heights of elements for the selector
         * 
         * @return LineUp
         */
        reset: function(){
            this.nodes.css("height", "");
            return this;
        },

        /**
         * Get font sampler node
         *
         * @return jQuery
         */
        getFontSampler: function(){
            var name, node, process;

            name = this.get("fontSamplerName");
            node = $("#" + name);

            // already created ?
            if(node.length){
                return node;
            }

            // create sampler node
            node = $("<span>").text("M").css({
                position: "absolute",
                visibility: "hidden"
            })
            .attr("id", name)
            .appendTo("body");
            node.data("height", node.height());

            // check by interval
            process = function(eventName){
                var height = this.height();
                if(this.data("height") !== height){
                    this.trigger(eventName);
                    this.data("height", height);
                }
            };

            node.data(
                /*setInterval(
                    $.proxy(process, node, this.EVENT_FONT_RESIZE),
                    this.get("checkFontInterval")
                )*/
            );

            return node;
        }

    });


    /**
     * jquery.fn.lineUp
     */
    $.fn.extend({
        lineUp: function(option){
            var node, lineup;

            node = $(this);
            lineup = node.data("lineUp");

            if(lineup instanceof LineUp){
                lineup.config(option);
                lineup.refresh();
            } else {
                node.data("lineUp", new LineUp(this.selector, option));
            }
        }
    });


    /**
     * Run with parameter
     *
     * @example
     *   <script src="lineup.js" data-selector=".item-a, .item-b"></script>
     */
    (function(){
        var selector = $("script:last").data("lineupSelector");

        if(selector){
            $.each(selector.split(","), function(index, value){
                $(value).lineUp();
            });
        }
    }());

}(jQuery));