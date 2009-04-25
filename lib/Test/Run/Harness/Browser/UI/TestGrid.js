Class('Test.Run.Harness.Browser.UI.TestGrid', {
	
	isa : Ext.grid.GridPanel,
	
	
	before : {
		initComponent : function () {
			this.addEvents('rowselect');
			
			Ext.apply(this, {
				
				tbar : [
					{ text : 'Rerun' }
				],
				
				width : 400,
				
				columns: [
					{ header: 'Name', width: 210, sortable: true, dataIndex: 'name' },
					{ header: 'Passed', width: 60, sortable: true, dataIndex: 'passCount', align : 'center' },
					{ header: 'Failed', width: 60, sortable: true, dataIndex: 'failCount', align : 'center' },
					{ header: 'Time', width: 50, sortable: true, dataIndex: 'time', align : 'center' }
				],
				
				viewConfig : {
					forceFit : true,
					
					enableRowBody : true,
					
					getRowClass : function(record, index, rowParams, store) {
//						var result = record.get('result');
//						
//						if (result instanceof Test.Run.Result.Diagnostic) {
//							rowParams.body = '<h2>' + result.description + '</h2>';
//							return 'x-test-diagnostic-row';
//						} else {
//							rowParams.body = '';
//							
//							return result.pass ? 'x-test-assert-row-ok' : 'x-test-assert-row-notok'
//						}
					}
				},
				
				sm: new Ext.grid.RowSelectionModel({ singleSelect : true }),
				
				store: new Ext.data.ArrayStore({
					fields: [
				       'name',
				       'pass',
				       'fail',
				       'time',
				       'test'
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