StartTest(function(t) {
	t.plan(2);
	
	//===============================================================================================================================================================================================================
	t.diag('Simple #3');
	
	t.ok(typeof GLOBAL == 'undefined', 'GLOBAL is undefined');
	
	GLOBAL = 'test3';
	
	t.beginAsync();
	
	setTimeout(function () {
		t.ok(GLOBAL == 'test3', 'GLOBAL didnt change');
        t.endAsync();
	}, 1000)
})
