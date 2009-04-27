StartTest(function(t) {
	t.plan(1);
	
	//===============================================================================================================================================================================================================
	t.diag('Simple #2');
	
	t.ok(typeof GLOBAL == 'undefined', 'GLOBAL is undefined');
	
	GLOBAL = 'test2';
	
	t.waitAsync();
	
	setTimeout(function () {
		t.ok(GLOBAL == 'test2', 'GLOBAL didnt change');
	}, 1000)
})
