var WebSocket = require('ws');
var Teocli = require('./teocli');


/**
 * Echo answer callback function example
 *
 * @param {type} err
 * @param {type} data
 * @returns {undefined}
 */
function echo_func(err, data) {

    console.log("echo_func, triptime: " + data.data.time + " ms", data);
}

/**
 * Peers answer callback function example
 *
 * @param {type} err
 * @param {type} data
 * @returns {undefined}
 */
function peers_func(err, data) {

    console.log("peers_func", data);
}

/**
 * Other callback function example
 *
 * @param {type} err
 * @param {type} data
 * @returns {undefined}
 */
function other_func(err, data) {

    console.log("other_func", data);
}

/**
 * On client connected callback function example
 *
 * @param {type} ev
 * @returns {undefined}
 */
function open_func(ev) {

    // Client name (random created)
    teocli.client_name = "ws-" + Math.floor((Math.random() * 100) + 1);

    console.log('onopen', teocli.client_name);

    teocli.login(teocli.client_name); // Send login command to L0 server
    teocli.peers("ps-server"); // Send peers list request command to "ps-server" peer
    teocli.echo("ps-server", "Hello " + teocli.client_name + "!"); // Send echo command to "ps-server" peer
}

/**
 * On error callback function example
 *
 * @param {type} ev
 * @returns {undefined}
 */
function error_func(ev) {

    console.log('onerror');
}

/**
 * On close callback function example
 *
 * @param {type} ev
 * @returns {undefined}
 */
function close_func(ev) {

    console.log('onclose');
}

/**
 * On message callback function example
 *
 * @param {type} ev
 * @returns {undefined}
 */
function message_func(ev) {

    //console.log('onmessage', ev.data);

    // Process command. If command not processed show it in html page
    if (!teocli.process(ev.data)) {

        console.log(ev.data);

        //var div = document.createElement('div');
        //div.innerHTML = ev.data;
        //document.getElementById('messages').appendChild(div);
    }
}


// Connect to websocket server
//var ws = new WebSocket('ws://' + location.host + '/ws');
var ws = new WebSocket('ws://10.12.35.53:8080/ws');

// Create Teocli object
var teocli = new Teocli(ws);


// Define received data callbacks
teocli.onecho = echo_func; // Calls when echo_answer received
teocli.onpeers = peers_func; // Calls when peers_answer received
teocli.onother = other_func; // Calls when some other command received
// Define common websocket callbacks
teocli.onopen = open_func; // Calls when client connected to websocket
teocli.onclose = close_func; // Calls when client connected to websocket
teocli.onmessage = message_func; // Calls when websocket message received
teocli.onerror = error_func; // Calls when websocket error hapend


// input from console
var stdin = process.openStdin();
stdin.addListener("data", function (d) {
    ws.send(d.toString().trim());
});