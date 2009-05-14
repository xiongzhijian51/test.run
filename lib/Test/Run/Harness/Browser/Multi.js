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