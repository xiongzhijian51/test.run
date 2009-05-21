Class('Test.Run.Harness.Browser.Multi', {
    
    isa : Test.Run.Harness.Browser,
    
    my : {
        
        have : {
            testClass : Test.Run.Test.Browser.ExtJS,
            
            viewport : null
        },
        
        
        after : {
            
            processUrl : function (url) {
                this.viewport.addUrlRecord(url)
            },
            
            
            testStart : function (test) {
                this.viewport.testStart(test)
            },
            
            
            testUpdate : function (test, result) {
                this.viewport.testUpdate(test, result)
            },
            
            
            testEnd : function (test) {
                this.viewport.testEnd(test)
                test.diag(test.getSummaryMessage().join('<br>'))
            },
            
            
            testFail : function (test, exception) {
            }
            
        },
        
        
        before : {
            
            removeTest : function (test) {
                this.viewport.removeTest(test)
            }
            
        },
        
        
        
        methods : {
            
            start : function () {
                var me = this
                
                //waiting for viewport
                if (!this.viewport) { 
                    var startArguments = Array.prototype.slice.call(arguments)
                    
                    Ext.onReady(function(){
                        
                        me.viewport = new Test.Run.Harness.Browser.UI.Viewport({
                            title : me.title,
                            harness : me
                        })
                        
                        me.start.apply(me, startArguments)
                    })
                    
                } else 
                    this.SUPERARG(arguments)
            }
            
        }
        
    }
    //eof my
})
//eof Test.Run.Harness.Browser.Multi



/**
 * @namespace Test.Run.Harness.Browser
 * @class Test.Run.Harness.Browser.Multi
 * @extends Test.Run.Harness.Browser
 * This class represent a harness, which runs into browser and provides an ExtJS based GUI.<br>
 * Each test should be located in separate javascript file. As a convention, tests files are to be placed into /t subdirectory of your distribution. 
 * Please refer to {@link Test.Run.Test} documentation for information how the individual tests should be organized.<br><br>
 * 
 * Individual tests are grouped together by the harness. Harness is a usual '*.html' file, which contain the configuration information and links to test files.<br>
 * Example (see also <a href="http://jsan.symbie.org/test.run/demo/multi.html">full file example</a>): 
<pre>
Test.Run.Harness.Browser.Multi.my.<b>configure</b>({
    title : 'Lazy meta test suite',
    
    passThroughEx : true,
    
    preload : [
        '/inc/Task/Joose/core.js',
        'JooseX.Meta.Lazy'
    ]
})    

Test.Run.Harness.Browser.Multi.my.<b>start</b>(
    '010_lazy_meta.t.js'
)
</pre>
 * 
 * Each test is executing in separate iframe, with clean global namespace (even from Test.Run itself). Files, which needs to be preloaded in each test can be specified with the
 * {@link #preload} property.<br>
 * 
 * @singleton
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */


/**
 * @property testClass The test class which will be used for running tests, defaults is redefined to Test.Run.Test.Browser.ExtJS. 
 * @type {Class} 
 */


/**
 * @property viewport The reference to ExtJS viewport object 
 * @type {Ext.Viewport} 
 */


/**
 * This method notifies a viewport about newly url.
 * This is actually an 'after' modifier  
 * @method processUrl
 * @param {String} url The test file url
 */


/**
 * This method notifies a viewport about started test.
 * This is actually an 'after' modifier 
 * @method testStart
 * @param {Test.Run.Test} test The test instance which started
 */


/**
 * This method notifies a viewport about updated test.
 * This is actually an 'after' modifier 
 * @method testUpdate
 * @param {Test.Run.Test} test The test instance which was updated
 * @param {Test.Run.Result} result The results instance which was added
 */

            
/**
 * This method notifies a viewport about ended test and outputs a summary message
 * This is actually an 'after' modifier 
 * @method testEnd
 * @param {Test.Run.Test} test The test instance which finished
 */
            

/**
 * This method notifies a viewport about removed test
 * This is actually an 'before' modifier
 * @method removeTest
 * @param {Test.Run.Test} test The test instance being removed
 */


/**
 * This method delays the actual call to 'start' until the viewport is created.
 * @method start
 * @param {String*} url The variable number of test files urls
 */

