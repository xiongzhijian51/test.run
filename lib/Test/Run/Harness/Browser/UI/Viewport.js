Class('Test.Run.Harness.Browser.UI.Viewport', {
	
	isa : Ext.Viewport,
	
	have : {
		title : null,
		
		harness : null
	},
	
	before : {
		
		initComponent : function () {
			Ext.apply(this, {
				
				slots : true,
				
				layout : 'border',
				items : [
					{
						region : 'north',
						slot : 'title',
						
						bodyStyle : 'background-color:#1E4176;color:white;line-height:50px;font-size:20px;padding-left:10px',
						
						html : '<h1>' + this.title + '</h1>',
						
						height : 50
					},
					{
						region : 'center',
						
						layout : 'border',
						
						items : [
							{
								region : 'west',
								xtype : 'testgrid',
								slot : 'tests',
								
								split : true
							},
							{
								region : 'center',
								xtype : 'tabpanel',
								slot : 'tabs'
							}
						]
					}
				]
			});
		}
		//eof initComponent
	},
	
	
	methods : {
		
		onTestStart : function (test) {
			var store = this.slots.tests.store;
			var recType = store.recordType;
			
			var record = new recType({
				name : test.url,
				test : test
			})
			
			test.record = record;
			
			store.add([ record ]);
			
			test.grid = new Test.Run.Harness.Browser.UI.AssertionGrid({
				test : test
			})
			
			this.slots.tabs.add(test.grid);
			this.slots.tabs.doLayout();
		},
		
		
		onTestUpdate : function (test, result) {
			test.record.set('passCount', test.passCount);
			test.record.set('failCount', test.failCount);
			
			var assertStore = test.grid.store;
			var assertRecType = assertStore.recordType;
			
			assertStore.add([
				new assertRecType({
					result : result.pass ? 'ok' : 'not ok',
					description : result.description
				})
			])
		},
		
		
		onTestExecutionEnd : function (test) {
			test.record.set('time', (test.execEnd - test.start) + 'ms');
		}
		
		
	}
	
});
//eof Test.Run.Harness.Browser.UI.Viewport