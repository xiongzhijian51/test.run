Class('Test.Run.Harness.Browser.UI.Viewport', {
	
	isa : Ext.Viewport,
	
	
	before : {
		
		initComponent : function () {
			Ext.apply(this, {
				
				slots : true,
				
				layout : 'border',
				items : [
					{
						region : 'north',
						slot : 'title',
						
						bodyStyle : 'background-color:#1E4176;color:white;line-height:50px;font-size:20px;padding-left:10px',
						
						
						height : 50,
						header : false
					},
					{
						region : 'center',
						
						layout : 'border',
						
						items : [
							{
								region : 'west',
								xtype : 'testgrid',
								
								split : true
							},
							{
								region : 'center'
							}
						]
					}
				]
			});
		}
		//eof initComponent
	}
	
});
//eof Test.Run.Harness.Browser.UI.Viewport