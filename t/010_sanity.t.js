(function () {
var testobj = new Test.TAP.Class();
testobj.plan(1)

testobj.testSanity = function() {
    //==================================================================================================================================================================================
    this.diag("Test.Run sanity");
    
    var tap = this;
    
    tap.ok(Test.Run, "Test.Run is here");
    tap.ok(Test.Run.Result, "Test.Run.Result is here");
    tap.ok(Test.Run.Test, "Test.Run.Test is here");
    tap.ok(Test.Run.Harness, "Test.Run.Harness is here")
    
    //==================================================================================================================================================================================
    tap.diag("Test.Run.Test creation");
    
    var test = new Test.Run.Test({
    	
    	harness : Test.Run.Harness.my,
    	
    	run : function (t) {
    		t.plan(4)
    		
    		t.pass('Pass description')
    		t.fail('Fail description')
    		
    		t.ok(true, 'True is ok')
    		t.is(null, undefined, 'Null is undefined')
    	}
    })
    
    tap.ok(test, 'Test object was created')
    
    
    //==================================================================================================================================================================================
    tap.diag("Test.Run.Test run");
    
    test.start();
    
    tap.ok(test.planned == 4, 'Plan was setuped')
}

return testobj;
})()