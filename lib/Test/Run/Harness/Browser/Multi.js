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
					name : test.name
				})
				
				test.record = record;
				
				this.slots.tests.store.add([ record ]);
			},
			
			
			onTestUpdate : function (test, result) {
				test.record.set('passCount', test.passCount);
				test.record.set('failCount', test.failCount);
			}
			
		},
		
		
		methods : {
			
			start : function () {
				//waiting for viewport
				if (!this.viewport) { 
					this.startArguments = Array.prototype.slice.call(arguments)
					
					var me = this;
					Ext.onReady(function(){
						me.viewport = new Test.Run.Harness.Browser.UI.Viewport({
							title : me.title
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