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
 * 
 * Yet Another JavaScript Testing Platform, based on <a href="http://en.wikipedia.org/wiki/Test_Anything_Protocol">TAP</a>.<br><br>
 * Platform is written on Ext 3.0 <a href="http://extjs.com/forum/showthread.php?t=55968">bridged</a> to Joose.<br><br>
 * 
 * Platform is written as <a href="http://openjsan.org/">JSAN</a> distribution. For installation information please refer to this 
 * <a href="http://groups.google.com/group/jsan/browse_thread/thread/ee21fd9269ff1572">post</a>.<br><br>
 * 
 * Demo links: <br>
 * <a href="http://jsan.symbie.org/test.run/demo/multi.html">Simple test suite</a><br>
 * <a href="http://jsan.symbie.org/Joose3/mutability/t/">Joose test suite</a><br><br>
 * 
 * This class just stores the information about currently using harness, it should not be used directly. Instead use one of the harness classes, for example
 * {@link Test.Run.Harness.Browser.Multi}
 * 
 * @singleton
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */


/**
 * @property harness Reference to {@link Test.Run.Harness} (or subclass) instance, which reprsents the current harness, to which all test launches will be redirected
 * defaults to {@link Test.Run.Harness.Browser.Single}
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
 * @param {Function} func The function, which contain test statements. The instance of {@link Test.Run.Test} will be passed to it as 1st argument  
 * @param {Class} testClass The class which should be used for instantiation of test
 * @param {Object} topScope The top scope in which this test was declared
 */
