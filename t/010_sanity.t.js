(function () {
var testobj = new Test.TAP.Class();
testobj.plan(5)

testobj.testSanity = function() {
    var tap = this;
    
	//==================================================================================================================================================================================
    tap.diag("Test.Run sanity");
    
    tap.ok(Test.Run, "Test.Run is here");
    tap.ok(Test.Run.Result, "Test.Run.Result is here");
    tap.ok(Test.Run.Test, "Test.Run.Test is here");
    tap.ok(Test.Run.Harness, "Test.Run.Harness is here")
    tap.ok(Test.Run.Harness.Browser, "Test.Run.Harness.Browser is here")
    tap.ok(Test.Run.Result.Diagnostic, "Test.Run.Result.Diagnostic is here")
    tap.ok(Test.Run.Result.Assertion, "Test.Run.Result.Assertion is here")
}

return testobj;
})()