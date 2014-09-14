// JavaScript Document
window.views = window.views || {};

views.Slider = function(options){
	
	this.ele = $();
	
	//private
	//当前轮播点 实时更改
	this.active = null;
	//向左的便宜距离 实时更改
	this.activeLeft = null;
	//最小轮播
	this.min = 0;
	//最大轮播数  初始化时读取
	this.max = 0;
	//自动轮询时的计时器
	this.timer = null;
	//延迟重置的计时器
	this.delayTimer = null; 
	
	//public
	//轮播切换执行的时间
	this.sliderTime = 200;
	//自动轮播时的切换时间参数
	this.loopTime = 3000;
	//是否自动循环播放
	this.auto  = true;
	//是否从最后一个跳跃到第一个 或者 从第一个跳跃到最后一个 影响上翻和下翻
	this.autoBack = true;
	//轮播标记的触发类型 click 或者 mouseover 或者 mouseenter 都可以
	this.pointType = "click";
	
	//轮播项最外层容器的标签名
	this.class_content=".slider-content";
	//上翻的标签名
	this.class_prev=".slider-prev";
	//下翻的标签名
	this.class_next=".slider-next";
	//滑块单位
	this.class_panel=".slider-panel";
	//滑块单位的横向容器 假想是无限大
	this.class_panels=".slider-panels";
	//滑块对应的导航
	this.class_point=".slider-point";
	//对应导航容器
	this.class_points = ".slider-points";
	
	//序号
	this.attr_index = "i";
	//标记活跃时的类名
	this.attr_active="on-active";
	//读取导航事件类型的attribute
	this.attr_pointType="pointType";
	//轮播时间
	this.attr_loopTime="loopTime";
	//如果有值  不自动轮播
	this.attr_auto="noAuto";
	//如果有值 不自动从最后到第一个
	this.attr_autoBack="noBack";
	
	this.init(options);
	this.bindEvents();
};
views.Slider.prototype = {
	init:function(options){
		
		for(var x in options){
			this[x] = options[x];
		}
		
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
		var index = this.attr_index;
		$panel.each(function(i,item){
			$(this).attr(index,i);
		});
		var $con = $ele.find(this.class_panels);
		$con.css({"width":($panel.length*100)+"%"});
		$panel.css({"width":(100/$panel.length)+"%"});
		
		this.min = 0;
		this.max = $panel.length - 1;
		
		this.go(this.min);
	},
	bindEvents :function(){
		
		var _this = this;
		
		var startX = 0;
		var moveX = 0;
		var $ele = this.ele;
		var $con = $ele.find(this.class_panels);
		
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
				
				if((moveX - startX)>30){
					_this.prev();
				}else if((startX - moveX)>30){
					_this.next();
				}else{
					_this.go();
				}
				
				_this.start();
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
		window.clearTimeout(this.delayTimer);
		
		var $panel = this.ele.find(this.class_panel);
		var $point = this.ele.find(this.class_point);
		var $con = this.ele.find(this.class_panels);
		var $nextActive = $panel.filter("["+this.attr_index+"='"+n+"']");
		
		$panel.removeClass(this.attr_active);
		$point.removeClass(this.attr_active).eq(n).addClass(this.attr_active);
		$nextActive.addClass(this.attr_active);
		
		var left = $nextActive.position().left - $panel.first().position().left;
		$con.css({
			"transition-duration":this.sliderTime+"ms",
			//"-webkit-transform": "translate3d(-"+left+"px, 0px, 0px)",
			//"-moz-transform": "translate3d(-"+left+"px, 0px, 0px)",
			"transform": "translate3d(-"+left+"px, 0px, 0px)"
		});
	
		this.active = n;
		this.activeLeft = left;
		
		var _this = this;
		this.delayTimer = window.setTimeout(function(){
				_this.delayInit();
		}, this.sliderTime+10);
	},
	delayInit:function(){
		
		var $con = this.ele.find(this.class_panels);
		var $panel = this.ele.find(this.class_panel);
		var $active = $panel.filter("."+this.attr_active);
		
		if($active.nextAll().length > 1 ){
			$panel.first().before($panel.last());
		}else if($active.nextAll().length < 1){
			$panel.last().after($panel.first());
		}
		
		var $panel = this.ele.find(this.class_panel);
		var $active = $panel.filter("."+this.attr_active);
		var left = $active.position().left - $panel.first().position().left;
		this.activeLeft = left;
		
		$con.css({
			//"-moz-transition-time":0,	/* Firefox 4 */
			//"-webkit-transition-time":0,	/* Safari 和 Chrome */
			//"-o-transition-time":0,	/* Opera */
			"transition-duration":"0ms",
			//"-webkit-transform": "translate3d(-"+left+"px, 0px, 0px)",
			//"-moz-transform": "translate3d(-"+left+"px, 0px, 0px)",
			"transform": "translate3d(-"+left+"px, 0px, 0px)"
		});
	}
};


$(document).ready(function(e) {
    $(".views-slider").each(function(index, element) {
        var view = new views.Slider({ele:$(this)});
		view.start();
    });
});