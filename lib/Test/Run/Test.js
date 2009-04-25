Class('Test.Run.Test', {
	
	have : {
		
		id : null,
		name : null,
		
		assertPlanned : null,
		assertCount : 0,
		
		diagCount : 0,
		
		passCount : 0,
		failCount : 0,
		
		results : null,
		
		run : null,
		
		harness : null,
		
		failed : false,
		
		start : null,
		execEnd : null,
		planEnd : null
	},
	
	
	after : {
	
		initialize : function (config) {
			if (typeof this.run != 'function') throw "The body of test absent";
			
			this.results = [];
		}
		
	},
	
	
	methods : {
		
		plan : function (value) {
			if (this.assertPlanned != null) throw "Test plan can't be changed";
			
			this.assertPlanned = value; 
		},
		
		
		addResult : function (result) {
			if (this.assertPlanned == null && this.assertCount) throw "Plan wasn't setuped"
			
			this.results.push(result);
			
			this.harness.onTestUpdate(this, result);
			
			if (this.assertCount == this.assertPlanned) {
				this.planEnd = new Date();
				
				this.harness.onTestPlanEnd(this);
			}
		},
		
		
		diag : function (desc) {
			this.diagCount++;
			
			this.addResult(new Test.Run.Result.Diagnostic({
				description : desc
			}));
		},
		
		
		//XXX pass&fail should be more flexible and overridable (for TODO,SKIP, etc)
		pass : function (desc) {
			this.passCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc,
				
				indx : ++this.assertCount
			}));
		},
		
		
		fail : function (desc) {
			this.failCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : false,
				
				description : desc,
				
				indx : ++this.assertCount
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
			
			this.start = new Date();
			
			try {
				run(this);
			} catch (e) {
				
				this.failed = true;
				
				this.harness.onTestFail(this, e);
			} finally {
				this.finalize()
			}
		},
		
		
		finalize : function () {
			this.execEnd = new Date()
			
			this.harness.onTestExecutionEnd(this);
		}
		
	}
		
});
//eof Test.Run.Test