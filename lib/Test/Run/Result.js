Class('Test.Run.Test.Result', {
	
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
//eof Test.Run