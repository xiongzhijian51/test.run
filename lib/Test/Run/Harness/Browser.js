Class('Test.Run.Harness.Browser', {
	
	isa : Test.Run.Harness,
	
	my : {
		
		have : {
			title : null,
			
			isIE : /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent),
			
			preload : null
		},
		
		
		methods : {
			
			startTest : function (func, testClass) {
				if (window.parent && window.parent.Test && window.parent.Test != Test) {
					Test = window.parent.Test;
					Test.run.start(func, testClass);
					return;
				}
				this.SUPERARG(arguments);
			},
			
			
			processUrl : function (url, ready) {
				var iframe;
				var me = this;
				
				if (this.isIE) {
		            iframe = document.createElement('<iframe name="test' + this.tests.length + '"></iframe>')
		            
		            iframe.onreadystatechange = function () {
		            	
		            	if (iframe.readyState == "loaded" || iframe.readyState == "complete") me.setupIframe(iframe, url, ready) 
	            	}
				} else {
		            iframe = document.createElement('iframe');
		            iframe.name = 'test' + this.tests.length;
		            
		            iframe.onload = function () { me.setupIframe(iframe, url, ready) }
				}
				
				this.customizeIframe(iframe);
				
	            document.body.appendChild(iframe);
			},
			
			
			customizeIframe : function (iframe) {
			},
			
			
			setupIframe : function (iframe, url, ready) {
				var me = this;
				
				if (/\.js$/.test(url)) 
					this.finalizeUrl(iframe, url, ready)
				else
					if (/\.html$/.test(url)) 
						if (this.isIE)
				            iframe.onreadystatechange = function () {
				            	if (iframe.readyState == "loaded" || iframe.readyState == "complete") ready() 
			            	}
						else
				            iframe.onload = ready
		            else
		            	throw "Unknow url: [" + url + "]"
			},
			
			
			finalizeUrl : function (iframe, url, ready) {
	            var ifrWindow = iframe.contentWindow;
	            var ifrDoc = ifrWindow.document;
	            var ifrBody = ifrDoc.body;
	            
	            if (this.preload) Joose.A.each(this.preload, function (preloadUrl) {
	            	ifrBody.appendChild(this.createScriptTag(null, preloadUrl, null, ifrDoc))
	            }, this)
		            
	            ifrWindow.Test = Test;
	            
	            ifrDoc.body.appendChild(this.createScriptTag(null, url, ready, ifrDoc))
			},
			
			
			createScriptTag : function (text, url, onload, doc) {
	            var node = (doc || document).createElement("script");
	            
	            node.setAttribute("type", "text/javascript");
	            
	            if (url) node.setAttribute("src", url)
	            
	            if (text) node.text = text
	            
	            if (onload) node.onload = node.onreadystatechange = function() {
	                if (!node.readyState || node.readyState == "loaded" || node.readyState == "complete" || node.readyState == 4 && node.status == 200)
	                    //surely for IE6..
	                    setTimeout(onload, 1);
	            }
	            
	            return node;
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser