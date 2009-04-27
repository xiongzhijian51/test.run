Class('Test.Run.Harness.Browser.UI.TestGrid', {
	
	isa : Ext.grid.GridPanel,
	
	
	before : {
		initComponent : function () {
			this.addEvents('rowselect');
			
			Ext.apply(this, {
				
				tbar : [
					{ 
						text : 'Re-run',
						iconCls : 'x-test-icon-refresh'
					}
				],
				
				width : 400,
				
				columns: [
					{ header: 'Name', width: 210, sortable: true, dataIndex: 'name' },
					{ header: 'Passed', width: 60, sortable: true, dataIndex: 'passCount', align : 'center' },
					{ header: 'Failed', width: 60, sortable: true, dataIndex: 'failCount', align : 'center' },
					{ header: 'Time', width: 50, sortable: true, dataIndex: 'time', align : 'center' }
				],
				
				viewConfig : {
					selectedRowClass : 'x-test-row-selected',
					
					forceFit : true,
					
					enableRowBody : true,
					
					getRowClass : function(record, index, rowParams, store) {
						var test = record.get('test');
						
						if (test)
							if (test.failCount) {
								return 'x-test-test-row-failed';
							} else if (test.passCount >= test.assertPlanned) {
								return 'x-test-test-row-passed';
							} else 
								return ''
						
					}
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
		}
		
	}
	
});

Ext.reg('testgrid', Test.Run.Harness.Browser.UI.TestGrid);