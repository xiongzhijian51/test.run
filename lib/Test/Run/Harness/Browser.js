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
		
		
		before : {
			
			start : function () {
				if (!this.preload && window.COMPONENTS) {
					this.setPreloadFromTaskName('core');
				}
			},
			
			
			configure : function (config) {
				if (typeof config.preload == 'string') {
					this.setPreloadFromTaskName(config.preload);
					delete config.preload;
				}
			}
			
		},
		
		
		methods : {
			
			expandComponents : function () {
				if (!window.COMPONENTS) throw "COMPONENTS is not defined";
				
				Joose.O.each(COMPONENTS, function (components, taskName) {
					var res = [];
					
					Joose.A.each(components, function (comp) {
						var match = /^\+(.+)/.exec(comp);
						
						res = res.concat(match ? COMPONENTS[match[1]] : comp);
					})
					
					COMPONENTS[taskName] = res;
				})
			},
			
			
			setPreloadFromTaskName : function (taskName) {
				this.expandComponents();
				
				var preload = [];
				
				Joose.A.each(COMPONENTS[taskName], function (comp) {
					preload.push('../lib/' + comp.split('.').join('/') + '.js')
				})
				
				this.preload = preload;
			},
			
			
			startTest : function (func, testClass, topScope) {
				if (window.parent && window.parent.Test && window.parent.Test != Test) {
					Test = window.parent.Test;
					Test.run.start(func, testClass);
					return;
				}
				this.SUPERARG(arguments);
			},			
			
			
			//webkit bug - base urls for iframes are broken
			//https://bugs.webkit.org/show_bug.cgi?id=13364
			resolveUrl : function (url) {
				var resolved = !/^http/.test(url) && !/^\//.test(url) ? this.baseUrl + url : url;
				
				if (this.disableCaching) resolved += '?disableCaching=' + new Date().getTime()
				
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
	            var ifrHead = ifrDoc.getElementsByTagName("head")[0];
	            
                if (!ifrHead) {
                    // some browsers (Webkit, Safari) do not auto-create head elements
                    ifrHead = ifrDoc.createElement("head");
                    ifrDoc.getElementsByTagName("html")[0].appendChild(ifrHead);
                }

	            var scriptTags = [];
                
                
	            if (this.preload) Joose.A.each(this.preload, function (preloadUrl) {
	            	preloadUrl = this.resolveUrl(preloadUrl)
	            	
	            	scriptTags.push([ null, preloadUrl, null, ifrDoc ])
	            }, this)
		            
	            scriptTags.push([
	            	'StartTest = function(testFunc, testClass) { window.parent.Test.Run.my.start(testFunc, testClass, this) }; ' +
	            	'__EXCEPTION_CATCHER__ = function (func) { var ex; try { func() } catch (e) { ex = e; }; return ex; };',
        			null, 
        			null, 
        			ifrDoc
    			])
	            
    			scriptTags.push([ null, resolvedUrl, null, ifrDoc ]);
    			
	            this.processScripTagQueue(ifrHead, scriptTags)
			},
			
			
			processScripTagQueue : function (ifrHead, queue) {
				if (queue.length) {
					var params = queue.shift();
					
					//no text - loading via 'src'
					if (!params[0]) {
						var me = this;
						params[2] = function () {
							me.processScripTagQueue(ifrHead, queue)
						}
					}
					
					ifrHead.appendChild(this.createScriptTag.apply(this, params))
					
					//have text - need to process further manually
					if (params[0]) this.processScripTagQueue(ifrHead, queue)
				}
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