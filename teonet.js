/* 
 * The MIT License
 *
 * Copyright 2016 Kirill Scherba <kirill@scherba.ru>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var ref = require('ref');
var ffi = require('ffi');
var ArrayType = require('ref-array');
var StringArray = ArrayType('string');


//module.exports = ffi.Library('/home/kirill/Projects/teonet/src/.libs/libteonet', {
module.exports =  { 
    
   lib: ffi.Library('libteonet', {
    'teoGetLibteonetVersion': [ 'string', [ ] ],
    'ksnetEvMgrInit': [ 'pointer', [ 'int', StringArray, 'pointer', 'int' ] ],
    'ksnetEvMgrRun': [ 'int', [ 'pointer' ] ],
    'ksnetEvMgrSetCustomTimer': [ 'void', [ 'pointer', 'double' ] ],
    'teoSetAppType': [ 'void' , [ 'pointer', 'string' ] ]
    }), 
  
    eventCbPtr: function(eventCb) {
      return ffi.Callback('void', ['pointer', 'int', 'pointer', 'int', 'pointer'], eventCb);
    },
    
    ksnetEvMgrInit: function(eventCb) {
        return this.lib.ksnetEvMgrInit(process.argv.length-1, Array.from(process.argv).slice(1), this.eventCbPtr(eventCb), 3);
    }
  };


// ksnetEvMgrSetCustomTimer(ke, 2.00);

/*
 // Start teonet
 ksnetEvMgrRun(ke); 


 ksnetEvMgrClass *ke = ksnetEvMgrInit(argc, argv, NULL, 3); 
  
 
 ksnetEvMgrClass *ksnetEvMgrInit(
    int argc, 
    char** argv,
    void (*event_cb)(ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data, size_t data_len, void *user_data),
    int options
);
  
  
ksnetEvMgrClass *ksnetEvMgrInit(
    int argc, char** argv,
    void (*event_cb)(ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data, size_t data_len, void *user_data),
    int options
);
*/