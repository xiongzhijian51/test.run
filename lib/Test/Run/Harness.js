Class('Test.Run.Harness', {
    
    my : {
        
        have : {
            testClass : Test.Run.Test,
            
            tests : null,
            
            passThroughEx : false,
            
            urls : null,
            testsGiven : 0
        },
        
        
        after : {
            
            initialize : function () {
                this.tests = []
                this.urls = {}
            }
        },
        
        
        methods : {
            
            testUpdate : function (test, result) {
            },
            
            
            testFail : function (test, exception) {
            },
            
            
            testStart : function (test) {
            },
            
            
            testEnd : function (test) {
                if (!this.isRunning()) this.testSuiteEnd()
            },
            
            
            testSuiteEnd : function () {
            },
            
            
            configure : function (config) {
                Joose.O.copy(config, this)
            },
            
            
            startTest : function (func, testClass, topScope) {
                var test = new (testClass || this.testClass)({
                    harness : this,
                    run : func,
                    topScope : topScope,
                    passThroughEx : this.passThroughEx
                })
                
                this.recordTest(test)
                
                test.start()
            },
            
            
            removeTest : function (test) {
                this.tests = Joose.A.remove(this.tests, test)
            },
            
            
            reRunTest : function (test) {
                this.removeTest(test)
            },
            
            
            reRunSuite : function () {
                Joose.A.each(this.tests, function (test) {
                    this.reRunTest(test)
                }, this)
            },
            
            
            recordTest : function (test) {
                this.tests.push(test)
            },
            
            
            start : function () {
                this.testSuiteStart()
                
                this.testsGiven = arguments.length
                
                Joose.A.each(arguments, function (url) {
                    this.processUrl(url)
                }, this)
                
                this.testSuiteProcessed()
            },
            
            
            testSuiteStart : function () {
                Test.Run.my.configure({
                    harness : this
                })
            },
            
            
            testSuiteProcessed : function () {
            },
            
            
            processUrl : function (url) {
                this.urls[url] = {}
            },
            
            
            isPassed : function () {
                var res = true
                
                Joose.A.each(this.tests, function (test) {
                    if (!test.isPassed()) res = false
                })
                
                return res
            },
            
            
            isRunning : function () {
                if (this.testsGiven != this.tests.length) return true
                
                var res = false
                
                Joose.A.each(this.tests, function (test) {
                    if (!test.execEnd) res = true
                })
                
                return res
            }
            
        }
        
    }
    //eof my
})
//eof Test.Run.Harness



/**
 * @namespace Test.Run
 * @class Test.Run.Harness
 * This class represent an abstract harness, which control the execution of several test files (test suite)
 * @singleton
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */


/**
 * @property testClass The test class which will be used for running tests, defaults to Test.Run.Test. 
 * @type {Class} 
 */


/**
 * @property tests The array of test instances
 * @type {Test.Run.Test[]} 
 */


/**
 * @property passThroughEx The sign whether the each test in suite should re-throw any exceptions caught (useful for debugging with FireBug). Defaults to 'false'
 * @type {Boolean} 
 */


/**
 * @property urls Hash of test files urls.
 * @type {Object} 
 */


/**
 * @property testsGiven The number of test files url, given in 'start'
 * @type {Number} 
 */


/**
 * This method is called each time the test in the test suite has been updated (new result appeared in results queue) 
 * @method testUpdate
 * @param {Test.Run.Test} test The test instance which was updated
 * @param {Test.Run.Result} result The results instance which was added
 */


/**
 * This method is called each time the test in the test suite has been failed (the exception was thrown) 
 * @method testFail
 * @param {Test.Run.Test} test The test instance which failed
 * @param {Object} result The thrown exception
 */


/**
 * This method is called each time the test in the test suite has been started 
 * @method testStart
 * @param {Test.Run.Test} test The test instance which started
 */


/**
 * This method is called each time the test in the test suite has been finished execution 
 * @method testEnd
 * @param {Test.Run.Test} test The test instance which finished
 */


/**
 * This method is called when the whole test suite has finished execution 
 * @method testSuiteEnd
 */


/**
 * This method configure the harness instance. It just copies the passed configuration option into instance.
 * @method configure
 * @param {Object} config The configuration options
 */


/**
 * This method starts the execution of a single test file.
 * @method startTest
 * @param {Function} func The function, which contain test statements. The instance of test will be passed to it as 1st argument  
 * @param {Class} testClass The class which should be used for instantiation of test (defaults to value of 'testClass' property)
 * @param {Object} topScope The top scope in which this test was declared
 */


/**
 * This method removes the test from harness. All necesery cleanup should be done here. 
 * @method removeTest
 * @param {Test.Run.Test} test The test instance beign removed
 */


/**
 * This method re-runs a single test from harness.  
 * @method reRunTest
 * @param {Test.Run.Test} test The test instance beign re-ran
 */


/**
 * This method re-runs a whole test suite.  
 * @method reRunSuite
 */


/**
 * This method records a test to internal structures.  
 * @method recordTest
 * @param {Test.Run.Test} test The test instance beign recorded
 */


/**
 * This method starts a test suite  
 * @method start
 * @param {String*} url The variable number of test files urls
 */


/**
 * This method is called when the whole test suite has started execution 
 * @method testSuiteStart
 */


/**
 * This method is called when the whole test suite was processed. Note that at this point some tests may still running. See also 'testSuiteEnd'
 * @method testSuiteProcessed
 */


/**
 * This method process a single test file url.  
 * @method processUrl
 * @param {String} url The test file url
 */


/**
 * This method return 'true' if all tests in test suite were passed succefully, 'false' otherwise
 * @method isPassed
 * @return {Boolean}
 */


/**
 * This method return 'true' if there is any test in test suite which is still running, 'false' otherwise
 * @method isRunning
 * @return {Boolean}
 */
