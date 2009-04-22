Class('Test.Run', {
	
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
			
			
			onTestFail : function (test) {
			},
			
			
			start : function (func, testClass) {
				
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run