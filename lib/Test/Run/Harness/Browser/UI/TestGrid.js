Class('Test.Run.Harness.Browser.UI.TestGrid', {
	
	isa : Ext.grid.GridPanel,
	
	have : {
		tests : null
	},

	
	before : {
		initComponent : function () {
			Ext.apply(this, {
				
				slot : 'tests',
				
				width : 400,
				
				columns: [
					{header: 'Name', width: 210, sortable: true, dataIndex: 'name'},
					{header: 'Passed', width: 60, sortable: true, dataIndex: 'passCount'},
					{header: 'Failed', width: 60, sortable: true, dataIndex: 'failCount'},
					{header: 'Time', width: 50, sortable: true, dataIndex: 'time'}
				],
				
				 store: new Ext.data.ArrayStore({
				 	fields: [
				       'name',
				       'pass',
				       'fail',
				       'time'
				    ],

			        autoDestroy: true,
			        data: []
			    })

 
			});
		}
	},
	
	
	after : {
		initComponent : function () {
		}
	}
	
});

Ext.reg('testgrid', Test.Run.Harness.Browser.UI.TestGrid);