#!/bin/sh
# 
# File:   teonode_install.sh
# Author: Tereshchenko Vladimir
#
# Created on Mar 02, 2016 16:44:14 GMT+0300
#


# Install dependencies:
sudo apt-get update
sudo apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies for build node-ffi:
npm install -g node-gyp
sudo apt-get install -y python2.7
npm config set python /usr/bin/python2.7
sudo apt-get install -y build-essential

cd /root/Projects/teonode
npm install



## Startup script
#sudo cat <<EOT > /root/teonet_watch_run
##!/bin/sh
##
## teonet_watch_run
##
## This script is executed at the end of each multiuser runlevel.
## Make sure that the script will "exit 0" on success or any other
## value on error.
##
## In order to enable or disable this script just change the execution
## bits.
##
## By default this script does nothing.
#
#
#node /root/Projects/teonode/watch teo-node-watch
#
#
##exec "$@"
#
##sudo exec "$@"
##exit 0
#EOT
##
#sudo chmod +x /root/teonet_watch_run
##


echo "Done"