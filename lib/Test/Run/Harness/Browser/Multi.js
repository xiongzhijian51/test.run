Class('Test.Run.Harness.Browser.Multi', {
	
	isa : Test.Run.Harness.Browser,
	
	my : {
		
		have : {
			startArguments : null,
			viewport : null,
			slots : null,
			
			testClass : Test.Run.Test.Browser
		},
		
		
		after : {
			
			onTestStart : function (test) {
				var store = this.slots.tests.store;
				var recType = store.recordType;
				
				var record = new recType({
					name : test.url,
					test : test
				})
				
				test.record = record;
				
				this.slots.tests.store.add([ record ]);
				
				test.grid = new Test.Run.Harness.Browser.UI.AssertionGrid({
					test : test
				})
			},
			
			
			onTestUpdate : function (test, result) {
				test.record.set('passCount', test.passCount);
				test.record.set('failCount', test.failCount);
			},
			
			
			onTestExecutionEnd : function (test) {
				test.record.set('time', (test.execEnd - test.start) + 'ms');
			}
			
		},
		
		
		methods : {
			
			start : function () {
				var me = this;
				
				//waiting for viewport
				if (!this.viewport) { 
					this.startArguments = Array.prototype.slice.call(arguments)
					
					Ext.onReady(function(){
						
						me.viewport = new Test.Run.Harness.Browser.UI.Viewport({
							title : me.title,
							harness : me
						})
						
						me.slots = me.viewport.slots
						
						me.start.apply(me, me.startArguments);
						delete me.startArguments
					});
					
				} else 
					this.SUPERARG(arguments);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Multi