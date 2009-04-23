Class('Test.Run.Result', {
	
	have : {
		
		description : null
		
	},
	
	
	after : {
	
		initialize : function (config) {
		}
		
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
		
		pass : null
		
	}
		
});

Class('Test.Run.Test', {
	
	have : {
		
		id : null,
		
		planned : null,
		current : null,
		
		diagCount : 0,
		assertCount : 0,
		
		run : null,
		
		results : null,
		
		harness : null,
		
		failed : false
		
	},
	
	
	after : {
	
		initialize : function (config) {
			if (typeof this.run != 'function') throw "The body of test absent";
			
			this.results = [];
			this.current = -1;
		}
		
	},
	
	
	methods : {
		
		plan : function (value) {
			if (this.planned != null) throw "Test plan can't be changed";
			
			this.planned = value; 
		},
		
		
		addResult : function (result) {
			if (this.planned == null) throw "Plan not setuped"
			
			this.results.push(result);
			this.current++;
			
			this.harness.onTestUpdate(this, result, this.current);
		},
		
		
		diag : function (desc) {
			this.diagCount++;
			
			this.addResult(new Test.Run.Result.Diagnostic({
				description : desc
			}));
		},
		
		
		pass : function (desc) {
			this.assertCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc
			}));
		},
		
		
		fail : function (desc) {
			this.assertCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc
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
			
			try {
				run(this);
			} catch (e) {
				
				this.failed = true;
				
				this.harness.onTestFail(this, e);
			} finally {
				this.harness.onTestEnd(this);
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
			},
			
			
			onTestEnd : function (test) {
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
				
				this.tests.push(test);
				
				test.start();
			},
			
			
			start : function () {
				this.testSuiteStart();
				
				Joose.A.each(arguments, function (testUrl) {
					this.prepareUrl(testUrl);
					this.processUrl(testUrl);
				}, this);
			},
			
			
			testSuiteStart : function () {
				this.installAsDefault();
				
				this.prepareOutput()
			},
			
			
			prepareOutput : function () {
			},
			
			
			prepareUrl : function () {
			},
			
			
			processUrl : function () {
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
				(this.harness || Test.Run.Harness.Browser.my).startTest(testFunc, testClass);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run
