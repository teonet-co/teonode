/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global process */

// Declare Teonet
var libteonet = require('./teonet');
var ffi = require('ffi');

console.log("Teonode ver. 0.0.1, based on teonet ver ", libteonet.teoGetLibteonetVersion());

//void roomEventCb(ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data,
//              size_t data_len, void *user_data)

// note: https://github.com/node-ffi/node-ffi/issues/72
var eventCb = function (ke, ev, data, data_len, user_data) {
    
    switch(ev) {
        
        // EV_K_STARTED 
        case 0:            
            console.log('Teonode started ....');
            console.log('Event EV_K_STARTED processing, arguments: ', arguments);
            break;
            
        // EV_K_TIMER    
        case 9:
            console.log('Timer ....');
            break;
            
        // EV_K_CONNECTED
        case 3:
            console.log('Peer ' + data.toString() + " connected", arguments);
            break;
    }
};
var eventCb_ptr = ffi.Callback('void', ['pointer', 'int', 'pointer', 'int', 'pointer'], eventCb);

var ke = libteonet.ksnetEvMgrInit(process.argv.length-1, Array.from(process.argv).slice(1), eventCb_ptr, 3);

libteonet.ksnetEvMgrSetCustomTimer(ke, 2.00);

libteonet.ksnetEvMgrRun(ke);
