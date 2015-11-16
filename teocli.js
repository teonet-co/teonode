/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Teonet client class
 *
 * @param {Object} ws Websocket connection
 * @constructor
 */
function Teocli(ws) {

    var teocli = this;
    teocli.ws = ws;

    teocli.ws.onopen = function (ev) {
        console.log("ws.onopen");
        teocli.onopen(ev);
    };
    teocli.ws.onerror = function (ev) {
        teocli.onerror(ev);
    };
    teocli.ws.onclose = function (ev) {
        teocli.onclose(ev);
    };
    teocli.ws.onmessage = function (ev) {
        teocli.onmessage(ev);
    };
}


/**
 * Send login command to L0 server
 *
 * @param {type} client_name Name of this client
 * @returns {undefined}
 */
Teocli.prototype.login = function (client_name) {
    this.ws.send('{ "cmd": 0, "to": "", "data": "' + client_name + '" }');
};

/**
 * Send peers request command to peer
 *
 * @param {type} to Peer name to send to
 * @returns {undefined}
 */
Teocli.prototype.peers = function (to) {
    this.ws.send('{ "cmd": 72, "to": "' + to + '", "data": "" }');
};

/**
 * Send peers answer request command to peer
 *
 * @param {type} to Peer name to send to
 * @returns {undefined}
 */
Teocli.prototype.peersAnswer = function (to) {
    this.ws.send('{ "cmd": 73, "to": "' + to + '", "data": "" }');
};

/**
 * Send echo command to peer
 *
 * @param {type} to Peer name to send to
 * @param {type} msg Text message to send to peer
 * @returns {undefined}
 */
Teocli.prototype.echo = function (to, msg) {

    var d = new Date();
    var n = d.getTime();
    this.ws.send('{ "cmd": 65, "to": "' + to + '", "data": { "msg": "' + msg + '", "time": ' + n + ' } }');
};

/**
 * Send echo answer command to peer
 *
 * @param {type} to Peer name to send to
 * @param {type} obj Data (object) to send to peer
 * @returns {undefined}
 */
Teocli.prototype.echoAnswer = function (to, obj) {
    this.ws.send('{ "cmd": 66, "to": "' + to + '", "data": ' + obj + ' }');
};

/**
 * Calculate echo triptime
 *
 * @param {type} t Previous time in ms
 * @returns {Number} Return triptime - diference between now and previous time
 *                   in ms
 */
Teocli.prototype.triptime = function (t) {

    var d = new Date();
    var n = d.getTime();

    return n - t;
};

/**
 * Check if input string is JSON object
 *
 * @param {type} str JSON string
 *
 * @returns {Array|Object|undefined} Parsed json object or undefined if input
 *                         string can't be parsed
 */
Teocli.prototype.IsJsonString = function (str) {

    try {
        return JSON.parse(str);
    } catch (e) {
        return undefined;
    }
};

/**
 * Process received data
 *
 * @param {type} data Received data
 *
 * @returns {int} 1 - if processed, 0 - if not processed
 */
Teocli.prototype.process = function (data) {

    var processed = 0;

    var teocli = this;

    // Parse JSON command
    var p = teocli.IsJsonString(data);

    // Check that command is in JSON format
    if (p && p.hasOwnProperty('cmd') && p.hasOwnProperty('from') &&
        p.hasOwnProperty('data')) {

        console.log("Teocli.process", p);

        // Check received commands
        //
        // Got ECHO command
        if (p.cmd === 65) {
            // Send echo answer
            teocli.echoAnswer(p.from, p.data);
            processed = 1;
        }

        // Got ECHO answer command
        else if (p.cmd === 66) {
            // Calculate triptime command
            p.data.time = teocli.triptime(p.data.time);
            //console.log("Teocli.process: Triptime " + p.data.time + " ms");
            // Exequte echo callback
            if (typeof this.onecho === 'function') {
                this.onecho(null, p);
            }

            processed = 1;
        }

        // Got PEERS command
        else if (p.cmd === 72) {
            // Send peers answer command
            teocli.peersAnswer(p.from);
            processed = 1;
        }

        // Got PEERS answer command
        else if (p.cmd === 73) {
            //teocli.peersAnswer(p.from);
            // Exequte peers callback
            if (typeof this.onpeers === 'function') {
                this.onpeers(null, p);
            }
            processed = 1;
        }

        // Got some other command
        else {
            // Exequte other callback
            if (typeof this.onother === 'function') {
                this.onother(null, p);
            }
            processed = 0;
        }
    }

    return processed;
};

// Check NodeJS module exists
if(typeof module !== 'undefined' && module.exports) {
    module.exports = Teocli;
}
