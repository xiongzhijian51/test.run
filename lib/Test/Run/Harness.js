Class('Test.Run.Harness', {
	
	my : {
		
		have : {
			testClass : Test.Run.Test,
            
            tests : null
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
					topScope : topScope
				})
				
				this.recordTest(test);
				
				test.start();
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