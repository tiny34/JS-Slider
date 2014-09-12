// JavaScript Document
$(document).ready(function(e) {
    $("a").on("click",function(){
		var href = $(this).attr("href");
		return !(href == "###");
	});
});


window.baseClass = window.baseClass || {};
window.baseMethod = window.baseMethod || {};

baseMethod.extend = function(obj,options){
	for(var x in options){
		obj[""+x] = options[x];
	}
	return obj;
};
baseClass.Event = function(){
	this.datas = [];
	this.notify = function(data){
		var re = true;
		var list = this.datas;
		
		var x = 0;
		for(;x<list.length;x++){
			var func = list[x];
			if(typeof func == "function" && func(data) == false){
				re = false;
			}
		}
		return re;
	};
	this.attach = function(func){
		if(typeof func == "function"){
			this.datas.push(func);
		}
	};
};