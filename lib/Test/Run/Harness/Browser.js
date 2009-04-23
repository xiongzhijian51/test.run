Class('Test.Run.Harness.Browser', {
	
	isa : Test.Run.Harness,
	
	my : {
		
		have : {
			isIE : false,
			
			preload : null
		},
		
		
		after : {
			
			initialize : function () {
			    this.isIE =  /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
			}
			
		},
		
		
		methods : {
			
//			start : function () {
//				this.SUPERARG(arguments);
//			},
			
			
			processUrl : function (url, ready) {
	            var iframe = this.isIE ? document.createElement('<iframe name="test' + this.tests.length + '"></iframe>') : document.createElement('iframe');
	            if (!this.isIE) iframe.name = 'test' + this.tests.length;
	            
	            var me = this;
	            
	            iframe.onload = function () { me.preloadUrl(iframe, url, ready) }
	            
	            document.body.appendChild(iframe);
			},
			
			
			preloadUrl : function (iframe, url, ready) {
	            var ifrWindow = iframe.contentWindow;
	            var ifrDoc = ifrWindow.document;
	            var ifrBody = ifrDoc.body;
	            
	            
	            if (this.preload) Joose.A.each(this.preload, function (preloadUrl) {
	            	ifrBody.appendChild(this.getScriptTag(null, preloadUrl))
	            }, this)
		            
	            this.finalizeUrl(ifrWindow, url, ready)
			},
			
			
			finalizeUrl : function (ifrWindow, url, ready) {
	            ifrWindow.Test = Test;
	            
	            ifrWindow.document.body.appendChild(this.getScriptTag(null, url))
	            
	            ready()
			},
			
			
			getScriptTag : function (text, url, onload) {
	            var node = document.createElement("script");
	            
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