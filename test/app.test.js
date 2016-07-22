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

// Declare Teonet
var teonet = require('../teonet/teonet');
var should = require('should'); // http://shouldjs.github.io/

// Test function teoGetLibteonetVersion 
it('teoGetLibteonetVersion', function () {
    
    console.log('teoGetLibteonetVersion');
    
    console.time('t1');
    var output = teonet.lib.teoGetLibteonetVersion();
    output.should.be.aboveOrEqual('0.1.31');
    console.timeEnd('t1');

    console.time('t2');
    var output1 = teonet.lib.teoGetLibteonetVersion();
    console.timeEnd('t2');

    console.time('t3');
    var output2 = teonet.lib.teoGetLibteonetVersion();
    console.timeEnd('t3');

    console.log('Libteonet Version: ' + output);
});

// Test ...
//it('', function(){
//    
//});
