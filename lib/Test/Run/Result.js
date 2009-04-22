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
