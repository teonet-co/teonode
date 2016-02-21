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

var ref = require('ref');
var ffi = require('ffi');
var ArrayType = require('ref-array');
var StructType = require('ref-struct');
var StringArray = ArrayType('string');

/**
 * Define the "ksnCorePacketData" struct type
 * 
 */
var ksnCorePacketData = StructType({

    addr: 'string',                 ///< @param {'string'} addr Remote peer IP address
    port: 'int',                    ///< @param {'int'} port Remote peer port
    mtu: 'int',                     ///< @param {'int'} mtu Remote mtu
    from: 'string',                 ///< @param {'string'} from Remote peer name
    from_len: 'uint8',              ///< @param {'uint8'} from_len Remote peer name length

    cmd: 'uint8',                   ///< @param {'uint8'} cmd Command ID

    data: 'pointer',                ///< @param {'pointer'} data Received data
    data_len: 'size_t',             ///< @param {'size_t'} data_len Received data length

    raw_data: 'pointer',            ///< @param {'pointer'} raw_data Received packet data
    raw_data_len: 'size_t',         ///< @param {'size_t'} raw_data_len Received packet length

    arp: 'pointer', /* ksnet_arp_data * */    ///< @param {'pointer'} arp Pointer to ARP Table data

    l0_f: 'int'                     ///< @param {'int'} l0_f L0 command flag (from set to l0 client name)  
});
var ksnCorePacketDataPtr = ref.refType(ksnCorePacketData);

/**
  * The "ksnCoreClass" struct type
  */
var ksnCoreClass = StructType({

    name: 'string',          ///< Host name
    name_len: 'uint8',       ///< Host name length
    addr: 'string',          ///< Host IP address
    port: 'int',             ///< Host IP port
    fd: 'int',               ///< Host socket file descriptor

    last_check_event: 'double', ///< Last time of check host event
    ka: 'pointer', /* ksnetArpClass * */       ///< Arp table class object
    kco: 'pointer' /* ksnCommandClass *kco */ ///< Command class object
//    ksnTRUDPClass *ku;       ///< TR-UDP class object
//    #if KSNET_CRYPT
//    ksnCryptClass *kcr;      ///< Crypt class object
//    #endif
//    ev_io host_w;            ///< Event Manager host (this host) watcher
//    void *ke;                ///< Pointer to Event manager class object
//
//    #ifdef HAVE_MINGW
//    WSADATA wsaData;
//    #endif

}); 
var ksnCoreClassPtr = ref.refType(ksnCoreClass);

/**
 * KSNet event manager functions data
 */
var ksnetEvMgrClass  = StructType({

    // Pointers to Modules classes
    km: 'pointer',          ///< Pointer to multi net class
    kc: ksnCoreClassPtr     ///< Pointer to ksnCoreClass core class
//    ksnetHotkeysClass *kh; ///< Hotkeys class
//    ksnVpnClass *kvpn; ///< VPN class
//    ksnTcpClass *kt; ///< TCP Client/Server class
//    ksnLNullClass *kl; ///< L0 Server class
//    ksnTCPProxyClass *tp; ///< TCP Proxy class
//    ksnTunClass *ktun; ///< Tunnel class
//    ksnTermClass *kter; ///< Terminal class
//    ksnCQueClass *kq; ///< Callback QUEUE class
//    ksnTDBClass *kf; ///< PBL KeyFile class
//    ksnStreamClass *ks; ///< Stream class
//
//    ksnet_cfg ksn_cfg; ///< KSNet configuration
//
//    int runEventMgr; ///< Run even manages (stop if 0)
//    uint32_t timer_val; ///< Event loop timer value
//    uint32_t idle_count; ///< Idle callback count
//    uint32_t idle_activity_count; ///< Idle activity callback count
//    void (*event_cb)(struct ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data, size_t data_len, void *user_data);
//    struct ev_loop *ev_loop; ///< Event loop
//
//    // Event Manager Watchers
//    ev_idle idle_w;         ///< Idle TIMER watcher
//    ev_idle idle_activity_w;///< Idle Check activity watcher
//    ev_timer timer_w;       ///< Timer watcher
//    ev_async sig_async_w;   ///< Async signal watcher
//
//    double custom_timer_interval;   ///< Custom timer interval
//    double last_custom_timer;       ///< Last time the custom timer called
//
//    PblList* async_queue;   ///< Async data queue
//    pthread_mutex_t async_mutex; ///< Async data queue mutex
//
//    size_t n_num; ///< Network number
//    void *n_prev; ///< Previouse network
//    void *n_next; ///< Next network
//    size_t num_nets; ///< Number of networks
//
//    // Define signals watchers
//    ev_signal sigint_w;  ///< Signal SIGINT watcher
//    ev_signal sigterm_w; ///< Signal SIGTERM watcher
//    ev_signal sigsegv_w; ///< Signal SIGSEGV watcher
//    ev_signal sigabrt_w; ///< Signal SIGABRT watcher
//    #ifndef HAVE_MINGW
//    ev_signal sigquit_w; ///< Signal SIGQUIT watcher
//    ev_signal sigkill_w; ///< Signal SIGKILL watcher
//    ev_signal sigstop_w; ///< Signal SIGSTOP watcher
//    #endif
//    
//    void *user_data; ///< Pointer to user data or NULL if absent
//    
//    struct cli_def *cli;
//    
//    int argc;         ///< Applications argc
//    char** argv;      ///< Applications argv  
//    
//    char *type;         ///< Application type

});
var ksnetEvMgrClassPtr = ref.refType(ksnetEvMgrClass);


//module.exports = ffi.Library('/home/kirill/Projects/teonet/src/.libs/libteonet', {
module.exports =  { 
    
    /**
     * TODO: Teonet events enum
     */
    ev: {
        
        /*
         * Default event description example:
         * 
         * Description:
         * #0 Calls immediately after event manager starts
         * 
         * Parameters definition:
         * 
         * @param {'pointer'} ke Pointer to ksnetEvMgrClass
         * @param {int} ev This event
         * @param {'pointer'} data Pointer to data, usually Pointer to ksnCorePacketData
         * @param {'size_t'} data_len Size of data, usually size f ksnCorePacketData
         * @param {'pointer'} user_data Pointer to user data
         */
        
        /**
         * #0 Calls immediately after event manager starts
         * 
         * @param {'pointer'} ke Pointer to ksnetEvMgrClass
         * @param {int} ev This event
         * @param {'pointer'} data null
         * @param {'size_t'} data_len 0
         * @param {'pointer'} user_data null
         */
        EV_K_STARTED: 0,
        
        /**
         * #1 Calls before event manager stopped
         * 
         * @param {'pointer'} ke Pointer to ksnetEvMgrClass
         * @param {int} ev This event
         * @param {'pointer'} data null
         * @param {'size_t'} data_len 0
         * @param {'pointer'} user_data null
         */
        EV_K_STOPPED_BEFORE: 1,
        
        /**
         * #2 Calls after event manager stopped
         * 
         * @param {'pointer'} ke Pointer to ksnetEvMgrClass
         * @param {int} ev This event
         * @param {'pointer'} data null
         * @param {'size_t'} data_len 0
         * @param {'pointer'} user_data null
         */
        EV_K_STOPPED: 2,
        
        /**
         * #3 New peer connected to host event
         * 
         * @param {'pointer'} ke Pointer to ksnetEvMgrClass
         * @param {int} ev This event
         * @param {'pointer'} data Pointer to ksnCorePacketData
         * @param {'size_t'} data_len Size of ksnCorePacketData
         * @param {'pointer'} user_data null
         */
        EV_K_CONNECTED: 3,
        
        /**
         * #4 A peer was disconnected from host
         * 
         * @param {'pointer'} ke Pointer to ksnetEvMgrClass
         * @param {int} ev This event
         * @param {'pointer'} data Pointer to ksnCorePacketData
         * @param {'size_t'} data_len Size of ksnCorePacketData
         * @param {'pointer'} user_data null
         */
        EV_K_DISCONNECTED: 4,
        
        EV_K_RECEIVED: 5,      ///< #5  This host Received a data
        
        /**
         * #9 Timer event, seted by ksnetEvMgrSetCustomTimer
         * 
         * @param {'pointer'} ke Pointer to ksnetEvMgrClass
         * @param {int} ev This event
         * @param {'pointer'} data null
         * @param {'size_t'} data_len 0
         * @param {'pointer'} user_data null
         */
        EV_K_TIMER: 9
        

    },
   
    /**
     * The "ksnCorePacketData" struct type
     * 
     * @param {'string'} addr Remote peer IP address
     * @param {'int'} port Remote peer port
     * @param {'int'} mtu Remote mtu
     * @param {'string'} from Remote peer name
     * @param {'uint8'} from_len Remote peer name length
     * @param {'uint8'} cmd Command ID
     * @param {'pointer'} data Received data
     * @param {'size_t'} data_len Received data length
     * @param {'pointer'} raw_data Received packet data
     * @param {'size_t'} raw_data_len Received packet length
     * @param {'pointer'} arp Pointer to ARP Table data
     * @param {'int'} l0_f L0 command flag (from set to l0 client name)  
     * 
     */
    'packetData': ksnCorePacketData,    
    //'ksnCorePacketDataPtr': ksnCorePacketDataPtr,
    
    /**
     * The "ksnetEvMgrClass" struct type
     */
    'ksnetEvMgrClass': ksnetEvMgrClass,
    //'ksnetEvMgrClassPtr': ksnetEvMgrClassPtr,
    
    /**
     * "The "ksnCoreClass" struct type
     */
    'ksnCoreClass': ksnCoreClass,
    //'ksnCoreClassPtr': ksnCoreClassPtr,
    
    lib:ffi.Library('libteonet', {
        
      /**
       * Get teonet library version
       * 
       * @return {'string'} Teonet library version
       */  
      'teoGetLibteonetVersion': [ 'string', [ ] ],
      
      'ksnetEvMgrInit': [ 'pointer', [ 'int', StringArray, 'pointer', 'int' ] ],
      
      /**
       * Start KSNet Event Manager and network communication
       *
       * @param {'pointer'} ke Pointer to ksnetEvMgrClass
       * @return {'int'} Alway return 0
       */      
      'ksnetEvMgrRun': [ 'int', [ 'pointer' ] ],
      
      /**
       * Set custom timer interval. The event EV_K_TIMER will be send after 
       * every time_interval period.
       *
       * @param {'pointer'} ke Pointer to ksnetEvMgrClass
       * @param {'double'}  time_interval Timer interval
       */      
      'ksnetEvMgrSetCustomTimer': [ 'void', [ 'pointer', 'double' ] ],
      
     /**
      * Set Teonet application type
      * 
      * @param {'pointer'} ke Pointer to ksnetEvMgrClass
      * @param {'string'}  type Application type string
      */      
      'teoSetAppType': [ 'void' , [ 'pointer', 'string' ] ],
      
      /**
       * Get Teonet event manager time
       *
       * @return Teonet event manager time
       */      
      'ksnetEvMgrGetTime': [ 'double',[ 'pointer' ] ],
      
      /**
       * Send command by name to peer
       *
       * @param {'pointer'} kc Pointer to ksnCoreClass
       * @param {'pointer'} to Peer name to send to
       * @param {'uint8'} cmd Command number
       * @param {'pointer'} data Commands data
       * @param {'size_t'} data_len Commands data length
       * 
       * @return {'pointer'} Pointer to ksnet_arp_data or null if "to" peer is absent
       */      
      'ksnCoreSendCmdto': [ 'pointer', [ 'pointer', 'string', 'uint8', 'string', 'size_t' ] ],
      
      // ksnCoreSendto(kco->kc, rd->addr, rd->port, CMD_ECHO_ANSWER,
      //          rd->data, rd->data_len);
      'ksnCoreSendto': [ 'pointer', [ 'pointer', 'string', 'int', 'uint8', 'pointer', 'size_t' ] ],
      
      // int ksnCommandSendCmdEcho(ksnCommandClass *kco, char *to, void *data,
      //                    size_t data_len)
      'ksnCommandSendCmdEcho': [ 'int', [ 'pointer', 'string', 'string', 'size_t' ] ],
      
      /**
       * Send data to L0 client. Usually it is an answer to request from L0 client
       * 
       * @param {'pointer'} ke Pointer to ksnetEvMgrClass
       * @param {'string'} addr IP address of remote peer
       * @param {'int'} port Port of remote peer
       * @param {'string'} cname L0 client name (include trailing zero)
       * @param {'size_t'} cname_length Length of the L0 client name
       * @param {'uint8'} cmd Command
       * @param {'pointer'} data Data
       * @param {'size_t'} data_len Data length
       * 
       * @return {'int'} Return 0 if success; -1 if data length is too lage (more than 32319)
       */      
      'ksnLNullSendToL0': [ 'int', [ 'pointer', 'string', 'int', 'string', 'size_t', 'uint8', 'pointer', 'size_t' ] ]
    }),     
    
    /**
     * Get teonet library version
     * 
     * @return {'string'} Teonet library version
     */
    version: function() { 
        return this.lib.teoGetLibteonetVersion(); 
    },
    
    /**
     * Set Teonet application type
     * 
     * @param {'pointer'} ke Pointer to ksnetEvMgrClass
     * @param {'string'}  type Application type string
     */ 
    setAppType: function(ke, type) {
        this.lib.teoSetAppType(ke, type);
    },
    
    /**
     * Set custom timer interval. The event EV_K_TIMER will be send after 
     * every time_interval period.
     *
     * @param {'pointer'} ke Pointer to ksnetEvMgrClass
     * @param {'double'}  time_interval Timer interval
     */
    setCustomTimer: function(ke, time_interval) {
        this.lib.ksnetEvMgrSetCustomTimer(ke, time_interval);
    },
    
    /**
     * Send request answer data to Peer or L0 server client (
     * 
     * @param {'pointer'} ke Pointer to ksnetEvMgrClass
     * @param {'pointer'} rd_ptr Pointer to ksnCorePacketData 
     * @param {'string'}  name Peer or Client name
     * @param {'uint8'} cmd Comand to send
     * @param {'pointer'} out_data Output data
     * @param {'size_t'} out_data_len Output data length
     * @returns {'int'|'pointer'}
     */
    sendCmdAnswerTo: function(ke, rd_ptr, name, cmd, out_data, out_data_len) {
        
        var rd = new ksnCorePacketData(rd_ptr);
        var retavl;
        
        if(rd.l0_f) 
            retavl = this.lib.ksnLNullSendToL0(ke, 
                rd.addr, rd.port, name, name.length + 1, cmd, 
                out_data, out_data_len); 
        else {
            var ke_ptr = new ksnetEvMgrClass(ke);
            
            //retavl = ksnCoreSendCmdto(ke_ptr.kc, name, cmd, // TODO: parse ke.kc
            //    out_data, out_data_len);
            
            // TODO: use this function insted of ksnCoreSendCmdto
            this.lib.ksnCoreSendto(ke_ptr.kc, 
                rd.addr, rd.port, cmd,
                out_data, out_data_len);
        }
                
        return retavl;
    },
    
    /**
     * Send command to peer
     *
     * @param {'pointer'} ke Pointer to ksnetEvMgrClass
     * @param {'pointer'} peer_name Peer name to send to
     * @param {'uint8'} cmd Command number
     * @param {'pointer'} data Commands data
     * @param {'size_t'} data_len Commands data length
     * 
     * @return {'pointer'} Pointer to ksnet_arp_data or null if "to" peer is absent
     */
    sendCmdTo: function(ke, peer_name, cmd, data, data_len) {
        
        return this.lib.ksnCoreSendCmdto(ke.kc, peer_name, cmd, data, data_len);
    },
    
    /**
     * Send Echo command to peer name
     *
     * @param {'pointer'} ke Pointer to ksnetEvMgrClass
     * @param {'pointer'} peer_name Peer name to send to
     * @param {'pointer'} data Commands data
     * @param {'size_t'} data_len Commands data length
     * 
     * @return {'pointer'} Pointer to ksnet_arp_data or null if "to" peer is absent
     */
    sendCmdEchoTo: function(ke, peer_name, data, data_len) {
        
        return this.lib.ksnCommandSendCmdEcho(ksnCoreClass(ke.kc).kco, 
            peer_name, data, data_len);
    },
    
    /**
     * Covert javascript callback to C library callback
     * 
     * @param {type} eventCb
     * @returns {nm$_ffi.exports.Callback}
     */
    eventCbPtr: function(eventCb) {
      return ffi.Callback('void', [ksnetEvMgrClassPtr, 'int', ksnCorePacketDataPtr, 'size_t', 'pointer'], 
        //eventCb
        function(ke_ptr, ev, data, data_len, user_dat) {
            //var ke = new ksnetEvMgrClass(ke_ptr);
            eventCb(ksnetEvMgrClass(ke_ptr), ev, data, data_len, user_dat);
        }
      );
    },
    
    /**
     * Initialize KSNet Event Manager and network
     *
     * @param {'pointer'} eventCb Events callback function called when an event happens
     * @param {int}       options Options set: <br>
     *                      READ_OPTIONS #1 - read options from command line parameters; <br>
     *                      READ_CONFIGURATION #2 - read options from configuration file
     * 
     * @return Pointer to created ksnetEvMgrClass
     */    
    init: function(eventCb, options) {
        return this.lib.ksnetEvMgrInit(process.argv.length-1, Array.from(process.argv).slice(1), this.eventCbPtr(eventCb), options);
    },
    
    /**
     * Start KSNet Event Manager and network communication
     *
     * @param {'pointer'} ke Pointer to ksnetEvMgrClass
     * @return {'int'} Alway return 0
     */ 
    run: function(ke) {
        
        var self = this;
        
        // Start teonet
        //teonet.lib.ksnetEvMgrRun(ke); // Start without async
        return self.lib.ksnetEvMgrRun.async(ke, function (err, res) {
            if (err) throw err;
            console.log("Teonet exited, res: " + res + " ...");
        });
    }
    
  };
