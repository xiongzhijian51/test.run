Class('Test.Run', {
	
	use : [
		'Test.Run.Harness'
	],
	
	my : {
		
		have : {
			harnessClass : Test.Run.Harness
		},
		
		
		methods : {
			
			configure : function (config) {
				
			},
			
			
			start : function (testFunc, testClass) {
				this.harnessClass.my.start(testFunc, testClass);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run