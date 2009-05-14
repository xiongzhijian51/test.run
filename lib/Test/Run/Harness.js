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
            
            testUpdate : function (test, result, indx) {
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