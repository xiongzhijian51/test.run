Role('Test.Run.Test.More', {
	
	methods : {
		
		like : function (string, regex, desc) {
            if (regex instanceof RegExp) 
                return this.ok(string.match(regex), desc)
            else
                return this.ok(string.indexOf(regex) != -1, desc)
		},
		
		
		unlike : function(string, regex, desc) {
            if (regex instanceof RegExp) 
                return this.ok(!string.match(regex), desc)
            else
                return this.ok(string.indexOf(regex) == -1, desc)
		},		
		
		
		throws_ok : function(func, expected, desc) {
		    if (typeof func != 'function') throw 'throws_ok needs a function to run';
		    
		    var errormsg = '';
		    
		    try {
		        func();
		    }
		    catch(e) {
		        
		        if (e instanceof Error)
			        //IE uses non-standard 'description' property for error msg
		        	errormsg = e.message || e.description
	        	else
			        errormsg = e;
		    }
		    this.like(errormsg, expected, desc + ' ( got [' + errormsg + '], expected [' + expected + '])');
		}	
		
	}
		
});
//eof Test.Run.Test.More

Test.Run.Test.meta.extend({
	does : [ Test.Run.Test.More ]
});