'use strict';


const teonet = require('../../teonet');
const logger = teonet.syslog('authasst', module.filename);
const db = require('./db');

/**
 * This application API commands
 */
const teoApi = {
    /**
     * data: 'accessToken'
     */
    CMD_CHECK_USER: 129,

    /**
     * Answers:
     * found - {accessToken, data}
     * not found - {accessToken, data: null}
     * error - {accessToken, error}
     */
    CMD_CHECK_USER_ANSWER: 96, //130,

    /**
     * data: {action: (add|remove), userId, group}
     * add: if group not exists it will be created
     * remove group from user
     */
    CMD_MANAGE_GROUPS: 131,

    /**
     * data: ['userId1', 'userId2', ...]
     */
    CMD_USER_INFO: 132,

    /**
     * found - [{userId, username}, ...]
     * not found - null
     * error - {error}
     */
    CMD_USER_INFO_ANSWER: 133,

    /**
     * data: ['clientId1', 'clientId2', ...]
     */
    CMD_CLIENT_INFO: 134,

    /**
     * found - [{clientId, registerDate, data: {}}, ...]
     * not found - null
     * error - {error}
     */
    CMD_CLIENT_INFO_ANSWER: 135
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
            // use copy of rd object in callbacks, because rd object 
            // automatically free after use (after return) and there is 
            // segmentation fault error in callbacks if we use direct rd
            let _rd = teonet.cloneObject(rd);

            // Command
            switch (_rd.cmd) {
                case teoApi.CMD_CHECK_USER:
                    db.checkUser(_rd.data, function (err, _data) {
                        if (err) {
                            logger.error(err, 'CMD_CHECK_USER');
                            console.log('CMD_CHECK_USER', err);
                            teonet.sendCmdAnswerTo(_ke, _rd, teoApi.CMD_CHECK_USER_ANSWER, JSON.stringify({
                                accessToken: _rd.data,
                                error: err.message
                            }));
                            return;
                        }

                        teonet.sendCmdAnswerTo(_ke, _rd, teoApi.CMD_CHECK_USER_ANSWER, JSON.stringify({
                            accessToken: _rd.data,
                            data: _data
                        }));
                    });
                    break;

                case teoApi.CMD_MANAGE_GROUPS:
                    _rd.data = JSON.parse(_rd.data);
                    if (rd.data.action === 'add') {
                        db.addGroup(_rd.data.userId, _rd.data.group, function (err) {
                            if (err) {
                                logger.error(err, 'CMD_MANAGE_GROUPS:' + JSON.stringify(_rd.data));
                                console.log('CMD_MANAGE_GROUPS', err, _rd.data);
                            }
                        });
                    } else if (_rd.data.action === 'remove') {
                        db.removeGroup(_rd.data.userId, _rd.data.group, function (err) {
                            if (err) {
                                logger.error(err, 'CMD_MANAGE_GROUPS:' + JSON.stringify(_rd.data));
                                console.log('CMD_MANAGE_GROUPS', err, _rd.data);
                            }
                        });
                    }
                    break;

                case teoApi.CMD_USER_INFO:
                    _rd.data = JSON.parse(_rd.data);
                    db.getUserInfo(_rd.data, function (err, _data) {
                        if (err) {
                            logger.error(err, 'CMD_USER_INFO');
                            console.log('CMD_USER_INFO', err);
                            teonet.sendCmdAnswerTo(_ke, _rd, teoApi.CMD_USER_INFO_ANSWER, JSON.stringify({error: err.message}));
                            return;
                        }

                        teonet.sendCmdAnswerTo(_ke, _rd, teoApi.CMD_USER_INFO_ANSWER, _data ? JSON.stringify(_data) : null);
                    });
                    break;

                case teoApi.CMD_CLIENT_INFO:
                    _rd.data = JSON.parse(_rd.data);
                    db.getClientInfo(_rd.data, function (err, _data) {
                        if (err) {
                            logger.error(err, 'CMD_CLIENT_INFO');
                            console.log('CMD_CLIENT_INFO', err);
                            teonet.sendCmdAnswerTo(_ke, _rd, teoApi.CMD_CLIENT_INFO_ANSWER, JSON.stringify({error: err.message}));
                            return;
                        }

                        teonet.sendCmdAnswerTo(_ke, _rd, teoApi.CMD_CLIENT_INFO_ANSWER, _data ? JSON.stringify(_data) : null);
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


teonet.start('teo-node,teo-auth', '0.0.10', 3, 5, teoEventCb);
