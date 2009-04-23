Class('Test.Run', {
	
	my : {
		
		have : {
			harnessClass : Test.Run.Harness.Browser
		},
		
		
		methods : {
			
			configure : function (config) {
				Joose.O.copy(config, this);
			},
			
			
			start : function (testFunc, testClass) {
				this.harnessClass.my.start(testFunc, testClass);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run