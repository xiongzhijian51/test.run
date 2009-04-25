Class('Test.Run.Harness.Browser.UI.TestGrid', {
	
	isa : Ext.grid.GridPanel,
	
	
	before : {
		initComponent : function () {
			Ext.apply(this, {
				
				tbar : [
					{ text : 'Rerun' }
				],
				
				slot : 'tests',
				
				width : 400,
				
				columns: [
					new Ext.grid.RowNumberer(),
					{ header: 'Name', width: 210, sortable: true, dataIndex: 'name' },
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
			
		}
		
	}
	
});

Ext.reg('testgrid', Test.Run.Harness.Browser.UI.TestGrid);