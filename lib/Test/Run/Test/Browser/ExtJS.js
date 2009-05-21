Class('Test.Run.Test.Browser.ExtJS', {
    
    isa : Test.Run.Test.Browser,
    
    have : {
        testRecord : null,
        
        assertionGrid : null
    }
    
})
//eof Test.Run.Test.Browser.ExtJS


/**
 * @namespace Test.Run.Test.Browser
 * @class Test.Run.Test.Browser.ExtJS
 * @extends Test.Run.Test.Browser
 * This class represent a test file, which is supposed to be executed in browser, and under the Test.Run.Harness.Browser.Multi harness
 * @author Nickolay (SamuraiJack) Platonov 
 * @version 0.01
 */


/**
 * @property testRecord The record, which contain information about current test 
 * @type {Ext.data.Record}
 */


/**
 * @property assertionGrid The ExtJS grid, which contain the presentation of results queue
 * @type {Ext.grid.GridPanel}
 */
