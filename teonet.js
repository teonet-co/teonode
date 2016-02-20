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
    'ksnCorePacketData': ksnCorePacketData,    
    //'ksnCorePacketDataPtr': ksnCorePacketDataPtr,
    
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
      'ksnCoreSendCmdto': [ 'pointer', [ 'pointer', 'string', 'uint8', 'pointer', 'size_t' ] ],
      
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
     * Get parameter kc of ksnetEvMgrClass
     * @param {'pointer'} ke Pointer to ksnetEvMgrClass
     * @returns {'pointer'} Pointer to ksnCoreClass
     */
    getKc: function(ke) {
        
//        console.log(ke);
//        
//        var ke_buf = ref.alloc('pointer', ke);
//        console.log(1,ke_buf);
//              
//        var kc_buf = ref.readPointer(ke_buf, ref.sizeof.pointer, ref.sizeof.pointer);
//        console.log(4, kc_buf);
//        
//        var kc = ref.alloc('pointer', kc_buf);
//        console.log(5, kc);
//
//        var kc_addr = ref.address(ke) + ref.sizeof.pointer;
//        console.log(6, "0x" + kc_addr.toString(16));
//        
//        
//        var ke_buf = ref.alloc('pointer', ke);
//        
//        buf.readPointer(0 * ref.sizeof.pointer)
//        
//        
//        
//        
//         var buf = new Buffer(ref.sizeof.pointer * 1);
//         var a = new Buffer('hello')
        
        
        return null;
    },
    
    /**
     * Send request answer data to Peer or L0 server client (
     * 
     * @param {'pointer'} ke Pointer to ksnetEvMgrClass
     * @param {'pointer'} rd_ptr Pointer to ksnCorePacketData 
     * @param {'string'}  name Peer or Client name
     * @param {'pointer'} out_data Output data
     * @param {'size_t'} out_data_len Output data length
     * @returns {'int'|'pointer'}
     */
    sendCmdAnswerTo: function(ke, rd_ptr, name, out_data, out_data_len) {
        
        var rd = new ksnCorePacketData(rd_ptr);
        var retavl;
        
        if(rd.l0_f) 
            retavl = this.lib.ksnLNullSendToL0(ke, 
                rd.addr, rd.port, name, name.length + 1, rd.cmd, 
                out_data, out_data_len); 
        else 
            retavl = ksnCoreSendCmdto(this.getKc(ke), name, rd.cmd, // TODO: parse ke.kc
                out_data, out_data_len);
                
        return retavl;
    },

    /**
     * Covert javascript callback to C library callback
     * 
     * @param {type} eventCb
     * @returns {nm$_ffi.exports.Callback}
     */
    eventCbPtr: function(eventCb) {
      return ffi.Callback('void', ['pointer', 'int', ksnCorePacketDataPtr, 'size_t', 'pointer'], eventCb);
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
    ksnetEvMgrInit: function(eventCb, options) {
        return this.lib.ksnetEvMgrInit(process.argv.length-1, Array.from(process.argv).slice(1), this.eventCbPtr(eventCb), options);
    }
    
  };
