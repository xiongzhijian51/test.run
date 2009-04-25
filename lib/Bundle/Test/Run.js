Class('Test.Run.Result', {
	
	have : {
		description : null
	},
	
	
	methods : {
		
		toString : function () {
			return this.description;
		}
		
	}
		
});
//eof Test.Run.Result
Class('Test.Run.Result.Diagnostic', {
	
	isa : Test.Run.Result
	
});

Class('Test.Run.Result.Assertion', {
	
	isa : Test.Run.Result,
	

	have : {
		pass : null,
		
		indx : null
	},
	
	
	methods : {
		
		toString : function () {
			return (this.pass ? 'ok' : 'not ok') + ' ' + this.indx + ' - ' + this.description;
		}
		
	}
		
});

Class('Test.Run.Test', {
	
	have : {
		
		id : null,
		url : null,
		
		assertPlanned : null,
		assertCount : 0,
		
		diagCount : 0,
		
		passCount : 0,
		failCount : 0,
		
		results : null,
		
		run : null,
		
		harness : null,
		
		failed : false,
		
		start : null,
		execEnd : null,
		planEnd : null
	},
	
	
	after : {
	
		initialize : function (config) {
			if (typeof this.run != 'function') throw "The body of test absent";
			
			this.results = [];
		}
		
	},
	
	
	methods : {
		
		toString : function() {
			return this.url || this.id;
		},
		
		
		plan : function (value) {
			if (this.assertPlanned != null) throw "Test plan can't be changed";
			
			this.assertPlanned = value; 
		},
		
		
		addResult : function (result) {
			if (this.assertPlanned == null && this.assertCount) throw "Plan wasn't setuped"
			
			this.results.push(result);
			
			this.harness.onTestUpdate(this, result);
			
			if (this.assertCount == this.assertPlanned) {
				this.planEnd = new Date();
				
				this.harness.onTestPlanEnd(this);
			}
		},
		
		
		diag : function (desc) {
			this.diagCount++;
			
			this.addResult(new Test.Run.Result.Diagnostic({
				description : desc
			}));
		},
		
		
		//XXX pass&fail should be more flexible and overridable (for TODO,SKIP, etc)
		pass : function (desc) {
			this.passCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : true,
				
				description : desc,
				
				indx : ++this.assertCount
			}));
		},
		
		
		fail : function (desc) {
			this.failCount++;
			
			this.addResult(new Test.Run.Result.Assertion({
				pass : false,
				
				description : desc,
				
				indx : ++this.assertCount
			}));
		},
		
		
		ok : function (condition, desc) {
		    if (condition) this.pass(desc); else this.fail(desc)
		},
		
		
		is : function (got, expected, desc) {
		    this.ok(got == expected, desc);
		},

		
		start : function () {
			var run = this.run;
			
			this.harness.onTestStart(this);
			
			this.start = new Date();
			
			try {
				run(this);
			} catch (e) {
				
				this.failed = true;
				
				this.harness.onTestFail(this, e);
			} finally {
				this.finalize()
			}
		},
		
		
		finalize : function () {
			this.execEnd = new Date()
			
			this.harness.onTestExecutionEnd(this);
		}
		
	}
		
});
//eof Test.Run.Test
Class('Test.Run.Test.Browser', {
	
	isa : Test.Run.Test,
	
	have : {
		record : null,
		
		grid : null
	},
	
	
	after : {
		
		initialize : function () {
//			this.name = window.location.pathname
		}
		
	}
	
});
//eof Test.Run.Test.Browser
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
						
						cls : 'x-test-title',
						
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
								slot : 'tests',
								
								split : true
							},
							{
								region : 'center',
								xtype : 'tabpanel',
								slot : 'tabs'
							}
						]
					}
				]
			});
		}
		//eof initComponent
	},
	
	
	after : {
		initComponent : function () {
			var slots = this.slots;
			
			slots.tests.on('rowselect', function (grid, record) {
				slots.tabs.activate(record.get('test').grid);
			}, this);
			
			slots.tabs.on('tabchange', function (tabs, panel) {
				slots.tests.getSelectionModel().selectRecords([ panel.test.record ])
			}, this);
		}
	},
	
	
	methods : {
		
		onTestStart : function (test) {
			var slots = this.slots;
			var store = slots.tests.store;
			var recType = store.recordType;
			
			var record = new recType({
				name : test.url,
				test : test
			})
			
			test.record = record;
			
			store.add([ record ]);
			
			test.grid = new Test.Run.Harness.Browser.UI.AssertionGrid({
				test : test
			})
			
			slots.tabs.add(test.grid);
			if (slots.tabs.items.getCount() == 1) slots.tabs.activate(0)
		},
		
		
		onTestUpdate : function (test, result) {
			test.record.set('passCount', test.passCount);
			test.record.set('failCount', test.failCount);
			
			var assertStore = test.grid.store;
			var assertRecType = assertStore.recordType;
			
			assertStore.add([
				new assertRecType({
					ok : result.pass ? 'ok' : 'not ok',
					description : result.description,
					result : result
				})
			])
		},
		
		
		onTestExecutionEnd : function (test) {
			test.record.set('time', (test.execEnd - test.start) + 'ms');
		}
		
		
	}
	
});
//eof Test.Run.Harness.Browser.UI.Viewport
Class('Test.Run.Harness.Browser.UI.TestGrid', {
	
	isa : Ext.grid.GridPanel,
	
	
	before : {
		initComponent : function () {
			this.addEvents('rowselect');
			
			Ext.apply(this, {
				
				tbar : [
					{ text : 'Rerun' }
				],
				
				width : 400,
				
				columns: [
					{ header: 'Name', width: 210, sortable: true, dataIndex: 'name' },
					{ header: 'Passed', width: 60, sortable: true, dataIndex: 'passCount', align : 'center' },
					{ header: 'Failed', width: 60, sortable: true, dataIndex: 'failCount', align : 'center' },
					{ header: 'Time', width: 50, sortable: true, dataIndex: 'time', align : 'center' }
				],
				
				viewConfig : {
					forceFit : true,
					
					enableRowBody : true,
					
					getRowClass : function(record, index, rowParams, store) {
//						var result = record.get('result');
//						
//						if (result instanceof Test.Run.Result.Diagnostic) {
//							rowParams.body = '<h2>' + result.description + '</h2>';
//							return 'x-test-diagnostic-row';
//						} else {
//							rowParams.body = '';
//							
//							return result.pass ? 'x-test-assert-row-ok' : 'x-test-assert-row-notok'
//						}
					}
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
			this.fireEvent('rowselect', this, record);
		}
		
	}
	
});

Ext.reg('testgrid', Test.Run.Harness.Browser.UI.TestGrid);
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
Class('Test.Run.Harness', {
	
	my : {
		
		have : {
			tests : null,
			
			testClass : Test.Run.Test,
			
			currentUrl : null
		},
		
		
		after : {
		
			initialize : function (config) {
				this.tests = []
			}
			
		},
		
		
		methods : {
			
			onTestUpdate : function (test, result, indx) {
			},
			
			
			onTestFail : function (test, exception) {
			},
			
			
			onTestStart : function (test) {
				if (!this.currentUrl) throw "Test started w/o url";
				
				test.url = this.currentUrl;
			},
			
			
			onTestPlanEnd : function (test) {
				
			},
			
			
			onTestExecutionEnd : function (test) {
			},
			
			
			configure : function (config) {
				Joose.O.copy(config, this);
			},
			
			
			startTest : function (func, testClass) {
				var test = new (testClass || this.testClass)({
					id : this.tests.length,
					harness : this,
					run : func
				})
				
				this.tests.push(test);
				
				test.start();
			},
			
			
			start : function () {
				this.onTestSuiteStart();
				
				this.runTests(Array.prototype.slice.call(arguments));
			},
			
			
			runTests : function (urls) {
				var me = this;
				
				if (urls.length) {
					var url = urls.shift();
					
					this.currentUrl = url;
					
					this.processUrl(url, function () {
						delete me.currentUrl;
						
						me.runTests(urls)
					});
					
				} else this.onTestSuiteEnd();
			},
			
			
			onTestSuiteStart : function () {
				Test.Run.my.configure({
					harness : this
				})
			},
			
			
			onTestSuiteEnd : function () {
			},
			
			
			processUrl : function (url, ready) {
				ready()
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness
Class('Test.Run.Harness.Browser', {
	
	isa : Test.Run.Harness,
	
	my : {
		
		have : {
			title : null,
			
			isIE : /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent),
			
			baseUrl : window.location.href.replace(/\/(?:\w|\.)*$/, '/'),
			
			preload : null
		},
		
		
		methods : {
			
			startTest : function (func, testClass) {
				if (window.parent && window.parent.Test && window.parent.Test != Test) {
					Test = window.parent.Test;
					Test.run.start(func, testClass);
					return;
				}
				this.SUPERARG(arguments);
			},
			
			
			//webkit bug - base url for iframes are broken
			//https://bugs.webkit.org/show_bug.cgi?id=13364
			resolveUrl : function (url) {
				return (!/^http/.test(url) && !/^\//.test(url)) ? this.baseUrl + url : url;
			},
			
			
			processUrl : function (url, ready) {
				var iframe;
				var me = this;
				
				url = this.resolveUrl(url)
				
				if (this.isIE) {
		            iframe = document.createElement('<iframe name="test' + this.tests.length + '"></iframe>')
		            
		            iframe.onreadystatechange = function () {
		            	
		            	if (iframe.readyState == "loaded" || iframe.readyState == "complete") me.setupIframe(iframe, url, ready) 
	            	}
				} else {
		            iframe = document.createElement('iframe');
		            iframe.name = 'test' + this.tests.length;
		            
		            iframe.onload = function () { me.setupIframe(iframe, url, ready) }
				}
				
				this.customizeIframe(iframe);
				
	            document.body.appendChild(iframe);
			},
			
			
			customizeIframe : function (iframe) {
			},
			
			
			setupIframe : function (iframe, url, ready) {
				var me = this;
				
				if (/\.js$/.test(url)) 
					this.finalizeUrl(iframe, url, ready)
				else
					if (/\.html$/.test(url)) 
						if (this.isIE)
				            iframe.onreadystatechange = function () {
				            	if (iframe.readyState == "loaded" || iframe.readyState == "complete") ready() 
			            	}
						else
				            iframe.onload = ready
		            else
		            	throw "Unknow url: [" + url + "]"
			},
			
			
			finalizeUrl : function (iframe, url, ready) {
	            var ifrWindow = iframe.contentWindow;
	            var ifrDoc = ifrWindow.document;
	            var ifrBody = ifrDoc.body;
	            
	            if (this.preload) Joose.A.each(this.preload, function (preloadUrl) {
	            	ifrBody.appendChild(this.createScriptTag(null, preloadUrl, null, ifrDoc))
	            }, this)
		            
	            ifrWindow.Test = Test;
	            
	            ifrDoc.body.appendChild(this.createScriptTag(null, url, ready, ifrDoc))
			},
			
			
			createScriptTag : function (text, url, onload, doc) {
	            var node = (doc || document).createElement("script");
	            
	            node.setAttribute("type", "text/javascript");
	            
	            if (url) node.setAttribute("src", url)
	            
	            if (text) node.text = text
	            
	            if (onload) node.onload = node.onreadystatechange = function() {
	                if (!node.readyState || node.readyState == "loaded" || node.readyState == "complete" || node.readyState == 4 && node.status == 200)
	                    //surely for IE6..
	                    setTimeout(onload, 1);
	            }
	            
	            return node;
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser
Class('Test.Run.Harness.Browser.Single', {
	
	isa : Test.Run.Harness.Browser,
	
	my : {
		
		after : {
		
			onTestUpdate : function (test, result) {
				this.print(result);
			},
			
			
			onTestFail : function (test, exception) {
				this.print('Test threw an exception: ' + exception)
			},
			
			
			onTestExecutionEnd : function (test) {
				this.print(this.getSummaryMessage(test)); 
			}
		},

		
		methods : {
			
			onTestStart : function (test) {
			},
			
			
			print : function (text) {
				var div = document.createElement('div');
				div.innerHTML = text;
				document.body.appendChild(div);
			},
			
			
			getSummaryMessage : function (test) {
				var res = [];
				
				var passCount = test.passCount;
				var failCount = test.failCount;
				
				res.push('Passed: ' + passCount);
				res.push('Failed: ' + failCount);
				
				if (failCount + passCount < test.assertPlanned) res.push('Looks like you planned ' + test.assertPlanned + ' tests, but ran only ' +  (failCount + passCount))
				
				if (failCount + passCount == test.assertPlanned && !failCount) res.push('All tests successfull');
				
				return res.join('<br>')
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Single
Class('Test.Run.Harness.Browser.Multi', {
	
	isa : Test.Run.Harness.Browser,
	
	my : {
		
		have : {
			startArguments : null,
			viewport : null,
			
			testClass : Test.Run.Test.Browser
		},
		
		
		after : {
			
			onTestStart : function (test) {
				this.viewport.onTestStart(test);
			},
			
			
			onTestUpdate : function (test, result) {
				this.viewport.onTestUpdate(test, result)
			},
			
			
			onTestExecutionEnd : function (test) {
				this.viewport.onTestExecutionEnd(test);
			}
			
		},
		
		
		methods : {
			
			start : function () {
				var me = this;
				
				//waiting for viewport
				if (!this.viewport) { 
					this.startArguments = Array.prototype.slice.call(arguments)
					
					Ext.onReady(function(){
						
						me.viewport = new Test.Run.Harness.Browser.UI.Viewport({
							title : me.title,
							harness : me
						})
						
						me.start.apply(me, me.startArguments);
						delete me.startArguments
					});
					
				} else 
					this.SUPERARG(arguments);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run.Harness.Browser.Multi
Class('Test.Run', {
	
	my : {
		
		have : {
			harness : null
		},
		
		
		methods : {
			
			configure : function (config) {
				Joose.O.copy(config, this);
			},
			
			
			start : function (testFunc, testClass) {
				
				(this.harness || Test.Run.Harness.Browser.Single.my).startTest(testFunc, testClass);
			}
			
		}
		
	}
	//eof my
});
//eof Test.Run
