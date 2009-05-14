Class('Test.Run.Harness.Browser.Single', {
    
    isa : Test.Run.Harness.Browser,
    
    my : {
        
        after : {
        
            testUpdate : function (test, result) {
                this.print(result)
            },
            
            
            testFail : function (test, exception) {
                this.print('Test threw an exception: ' + exception)
            },
            
            
            testEnd : function (test) {
                this.print(test.getSummaryMessage().join('<br>')); 
            }
        },

        
        methods : {
            
            print : function (text) {
                var div = document.createElement('div')
                div.innerHTML = text
                document.body.appendChild(div)
            }
            
        }
        
    }
    //eof my
})
//eof Test.Run.Harness.Browser.Single