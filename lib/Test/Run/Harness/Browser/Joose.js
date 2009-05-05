Role('Test.Run.Harness.Browser.Joose', {
	
	my : {
		
		before : {
			
			startTest : function (func, testClass, topScope) {
				if (topScope.Joose) func.__JOOSE_MODULE__ = topScope.Joose.Namespace.Manager.my.global;
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Joose


Test.Run.Harness.Browser.meta.extend({
	does : [ Test.Run.Harness.Browser.Joose ]
})