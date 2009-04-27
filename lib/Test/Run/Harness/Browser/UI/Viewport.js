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
				slots.tabs.activate(record.get('assertionGrid'));
			}, this);
			
			slots.tabs.on('tabchange', function (tabs, panel) {
				slots.tests.getSelectionModel().selectRecords([ panel.testRecord ])
			}, this);
		}
	},
	
	
	methods : {
		
		addTestRecord : function (url) {
			var slots = this.slots;
			var store = slots.tests.store;
			var recType = store.recordType;
			
			var record = new recType({
				name : url
			})
			
			store.add([ record ]);
			
			var assertionGrid = new Test.Run.Harness.Browser.UI.AssertionGrid({
				testRecord : record
			})
			
			record.set('assertionGrid', assertionGrid);
			
			slots.tabs.add(assertionGrid);
			if (slots.tabs.items.getCount() == 1) slots.tabs.activate(0)
		},
		
		
		testStart : function (test) {
			var slots = this.slots;
			var testStore = slots.tests.store;
			
			var record = testStore.getAt(testStore.find('name', test.url))
			
			record.set('test', test);
			
			test.testRecord = record;
			test.assertionGrid = record.get('assertionGrid')
		},
		
		
		testUpdate : function (test, result) {
			test.testRecord.set('passCount', test.passCount);
			test.testRecord.set('failCount', test.failCount);
			test.testRecord.commit()
			
			var assertStore = test.assertionGrid.store;
			var assertRecType = assertStore.recordType;
			
			assertStore.add([
				new assertRecType({
					indx : test.assertCount,
					ok : result.pass ? 'ok' : 'not ok',
					description : result.description,
					result : result
				})
			])
		},
		
		
		testEnd : function (test) {
			test.testRecord.set('time', (test.execEnd - test.start) + 'ms');
			test.testRecord.commit()
		}
		
		
	}
	
});
//eof Test.Run.Harness.Browser.UI.Viewport