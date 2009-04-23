Class('Test.Run.Test', {
	
	have : {
		
		id : null,
		
		planned : null,
		current : null,
		
		diagCount : 0,
		assertCount : 0,
		
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
			this.diagCount++;
			
			this.addResult(new Test.Run.Result.Diagnostic({
				description : desc
			}));
		},
		
		
		pass : function (desc) {
			this.assertCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc
			}));
		},
		
		
		fail : function (desc) {
			this.assertCount++;
			
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
			var run = this.run;
			
			this.harness.onTestStart(this);
			
			try {
				run(this);
			} catch (e) {
				
				this.failed = true;
				
				this.harness.onTestFail(this, e);
			} finally {
				this.harness.onTestExecutionEnd(this);
			}
		} 
		
	}
		
});
//eof Test.Run.Test