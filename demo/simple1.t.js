StartTest(function(t) {
	t.plan(3);
	
	//===============================================================================================================================================================================================================
	t.diag('Simple #1');
	
	t.ok(typeof GLOBAL == 'undefined', 'GLOBAL is undefined');
	
	GLOBAL = 'test1';
	
	t.beginAsync();
	
	setTimeout(function () {
		t.ok(GLOBAL == 'test1', 'GLOBAL didnt change');
        t.endAsync();
	}, 1000)
    
    t.fail('failed');
})
