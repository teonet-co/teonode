## Teonet teonode Dockerfile
#
#FROM gitlab.ksproject.org:5000/teonet/teonet
#MAINTAINER Tereshchenko Vladimir <vdtereshchenko@gmail.com>
#MAINTAINER Kirill Scherba <kirill@scherba.ru>
#
## Add install script
#ADD docker/teonode_install.sh /root/
#
## Copy project
#ADD . /root/Projects/teonode/
#
## Install
#WORKDIR /root/
#RUN ./teonode_install.sh
#RUN rm ./teonode_install.sh
#WORKDIR /root/Projects/teonode
#
## CMD ["/root/teonet_watch_run"]


# Teonet teonode Dockerfile

FROM node:8.11.3
MAINTAINER Kirill Scherba <kirill@scherba.ru>

# Add Teonet repository and Install Teonet
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 8CC88F3BE7D6113C && \
    printf "\ndeb http://repo.ksproject.org/ubuntu/ teonet main\n" >> /etc/apt/sources.list && \
    apt-get update && apt-get upgrade -y && apt-get install -y libteonet-dev && ldconfig

# Copy project
ADD . /root/Projects/teonode

# Set work folder and Install npm dependencies
WORKDIR /root/Projects/teonode
RUN npm i

# Default command
CMD ["node","app/authasst","teo-auth"]


# context will be teonode dir
# Dockerfile on windows don't understand home dir ~
# script must be run from /teonode
#
# Build
# cd /teonode
# docker build --no-cache -t gitlab.ksproject.org:5000/teonet/teonode -f docker/Dockerfile .
#
# Run watcher as an example
# docker run -it --name watch gitlab.ksproject.org:5000/teonet/teonode node /root/Projects/teonode/app/watch teo-node-watch
# docker run -it --name teoauth -w /root/Projects/teonode gitlab.ksproject.org:5000/teonet/teonode node app/authasst teo-auth
#