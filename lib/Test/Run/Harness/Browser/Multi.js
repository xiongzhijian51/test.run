Class('Test.Run.Harness.Browser.Multi', {
	
	isa : Test.Run.Harness.Browser,
	
	my : {
		
		have : {
			startArguments : null,
			viewport : null,
			
			testClass : Test.Run.Test.Browser
		},
		
		
		after : {
			
			onTestStart : function (test) {
				this.viewport.onTestStart(test);
			},
			
			
			onTestUpdate : function (test, result) {
				this.viewport.onTestUpdate(test, result)
			},
			
			
			onTestExecutionEnd : function (test) {
				this.viewport.onTestExecutionEnd(test);
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