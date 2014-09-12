// JavaScript Document
window.views = window.views || {};

views.Slider = function(options){
	
	this.ele = $();
	
	this.active = null;
	this.activeLeft = null;
	this.min = 0;
	this.max = 0;
	
	this.loopTime = 3000;
	this.auto  = true;
	this.autoBack = true;
	this.pointType = "click";
	
	this.class_content=".slider-content";
	this.class_prev=".slider-prev";
	this.class_next=".slider-next";
	this.class_panel=".slider-panel";
	this.class_panels=".slider-panels";
	this.class_point=".slider-point";
	this.class_points = ".slider-points";
	
	this.attr_active="on-active";
	this.attr_pointType="pointType";
	this.attr_loopTime="loopTime";
	this.attr_auto="noAuto";
	this.attr_autoBack="noBack";
	
	this.events = {
		go:new baseClass.Event()
	};
	
	this.timer = null;
	
	baseMethod.extend(this,options);
	this.init();
	this.bindEvents();
};
views.Slider.prototype = {
	init:function(){
		var $ele = this.ele;
		
		var loopTime = parseInt($ele.attr(this.attr_loopTime));
		var notAuto = $ele.attr(this.attr_auto);
		var pointType = $ele.attr(this.attr_pointType);
		var autoBack = $ele.attr(this.attr_autoBack);
		
		if(!isNaN(loopTime)){
			this.loopTime = loopTime;
		}
		if(!!pointType){
			this.pointType = pointType;
		}
		if(!!notAuto){
			this.auto = false;
		}
		if(!!autoBack){
			this.autoBack = false;
		}
		
		var $panel = $ele.find(this.class_panel);
		var $con = $ele.find(this.class_panels);
		this.min = 0;
		this.max = $panel.length - 1;
		
		
		var cloneFirst = $panel.eq(this.min).clone();
		var cloneLast = $panel.eq(this.max).clone();
		$panel.last().after(cloneLast);
		$panel.last().after(cloneFirst);
		cloneLast.css({"left":"-100%","position":"relative"});
		
		$panel = $ele.find(this.class_panel);
		$con.css({"width":($panel.length*100)+"%"});
		$panel.css({"width":(100/$panel.length)+"%"});
		
		this.go(this.min);
	},
	bindEvents :function(){
		
		var _this = this;
		
		var startX = 0;
		var moveX = 0;
		var $ele = this.ele;
		var $con = $ele.find(this.class_panels);
		var $panel = $ele.find(this.class_panel);
		
		$ele.bind({
			"mouseenter":function(e){
				_this.stop();
			},
			"mouseleave":function(e){
				_this.start();
			},
			"touchstart":function(){
				
				var touch = event.touches[0];
				startX = touch.pageX;
				moveX = 0;
				
				$con.addClass("on-touch");
				_this.stop();
				return false;
			},
			"touchmove":function(){
				var touch = event.touches[0];
				moveX = touch.pageX;
				
				var now = _this.activeLeft + startX - moveX;
				now = 0 -now;
				$con.css({
					"-webkit-transform": "translate3d("+now+"px, 0px, 0px)",
					"-moz-transform": "translate3d("+now+"px, 0px, 0px)",
					"transform": "translate3d("+now+"px, 0px, 0px)"
				});
				return false;
			},
			"touchend":function(){
				
				var min = _this.min;
				var max = _this.max;
				var active = _this.active;
				var width = $panel.eq(max).position().left - $panel.eq(min).position().left;			
				var left = $con.position().left;
				
				if((moveX - startX)>30 && active == min){
					left = left + width;
				}else if((startX - moveX)>30 && active == max){
					left = left - width;
				}
				$con.css({
					"-webkit-transform": "translate3d("+left+"px, 0px, 0px)",
					"-moz-transform": "translate3d("+left+"px, 0px, 0px)",
					"transform": "translate3d("+left+"px, 0px, 0px)"
				});
				
				$con.removeClass("on-touch");
				_this.start();
					
				if((moveX - startX)>30){
					_this.prev();
				}else if((startX - moveX)>30){
					_this.next();
				}else{
					_this.go();
				}
				
				return false;
			}
		});
		
		var $point = $ele.find(this.class_point);
		var temp = {};
		temp[this.pointType]=function(e){
			var n = $(this).index();
			_this.go(n);
		};
		$point.bind(temp);
		
		var $prev = $ele.find(this.class_prev);
		$prev.click(function(e){
			_this.prev();
		});
		
		var $next = $ele.find(this.class_next);
		$next.click(function(e){
			_this.next();
		});
		
	},
	start:function(){
		var time = this.loopTime;
		if(time>0 && this.auto){
			var _this = this;
			this.timer = window.setInterval(function(){
				_this.next(true);
			},time);
		}
	},
	stop:function(){
		window.clearInterval(this.timer);
	},
	next:function(){
		var isAuto = this.autoBack;
		var n = this.active+1;
		if(n<=this.max){
			this.go(n);
		}else if(isAuto){
			this.go(this.min);
		}else{
			this.go();
		}
	},
	prev:function(){
		var isAuto = this.autoBack;
		var n = this.active-1;
		if(n>=this.min){
			this.go(n);
		}else if(isAuto){
			this.go(this.max);
		}else{
			this.go();
		}
	},
	go:function(n){
		if(n<this.min || n>this.max){
			return;
		}
		if(typeof n == "undefined"){
			n = this.active;
		}
		
		var $ele = this.ele;
		var $panel = this.ele.find(this.class_panel);
		var $point = this.ele.find(this.class_point);
		var $con = this.ele.find(this.class_panels);
		
		$panel.removeClass(this.attr_active);
		$point.removeClass(this.attr_active);
		$panel.eq(n).addClass(this.attr_active);
		$point.eq(n).addClass(this.attr_active);
		
		var list = $ele.attr("class").split(" ");
		var x=0;
		for(;x<list.length;x++){
			var c = list[x];
			if(c.indexOf(this.attr_active)==0){
				$ele.removeClass(c);
			}
		}
		$ele.addClass(this.attr_active+"-"+n);
		
		var left = $panel.eq(n).position().left - $panel.first().position().left;
		$con.css({
			"-webkit-transform": "translate3d(-"+left+"px, 0px, 0px)",
			"-moz-transform": "translate3d(-"+left+"px, 0px, 0px)",
			"transform": "translate3d(-"+left+"px, 0px, 0px)"
		});
	
		this.events.go.notify(n);
		this.active = n;
		this.activeLeft = left;
	}
};


$(document).ready(function(e) {
    $(".views-slider").each(function(index, element) {
        var view = new views.Slider({ele:$(this)});
		view.start();
    });
});