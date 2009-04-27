Class('Test.Run.Harness', {
	
	my : {
		
		have : {
			testClass : Test.Run.Test
		},
		
		
		methods : {
			
			testUpdate : function (test, result, indx) {
			},
			
			
			testFail : function (test, exception) {
			},
			
			
			testStart : function (test) {
			},
			
			
			testPlanEnd : function (test) {
				
			},
			
			
			testExecutionEnd : function (test) {
			},
			
			
			configure : function (config) {
				Joose.O.copy(config, this);
			},
			
			
			startTest : function (func, testClass, topScope) {
				var test = new (testClass || this.testClass)({
					harness : this,
					run : func
				})
				
				this.recordTest(test, topScope);
				
				test.start();
			},
			
			
			recordTest : function (test, topScope) {
			},
			
			
			start : function () {
				this.testSuiteStart();
				
				this.runTests.apply(this, arguments);
			},
			
			
			runTests : function () {
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
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness