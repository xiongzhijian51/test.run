Class('Test.Run.Harness.Browser.UI.TestGrid', {
	
	isa : Ext.grid.GridPanel,
	
	
	before : {
		initComponent : function () {
			this.addEvents('rowselect');
			
			Ext.apply(this, {
				
				tbar : [
					{ 
						text : 'Re-run all',
						iconCls : 'x-test-icon-refresh',
                        scale : 'large',
						handler : this.reRunSuite,
						scope : this
					}
				],
				
				width : 400,
				
				columns: [
					{ header: 'Name', width: 210, sortable: true, dataIndex: 'name', renderer : this.testRowRenderer },
					{ header: 'Passed', width: 60, sortable: true, dataIndex: 'passCount', align : 'center' },
					{ header: 'Failed', width: 60, sortable: true, dataIndex: 'failCount', align : 'center' },
					{ header: 'Time', width: 50, sortable: true, dataIndex: 'time', align : 'center' }
				],
				
				viewConfig : {
					forceFit : true
				},
				
				sm: new Ext.grid.RowSelectionModel({ singleSelect : true }),
				
				store: new Ext.data.ArrayStore({
					fields: [
				       'name',
				       'passCount',
				       'failCount',
				       'time',
				       
				       'test',
				       'assertionGrid'
				    ],

			        autoDestroy: true,
			        data: []
			    })

 
			});
		}
	},
	
	
	after : {
		initComponent : function () {
			this.getSelectionModel().on('rowselect', this.onRowSelect, this);
		}
	},
	
	
	methods : {
		
		onRowSelect : function (selModel, indx, record) {
			this.fireEvent('rowselect', this, record);
		},
		
		
		reRunSuite : function () {
			
		},
        
        
        testRowRenderer : function (value, metaData, record, rowIndex, colIndex, store) {
            var test = record.get('test');
            
            metaData.css = 'x-test-test-status ';
            if (test) {
                if (test.failed)
                    metaData.css += 'x-test-test-status-thrown';
                else if (test.failCount)
                    metaData.css += 'x-test-test-status-failed';
                else if (test.passCount >= test.assertPlanned)
                    metaData.css += 'x-test-test-status-passed';
                else
                    metaData.css += 'x-test-test-status-working';
                    
            } else 
                metaData.css += 'x-test-test-status-question'
            
            return value;
        }
		
	}
	
});

Ext.reg('testgrid', Test.Run.Harness.Browser.UI.TestGrid);