Role('Test.Run.Test.More', {
    
    methods : {
        
        like : function (string, regex, desc) {
            if (regex instanceof RegExp) 
                this.ok(string.match(regex), desc)
            else
                this.ok(string.indexOf(regex) != -1, desc)
        },
        
        
        unlike : function(string, regex, desc) {
            if (regex instanceof RegExp) 
                this.ok(!string.match(regex), desc)
            else
                this.ok(string.indexOf(regex) == -1, desc)
        },        
        
        
        throws_ok : function(func, expected, desc) {
            if (typeof func != 'function') throw 'throws_ok accepts a function as 1st argument'
            
            var e = this.topScope.__EXCEPTION_CATCHER__(func)
            
            if (e instanceof this.topScope.Error)
                //IE uses non-standard 'description' property for error msg
                e = e.message || e.description
            
            this.like('' + e, expected, desc + ' (got [' + e + '], expected [' + expected + '])')
        }    
        
    }
        
})
//eof Test.Run.Test.More

Test.Run.Test.meta.extend({
    does : [ Test.Run.Test.More ]
})