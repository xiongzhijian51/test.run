Class('Test.Run', {
    
    my : {
        
        have : {
            harness : null
        },
        
        
        methods : {
            
            configure : function (config) {
                Joose.O.copy(config, this)
            },
            
            
            start : function (testFunc, testClass, topScope) {
                (this.harness || Test.Run.Harness.Browser.Single.my).startTest(testFunc, testClass, topScope)
            }
            
        }
        
    }
    //eof my
})
//eof Test.Run


//starter, which also capture the top scope - it will be re-defined in Test.Run.Harness.Browser
StartTest = function (testFunc, testClass) {
    Test.Run.my.start(testFunc, testClass, this)
}

__EXCEPTION_CATCHER__ = function (func) { var ex; try { func() } catch (e) { ex = e; }; return ex; }


/**
 * @namespace Test
 * @class Test.Run
 * This class just stores the information about currently using harness, it should not be used directly. It also redirects test launches to current harness.
 * @singleton
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */


/**
 * @property harness Reference to Test.Run.Harness (or subclass) instance, which reprsents the current harness, to which all test launches will be redirected
 * defaults to Test.Run.Harness.Browser.Single
 * @type {Test.Run.Harness}
 */


/**
 * This method configures the Test.Run instance. It just copies the passed configuration option into instance.
 * @method configure
 * @param {Object} config The configuration options
 */


/**
 * This method starts the execution of a single test file, via delegatin to 'starTest' method of current harness.
 * @method start
 * @param {Function} func The function, which contain test statements. The instance of test will be passed to it as 1st argument  
 * @param {Class} testClass The class which should be used for instantiation of test (defaults to value of 'testClass' property)
 * @param {Object} topScope The top scope in which this test was declared
 */
