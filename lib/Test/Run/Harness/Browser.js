Class('Test.Run.Harness.Browser', {
    
    isa : Test.Run.Harness,
    
    my : {
        
        have : {
            testClass : Test.Run.Test.Browser,
            
            title : null,
            
            disableCaching : true,
            
            isIE : /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent),
            
            baseUrl : window.location.href.replace(/\?.*$/,'').replace(/\/(\w|\.)*$/, '/'),
            baseHost : window.location.host,
            baseProtocol : window.location.protocol,
            
            preload : null,
            
            componentsExpanded : false
        },
        
        
        after : {
        
            recordTest : function (test) {
                Joose.O.each(this.urls, function (value, url) {
                    
                    if (value.iframe.contentWindow == test.topScope) {
                        test.iframe = value.iframe
                        test.url = url
                        
                        value.test = test
                    }
                })
            },
            
            
            reRunTest : function (test) {
                this.processUrl(test.url)
            }
            
        },
        
        
        before : {
            
            start : function () {
                if (!this.preload && window.COMPONENTS) this.setPreloadFromTaskName('core')
                
                this.preload = this.expandPreload(this.preload)
            },
            
            
            configure : function (config) {
                var browser = /browser=(.+)/.exec(window.location.search)
                
                if (browser) {
                    Test.Run.Harness.Browser.meta.extend({
                        does : [ Test.Run.Harness.Browser.Proven ]
                    });
                    
                    config.browser = browser[1]
                }
                
                if (typeof config.preload == 'string') {
                    this.setPreloadFromTaskName(config.preload)
                    delete config.preload
                }
            },
            
            
            removeTest : function (test) {
                var url = test.url
                
                document.body.removeChild(test.iframe)
                
                delete this.urls[url].iframe
                delete this.urls[url].test
                delete test.iframe
            }
            
        },
        
        
        methods : {
            
            expandComponents : function () {
                if (this.componentsExpanded || !window.COMPONENTS) return
                
                Joose.O.each(COMPONENTS, function (components, taskName) {
                    var res = []
                    
                    Joose.A.each(components, function (comp) {
                        var match = /^\+(.+)/.exec(comp)
                        
                        res = res.concat(match ? COMPONENTS[match[1]] : comp)
                    })
                    
                    COMPONENTS[taskName] = res
                })
                
                this.componentsExpanded = true
            },
            
            
            setPreloadFromTaskName : function (taskName) {
                this.preload = COMPONENTS[taskName]
            },
            
            
            expandPreload : function (preload) {
                this.expandComponents()
                
                var expanded = []
                
                Joose.A.each(preload, function (comp) {
                    var match
                    
                    if (/\.js$/.test(comp))
                        expanded.push(comp)
                    else if (match = /^\+(.+)/.exec(comp))
                        expanded = expanded.concat(this.expandPreload(COMPONENTS[match[1]]))
                    else
                        expanded.push('../lib/' + comp.split('.').join('/') + '.js')
                }, this)
                
                return expanded
            },
            
            
            startTest : function (func, testClass, topScope) {
                if (window.parent && window.parent.Test && window.parent.Test != Test) {
                    Test = window.parent.Test
                    Test.run.start(func, testClass, topsScope)
                    return
                }
                this.SUPERARG(arguments)
            },            
            
            
            //webkit bug - base urls for iframes are broken
            //https://bugs.webkit.org/show_bug.cgi?id=13364
            resolveUrl : function (url, onlyResolve) {
                var resolved
                
                if (!/^http/.test(url))
                    if (!/^\//.test(url))
                        resolved = this.baseUrl + url
                    else
                        resolved = this.baseProtocol + '//' + this.baseHost + url
                
                if (this.disableCaching && !onlyResolve) resolved += '?disableCaching=' + new Date().getTime()
                
                return resolved
            },
            
            
            processUrl : function (url) {
                this.SUPER(url)
                
                var me = this
                
                var resolved = this.resolveUrl(url)
                
                var iframe = document.createElement('iframe')
                //pointing to non-existed file, to satisfy same-origin policy
                iframe.src = this.resolveUrl('dummyFile.js', true)
                
                iframe.onload = iframe.onreadystatechange = function () {
                    if (!iframe.readyState || iframe.readyState == "loaded" || iframe.readyState == "complete") me.setupIframe(iframe, resolved) 
                }
                
                this.customizeIframe(iframe)
                
                document.body.appendChild(iframe)
                
                this.urls[url].iframe = iframe
            },
            
            
            customizeIframe : function (iframe) {
            },
            
            
            setupIframe : function (iframe, resolvedUrl) {
                var me = this
                
                var urlCopy = resolvedUrl.replace(/\?.*$/,'')
                
                if (/\.js$/.test(urlCopy)) 
                    this.finalizeUrl(iframe, resolvedUrl)
                else
                    if (/\.html$/.test(urlCopy)) 
                        iframe.src = resolvedUrl
                    else
                        throw "Unknow url type: [" + resolvedUrl + "]"
            },
            
            
            finalizeUrl : function (iframe, resolvedUrl) {
                var ifrWindow = iframe.contentWindow
                var ifrDoc = ifrWindow.document
                var ifrHead = ifrDoc.getElementsByTagName("head")[0]
                
                if (!ifrHead) {
                    // some browsers (Webkit, Safari) do not auto-create head elements
                    ifrHead = ifrDoc.createElement("head")
                    ifrDoc.getElementsByTagName("html")[0].appendChild(ifrHead)
                }
                
                var base = ifrDoc.createElement("base")
                base.setAttribute("href", this.baseUrl)
                ifrHead.appendChild(base)

                var scriptTags = []
                
                
                if (this.preload) Joose.A.each(this.preload, function (preloadUrl) {
                    preloadUrl = this.resolveUrl(preloadUrl)
                    
                    scriptTags.push([ null, preloadUrl, null, ifrDoc ])
                }, this)
                    
                scriptTags.push([
                    'StartTest = function(testFunc, testClass) { window.parent.Test.Run.my.start(testFunc, testClass, this) }; ' +
                    '__EXCEPTION_CATCHER__ = function (func) { var ex; try { func() } catch (e) { ex = e; }; return ex; };',
                    null, 
                    null, 
                    ifrDoc
                ])
                
                scriptTags.push([ null, resolvedUrl, null, ifrDoc ])
                
                this.processScripTagQueue(ifrHead, scriptTags)
            },
            
            
            processScripTagQueue : function (ifrHead, queue) {
                if (queue.length) {
                    var params = queue.shift()
                    
                    //no text - loading via 'src'
                    if (!params[0]) {
                        var me = this
                        params[2] = function () {
                            me.processScripTagQueue(ifrHead, queue)
                        }
                    }
                    
                    ifrHead.appendChild(this.createScriptTag.apply(this, params))
                    
                    //have text - need to process further manually
                    if (params[0]) this.processScripTagQueue(ifrHead, queue)
                }
            },
            
            
            createScriptTag : function (text, url, onload, doc) {
                var node = (doc || document).createElement("script")
                
                node.setAttribute("type", "text/javascript")
                
                if (url) node.setAttribute("src", url)
                
                if (text) node.text = text
                
                if (onload) node.onload = node.onreadystatechange = function() {
                    if (!node.readyState || node.readyState == "loaded" || node.readyState == "complete" || node.readyState == 4 && node.status == 200)
                        //surely for IE6..
                        setTimeout(onload, 1)
                }
                
                return node
            }
            
        }
        
    }
    //eof my
})
//eof Test.Run.Harness.Browser



/**
 * @namespace Test.Run.Harness
 * @class Test.Run.Harness.Browser
 * @extends Test.Run.Harness
 * This class represent a harness, which is running into browser. This class provides no UI, you should use one of it subclasses, for example {@link Test.Run.Harness.Browser.Multi}
 * @singleton
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */


/**
 * @property testClass The test class which will be used for running tests, defaults is redefined to Test.Run.Test.Browser. 
 * @type {Class} 
 */


/**
 * @property title The title of the test suite 
 * @type {String} 
 */
            
            
/**
 * @property disableCaching The sign whether the harness should surpress the browser caching for each loading operation. Defaults to 'true' 
 * @type {Boolean} 
 */


/**
 * @property isIE 'true' if running under MS IE. 
 * @type {Boolean} 
 */

            
/**
 * @property baseUrl Base url of harness file. 
 * @type {String} 
 */


/**
 * @property baseHost Base host of harness file. 
 * @type {String} 
 */


/**
 * @property baseProtocol Protocol of base url. 
 * @type {String} 
 */


/**
 * @property preload The array which contain information about which files should be preloaded into each test's iframe. See also {@link #expandPreload} 
 * @type {String[]} 
 */


/**
 * This method initialize the 'iframe' and 'url' properties of test instance. It is actually an 'after' modifier.  
 * @method recordTest
 * @param {Test.Run.Test} test The test instance being recorded
 */


/**
 * This method re-runs a single test from harness. It is actually an 'after' modifier.
 * @method reRunTest
 * @param {Test.Run.Test} test The test instance being re-ran
 */



/**
 * This method preprocess the 'preload' property, with call to 'expandPreload'. It is actually a 'before' modifier.
 * @method start
 * @param {String*} url The variable number of test files urls
 */


/**
 * This method checks if the harness files is opened with 'browser' parameter in URL. If so - it applies additional Test.Run.Harness.Browser.Proven role,
 * which implements the reporting behaviour for JSAN::Prove.
 * This method also allows to specify the 'preload' property value as a string. In this case, it will be used as a parameter in call to 'setPreloadFromTaskName' method.
 * It is actually a 'before' modifier.
 * @method configure
 * @param {Object} config The configuration options
 */


/**
 * This method performs additional cleanup during removing of test (notably, removing the iframe's DOM element ). 
 * @method removeTest
 * @param {Test.Run.Test} test The test instance being removed
 */


/**
 * This method expands the global COMPONENTS specification. Each component, which starts with '+' is replaced with the corresponding components sequence.  
 * @method expandComponents
 */


/**
 * This method initialize the preloading sequence with the COMPONENTS sequence of the given name 
 * @method setPreloadFromTaskName
 * @param {String} taskName The name of components sequence
 */


/**
 * This method expands the given preloading sequence by following rules:<br>
 * 1. All entries starting with '+' are replaced with corresponding components sequences<br>
 * 2. If the component entry represent a class name (for example : Test.Run.Test) it is converting to the url, like "../lib/Test/Run/Test.js"<br>
 * 3. If the component entry ends with ".js", its supposed to be the url and is passing without modifications.<br>
 * Note, that original preloading sequnce is not modified, method returns a new array. 
 * @method expandPreload
 * @param {String[]} preload The preload sequence to expand
 * @return {String[]} expanded preload sequence
 */


/**
 * This method checks if there is parent window, and a Test.Run instance in it. If it was detected, method call is delegated to that instance in parent window.
 * This is intended to support tests in *.html files, which may accidentally include a copy of Test.Run. 
 * @method startTest
 * @param {Function} func The function, which contain test statements. The instance of test will be passed to it as 1st argument  
 * @param {Class} testClass The class which should be used for instantiation of test (defaults to value of 'testClass' property)
 * @param {Object} topScope The top scope in which this test was declared
 */


/**
 * This method returns the absolutized URL. "Absolutization" is performing against 'baseUrl' property. As an addition, if 'onlyResolve' parameter is 'false' or not passed
 * and 'disableCaching' is set to 'true', the url will be appended with 'disableCaching' parameter. 
 * @method resolveUrl
 * @param {String} url The url to resolve  
 * @param {Boolean} onlyResolve The sign, whether the url should be strictly only absolutized and not appended with disableCaching parameter
 */



/**
 * This method creates an iframe for passed url.  
 * @method processUrl
 * @param {String} url The test file url
 */


/**
 * This method is called before appending the created iframe into DOM. Its intented for overloading in custom classes and performing additional customization of the iframe.  
 * @method customizeIframe
 * @param {DOMObject} iframe The iframe being customizing
 */


/**
 * This method creates a script tag, with the given behaviour. 
 * @method createScriptTag
 * @param {String} text The textual content of the tag  
 * @param {String} url The url, which will be used as value for 'src' attribute
 * @param {Function} onload The 'onload' callback
 * @param {DOMObject} doc Optional 'document' which will be used as "element generator". Defaults to 'document' in the global scope. 
 * @return {DOMObject} Created <script> tag 
 */
