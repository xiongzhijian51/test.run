Class('Test.Run.Harness.Browser', {
	
	isa : Test.Run.Harness,
	
	my : {
		
		have : {
			testClass : Test.Run.Test.Browser,
			
			urls : null,
			
			title : null,
			
			disableCaching : true,
			
			isIE : /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent),
			
			baseUrl : window.location.href.replace(/\/(?:\w|\.)*$/, '/'),
			
			preload : null
		},
		
		
		after : {
		
			initialize : function (config) {
				this.urls = {}
			},
			
			
			recordTest : function (test, topScope) {
				Joose.O.each(this.urls, function (value, url) {
					
					if (value.iframe.contentWindow == topScope) {
						test.iframe = value.iframe
						test.url = url
						
						value.test = test
					}
				});
			}
			
		},
		
		
		methods : {
			
			startTest : function (func, testClass, topScope) {
				if (window.parent && window.parent.Test && window.parent.Test != Test) {
					Test = window.parent.Test;
					Test.run.start(func, testClass);
					return;
				}
				this.SUPERARG(arguments);
			},			
			
			
			//webkit bug - base url for iframes are broken
			//https://bugs.webkit.org/show_bug.cgi?id=13364
			resolveUrl : function (url) {
				var resolved = !/^http/.test(url) && !/^\//.test(url) ? this.baseUrl + url : url;
				
				if (this.disableCaching) resolved += '?disableCaching=true'
				
				return resolved
			},
			
			
			processUrl : function (url) {
				var iframe;
				var me = this;
				
				this.urls[url] = {};
				
				var resolved = this.resolveUrl(url)
				
				iframe = document.createElement('iframe');
				
				if (this.isIE)
		            iframe.onreadystatechange = function () {
		            	if (iframe.readyState == "loaded" || iframe.readyState == "complete") me.setupIframe(iframe, resolved) 
	            	}
				else
		            iframe.onload = function () { me.setupIframe(iframe, resolved) }
				
				this.customizeIframe(iframe);
				
	            document.body.appendChild(iframe);
	            
	            this.urls[url].iframe = iframe;
			},
			
			
			customizeIframe : function (iframe) {
			},
			
			
			setupIframe : function (iframe, resolvedUrl) {
				var me = this;
				
				var urlCopy = resolvedUrl.replace(/\?.*$/,'')
				
				if (/\.js$/.test(urlCopy)) 
					this.finalizeUrl(iframe, resolvedUrl)
				else
					if (/\.html$/.test(urlCopy)) 
			            iframe.src = resolvedUrl
					else
		            	throw "Unknow url type: [" + resolvedUrl + "]"
			},
			
			
			finalizeUrl : function (iframe, resolvedUrl) {
	            var ifrWindow = iframe.contentWindow;
	            var ifrDoc = ifrWindow.document;
	            var ifrBody = ifrDoc.body;
	            
	            if (this.preload) Joose.A.each(this.preload, function (preloadUrl) {
	            	preloadUrl = this.resolveUrl(preloadUrl)
	            	
	            	ifrBody.appendChild(this.createScriptTag(null, preloadUrl, null, ifrDoc))
	            }, this)
		            
	            ifrBody.appendChild(this.createScriptTag(
	            	'StartTest = function(testFunc, testClass) {' +
	            	'	window.parent.Test.Run.my.start(testFunc, testClass, this)' +
	            	'}',
        			null, 
        			null, 
        			ifrDoc
    			))
	            
	            ifrDoc.body.appendChild(this.createScriptTag(null, resolvedUrl, null, ifrDoc))
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