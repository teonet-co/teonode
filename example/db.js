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

'use strict';

/**
 * Declare Teonet library module
 * @type Module teonet|Module teonet
 */

var ref = require('ref');
var teonet = require('./../teonet');


/**
 * This application API commands
 */
var teoApi = {
    CMD_D_SET: 129, //Set data request: TYPE_OF_REQUEST: { namespace, key, data, data_len } }
    CMD_D_GET: 130, //Get data request: TYPE_OF_REQUEST: { namespace, key, ID } }
    CMD_D_LIST: 131, // List request: TYPE_OF_REQUEST: { ID, namespace } }
    CMD_D_GET_ANSWER: 132, //Get data response: { namespace, key, data, data_len, ID } }
    CMD_D_LIST_ANSWER: 133 // [ key, key, ... ]
};


var _ke; // right pointer to ksnetEvMgrClass
var db = "teo-db";    // Teo DB-Server


// Application welcome message
console.log("Teonode ver. 0.0.1, based on teonet ver. " + teonet.version());

// Start teonet module
teoMain();

/**
 * Teonet event callback
 *
 * Original C function parameters:
 *
 * void roomEventCb(ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data,
 *              size_t data_len, void *user_data)
 *
 * *note: https://github.com/node-ffi/node-ffi/issues/72
 *
 * @param {pointer} ke Pointer to ksnetEvMgrClass,
 *     see the http://repo.ksproject.org/docs/teonet/structksnetEvMgrClass.html
 * @param {int} ev Teonet event number,
 *     see the http://repo.ksproject.org/docs/teonet/ev__mgr_8h.html#ad7b9bff24cb809ad64c305b3ec3a21fe
 * @param {pointer} data Binary or string (depended on event) data
 * @param {int} data_len Data length
 * @param {pointer} user_data Additional poiner to User data
 *
 * @returns {void}
 */
function teoEventCb(ke, ev, data, data_len, user_data) {
    let rd;

    switch (ev) {

        // EV_K_STARTED #0 Calls immediately after event manager starts
        case teonet.ev.EV_K_STARTED:
            _ke = ke;
            console.log('Teonode started .... ');


            break;

        // EV_K_TIMER #9 Timer event, seted by ksnetEvMgrSetCustomTimer   
        case teonet.ev.EV_K_TIMER:

            break;

        // EV_K_CONNECTED #3 New peer connected to host event
        case teonet.ev.EV_K_CONNECTED:


            rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" connected');

            if (rd.from === db) {
                console.log('CMD_D_SET');
                let a = 'JSON: ' + JSON.stringify({namespace: 'namespace1', key: 'a.a.', data: 'hello', data_len: 5});
                teonet.sendCmdTo(_ke, db, teoApi.CMD_D_SET, a);

                setTimeout(()=> {
                    console.log('CMD_D_LIST');

                    let a = 'JSON: ' + JSON.stringify({ID: '*', namespace: 'namespace1'});
                    teonet.sendCmdTo(_ke, db, teoApi.CMD_D_LIST, a);
                }, 100);
            }

            break;

        // EV_K_DISCONNECTED #4 A peer was disconnected from host
        case teonet.ev.EV_K_DISCONNECTED:

            rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" disconnected'/*, arguments*/);


            break;

        // EV_K_RECEIVED #5 This host Received a data    
        case teonet.ev.EV_K_RECEIVED:

            // DATA event
            rd = new teonet.packetData(data);

            // Command    
            switch (rd.cmd) {


                case teoApi.CMD_D_LIST_ANSWER:
                    console.log('Got CMD_D_LIST_ANSWER:', rd.data, 'from:', rd.from);

                    let a = 'JSON: ' + JSON.stringify({ID: '*', namespace: 'namespace1', key: 'a.a.'});
                    teonet.sendCmdTo(_ke, db, teoApi.CMD_D_GET, a);

                    break;

                case teoApi.CMD_D_GET_ANSWER:
                    console.log('Got CMD_D_GET_ANSWER:', rd.data, 'from:', rd.from);

                    break;
                default:
                    break;
            }
            break;

        case teonet.ev.EV_K_USER:
            break;
        case teonet.ev.EV_K_STOPPED:
            break;
        default:
            break;
    }
}



/**
 * Initialize and start Teonet
 *
 * @returns {undefined}
 */
function teoMain() {

    // Initialize teonet event manager and Read configuration
    var ke = teonet.init(teoEventCb, 3);

    // Set application type
    teonet.setAppType(ke, "teo-node");

    // Set application version
    teonet.setAppVersion(ke, '0.0.1');

    // Start Timer event 
    teonet.setCustomTimer(ke, 5.000);

    // Start teonet
    teonet.run(ke);

    // Show exit message
    console.log("Teonode application initialization finished ...");
}