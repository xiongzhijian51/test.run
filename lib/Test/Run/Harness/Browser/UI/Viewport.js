Class('Test.Run.Harness.Browser.UI.Viewport', {
	
	isa : Ext.Viewport,
	
	have : {
		title : null,
		
		harness : null
	},
	
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
						
						html : '<h1>' + this.title + '</h1>',
						
						height : 50
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
	},
	
	
	methods : {
	}
	
});
//eof Test.Run.Harness.Browser.UI.Viewport