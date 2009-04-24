Class('Test.Run.Harness.Browser.UI.TestGrid', {
	
	isa : Ext.grid.GridPanel,
	
	have : {
		tests : null
	},

	
	before : {
		initComponent : function () {
			Ext.apply(this, {
				columns: [
					{header: 'Name', width: 100, sortable: true, dataIndex: 'name'},
					{header: 'Passed', width: 30, sortable: true, dataIndex: 'pass'},
					{header: 'Failed', width: 120, sortable: true, dataIndex: 'fail'},
					{header: 'Time', width: 120, sortable: true, dataIndex: 'time'}
				],
				
				 store: new Ext.data.ArrayStore({
				 	fields: [
				       'Name'
				    ],

			        autoDestroy: true,
			        reader: new Ext.data.JsonReader(),
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