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


/**
 * @namespace Test.Run.Test
 * @class Test.Run.Test.More
 * This class is actually a Role. Methods which are defined here a plugged into Test.Run.Test class
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */
 
/**
 * This method add the passed or failed assertion into results queue. The type of assertion to add is determined from testing the 1st argument (which is expected to be a string)
 * against a regular expression, passed as 2nd argument
 * @method like
 * @param {String} string The string to test
 * @param {String|RegExp} regex The regex against which to test the string, can be also a plain string
 * @param {String} desc The text of the assertion
 */


/**
 * This method is the opposite of 'like' 
 * @method unlike
 * @param {String} string The string to test
 * @param {String|RegExp} regex The regex against which to test the string, can be also a plain string
 * @param {String} desc The text of the assertion
 */


/**
 * This method add the passed or failed assertion into results queue. The type of assertion to add is determined from the following:
 * The passed 'func' function is executing, and its expected to throw an exception. Then the exception object is stringified and passed to 'like' method along with 'expected' parameter.  
 * @method throws_ok
 * @param {Function} func The function to execute
 * @param {String|RegExp} expected The regex against which to test the stringified exception, can be also a plain string
 * @param {String} desc The text of the assertion
 */