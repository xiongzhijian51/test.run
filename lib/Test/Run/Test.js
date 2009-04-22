Class('Test.Run.Test', {
	
	have : {
		
		count : null,
		current : null,
		
		run : null,
		
		results : null,
		
		harness : null,
		
		failed : false
		
	},
	
	
	after : {
	
		initialize : function (config) {
			if (typeof this.run != 'function') throw "The body of test absent";
			
			this.results = [];
			this.current = -1;
			
			this.start();
		}
		
	},
	
	
	methods : {
		
		plan : function (value) {
			this.count = value; 
		},
		
		
		addResult : function (result) {
			if (this.count == null) throw "Plan not setuped"
			
			this.results.push(result);
			this.current++;
			
			this.harness.onTestUpdate(this, result, this.current);
		},
		
		
		diag : function (desc) {
			this.addResult(new Test.Run.Result.Diagnostic({
				description : desc
			}));
		},
		
		
		pass : function (desc) {
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc
			}));
		},
		
		
		fail : function (desc) {
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc
			}));
		},
		
		
		start : function () {
			try {
				this.run();
			} catch (e) {
				
				this.failed = true;
				
				this.harness.onTestFail(this);
			}
		} 
		
	}
		
});
//eof Test.Run