Class('Test.Run.Result', {
	
	have : {
		description : null,
		
		status : null
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
		
		name : null,
		
		assertPlanned : null,
		assertCount : 0,
		
		diagCount : 0,
		
		results : null,
		currentResult : -1,
		
		run : null,
		
		harness : null,
		
		failed : false,
		
		start : null,
		execEnd : null,
		planEnd : null
	},
	
	
	after : {
	
		initialize : function (config) {
			if (typeof this.run != 'function') throw "The body of test absent";
			
			this.results = [];
		}
		
	},
	
	
	methods : {
		
		plan : function (value) {
			if (this.assertPlanned != null) throw "Test plan can't be changed";
			
			this.assertPlanned = value; 
		},
		
		
		addResult : function (result) {
			if (this.assertPlanned == null && this.assertCount) throw "Plan wasn't setuped"
			
			this.results.push(result);
			this.currentResult++;
			
			this.harness.onTestUpdate(this, result, this.currentResult);
			
			if (this.assertCount == this.assertPlanned) {
				this.planEnd = new Date();
				
				this.harness.onTestPlanEnd(this);
			}
		},
		
		
		diag : function (desc) {
			this.diagCount++;
			
			this.addResult(new Test.Run.Result.Diagnostic({
				description : desc
			}));
		},
		
		
		pass : function (desc) {
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc,
				
				indx : ++this.assertCount
			}));
		},
		
		
		fail : function (desc) {
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
			var run = this.run;
			
			this.harness.onTestStart(this);
			
			this.start = new Date();
			
			try {
				run(this);
			} catch (e) {
				
				this.failed = true;
				
				this.harness.onTestFail(this, e);
			} finally {
				this.execEnd = new Date()
				
				this.harness.onTestExecutionEnd(this);
			}
		} 
		
	}
		
});
//eof Test.Run.Test
Class('Test.Run.Harness', {
	
	my : {
		
		have : {
			tests : null,
			
			testClass : Test.Run.Test
		},
		
		
		after : {
		
			initialize : function (config) {
				this.tests = []
			}
			
		},
		
		
		methods : {
			
			onTestUpdate : function (test, result, indx) {
			},
			
			
			onTestFail : function (test, exception) {
			},
			
			
			onTestStart : function (test) {
				this.tests.push(test);
				
			},
			
			
			onTestPlanEnd : function (test) {
				
			},
			
			
			onTestExecutionEnd : function (test) {
			},
			
			
			configure : function (config) {
				this.installAsDefault();
				
				Joose.O.copy(config, this);
			},
			
			
			installAsDefault : function () {
				Test.Run.my.configure({
					harness : this
				})
			},
			
			
			startTest : function (func, testClass) {
				var test = new (testClass || this.testClass)({
					id : this.tests.length,
					harness : this,
					run : func
				})
				
				test.start();
			},
			
			
			start : function () {
				this.onTestSuiteStart();
				
				this.runTests(Array.prototype.slice.call(arguments));
			},
			
			
			runTests : function (urls) {
				var me = this;
				
				if (urls.length) {
					var url = urls.shift();
					
					this.processUrl(url, function () {
						me.runTests(urls)
					});
				} else this.onTestSuiteEnd();
			},
			
			
			onTestSuiteStart : function () {
				this.installAsDefault();
				
				this.prepareOutput()
			},
			
			
			onTestSuiteEnd : function () {
			},
			
			
			prepareOutput : function () {
			},
			
			
			processUrl : function (url, ready) {
				ready()
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
Class('Test.Run.Harness.Browser.Single', {
	
	isa : Test.Run.Harness.Browser,
	
	my : {
		
		methods : {
			
			print : function (text) {
				var div = document.createElement('div');
				div.innerHTML = text;
				document.body.appendChild(div);
			},
			
			
			onTestUpdate : function (test, result, indx) {
				this.SUPERARG(arguments);
				
				this.print(result);
			},
			
			
			onTestFail : function (test, exception) {
				this.SUPERARG(arguments);
				
				this.print('Test threw an exception: ' + exception)
			},
			
			
			onTestExecutionEnd : function (test) {
				this.SUPERARG(arguments);
				
				this.print(this.getSummaryMessage(test)); 
			},
			
			
			getSummaryMessage : function (test) {
				var res = [];
				
				var passCount = 0;
				var failCount = 0;
				
				Joose.A.each(test.results, function (result, indx) {
					if (result instanceof Test.Run.Result.Assertion) {
						result.pass ? passCount++ : failCount++
					}
				}, this);
				
				res.push('Passed: ' + passCount);
				res.push('Failed: ' + failCount);
				
				if (failCount + passCount < test.assertPlanned) res.push('Looks like you planned ' + test.assertPlanned + ' tests, but ran only ' +  (failCount + passCount))
				
				if (failCount + passCount == test.assertPlanned && !failCount) res.push('All tests successfull');
				
				return res.join('<br>')
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Single
Class('Test.Run', {
	
	my : {
		
		have : {
			harness : null
		},
		
		
		methods : {
			
			configure : function (config) {
				Joose.O.copy(config, this);
			},
			
			
			start : function (testFunc, testClass) {
				(this.harness || Test.Run.Harness.Browser.Single.my).startTest(testFunc, testClass);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run
