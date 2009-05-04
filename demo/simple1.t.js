StartTest(function(t) {
	t.plan(2);
	
	//===============================================================================================================================================================================================================
	t.diag('Simple #1');
	
	t.ok(typeof GLOBAL == 'undefined', 'GLOBAL is undefined');
	
	GLOBAL = 'test1';
	
	t.waitAsync();
	
	setTimeout(function () {
		t.ok(GLOBAL == 'test1', 'GLOBAL didnt change');
	}, 1000)
})
