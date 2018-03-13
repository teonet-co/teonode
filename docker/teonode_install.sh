#!/bin/sh
# 
# File:    teonode_install.sh
# Author:  Tereshchenko Vladimir
# Updated: Kirill Scherba
#
# Created on Mar 02, 2016 16:44:14 GMT+0300
#

# Install NodeJS
apt-get update
apt-get install -y curl 
curl -sL https://deb.nodesource.com/setup_9.x | bash -
apt-get update
apt-get install -y nodejs python2.7 git build-essential git
apt upgrade -y

# Install dependencies for build node-ffi:
npm install -g node-gyp
npm config set python /usr/bin/python2.7

# Install application dependencies
cd /root/Projects/teonode
npm install

## Startup script
#cat <<EOT > /root/teonet_watch_run
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
#node /root/Projects/teonode/app/watch teo-node-watch
#
#
##exec "$@"
#
##exec "$@"
##exit 0
#EOT
##
#chmod +x /root/teonet_watch_run
##


echo "Done install"
