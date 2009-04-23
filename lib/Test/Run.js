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