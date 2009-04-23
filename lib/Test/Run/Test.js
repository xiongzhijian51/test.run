Class('Test.Run.Test', {
	
	have : {
		
		planned : null,
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
			if (this.planned != null) throw "Test plan can't be changed";
			
			this.planned = value; 
		},
		
		
		addResult : function (result) {
			if (this.planned == null) throw "Plan not setuped"
			
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
		
		
		ok : function (condition, desc) {
		    if (condition) this.pass(desc); else this.fail(desc)
		},
		
		
		is : function (got, expected, desc) {
		    this.ok(got == expected, desc);
		},

		
		start : function () {
//			var self = this;
			var run = this.run;
			
			try {
				run(this);
			} catch (e) {
				
				this.failed = true;
				
				this.harness.onTestFail(this, e);
			}
		} 
		
	}
		
});
//eof Test.Run.Test