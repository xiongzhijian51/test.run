(function () {
var testobj = new Test.TAP.Class();
testobj.plan(6)

testobj.testSanity = function() {
    var tap = this;
    
	//==================================================================================================================================================================================
    tap.diag("Test.Run.Test creation");
    
    var test = new Test.Run.Test({
    	
    	harness : Test.Run.Harness.my,
    	
    	run : function (t) {
    		t.plan(4)
    		
    		t.diag('Diag message')
    		
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
    
    tap.ok(test.assertPlanned == 4, 'Plan was setuped')
    
    tap.ok(test.results.length == 5, 'Results were created')
    tap.ok(test.currentResult == 4, 'Current index is correct')
    tap.ok(test.diagCount == 1, 'There was 1 diagnostic message')
    tap.ok(test.assertCount == 4, 'There was 4 assertions')
    
    tap.ok(test.results[0] instanceof Test.Run.Result.Diagnostic, 'Very 1st result is a diagnostic message')
    tap.ok(test.results[1] instanceof Test.Run.Result.Assertion, '2nd results is an assertion')
    
    
    //==================================================================================================================================================================================
    tap.diag("No plan #1");
    
    var noPlanTest1 = new Test.Run.Test({
    	
    	harness : Test.Run.Harness.my,
    	
    	run : function (t) {
    		t.diag('Diag message')
    	}
    })
    
    noPlanTest1.start();
    
    tap.pass('Diagnostic messages do not require plan');
    
    
    //==================================================================================================================================================================================
    tap.diag("No plan #2");
    
    var noPlanTest2 = new Test.Run.Test({
    	
    	harness : Test.Run.Harness.my,
    	
    	run : function (t) {
    		t.diag('Diag message')
    		
    		t.pass('no plan');
    	}
    })
    
    noPlanTest2.start();
    
    tap.ok(noPlanTest2.failed, 'Missing plan is detecting');
}

return testobj;
})()