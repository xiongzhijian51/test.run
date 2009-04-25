Class('Test.Run.Harness.Browser.UI.AssertionGrid', {

	isa : Ext.grid.GridPanel,

	have : {
		test : null
	},

	before : {
		initComponent : function() {
			Ext.apply(this, {
				
				title : this.test.url,

				columns : [
					new Ext.grid.RowNumberer(),

					{
						header : 'Result',
						width : 60,
						sortable : true,
						dataIndex : 'ok',
						align : 'center'
					}, {
						header : 'Assertion',
						width : 500,
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
//					forceFit : true,
					enableRowBody : true,

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
					fields : ['ok', 'description', 'status', 'result'],

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