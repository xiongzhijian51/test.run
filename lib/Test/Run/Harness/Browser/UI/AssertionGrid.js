Class('Test.Run.Harness.Browser.UI.AssertionGrid', {

	isa : Ext.grid.GridPanel,

	have : {
		testRecord : null
	},

	before : {
		initComponent : function() {
			Ext.apply(this, {
				
				title : this.testRecord.get('name'),
				
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

				view : new Ext.grid.GridView({
					forceFit : true,
					enableRowBody : true,
					
					getRowClass : function(record, index, rowParams, store) {
						var result = record.get('result');
						
						if (result instanceof Test.Run.Result.Diagnostic) {
							rowParams.body = '<h2>' + result.description + '</h2>';
							return 'x-test-diagnostic-row';
						} else {
							rowParams.body = '';
							
							return result.pass ? 'x-test-assert-row-ok' : 'x-test-assert-row-notok'
						}
					}
				}),

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