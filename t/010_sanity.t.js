(function () {
var testobj = new Test.TAP.Class();
testobj.plan(1)

testobj.testSanity = function() {
    //==================================================================================================================================================================================
    this.diag("Test.Run sanity");
    
    this.ok(Test.Run, "Test.Run is here");
    this.ok(Test.Run.Result, "Test.Run.Result is here");
    
        
};

return testobj;
})()