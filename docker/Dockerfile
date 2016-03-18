# Teonet teonode Dockerfile

FROM gitlab.ksproject.org:5000/teonet/teonet
MAINTAINER Tereshchenko Vladimir <vdtereshchenko@gmail.com>

# Add install script
ADD docker/teonode_install.sh /root/

# Copy project
ADD . /root/Projects/teonode/

# Install
WORKDIR /root/
RUN ./teonode_install.sh
RUN rm ./teonode_install.sh

# CMD ["/root/teonet_watch_run"]


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
#