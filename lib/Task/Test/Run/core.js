Class('Test.Run.Result', {
	
	have : {
		description : null
	},
	
	
	methods : {
		
		toString : function () {
			return this.description;
		}
		
	}
		
});
//eof Test.Run.Result
Class('Test.Run.Result.Diagnostic', {
	
	isa : Test.Run.Result
	
});

Class('Test.Run.Result.Assertion', {
	
	isa : Test.Run.Result,
	

	have : {
		pass : null,
		
		indx : null
	},
	
	
	methods : {
		
		toString : function () {
			return (this.pass ? 'ok' : 'not ok') + ' ' + this.indx + ' - ' + this.description;
		}
		
	}
		
});

Class('Test.Run.Test', {
	
	have : {
		
		url : null,
		
		assertPlanned : null,
		assertCount : 0,
		
		diagCount : 0,
		
		passCount : 0,
		failCount : 0,
		
		results : null,
		
		run : null,
		
		harness : null,
		
		failed : false,
		failedException : null,
		
		start : null,
		execEnd : null,
		planEnd : null,
		
		topScope : null,
        
        passThroughEx : false
	},
	
	
	after : {
	
		initialize : function (config) {
			if (typeof this.run != 'function') throw "The body of test absent";
			
			this.results = [];
		}
		
	},
	
	
	methods : {
		
		toString : function() {
			return this.url;
		},
		
		
		plan : function (value) {
			if (this.assertPlanned != null) throw "Test plan can't be changed";
			
			this.assertPlanned = value; 
		},
		
		
		addResult : function (result) {
			if (this.assertPlanned == null && this.assertCount) throw "Plan wasn't setuped"
			
			this.results.push(result);
			
			this.harness.testUpdate(this, result);
		},
		
		
		diag : function (desc) {
			this.diagCount++;
			
			this.addResult(new Test.Run.Result.Diagnostic({
				description : desc
			}));
		},
		
		
		//XXX pass&fail should be more flexible and overridable (for TODO,SKIP, etc)
		pass : function (desc) {
			this.passCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc,
				
				indx : ++this.assertCount
			}));
		},
		
		
		fail : function (desc) {
			this.failCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : false,
				
				description : desc,
				
				indx : ++this.assertCount
			}));
		},
		
		
		ok : function (condition, desc) {
		    if (condition) this.pass(desc); else this.fail(desc)
		},
		
		
		is : function (got, expected, desc) {
		    this.ok(got == expected, desc);
		},

		
		start : function () {
			this.start = new Date();
            
            this.harness.testStart(this);
            
            var me = this;
			
            var e = this.topScope.__EXCEPTION_CATCHER__(function(){
                me.run(me);
            });
            
            if (e) {
				this.failed = true;
				this.failedException = e;
				
				this.harness.testFail(this, e);
                
                this.finalize();
                
                if (this.passThroughEx) throw e;
                
                return;
			} 
            
			this.finalize()
		},
		
		
		finalize : function () {
			this.execEnd = new Date()
			
			this.harness.testEnd(this);
		},
		
		
		getSummaryMessage : function () {
			var res = [];
			
			var passCount = this.passCount;
			var failCount = this.failCount;
			
			res.push('Passed: ' + passCount);
			res.push('Failed: ' + failCount);
			
			if (!this.failed) {
				if (failCount + passCount < this.assertPlanned) res.push('Looks like you planned ' + this.assertPlanned + ' tests, but ran only ' +  (failCount + passCount))
				if (failCount + passCount > this.assertPlanned) 
					res.push('Looks like you planned ' + this.assertPlanned + ' tests, but ran ' +  (failCount + passCount - this.assertPlanned) + ' extra tests, ' + (failCount + passCount) + ' total.')
				
				if (passCount == this.assertPlanned && !failCount) res.push('All tests successfull');
			} else {
				res.push('Test suite threw an exception: ' + this.failedException);
			}
			
			return res;
		},
		
		
		isPassed : function () {
			return !this.failed && !this.failCount && this.passCount >= this.assertPlanned;
		}
		
	}
		
});
//eof Test.Run.Test
Role('Test.Run.Test.More', {
	
	methods : {
		
		like : function (string, regex, desc) {
            if (regex instanceof RegExp) 
                this.ok(string.match(regex), desc)
            else
                this.ok(string.indexOf(regex) != -1, desc)
		},
		
		
		unlike : function(string, regex, desc) {
            if (regex instanceof RegExp) 
                this.ok(!string.match(regex), desc)
            else
                this.ok(string.indexOf(regex) == -1, desc)
		},		
		
		
		throws_ok : function(func, expected, desc) {
		    if (typeof func != 'function') throw 'throws_ok accepts a function as 1st argument';
		    
		    var e = this.topScope.__EXCEPTION_CATCHER__(func);
		    
	        if (e instanceof this.topScope.Error)
		        //IE uses non-standard 'description' property for error msg
	        	e = e.message || e.description
		    
		    this.like('' + e, expected, desc + ' (got [' + e + '], expected [' + expected + '])');
		}	
		
	}
		
});
//eof Test.Run.Test.More

Test.Run.Test.meta.extend({
	does : [ Test.Run.Test.More ]
});
Class('Test.Run.Test.Browser', {
	
	isa : Test.Run.Test,
	
	have : {
		url : null,
		
		iframe : null,
		
		timeoutIds : null,
		
		finished : false
	},
	
	
	after : {
        
        initialize : function () {
            this.timeoutIds = {};
        }
		
	},
	
	
	methods : {
		
		beginAsync : function (time) {
            var me = this;
            
            var timeoutId = setTimeout(function () {
                me.endAsync(timeoutId);
            }, time || 1e4)
			
            this.timeoutIds[timeoutId] = true;
		},
		
		
        endAsync : function (timeoutId) {
            var counter = 0;
            
            if (!timeoutId) Joose.O.each(this.timeoutIds, function (value, name) {
                timeoutId = name;
                if (counter++) throw "Calls to endAsync without argument should only be performed if you have single beginAsync statement" 
            })
            
            clearTimeout(timeoutId);
            delete this.timeoutIds[timeoutId];
            
            if (this.finished) this.finalize();
        },
        
        
		finalize : function () {
			this.finished = true;
			
            if (!Joose.O.isEmpty(this.timeoutIds)) return;
			
			this.SUPER();
		}
		
	}
	
});
//eof Test.Run.Test.Browser
Class('Test.Run.Harness', {
	
	my : {
		
		have : {
			testClass : Test.Run.Test,
            
            tests : null,
            
            passThroughEx : false
		},
        
        
        after : {
            
            initialize : function () {
                this.tests = [];
            }
        },
		
		
		methods : {
			
			testUpdate : function (test, result, indx) {
			},
			
			
			testFail : function (test, exception) {
			},
			
			
			testStart : function (test) {
			},
			
			
			testEnd : function (test) {
			},
			
			
			configure : function (config) {
				Joose.O.copy(config, this);
			},
			
			
			startTest : function (func, testClass, topScope) {
				var test = new (testClass || this.testClass)({
					harness : this,
					run : func,
					topScope : topScope,
                    passThroughEx : this.passThroughEx
				})
				
				this.recordTest(test);
				
				test.start();
			},
            
            
            removeTest : function (test) {
                this.tests = Joose.A.remove(this.tests, test)
            },
            
            
	        reRunTest : function () {
	        },
            
            
	        reRunSuite : function () {
	        },
			
			
			recordTest : function (test) {
                this.tests.push(test);
			},
			
			
			start : function () {
				this.testSuiteStart();
				
				Joose.A.each(arguments, function (url) {
					this.processUrl(url)
				}, this);
				
				this.testSuiteProcessed();
			},
			
			
			testSuiteStart : function () {
				Test.Run.my.configure({
					harness : this
				})
			},
			
			
			testSuiteProcessed : function () {
			},
			
			
			processUrl : function (url) {
			},
            
            
            isPassed : function () {
                var res = true;
                
                Joose.A.each(this.tests, function (test) {
                    if (!test.isPassed()) res = false;
                })
                
                return res;
            }
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness
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
			baseHost : window.location.host,
			baseProtocol : window.location.protocol,
			
			preload : null
		},
		
		
		after : {
		
			initialize : function (config) {
                this.urls = {}
			},
			
			
			recordTest : function (test) {
				Joose.O.each(this.urls, function (value, url) {
					
					if (value.iframe.contentWindow == test.topScope) {
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
			},
            
            
            removeTest : function (test) {
                var url = test.url;
                
                document.body.removeChild(test.iframe);
                
                delete this.urls[url].iframe;
                delete this.urls[url].test;
                delete test.iframe;
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
				var resolved;
				
				if (!/^http/.test(url))
					if (!/^\//.test(url))
						resolved = this.baseUrl + url
					else
						resolved = this.baseProtocol + '//' + this.baseHost + url
				
				if (this.disableCaching) resolved += '?disableCaching=' + new Date().getTime()
				
				return resolved
			},
			
			
			processUrl : function (url) {
				var me = this;
				
				this.urls[url] = {};
				
				var resolved = this.resolveUrl(url)
				
				var iframe = document.createElement('iframe');
				
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
            
            
            clearTest : function (test) {
                
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
Class('Test.Run.Harness.Browser.Single', {
	
	isa : Test.Run.Harness.Browser,
	
	my : {
		
		after : {
		
			testUpdate : function (test, result) {
				this.print(result);
			},
			
			
			testFail : function (test, exception) {
				this.print('Test threw an exception: ' + exception)
			},
			
			
			testEnd : function (test) {
				this.print(test.getSummaryMessage().join('<br>')); 
			}
		},

		
		methods : {
			
			print : function (text) {
				var div = document.createElement('div');
				div.innerHTML = text;
				document.body.appendChild(div);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Single
Role('Test.Run.Harness.Browser.Proven', {
	
	my : {
		
		have : {
			browser : null
		},
		
		
		after : {
			
//			testStart : function (test) {
//			},
//			
//			
//			testUpdate : function (test, result) {
//			},
//			
//			
//			testFail : function (test, exception) {
//			},

			
			testEnd : function (test) {
				var req = new JooseX.SimpleRequest();
				
				req.getText('/proven/' + this.browser + '/' + (this.isPassed() ? 'pass' : 'fail'))
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Proven
Class('Test.Run', {
	
	my : {
		
		have : {
			harness : null
		},
		
		
		methods : {
			
			configure : function (config) {
				Joose.O.copy(config, this)
			},
			
			
			start : function (testFunc, testClass, topScope) {
				(this.harness || Test.Run.Harness.Browser.Single.my).startTest(testFunc, testClass, topScope)
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run


//starter, which also capture the top scope
StartTest = function (testFunc, testClass) {
	Test.Run.my.start(testFunc, testClass, this)
}

__EXCEPTION_CATCHER__ = function (func) { var ex; try { func() } catch (e) { ex = e; }; return ex; }
