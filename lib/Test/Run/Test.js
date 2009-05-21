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
 * {@link SamplePackage.SampleClass#methodOne this is method one} <br/>
 * {@link SamplePackage.SampleClass#methodOne} <br/>
 * {@link #methodOne another link} <br/>
 * {@link #methodOne} <br/>
 * {@link SamplePackage.SampleClass} <br/>
 * {@link SamplePackage.SampleClass sample class} <br/>
 * @author SamuraiJack
 * @version 0.01
 */
 
/**
 * @cfg {String} url Url of the test file.
 */

/**
 * @cfg {Number} assertPlanned Planned number of assertions to test.
 */
 
/**
 * @cfg {Number} assertCount Current number of processed assertions
 */

/**
 * @cfg {Number} diagCount Current number of processed diagnostic messages
 */

/**
 * @cfg {Number} passCount Current number of passed assertions
 */

/**
 * @cfg {Number} failCount Current number of failed assertions
 */

/**
 * @cfg {Array} results Array of Test.Run.Result instances (represent either assertion or diagnostic message)
 */

/**
 * @cfg {Function} run The function, which contain test statements (is invoking with StartTest)
 */

/**
 * @cfg {Test.Run.Harness} harness Reference to Test.Run.Harness (or subclass) instance, which reprsents the harness, under which the test is running
 */

/**
 * @cfg {Boolean} failed The sign whether the test has threw an exception 
 */
        
/**
 * @cfg {Object} failedException Thrown exception (see also 'failed')
 */

/**
 * @cfg {Date} startDate Timestamp of test starting time
 */

/**
 * @cfg {Date} execEnd Timestamp of test finishing time
 */

/**
 * @cfg {Object} topScope The top scope object in which test function was declared (usually an iframe in which test is running)
 */

/**
 * @cfg {Boolean} passThroughEx The sign wether the test should re-throw any caught exceptions (usefull for FireBug debugging) 
 */
