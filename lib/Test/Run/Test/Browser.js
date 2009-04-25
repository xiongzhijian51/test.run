Class('Test.Run.Test.Browser', {
	
	isa : Test.Run.Test,
	
	have : {
		record : null
	},
	
	
	after : {
		
		initialize : function () {
//			this.name = window.location.pathname
		}
		
	}
	
});
//eof Test.Run.Test.Browser