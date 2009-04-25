Class('Test.Run.Harness.Browser.Multi', {
	
	isa : Test.Run.Harness.Browser,
	
	my : {
		
		have : {
			startArguments : null,
			viewport : null,
			slots : null
		},
		
		after : {
			
			onTestSuiteStart : function () {
				this.slots.title.body.update('<h1>' + this.title + '</h1>')
			}
			
		},
		
		methods : {
			
			start : function () {
				//waiting for viewport
				if (!this.viewport) { 
					this.startArguments = Array.prototype.slice.call(arguments)
					
					var me = this;
					Ext.onReady(function(){
						me.viewport = new Test.Run.Harness.Browser.UI.Viewport()
						me.slots = me.viewport.slots
						
						me.start.apply(me, me.startArguments);
						delete me.startArguments
					});
					
				} else 
					this.SUPERARG(arguments);
			}
			
			
			
//			onTestUpdate : function (test, result, indx) {
//				this.SUPERARG(arguments);
//				
//				this.print(result);
//			},
//			
//			
//			onTestFail : function (test, exception) {
//				this.SUPERARG(arguments);
//				
//				this.print('Test threw an exception: ' + exception)
//			},
//			
//			
//			onTestExecutionEnd : function (test) {
//				this.SUPERARG(arguments);
//				
//				this.print(this.getSummaryMessage(test)); 
//			},
//			
//			
//			getSummaryMessage : function (test) {
//				var res = [];
//				
//				var passCount = 0;
//				var failCount = 0;
//				
//				Joose.A.each(test.results, function (result, indx) {
//					if (result instanceof Test.Run.Result.Assertion) {
//						result.pass ? passCount++ : failCount++
//					}
//				}, this);
//				
//				res.push('Passed: ' + passCount);
//				res.push('Failed: ' + failCount);
//				
//				if (failCount + passCount < test.assertPlanned) res.push('Looks like you planned ' + test.assertPlanned + ' tests, but ran only ' +  (failCount + passCount))
//				
//				if (failCount + passCount == test.assertPlanned && !failCount) res.push('All tests successfull');
//				
//				return res.join('<br>')
//			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Multi