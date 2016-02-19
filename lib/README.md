## 4. Install Teonet library from repository

DEB / RPM repository: http://repo.ksproject.org

<hr>

### DEBIAN / UBUNTU

http://repo.ksproject.org/ubuntu/

#### Add repository

    sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 8CC88F3BE7D6113C
    sudo apt-get install -y software-properties-common
    sudo add-apt-repository "deb http://repo.ksproject.org/ubuntu/ teonet main"
    sudo apt-get update

#### Install

    sudo apt-get install -y libteonet-dev
    sudo ldconfig

<hr>

### CENTOS / RHEL / FEDORA

http://repo.ksproject.org/rhel/x86_64/

#### Add repository

    vi /etc/yum.repos.d/teonet.repo

    [teonet]
    name=Teonet library for RHEL / CentOS / Fedora
    baseurl=http://repo.ksproject.org/rhel/x86_64/
    enabled=1
    gpgcheck=0

#### Refresh

    # yum clean all

#### Install

    yum install libteonet
    ldconfig 

<hr>

### SUSE

#### Add repository

    zypper ar -f http://repo.ksproject.org/opensuse/x86_64/ teonet

#### Install
    
    zypper in -y libteonet
    ldconfig

<hr>


