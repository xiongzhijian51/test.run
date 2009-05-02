Role('Test.Run.Harness.Browser.Proven', {
	
	my : {
		
		have : {
			browser : null
		},
		
		
		after : {
			
//			testStart : function (test) {
//			},
//			
//			
//			testUpdate : function (test, result) {
//			},
			
			
			testEnd : function (test) {
				var req = new JooseX.SimpleRequest();
				
				req.getText('/proven/' + this.browser)
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Proven