Class('Test.Run.Result', {
    
    have : {
        description : null
    },
    
    
    methods : {
        
        toString : function () {
            return this.description
        }
        
    }
        
})
//eof Test.Run.Result

/**
 * @namespace Test.Run
 * @class Test.Run.Result
 * This class represent an abstract result of test execution
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */

/**
 * @property description Description of the result
 * @type {String} 
 */

/**
 * Return string presentation of this result. Defaults to value of 'description' property
 * @method toString
 * @return {String} 
 */
