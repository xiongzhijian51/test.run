Class('Test.Run.Test.Browser', {
	
	isa : Test.Run.Test,
	
	have : {
		url : null,
		
		topScope : null,
		
		testRecord : null,
		
		assertionGrid : null
	},
	
	
	after : {
		
		initialize : function () {
//			this.name = window.location.pathname
		}
		
	}
	
});
//eof Test.Run.Test.Browser