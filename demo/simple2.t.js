StartTest(function(t) {
	t.plan(2);
	
	//===============================================================================================================================================================================================================
	t.diag('Simple #2');
	
	t.ok(typeof GLOBAL == 'undefined', 'GLOBAL is undefined');
	
	GLOBAL = 'test2';
	
	t.beginAsync();
	
	setTimeout(function () {
		t.ok(GLOBAL == 'test2', 'GLOBAL didnt change');
        t.endAsync();
	}, 1000)
})
