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

/* global process */

// Declare Teonet library
var teonet = require('./teonet');
//var ref = require('ref');

// Application welcome message
console.log("Teonode ver. 0.0.1, based on teonet ver ", teonet.lib.teoGetLibteonetVersion());


/**
 * Teonet event callback
 * 
 * Original C function parameters:
 * 
 * void roomEventCb(ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data,
 *              size_t data_len, void *user_data)
 *
 * note: https://github.com/node-ffi/node-ffi/issues/72
 * 
 * @param {pointer} ke Pointer to ksnetEvMgrClass, see the http://repo.ksproject.org/docs/teonet/structksnetEvMgrClass.html
 * @param {int} ev Teonet event number, see the http://repo.ksproject.org/docs/teonet/ev__mgr_8h.html#ad7b9bff24cb809ad64c305b3ec3a21fe
 * @param {pointer} data Binary or string (depended on event) data
 * @param {int} data_len Data length
 * @param {pointer} user_data Additional poiner to User data
 * 
 * @returns {void}
 */
var eventCb = function (ke, ev, data, data_len, user_data) {
    
    switch(ev) {
        
        // EV_K_STARTED 
        case 0:            
            console.log('Teonode started ....');
            //console.log('Event EV_K_STARTED processing, arguments: ', arguments);
            break;
            
        // EV_K_TIMER    
        case 9:
            console.log('Timer ....' + teonet.lib.ksnetEvMgrGetTime(ke).toFixed(3));
            break;
            
        // EV_K_CONNECTED
        case 3:
            var rd = new teonet.ksnCorePacketData(data);
            
            console.log('Peer "' + rd.from + '" connected'/*, arguments*/);
            break;
    }
};

// Initialize teonet event manager and Read configuration
var ke = teonet.ksnetEvMgrInit(eventCb);

// Set application type
teonet.lib.teoSetAppType(ke, "teo-node");

// Start Timer event 
teonet.lib.ksnetEvMgrSetCustomTimer(ke, 5.00);

// Start teonet
teonet.lib.ksnetEvMgrRun(ke);

// Show exit message
console.log("Teonode exited...");
