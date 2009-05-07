Class('Test.Run.Harness.Browser.UI.AssertionGrid', {

	isa : Ext.grid.GridPanel,

	have : {
		testRecord : null
	},

	before : {
		initComponent : function() {
			Ext.apply(this, {
                
//                iconCls : 'x-test-test-status-question',
				
				title : this.testRecord.get('name'),
				
				columns : [
					{
						header : '#',
						width : 23,
						dataIndex : 'indx',
						align : 'center'
					},
					{
						header : 'Result',
						width : 60,
						sortable : true,
						dataIndex : 'ok',
						align : 'center',
                        
                        renderer : this.resultRenderer
					},
                    {
						header : 'Assertion',
						width : 500,
						sortable : true,
						dataIndex : 'description'
					}, 
                    {
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
						}
					}
				}),

				store : new Ext.data.ArrayStore({
					fields : ['indx', 'ok', 'description', 'status', 'result'],

					autoDestroy : true,
					data : []
				})

			});
		}
	},

	
    after : {
		initComponent : function() {
		}
	},
    
    
    methods : {
        resultRenderer : function (value, metaData, record, rowIndex, colIndex, store) {
            if (value == 'ok') 
                metaData.css = 'x-test-assert-row-ok-cell'
            else
                metaData.css = 'x-test-assert-row-bug-cell'
            
            return '';
        }
    }

});

Ext.reg('assertgrid', Test.Run.Harness.Browser.UI.AssertionGrid);