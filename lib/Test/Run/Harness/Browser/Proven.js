Role('Test.Run.Harness.Browser.Proven', {
	
	my : {
		
		have : {
			browser : null,
			
			tests : null
		},
		
		
		after : {
			
			initialize : function () {
				this.tests = [];
			},
			
			
			recordTest : function (test, topScope) {
				if (!this.tests) this.tests = [];
				
				this.tests.push(test);
			},
			
			
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
			
		},
		
		
		methods : {
			
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
//eof Test.Run.Harness.Browser.Proven