'use strict';

/**
 * Declare Teonet library module
 * @type Module teonet|Module teonet
 */
var teonet = require('../teonet/teonet');


/**
 * This application API commands
 */
var teoApi = {
    CMD_RESET: 8, // Reset command, data: byte or char 0 - soft reset; 1 - hard reset
    CMD_ECHO_ANSWER: 66,

    CMD_PEERS: 72, // Get peers
    CMD_PEERS_ANSWER: 73 // Get peers answer
};


var _ke; // right pointer to ksnetEvMgrClass
var peers = Object.create(null);


// Application welcome message
console.log("Teonode ver. 0.0.1, based on teonet ver. " + teonet.version());

// Start teonet module
teoMain();

/**
 * Teonet event callback
 *
 * Original C function parameters:
 * void roomEventCb(ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data, size_t data_len, void *user_data)
 *
 * @param {pointer} ke Pointer to ksnetEvMgrClass, see the http://repo.ksproject.org/docs/teonet/structksnetEvMgrClass.html
 * @param {int} ev Teonet event number, see the http://repo.ksproject.org/docs/teonet/ev__mgr_8h.html#ad7b9bff24cb809ad64c305b3ec3a21fe
 * @param {pointer} data Binary or string (depended on event) data
 * @param {int} data_len Data length
 * @param {pointer} user_data Additional poiner to User data
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

            teonet.sendCmdTo(_ke, rd.from, teoApi.CMD_PEERS, 'JSON');

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

                case teoApi.CMD_PEERS_ANSWER:
                    console.log('Got CMD_PEERS_ANSWER:', rd, 'from:', rd.from);
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
            clearInterval(getPeersTablesIntervalId);
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
            teonet.sendCmdTo(_ke, name, teoApi.CMD_RESET, null);
            console.log('SOFT RESET', name, peers[name]);
        } else if (peers[name] >= 10) {
            // send hard reset
            teonet.sendCmdTo(_ke, name, teoApi.CMD_RESET, '1');
            console.log('HARD RESET', name, peers[name]);
        }


        if (peers[name] >= 15) {
            deadCnt++;
        }

        teonet.sendCmdEchoTo(_ke, name, null);
        peers[name] = (peers[name] || 0 ) + 1;
    }

    if (cnt > 0 && cnt === deadCnt) {
        console.log('ALL DEAD (%d), RESTART YOURSELF', deadCnt);
        process.kill(process.pid, 'SIGUSR2'); // kill yourself
    }
}, 1000);


let getPeersTablesIntervalId = setInterval(() => {
    //for (let name in peers) {
    //    teonet.sendCmdTo(_ke, name, teoApi.CMD_PEERS, null);
    //}
});


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