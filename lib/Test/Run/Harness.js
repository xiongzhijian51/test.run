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