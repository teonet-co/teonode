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
const logger = teonet.syslog('watch', module.filename);

/**
 * This application API commands
 */
const teoApi = {
    CMD_ECHO_ANSWER: 66
};


var _ke; // right pointer to ksnetEvMgrClass
var peers = Object.create(null);


// Application welcome message
console.log("Teonode ver. 0.0.1, based on teonet ver. " + teonet.version());


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
            peers[rd.from] = 0;
            break;

        // EV_K_DISCONNECTED #4 A peer was disconnected from host
        case teonet.ev.EV_K_DISCONNECTED:
            rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" disconnected'/*, arguments*/);

            delete peers[rd.from];
            break;

        // EV_K_RECEIVED #5 This host Received a data    
        case teonet.ev.EV_K_RECEIVED:
            rd = new teonet.packetData(data);

            // Command    
            switch (rd.cmd) {
                case teoApi.CMD_ECHO_ANSWER:
                    peers[rd.from] = 0;
                    break;

                default:
                    break;
            }
            break;

        case teonet.ev.EV_K_USER:
            console.log('--------------------------------------------------------------------');
            for (let name in peers) {
                console.log('%s: %d', name, peers[name]);
            }

            break;

        case teonet.ev.EV_K_STOPPED:
            clearInterval(pingIntervalId);
            break;
        default:
            break;
    }
}

// ping peers
let pingIntervalId = setInterval(() => {
    if (!_ke || !peers) {
        return;
    }

    var cnt = 0;
    var deadCnt = 0;
    for (let name in peers) {
        cnt++;

        // soft reset after 5 seconds (5 missed pings) and hard reset after 10
        if (peers[name] >= 5 && peers[name] < 10) {
            // send soft reset
            teonet.sendCmdTo(_ke, name, teonet.ev.CMD_RESET, null);
            logger.message('SOFT RESET ' + name + ' ' + peers[name]);
            console.log('SOFT RESET', name, peers[name]);
        } else if (peers[name] >= 10) {
            // send hard reset
            teonet.sendCmdTo(_ke, name, teonet.ev.CMD_RESET, '1');
            logger.message('HARD RESET ' + name + ' ' + peers[name]);
            console.log('HARD RESET', name, peers[name]);
            peers[name] = 0;
        }


        if (peers[name] >= 15) {
            deadCnt++;
        }

        teonet.sendCmdEchoTo(_ke, name, null);
        peers[name] = (peers[name] || 0 ) + 1;
    }

    if (cnt > 0 && cnt === deadCnt) {
        logger.message('ALL DEAD (' + deadCnt + '), RESTART YOURSELF');
        console.log('ALL DEAD (%d), RESTART YOURSELF', deadCnt);
        process.kill(process.pid, 'SIGUSR2'); // kill yourself
    }
}, 1000);


teonet.start('teo-node', '0.1.2', 3, 5, teoEventCb);