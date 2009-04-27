Class('Test.Run.Test.Browser', {
	
	isa : Test.Run.Test,
	
	have : {
		//XXX more specific than browser
		testRecord : null,
		
		//XXX more specific than browser
		assertionGrid : null,
		
		url : null,
		
		iframe : null,
		
		timeoutId : null,
		
		finished : false
	},
	
	
	after : {
		
		addResult : function (result) {
			if (this.finished && this.timeoutId && this.passCount + this.failCount == this.assertPlanned) {
				this.clearAsync();
				this.finalize();
			}
		}
		
	},
	
	
	methods : {
		
		clearAsync : function () {
			clearTimeout(this.timeoutId);
			delete this.timeoutId
		},
		
		
		waitAsync : function (time) {
			this.clearAsync();
			
			var me = this;
			
			this.timeoutId = setTimeout(function () {
				me.clearAsync();
				me.finalize()
			}, time || 1e6)
		},
		
		
		finalize : function () {
			this.finished = true;
			
			if (this.timeoutId && !this.failed) return;
			delete this.timeoutId
			
			this.SUPER();
		}
		
	}
	
});
//eof Test.Run.Test.Browser