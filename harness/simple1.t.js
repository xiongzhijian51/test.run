StartTest(function(t) {
	t.plan(1);
	
	//===============================================================================================================================================================================================================
	t.diag('Simple #1');
	
	
	t.ok(typeof GLOBAL == 'undefined', 'GLOBAL is undefined');
	
	GLOBAL = 'test1';
	
	t.ok(typeof GLOBAL == 'undefined', 'GLOBAL is undefined');
})
