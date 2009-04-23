Class('Test.Run.Result', {
	
	have : {
		
		description : null
		
	},
	
	
	after : {
	
		initialize : function (config) {
		}
		
	},
	
	
	methods : {
		
		toString : function () {
			return this.description;
		}
		
	}
		
});
//eof Test.Run.Result
Class('Test.Run.Result.Diagnostic', {
	
	isa : Test.Run.Result
	
});

Class('Test.Run.Result.Assertion', {
	
	isa : Test.Run.Result,
	
	have : {
		
		pass : null
		
	}
		
});

Class('Test.Run.Test', {
	
	have : {
		
		planned : null,
		current : null,
		
		diagCount : 0,
		
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
				
				debugger;
				this.harness.onTestFail(this, e);
			}
		} 
		
	}
		
});
//eof Test.Run.Test
Class('Test.Run.Harness', {
	
	my : {
		
		have : {
			tests : null,
			
			testClass : Test.Run.Test
		},
		
		
		after : {
		
			initialize : function (config) {
				this.tests = []
			}
			
		},
		
		
		methods : {
			
			onTestUpdate : function (test, result, indx) {
			},
			
			
			onTestFail : function (test, exception) {
			},
			
			
			start : function (func, testClass) {
				
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness
Class('Test.Run.Harness.Browser', {
	
	isa : Test.Run.Harness,
	
	my : {
		
//		have : {
//			tests : null,
//			
//			testClass : Test.Run.Test
//		},
//		
//		
//		after : {
//		
//			initialize : function (config) {
//				this.tests = []
//			}
//			
//		},
//		
//		
//		methods : {
//			
//			onTestUpdate : function (test, result, indx) {
//			},
//			
//			
//			onTestFail : function (test, exception) {
//			},
//			
//			
//			start : function (func, testClass) {
//				
//			}
//			
//		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser
Class('Test.Run', {
	
	my : {
		
		have : {
			harnessClass : Test.Run.Harness.Browser
		},
		
		
		methods : {
			
			configure : function (config) {
				Joose.O.copy(config, this);
			},
			
			
			start : function (testFunc, testClass) {
				this.harnessClass.my.start(testFunc, testClass);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run
