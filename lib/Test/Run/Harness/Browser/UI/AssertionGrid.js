Class('Test.Run.Harness.Browser.UI.AssertionGrid', {

	isa : Ext.grid.GridPanel,

	have : {
		test : null
	},

	before : {
		initComponent : function() {
			Ext.apply(this, {

				columns : [
					new Ext.grid.RowNumberer(),

					{
						header : 'Result',
						width : 60,
						sortable : true,
						dataIndex : 'result',
						align : 'center'
					}, {
						header : 'Assertion',
						width : 60,
						sortable : true,
						dataIndex : 'description'
					}, {
						header : 'Status',
						width : 60,
						sortable : true,
						dataIndex : 'status'
					}
				],

				viewConfig : {
					forceFit : true,

					getRowClass : function(record, index) {
//								var c = record.get('change');
//								if (c < 0) {
//									return 'price-fall';
//								} else if (c > 0) {
//									return 'price-rise';
//								}
					}
				},

				store : new Ext.data.ArrayStore({
					fields : ['result', 'description', 'status'],

					autoDestroy : true,
					data : []
				})

			});
		}
	},

	after : {
		initComponent : function() {
		}
	}

});

Ext.reg('assertgrid', Test.Run.Harness.Browser.UI.AssertionGrid);