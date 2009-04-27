Class('Test.Run.Harness.Browser.Single', {
	
	isa : Test.Run.Harness.Browser,
	
	my : {
		
		after : {
		
			testUpdate : function (test, result) {
				this.print(result);
			},
			
			
			testFail : function (test, exception) {
				this.print('Test threw an exception: ' + exception)
			},
			
			
			testExecutionEnd : function (test) {
				this.print(this.getSummaryMessage(test)); 
			}
		},

		
		methods : {
			
			testStart : function (test) {
			},
			
			
			print : function (text) {
				var div = document.createElement('div');
				div.innerHTML = text;
				document.body.appendChild(div);
			},
			
			
			getSummaryMessage : function (test) {
				var res = [];
				
				var passCount = test.passCount;
				var failCount = test.failCount;
				
				res.push('Passed: ' + passCount);
				res.push('Failed: ' + failCount);
				
				if (failCount + passCount < test.assertPlanned) res.push('Looks like you planned ' + test.assertPlanned + ' tests, but ran only ' +  (failCount + passCount))
				
				if (failCount + passCount == test.assertPlanned && !failCount) res.push('All tests successfull');
				
				return res.join('<br>')
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Single