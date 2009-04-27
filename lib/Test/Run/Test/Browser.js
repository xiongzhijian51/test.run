Class('Test.Run.Test.Browser', {
	
	isa : Test.Run.Test,
	
	have : {
		url : null,
		
		iframe : null,
		
		testRecord : null,
		
		assertionGrid : null,
		
		timeoutId : null
	},
	
	
	methods : {
		
		waitAsync : function (time) {
			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
				delete this.timeoutId
			}
			
			var me = this;
			
			this.timeoutId = setTimeout(function () {
				delete me.timeoutId
				me.finalize()
			}, time || 1e6)
		},
		
		
		finalize : function () {
			if (this.timeoutId && !this.failed) return;
			
			this.SUPER();
		}
		
	}
	
});
//eof Test.Run.Test.Browser