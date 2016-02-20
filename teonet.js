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
    port: 'int',                    ///< Remote peer port
    mtu: 'int',                     ///< Remote mtu
    from: 'string',                 ///< Remote peer name
    from_len: 'uint8',              ///< Remote peer name length

    cmd: 'uint8',                   ///< Command ID

    data: 'void *',                 ///< Received data
    data_len: 'size_t',             ///< Received data length

    raw_data: 'void *',             ///< Received packet data
    raw_data_len: 'size_t',         ///< Received packet length

    arp: 'void *', /* ksnet_arp_data * */    ///< Pointer to ARP Table data

    l0_f: 'int'                     ///< L0 command flag (from set to l0 client name)  
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
     */
    'ksnCorePacketData': ksnCorePacketData,    
    //'ksnCorePacketDataPtr': ksnCorePacketDataPtr,
    
    lib:ffi.Library('libteonet', {
      'teoGetLibteonetVersion': [ 'string', [ ] ],
      'ksnetEvMgrInit': [ 'pointer', [ 'int', StringArray, 'pointer', 'int' ] ],
      'ksnetEvMgrRun': [ 'int', [ 'pointer' ] ],
      'ksnetEvMgrSetCustomTimer': [ 'void', [ 'pointer', 'double' ] ],
      'teoSetAppType': [ 'void' , [ 'pointer', 'string' ] ],
      'ksnetEvMgrGetTime': [ 'double',[ 'pointer' ] ]
    }), 
  
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


// ksnetEvMgrSetCustomTimer(ke, 2.00);

/*
 // Start teonet
 ksnetEvMgrRun(ke); 


 ksnetEvMgrClass *ke = ksnetEvMgrInit(argc, argv, NULL, 3); 
  
 
 ksnetEvMgrClass *ksnetEvMgrInit(
    int argc, 
    char** argv,
    void (*event_cb)(ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data, size_t data_len, void *user_data),
    int options
);
  
  
ksnetEvMgrClass *ksnetEvMgrInit(
    int argc, char** argv,
    void (*event_cb)(ksnetEvMgrClass *ke, ksnetEvMgrEvents event, void *data, size_t data_len, void *user_data),
    int options
);
*/