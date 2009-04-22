Class('Test.Run.Test', {
	
	have : {
		
		plan : null,
		
		run : null,
		
		results : null,
		
		testHelpers : [ 'plan', 'pass', 'fail' ]
		
	},
	
	
	after : {
	
		initialize : function (config) {
			if (typeof this.run != 'function') throw "The body of test absent";
			
			this.results = [];
			
		}
		
	},
	
	
	methods : {
		
		plan : function (value) {
		},
		
		
		pass : function (desc) {
			
		},
		
		
		fail : function (desc) {
			
		}
		
	}
		
});
//eof Test.Run