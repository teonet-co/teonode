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
var Table = require('cli-table');
var teonet = require('../../teonet');


/**
 * This application API commands
 */
var teoApi = {
    CMD_RESET: 8, // Reset command, data: byte or char 0 - soft reset; 1 - hard reset

    PEERS: 72,              ///< #72 Get peers
    PEERS_ANSWER: 73,       ///< #73 Get peers answer

    CMD_HOST_INFO: 90,          ///< #90 Request host info
    CMD_HOST_INFO_ANSWER: 91,   ///< #91 Host info amswer
    CMD_N_HELLO: 129,          ///< @param {'uint8'} CMD_N_HELLO Request Hello message
    CMD_N_HELLO_ANSWER: 130,    ///< @param {'uint8'} CMD_N_HELLO_ANSWER Answer to CMD_N_HELLO command
    CMD_ECHO_ANSWER: 66,

    //CMD_D_SET: 129, //Set data request: TYPE_OF_REQUEST: { namespace, key, data, data_len } }
    //CMD_D_GET: 130, //Get data request: TYPE_OF_REQUEST: { namespace, key, ID } }
    //CMD_D_LIST: 131, // List request: TYPE_OF_REQUEST: { ID, namespace } }
    //CMD_D_GET_ANSWER: 132, //Get data response: { namespace, key, data, data_len, ID } }
    //CMD_D_LIST_ANSWER: 133 // [ key, key, ... ]
};


var peerStates = {
    ONLINE: 0,
    OFFLINE: 1
};
makeEnum(peerStates);

var appStates = {
    STATE_NONE: 0,
    STATE_WAIT_KEY: 1,
    STATE_WAIT_STRING: 2
};
makeEnum(appStates);


var appState = appStates.STATE_NONE;

var _ke; // right pointer to ksnetEvMgrClass
var peers = {};//Object.create(null);
var lastCommand = null;
var printIntervalId = null;
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

            var rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" connected');

            peers[rd.from] = peers[rd.from] || {};
            peers[rd.from].status = peerStates.ONLINE;
            peers[rd.from].echoCount = 0; // echo count for connected peer


            teonet.sendCmdAnswerTo(ke, rd, teoApi.CMD_HOST_INFO, 'JSON', 4);
            teonet.sendCmdAnswerTo(ke, rd, teoApi.PEERS, 'JSON', 4);

            break;

        // EV_K_DISCONNECTED #4 A peer was disconnected from host
        case teonet.ev.EV_K_DISCONNECTED:

            var rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" disconnected'/*, arguments*/);

            peers[rd.from].status = peerStates.OFFLINE;


            break;

        // EV_K_RECEIVED #5 This host Received a data    
        case teonet.ev.EV_K_RECEIVED:

            // DATA event
            var rd = new teonet.packetData(data);

            // Command    
            switch (rd.cmd) {

                case teoApi.CMD_N_HELLO:
                    var data_out = "Hello";
                    console.log('Send CMD_N_HELLO:', data_out, 'to', rd.from);
                    teonet.sendCmdAnswerTo(ke, rd, teoApi.CMD_N_HELLO_ANSWER, data_out, data_out.length);
                    break;

                case teoApi.CMD_N_HELLO_ANSWER:
                    console.log('Got CMD_N_HELLO_ANSWER:', rd.data, 'from:', rd.from);
                    break;

                case teoApi.CMD_HOST_INFO_ANSWER:
                    console.log('Got CMD_HOST_INFO_ANSWER:', rd.data, 'from:', rd.from);
                    peers[rd.from].hostInfo = JSON.parse(rd.data);
                    break;

                case teoApi.CMD_ECHO_ANSWER:
                    peers[rd.from].echoCount = 0;
                    break;

                case teoApi.PEERS_ANSWER:
                    console.log('Got PEERS_ANSWER:', rd, 'from:', rd.from); // TODO rd.data не разбирается
                    break;

                default:
                    break;
            }
            break;

//        case teonet.ev.EV_K_HOTKEY:
//
//            //check hotkeys
//            if (appState === appStates.STATE_WAIT_KEY) {
//
//                //ASCII
//                var keyCode = ref.get(data, 0, ref.types.int32);
//                var command = String.fromCharCode(keyCode);
//
//
//                switch (command) {
//                    // exit
//                    case '0':
//                        appState = appStates.STATE_NONE;
//                        lastCommand = null;
//                        break;
//                    case '1':
//                        printPeers(peers, false);
//
//                        console.log('Press %d to start continuously refresh', command);
//                        lastCommand = command;
//                        break;
//                    default:
//                        console.log("Wrong key pressed... \nPress a or h to help, or 0 to exit this menu.");
//                        appState = appStates.STATE_NONE;
//                        lastCommand = null;
//                        break;
//                }
//
//                // Show prompt
//                if (appState == appStates.STATE_WAIT_KEY) {
//                    process.stdout.write('> ');
//                }
//            }
//
//            break;
//
//        case teonet.ev.EV_K_USER:
//            console.log("\n" +
//                "Test menu:\n" +
//                "  1 - print peers\n" +
//                "  0 - exit\n" +
//                "> "
//            );
//
//            appState = appStates.STATE_WAIT_KEY;
//            break;

        case teonet.ev.EV_K_USER:
            printPeers(peers, false);
            //if (printIntervalId) {
            //    clearInterval(printIntervalId);
            //    printIntervalId = null;
            //} else {
            //    printPeers(peers, false);
            //    printIntervalId = setInterval(function () {
            //        printPeers(peers, true);
            //    }, 250);
            //}

            break;
        case teonet.ev.EV_K_STOPPED:
            clearInterval(pingIntervalId);
            clearInterval(printIntervalId);
            break;
        default:
            break
    }
}

// ping peers
let pingIntervalId = setInterval(() => {
    if (!_ke || !peers) {
        return;
    }

    var onlineCnt = 0;
    var deadCnt = 0;
    for (let name in peers) {
        if (peers[name].status !== peerStates.ONLINE) {
            continue;
        }

        onlineCnt++;
        // TODO add read/write to DB


        // soft reset after 5 seconds (5 missed pings) and hard reset after 10
        if (peers[name].echoCount >= 5 && peers[name].echoCount < 10) {
            // send soft reset
            //teonet.sendCmdTo(_ke, name, teoApi.CMD_RESET, null, 0); //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //console.log('SOFT RESET', name, peers[name].echoCount);
        } else if (peers[name].echoCount >= 10) {
            // send hard reset
            //teonet.sendCmdTo(_ke, name, teoApi.CMD_RESET, '1', 1); //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //console.log('HARD RESET', name, peers[name].echoCount);
        }
        //ALL DEAD (1), RESTART ITSELF
        // ALL(1) DEAD , RESTART ITSELF

        if (peers[name].echoCount >= 15) {
            deadCnt++;
        }

        //teonet.sendCmdEchoTo(_ke, name, 'ping', 4); //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        peers[name].echoCount = (peers[name].echoCount || 0 ) + 1;
    }

    if (onlineCnt === deadCnt) {
        console.log('ALL DEAD (%d), RESTART ITSELF', deadCnt);

    }
}, 1000);


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

    // Start Timer event 
    teonet.setCustomTimer(ke, 5.000);

    // Start teonet
    teonet.run(ke);

    // Show exit message
    console.log("Teonode application initialization finished ...");
}


function makeEnum(obj) {
    for (let name in obj) {
        obj[obj[name]] = name;
    }
}

function printPeers(peers, rewrite) {
    let peersForPrint = new Table({head: ["#", "Name", "Status", "Type", "Core", "Echo count"]});
    let cnt = 0;
    for (let name in peers) {
        cnt++;
        peersForPrint.push([
            cnt,
            name,
            peerStates[peers[name].status],
            peers[name].hostInfo && peers[name].hostInfo.type,
            peers[name].hostInfo && peers[name].hostInfo.version,
            peers[name].echoCount
        ]);
    }

    if (rewrite) {
        let lenCnt = 2 * cnt + 3;

        // https://github.com/cronvel/terminal-kit/blob/5dbfcd8f0de0ab3a9631ce472c147f9768c2fc3a/lib/termconfig/xterm.js
        process.stdout.write('\x1b[' + lenCnt + 'A');

        for (let i = 0; i < lenCnt; i++) {
            process.stdout.write('\r\n');
        }

        process.stdout.write('\x1b[' + lenCnt + 'A');
    }

    try {
        console.log(peersForPrint.toString());
    } catch (ex) {
    }
}