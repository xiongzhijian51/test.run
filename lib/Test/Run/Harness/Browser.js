Class('Test.Run.Harness.Browser', {
	
	isa : Test.Run.Harness,
	
	my : {
		
		have : {
			isIE : false,
			
			preload : null
		},
		
		
		after : {
			
			initialize : function () {
			    this.isIE = /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
			}
			
		},
		
		
		methods : {
			
//			onTestUpdate : function (test, result, indx) {
//			},
//			
//			
//			onTestFail : function (test, exception) {
//			},
//			
//			
//			onTestStart : function (test) {
//				this.tests.push(test);
//				
//			},
//			
//			
//			onTestPlanEnd : function (test) {
//				
//			},
//			
//			
//			onTestExecutionEnd : function (test) {
//			},
			
			
//			start : function () {
//				this.SUPERARG(arguments);
//			},
			
			
			processUrl : function (url, ready) {
				var iframe;
				var me = this;
				
				if (this.isIE) {
		            iframe = document.createElement('<iframe name="test' + this.tests.length + '"></iframe>')
		            
		            iframe.onreadystatechange = function () {
		            	
		            	if (iframe.readyState == "loaded" || iframe.readyState == "complete") me.preloadUrl(iframe, url, ready) 
	            	}
				} else {
		            iframe = document.createElement('iframe');
		            iframe.name = 'test' + this.tests.length;
		            
		            iframe.onload = function () { me.preloadUrl(iframe, url, ready) }
				}
				
	            document.body.appendChild(iframe);
			},
			
			
			preloadUrl : function (iframe, url, ready) {
	            var ifrWindow = iframe.contentWindow;
	            var ifrDoc = ifrWindow.document;
	            var ifrBody = ifrDoc.body;
	            
	            
	            if (this.preload) Joose.A.each(this.preload, function (preloadUrl) {
	            	ifrBody.appendChild(this.getScriptTag(null, preloadUrl, null, ifrDoc))
	            }, this)
		            
	            this.finalizeUrl(ifrWindow, url, ready)
			},
			
			
			finalizeUrl : function (ifrWindow, url, ready) {
	            var ifrDoc = ifrWindow.document;
	            
	            ifrWindow.Test = Test;
	            
	            ifrDoc.body.appendChild(this.getScriptTag(null, url, ready, ifrDoc))
			},
			
			
			getScriptTag : function (text, url, onload, doc) {
	            var node = (doc || document).createElement("script");
	            
	            node.setAttribute("type", "text/javascript");
	            
	            if (url) node.setAttribute("src", url)
	            
	            if (text) node.text = text
	            
	            if (onload) node.onload = node.onreadystatechange = function() {
	                if (!node.readyState || node.readyState == "loaded" || node.readyState == "complete" || node.readyState == 4 && node.status == 200)
	                    //surely for IE6..
	                    setTimeout(function(){ onload() }, 1);
	            }
	            
	            return node;
	            
//	            document.getElementsByTagName("head")[0].appendChild(node);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser