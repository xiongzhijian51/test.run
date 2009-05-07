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
						
						html : '<a href="http://code.google.com/p/joose-js/"><div class="joose-logo"></div></a><h1>' + this.title + '</h1> ',
						
						height : 75
					},
					{
						region : 'center',
						
						layout : 'border',
						
						items : [
							{
								region : 'west',
								xtype : 'testgrid',
								slot : 'tests',
								
								split : true,
                                
                                harness : this.harness
							},
							{
								region : 'center',
								xtype : 'tabpanel',
								slot : 'tabs',
								enableTabScroll : true
							}
						]
					}
				]
			})
		}
		//eof initComponent
	},
	
	
	after : {
		initComponent : function () {
			var slots = this.slots
			
            var paused = false
            
			slots.tests.on('rowselect', function (grid, record) {
                if (!paused) {
				    paused = true
                    slots.tabs.activate(record.get('assertionGrid'))
                    paused = false
                }
			}, this)
			
			slots.tabs.on('tabchange', function (tabs, panel) {
                if (!paused) {
                    paused = true
    				slots.tests.getSelectionModel().selectRecords([ panel.testRecord ])
                    paused = false
                }
			}, this)
		}
	},
	
	
	methods : {
		
		addUrlRecord : function (url) {
			var slots = this.slots
			var testStore = slots.tests.store
			var recType = testStore.recordType
			
            var record = testStore.getAt(testStore.find('name', url))
            
			if (!record) { 
	            record = new recType({ name : url })
				
				testStore.add([ record ])
            }
			
			var assertionGrid = record.get('assertionGrid');
            
            if (!assertionGrid) {
                assertionGrid = new Test.Run.Harness.Browser.UI.AssertionGrid({
                    title : record.get('name')
				})
			
			    record.set('assertionGrid', assertionGrid)
			
				slots.tabs.add(assertionGrid)
				if (slots.tabs.items.getCount() == 1) slots.tabs.activate(0)
            }
		},
		
		
		testStart : function (test) {
			var slots = this.slots
			var testStore = slots.tests.store
			
			var record = testStore.getAt(testStore.find('name', test.url))
			
			record.set('test', test)
			
			test.testRecord = record
			test.assertionGrid = record.get('assertionGrid')
		},
		
		
		testUpdate : function (test, result) {
			test.testRecord.set('passCount', test.passCount)
			test.testRecord.set('failCount', test.failCount)
			test.testRecord.commit()
			
			var assertStore = test.assertionGrid.store
			var assertRecType = assertStore.recordType
			
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
			test.testRecord.set('time', (test.execEnd - test.start) + 'ms')
			test.testRecord.commit()
		},
        
        
        removeTest : function (test) {
            var record = test.testRecord;
            
            record.set('test', null)
            
            var assertionGrid = record.get('assertionGrid')
            assertionGrid.store.removeAll()
        }        
		
		
	}
	
})
//eof Test.Run.Harness.Browser.UI.Viewport