StartTest(function(t) {
	t.plan(1);
	
	//===============================================================================================================================================================================================================
	t.diag('Simple #3');
	
	t.ok(typeof GLOBAL == 'undefined', 'GLOBAL is undefined');
	
	GLOBAL = 'test3';
	
	t.waitAsync();
	
	setTimeout(function () {
		t.ok(GLOBAL == 'test3', 'GLOBAL didnt change');
	}, 1000)
})
