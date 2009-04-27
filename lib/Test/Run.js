Class('Test.Run', {
	
	my : {
		
		have : {
			harness : null
		},
		
		
		methods : {
			
			configure : function (config) {
				Joose.O.copy(config, this)
			},
			
			
			start : function (testFunc, testClass, topScope) {
				(this.harness || Test.Run.Harness.Browser.Single.my).startTest(testFunc, testClass, topScope)
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run


//starter, which also capture the top scope
StartTest = function (testFunc, testClass) {
	Test.Run.my.start(testFunc, testClass, this)
}