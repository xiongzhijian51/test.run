Class('Test.Run.Test', {
	
	have : {
		
		url : null,
		
		assertPlanned : null,
		assertCount : 0,
		
		diagCount : 0,
		
		passCount : 0,
		failCount : 0,
		
		results : null,
		
		run : null,
		
		harness : null,
		
		failed : false,
		failedException : null,
		
		start : null,
		execEnd : null,
		planEnd : null,
		
		topScope : null,
        
        passThroughEx : false
	},
	
	
	after : {
	
		initialize : function (config) {
			if (typeof this.run != 'function') throw "The body of test absent";
			
			this.results = [];
		}
		
	},
	
	
	methods : {
		
		toString : function() {
			return this.url;
		},
		
		
		plan : function (value) {
			if (this.assertPlanned != null) throw "Test plan can't be changed";
			
			this.assertPlanned = value; 
		},
		
		
		addResult : function (result) {
			if (this.assertPlanned == null && this.assertCount) throw "Plan wasn't setuped"
			
			this.results.push(result);
			
			this.harness.testUpdate(this, result);
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
			this.start = new Date();
            
            this.harness.testStart(this);
            
            var me = this;
			
            var e = this.topScope.__EXCEPTION_CATCHER__(function(){
                me.run(me);
            });
            
            if (e) {
				this.failed = true;
				this.failedException = e;
				
				this.harness.testFail(this, e);
                
                this.finalize();
                
                if (this.passThroughEx) throw e;
                
                return;
			} 
            
			this.finalize()
		},
		
		
		finalize : function () {
			this.execEnd = new Date()
			
			this.harness.testEnd(this);
		},
		
		
		getSummaryMessage : function () {
			var res = [];
			
			var passCount = this.passCount;
			var failCount = this.failCount;
			
			res.push('Passed: ' + passCount);
			res.push('Failed: ' + failCount);
			
			if (!this.failed) {
				if (failCount + passCount < this.assertPlanned) res.push('Looks like you planned ' + this.assertPlanned + ' tests, but ran only ' +  (failCount + passCount))
				if (failCount + passCount > this.assertPlanned) 
					res.push('Looks like you planned ' + this.assertPlanned + ' tests, but ran ' +  (failCount + passCount - this.assertPlanned) + ' extra tests, ' + (failCount + passCount) + ' total.')
				
				if (passCount == this.assertPlanned && !failCount) res.push('All tests successfull');
			} else {
				res.push('Test suite threw an exception: ' + this.failedException);
			}
			
			return res;
		},
		
		
		isPassed : function () {
			return !this.failed && !this.failCount && this.passCount >= this.assertPlanned;
		}
		
	}
		
});
//eof Test.Run.Test