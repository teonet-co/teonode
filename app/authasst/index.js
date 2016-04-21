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
    CMD_CHECK_USER_ANSWER: 130,

    /**
     * data: {action: (add|remove), userId, group}
     * add: if group not exists it will be created
     * remove group from user
     */
    CMD_MANAGE_GROUPS: 131
};


var _ke; // right pointer to ksnetEvMgrClass


// Application welcome message
console.log("Teonode application based on teonet ver. " + teonet.version());


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
            break;

        // EV_K_DISCONNECTED #4 A peer was disconnected from host
        case teonet.ev.EV_K_DISCONNECTED:
            rd = new teonet.packetData(data);
            console.log('Peer "' + rd.from + '" disconnected'/*, arguments*/);

            break;

        // EV_K_RECEIVED #5 This host Received a data
        case teonet.ev.EV_K_RECEIVED:
            rd = new teonet.packetData(data);

            // Command
            switch (rd.cmd) {
                case teoApi.CMD_CHECK_USER:
                    let from = rd.from; // using rd in callback throw Segmentation fault
                    //let _rd = rd;
                    db.checkUser(rd.data, function (err, _data) {
                        if (err) {
                            logger.error(err, 'CMD_CHECK_USER');
                            console.log('CMD_CHECK_USER', err);
                            teonet.sendCmdTo(_ke, from, teoApi.CMD_CHECK_USER_ANSWER, JSON.stringify({error: err.message}));
                            return;
                        }

                        if (_data) {
//                            if(rd.l0_f)
//                                teonet.ksnLNullSendToL0(_ke,
//                                    rd.addr, rd.port, from, teoApi.CMD_CHECK_USER_ANSWER,
//                                    JSON.stringify(_data));
//                            else
//                                teonet.sendCmdTo(_ke, from, teoApi.CMD_CHECK_USER_ANSWER, JSON.stringify(_data));
                            teonet.sendCmdAnswerTo(_ke, rd, teoApi.CMD_CHECK_USER_ANSWER, JSON.stringify(_data));
                        } else {
                            teonet.sendCmdTo(_ke, from, teoApi.CMD_CHECK_USER_ANSWER, null);
                        }
                    });
                    break;

                case teoApi.CMD_MANAGE_GROUPS:
                    let from = rd.from;
                    if (rd.data.action === 'add') {
                        db.addGroup(rd.data.userId, rd.data.group, function (err) {
                            if (err) {
                                logger.error(err, 'CMD_MANAGE_GROUPS:' + JSON.stringify(rd.data));
                                console.log('CMD_MANAGE_GROUPS', err, rd.data);
                            }
                        });
                    } else if (rd.data.action === 'remove') {
                        db.removeGroup(rd.data.userId, rd.data.group, function (err) {
                            if (err) {
                                logger.error(err, 'CMD_MANAGE_GROUPS:' + JSON.stringify(rd.data));
                                console.log('CMD_MANAGE_GROUPS', err, rd.data);
                            }
                        });
                    }
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


teonet.start('teo-node,teo-auth', '0.0.6', 3, 5, teoEventCb);


/***
 * todo
 * работа с группами: cmd: 131; data: {userId, action: (add|remove), name}
 */