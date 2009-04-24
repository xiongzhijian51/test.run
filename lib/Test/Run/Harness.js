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