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
						
						cls : 'x-test-title',
						
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
	
	
	after : {
		initComponent : function () {
			var slots = this.slots;
			
			slots.tests.on('rowselect', function (grid, record) {
				slots.tabs.activate(record.get('test').grid);
			}, this);
			
			slots.tabs.on('tabchange', function (tabs, panel) {
				slots.tests.getSelectionModel().selectRecords([ panel.test.record ])
			}, this);
		}
	},
	
	
	methods : {
		
		onTestStart : function (test) {
			var slots = this.slots;
			var store = slots.tests.store;
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
			
			slots.tabs.add(test.grid);
			if (slots.tabs.items.getCount() == 1) slots.tabs.activate(0)
		},
		
		
		onTestUpdate : function (test, result) {
			test.record.set('passCount', test.passCount);
			test.record.set('failCount', test.failCount);
			
			var assertStore = test.grid.store;
			var assertRecType = assertStore.recordType;
			
			assertStore.add([
				new assertRecType({
					ok : result.pass ? 'ok' : 'not ok',
					description : result.description,
					result : result
				})
			])
		},
		
		
		onTestExecutionEnd : function (test) {
			test.record.set('time', (test.execEnd - test.start) + 'ms');
		}
		
		
	}
	
});
//eof Test.Run.Harness.Browser.UI.Viewport