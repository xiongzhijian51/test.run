Class('Test.Run.Harness.Browser', {
	
	isa : Test.Run.Harness,
	
	my : {
		
		have : {
			isIE : false,
			
			preload : null
		},
		
		
		after : {
			
			initialize : function (config) {
			    this.is_IE = /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
			},
			
		
			prepareUrl : function (url) {
	            var iframe = this.isIE ? document.createElement('<iframe name="test' + this.tests.length + '"></iframe>') : document.createElement('iframe');
	            if (!this.isIE) iframe.name = 'test' + this.tests.length;
	            
	            document.body.appendChild(iframe);
	            
	            
	            iframe.window.Test = Test;
			}
			
		},
		
		
		methods : {
			
			onTestUpdate : function (test, result, indx) {
			},
			
			
			onTestFail : function (test, exception) {
			},
			
			
			start : function (func, testClass) {
				
			},
			
			
			createScriptTag : function (text, url, onload) {
//	            var loaderNode = document.createElement("script");
//	            
//	            loaderNode.onload = loaderNode.onreadystatechange = function() {
//	                if (!loaderNode.readyState || loaderNode.readyState == "loaded" || loaderNode.readyState == "complete" || loaderNode.readyState == 4 && loaderNode.status == 200) {
//	                    //surely for IE6..
//	                    setTimeout(function(){ onready() }, 1);
//	                }
//	            };
//	            
//	            loaderNode.setAttribute("type", "text/javascript");
//	            loaderNode.setAttribute("src", url);
//	            document.getElementsByTagName("head")[0].appendChild(loaderNode);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser