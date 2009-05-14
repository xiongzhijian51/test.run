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
//
//			
//          testEnd : function (test) {
//          },
            
            
            testSuiteEnd : function () {
                var req = new JooseX.SimpleRequest()
                var provenUrl = '/proven/' + this.browser + '/' + (this.isPassed() ? 'pass' : 'fail')
                
                try {
                    req.getText(this.resolveUrl(provenUrl))
                } catch (e) {
                }
            }
			
		}
        
	}
	//eof my
})
//eof Test.Run.Harness.Browser.Proven