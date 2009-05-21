Class('Test.Run.Test', {
    
    have : {
        
        url : null,
        
        assertPlanned : null,
        assertCount : 0,
        
        diagCount : 0,
        
        passCount : 0,
        failCount : 0,
        
        results : null,
        
        run : null,
        
        harness : null,
        
        failed : false,
        failedException : null,
        
        startDate : null,
        execEnd : null,
        
        topScope : null,
        
        passThroughEx : false
    },
    
    
    after : {
    
        initialize : function (config) {
            if (typeof this.run != 'function') throw "The body of test absent"
            
            this.results = []
        }
        
    },
    
    
    methods : {
        
        toString : function() {
            return this.url
        },
        
        
        plan : function (value) {
            if (this.assertPlanned != null) throw "Test plan can't be changed"
            
            this.assertPlanned = value; 
        },
        
        
        addResult : function (result) {
            if (this.assertPlanned == null && this.assertCount) throw "Plan wasn't setuped"
            
            this.results.push(result)
            
            this.harness.testUpdate(this, result)
        },
        
        
        diag : function (desc) {
            this.diagCount++
            
            this.addResult(new Test.Run.Result.Diagnostic({
                description : desc
            }))
        },
        
        
        //XXX pass&fail should be more flexible and overridable (for TODO,SKIP, etc)
        pass : function (desc) {
            this.passCount++
            
            this.addResult(new Test.Run.Result.Assertion({
                pass : true,
                
                description : desc,
                
                indx : ++this.assertCount
            }))
        },
        
        
        fail : function (desc) {
            this.failCount++
            
            this.addResult(new Test.Run.Result.Assertion({
                pass : false,
                
                description : desc,
                
                indx : ++this.assertCount
            }))
        },
        
        
        ok : function (condition, desc) {
            if (condition) this.pass(desc); else this.fail(desc)
        },
        
        
        is : function (got, expected, desc) {
            this.ok(got == expected, desc)
        },

        
        start : function () {
            this.startDate = new Date()
            
            this.harness.testStart(this)
            
            var me = this
            var run = this.run
            
            var e = this.topScope.__EXCEPTION_CATCHER__(function(){
                run(me)
            })
            
            if (e) {
                this.failed = true
                this.failedException = e
                
                this.harness.testFail(this, e)
                
                this.finalize()
                
                if (this.passThroughEx) throw e
                
                return
            } 
            
            this.finalize()
        },
        
        
        finalize : function () {
            this.execEnd = new Date()
            
            this.harness.testEnd(this)
        },
        
        
        getSummaryMessage : function () {
            var res = []
            
            var passCount = this.passCount
            var failCount = this.failCount
            
            res.push('Passed: ' + passCount)
            res.push('Failed: ' + failCount)
            
            if (!this.failed) {
                if (failCount + passCount < this.assertPlanned) res.push('Looks like you planned ' + this.assertPlanned + ' tests, but ran only ' +  (failCount + passCount))
                if (failCount + passCount > this.assertPlanned) 
                    res.push('Looks like you planned ' + this.assertPlanned + ' tests, but ran ' +  (failCount + passCount - this.assertPlanned) + ' extra tests, ' + (failCount + passCount) + ' total.')
                
                if (passCount == this.assertPlanned && !failCount) res.push('All tests successfull')
            } else {
                res.push('Test suite threw an exception: ' + this.failedException)
            }
            
            return res
        },
        
        
        isPassed : function () {
            return !this.failed && !this.failCount && this.passCount >= this.assertPlanned
        }
        
    }
        
})
//eof Test.Run.Test


/**
 * @namespace Test.Run
 * @class Test.Run.Test
 * This class represent a single test file (group of assertions).
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */
 
/**
 * @property url Url of the test file.
 * @type {String} 
 */

/**
 * @property assertPlanned Planned number of assertions to test.
 * @type {Number}
 */
 
/**
 * @property assertCount Current number of processed assertions
 * @type {Number}
 */

/**
 * @property diagCount Current number of processed diagnostic messages
 * @type {Number}
 */

/**
 * @property passCount Current number of passed assertions
 * @type {Number}
 */

/**
 * @property failCount Current number of failed assertions
 * @type {Number}
 */

/**
 * @property results Array of Test.Run.Result instances (represent either assertion or diagnostic message)
 * @type {Array}
 */

/**
 * @property run The function, which contain test statements (is invoking with StartTest)
 * @type {Function}
 */

/**
 * @property harness Reference to Test.Run.Harness (or subclass) instance, which reprsents the harness, under which the test is running
 * @type {Test.Run.Harness}
 */

/**
 * @property failed The sign whether the test has threw an exception 
 * @type {Boolean}
 */
        
/**
 * @property failedException Thrown exception (see also 'failed')
 * @type {Object}
 */

/**
 * @property startDate Timestamp of test starting time
 * @type {Date}
 */

/**
 * @property execEnd Timestamp of test finishing time
 * @type {Date}
 */

/**
 * @property topScope The top scope object in which test function was declared (usually an iframe in which test is running)
 * @type {Object}
 */

/**
 * @property passThroughEx The sign whether the test should re-throw any exceptions caught (useful for debugging with FireBug). Defaults to 'false' 
 * @type {Boolean}
 */

/**
 * This method should be called before any assertions were checked. The only parameter passed should be a number of planned assertions in this test file.
 * @method plan 
 * @param {Number} tests Planned number of assertions
 * 
 */

/**
 * Return string presentation of this test. Defaults to value of 'url' property
 * @method toString
 * @return {String} 
 */

/**
 * This method is 'protected' and should be used only for class extensions. 
 * This method adds the instance of Test.Run.Result to results queue. The result can be either assertion (Test.Run.Result.Assertion) 
 * or diagnostic message (Test.Run.Result.Diagnostic)
 * @method addResult
 * @param {Test.Run.Result} result The result instance to add
 */

/**
 * This method add the diagnostic message into results queue. The actual presentation logic of the message is delegated to harness. 
 * @method diag
 * @param {String} desc The text of diagnostic message
 */

/**
 * This method add the passed assertion into results queue. The actual presentation logic of the passed assertion is delegated to harness. 
 * @method pass
 * @param {String} desc The text of the assertion
 */
        
/**
 * This method add the failed assertion into results queue. The actual presentation logic of the failed assertion is delegated to harness. 
 * @method fail
 * @param {String} desc The text of the assertion
 */
        
/**
 * This method add the passed or failed assertion into results queue. The type of assertion to add is determined from 1st argument.
 * @method ok
 * @param {Boolean} condition The boolean condition, indicating wheter assertions is passed or failed
 * @param {String} desc The text of the assertion
 */
        
/**
 * This method add the passed or failed assertion into results queue. The type of assertion to add is determined from comparison of 1st and 2nd arguments.
 * Comparison is performed with '==' operator
 * @method is
 * @param {Any} value1 The 1st value for comparison
 * @param {Any} value2 The 2st value for comparison
 * @param {String} desc The text of the assertion
 */
        
        
/**
 * This method is 'protected' and should be used only for class extensions.
 * This method starts the test execution. Execution is performing by running the function in the 'run' attribute.
 * @method start
 */

/**
 * This method is 'protected' and should be used only for class extensions.
 * This method is called when the test finished execution. It setup the 'execEnd' attribute
 * @method finalize
 */
        
/**
 * This method is 'protected' and should be used only for class extensions.
 * This method returns the summary message for this test. Should be called after the test has finished execution.
 * Summary message is returning in the array of strings
 * @method getSummaryMessage
 * @return {String[]} 
 */
        
/**
 * This method is 'protected' and should be used only for class extensions.
 * This method returns the sign whether the whole test passed or failed. The test is considered passed, when a) no exceptions were thrown,
 * b) there is no failing assertions c) the number of passed assertions is greater or equal to planned assertions number. 
 * @method isPassed
 * @return {Boolean} 
 */
        