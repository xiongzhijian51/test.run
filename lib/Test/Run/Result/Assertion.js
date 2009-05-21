Class('Test.Run.Result.Assertion', {
    
    isa : Test.Run.Result,
    

    have : {
        pass : null,
        
        indx : null
    },
    
    
    methods : {
        
        toString : function () {
            return (this.pass ? 'ok' : 'not ok') + ' ' + this.indx + ' - ' + this.description
        }
        
    }
        
})


/**
 * @namespace Test.Run.Result
 * @class Test.Run.Result.Assertion
 * @extends Test.Run.Result
 * This class represent an result of assertion testing
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */

/**
 * @property pass Pass/fail sign
 * @type {Boolean} 
 */

/**
 * @property indx The index of this result in the results queue
 * @type {Number} 
 */

/**
 * Return TAP presentation of the assertion
 * @method toString
 * @return {String} 
 */
