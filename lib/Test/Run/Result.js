Class('Test.Run.Result', {
	
	have : {
		description : null,
		
		status : null
	},
	
	
	methods : {
		
		toString : function () {
			return this.description;
		}
		
	}
		
});
//eof Test.Run.Result