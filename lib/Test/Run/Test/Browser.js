Class('Test.Run.Test.Browser', {
	
	isa : Test.Run.Test,
	
	have : {
		url : null,
		
		iframe : null,
		
		timeoutIds : null,
		
		finished : false
	},
	
	
	after : {
        
        initialize : function () {
            this.timeoutIds = {};
        }
		
	},
	
	
	methods : {
		
		beginAsync : function (time) {
            var me = this;
            
            var timeoutId = setTimeout(function () {
                me.endAsync(timeoutId);
            }, time || 1e4)
			
            this.timeoutIds[timeoutId] = true;
		},
		
		
        endAsync : function (timeoutId) {
            var counter = 0;
            
            if (!timeoutId) Joose.O.each(this.timeoutIds, function (value, name) {
                timeoutId = name;
                if (counter++) throw "Calls to endAsync without argument should only be performed if you have single beginAsync statement" 
            })
            
            clearTimeout(timeoutId);
            delete this.timeoutIds[timeoutId];
            
            if (this.finished) this.finalize();
        },
        
        
		finalize : function () {
			this.finished = true;
			
            if (!Joose.O.isEmpty(this.timeoutIds)) return;
			
			this.SUPER();
		}
		
	}
	
});
//eof Test.Run.Test.Browser