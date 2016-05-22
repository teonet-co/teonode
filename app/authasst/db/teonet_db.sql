CREATE DATABASE IF NOT EXISTS `teonet` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `teonet`;

CREATE TABLE IF NOT EXISTS `networks` (
  `networkId` varchar(50) NOT NULL DEFAULT '',
  `network` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `host` varchar(50) NOT NULL,
  `port` int(11) NOT NULL,
  `l0_tcp_port` int(11) NOT NULL,
  `peer` varchar(50) NOT NULL,
  `description` text,
  `data` blob,  
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`networkId`),
  UNIQUE KEY `network` (`network`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELIMITER @@
DROP TRIGGER IF EXISTS before_insert_networks @@
CREATE TRIGGER teonet.before_insert_networks
BEFORE INSERT ON teonet.networks
FOR EACH ROW
BEGIN
  IF NEW.networkId IS NULL or NEW.networkId = '' THEN 
    SET new.networkId = uuid();
  END IF;
END;@@
DELIMITER ; 

