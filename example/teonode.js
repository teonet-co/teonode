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
var teonet = require('../teonet');

// Application welcome message
console.log("Teonode ver. 0.0.1, based on teonet ver. " + teonet.version());

// Start teonet module
teo_main();

/**
 * This application API commands
 */
var teo_api = {

    CMD_N_HELLO: 129,          ///< @param {'uint8'} CMD_N_HELLO Request Hello message
    CMD_N_HELLO_ANSWER: 130    ///< @param {'uint8'} CMD_N_HELLO_ANSWER Answer to CMD_N_HELLO command 
};

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
function teo_eventCb(ke, ev, data, data_len, user_data) {
    let rd;
    
    switch (ev) {

        // EV_K_STARTED #0 Calls immediately after event manager starts
        case teonet.ev.EV_K_STARTED:

            console.log('Teonode started .... ');
            break;

        // EV_K_TIMER #9 Timer event, seted by ksnetEvMgrSetCustomTimer   
        case teonet.ev.EV_K_TIMER:

            // Send CMD_ECHO command to peer with name "teo-web"            
            // teonet.sendCmdTo(ke, 'teo-web', 65, 'hello');
            teonet.sendCmdEchoTo(ke, 'teo-web', 'hello');

            break;

        // EV_K_CONNECTED #3 New peer connected to host event
        case teonet.ev.EV_K_CONNECTED:

            rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" connected'/*, arguments*/);

            // Send HELLO command to connected peer 'teo-node-2'     
            if (rd.from === 'teo-node-2') {
                teonet.sendCmdAnswerTo(ke, rd, teo_api.CMD_N_HELLO, null);
            }

            break;

        // EV_K_DISCONNECTED #4 A peer was disconnected from host
        case teonet.ev.EV_K_DISCONNECTED:

            //rd = new teonet.packetData(data);            
            console.log('Peer "' + teonet.packetData(data).from/*rd.from*/ +
                '" disconnected'/*, arguments*/);
            break;

        // EV_K_RECEIVED #5 This host Received a data    
        case teonet.ev.EV_K_RECEIVED:

            // DATA event
            rd = new teonet.packetData(data);
            console.log('Received a data: ' + rd.data_len +
                ' bytes length, cmd: ' + rd.cmd, rd);

            // Command    
            switch (rd.cmd) {

                case teo_api.CMD_N_HELLO:

                    var data_out = "Hello";
                    console.log('Send CMD_N_HELLO:', data_out, 'to', rd.from);
                    teonet.sendCmdAnswerTo(ke, rd, teo_api.CMD_N_HELLO_ANSWER, data_out);
                    break;

                case teo_api.CMD_N_HELLO_ANSWER:
                    console.log('Got CMD_N_HELLO_ANSWER:', rd.data, 'from:', rd.from);
                    break;

                default:
                    break;
            }
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
function teo_main() {

    // Initialize teonet event manager and Read configuration
    var ke = teonet.init(teo_eventCb, 3);

    // Set application type
    teonet.setAppType(ke, "teo-node");

    // Start Timer event 
    teonet.setCustomTimer(ke, 5.000);

    // Start teonet
    teonet.run(ke);

    // Show exit message
    console.log("Teonode application initialization finished ...");
}
