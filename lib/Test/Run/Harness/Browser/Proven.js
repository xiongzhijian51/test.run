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
//			
//			
//			testFail : function (test, exception) {
//			},

			
			testEnd : function (test) {
				var req = new JooseX.SimpleRequest();
				
				req.getText('/proven/' + this.browser + '/' + (this.isPassed() ? 'pass' : 'fail'))
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Proven