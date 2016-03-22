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


const teonet = require('../../teonet');
const logger = teonet.syslog('authasst', module.filename);
const db = require('./db');

/**
 * This application API commands
 */
const teoApi = {
    CMD_CHECK_USER: 129, // accessToken in data

    /**
     * Answers:
     * found - json
     * not found - empty string (length 0)
     * error - json with property error
     */
    CMD_CHECK_USER_ANSWER: 130
};


var _ke; // right pointer to ksnetEvMgrClass


// Application welcome message
console.log("Teonode application based on teonet ver. " + teonet.version());

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

        // EV_K_CONNECTED #3 New peer connected to host event
        case teonet.ev.EV_K_CONNECTED:
            rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" connected');
            break;

        // EV_K_DISCONNECTED #4 A peer was disconnected from host
        case teonet.ev.EV_K_DISCONNECTED:
            rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" disconnected'/*, arguments*/);

            break;

        // EV_K_RECEIVED #5 This host Received a data
        case teonet.ev.EV_K_RECEIVED:
            rd = new teonet.packetData(data);

            console.log('rd.cmd:' + rd.cmd, '; rd.from: ' + rd.from, '; data: ' + rd.data);
            // Command
            switch (rd.cmd) {
                case teoApi.CMD_CHECK_USER:

                    let from = rd.from; // using rd in callback throw Segmentation fault
                    db.checkUser(rd.data, function (err, _data) {
                        if (err) {
                            logger.error(err, 'CMD_CHECK_USER');
                            console.log('CMD_CHECK_USER', err);
                            teonet.sendCmdTo(_ke, from, teoApi.CMD_CHECK_USER_ANSWER, JSON.stringify({error: err.message}));
                            return;
                        }

                        if (_data) {
                            teonet.sendCmdTo(_ke, from, teoApi.CMD_CHECK_USER_ANSWER, JSON.stringify(_data));
                        } else {
                            teonet.sendCmdTo(_ke, from, teoApi.CMD_CHECK_USER_ANSWER, null);
                        }
                    });
                    break;
                default:
                    break;
            }
            break;

        case teonet.ev.EV_K_USER:
            break;
        case teonet.ev.EV_K_STOPPED:
            console.log('EV_K_STOPPED');
            db.pool.end();
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