Class('Test.Run.Harness', {
	
	my : {
		
		have : {
			tests : null,
			
			testClass : Test.Run.Test,
			
			currentUrl : null
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
				if (!this.currentUrl) throw "Test started w/o url";
				
				test.url = this.currentUrl;
			},
			
			
			onTestPlanEnd : function (test) {
				
			},
			
			
			onTestExecutionEnd : function (test) {
			},
			
			
			configure : function (config) {
				Joose.O.copy(config, this);
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
				this.onTestSuiteStart();
				
				this.runTests(Array.prototype.slice.call(arguments));
			},
			
			
			runTests : function (urls) {
				var me = this;
				
				if (urls.length) {
					var url = urls.shift();
					
					this.currentUrl = url;
					
					this.processUrl(url, function () {
						delete me.currentUrl;
						
						me.runTests(urls)
					});
					
				} else this.onTestSuiteEnd();
			},
			
			
			onTestSuiteStart : function () {
				Test.Run.my.configure({
					harness : this
				})
			},
			
			
			onTestSuiteEnd : function () {
			},
			
			
			processUrl : function (url, ready) {
				ready()
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness