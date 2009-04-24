Class('Test.Run.Harness.Browser.UI.TestGrid', {
	
	isa : Ext.grid.GridPanel,

	
	before : {
		initComponent : function () {
			Ext.apply(this, {
				height : 300,
				layout : 'column',
				header : true,
				title : 'Test panel',
				
				items : [
					{
						width : 200,
						html : 'yo1'
					},
					{
						width : 200,
						html : 'yo2'
					}
				]
			});
		}
	},
	
	
	after : {
		initComponent : function () {
			Ext.apply(this, {
				height : 300,
				layout : 'column',
				header : true,
				title : 'Test panel',
				
				items : [
					{
						width : 200,
						html : 'yo1'
					},
					{
						width : 200,
						html : 'yo2'
					}
				]
			});
		}
	}
	
});