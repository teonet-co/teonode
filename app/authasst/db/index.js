var mysql = require('mysql2');
var config = require("../libs/config");

var sqlPool = mysql.createPool(config.get('mysql'));

module.exports.pool = sqlPool;


var query = {};
query.checkUser = `
select
	ac.userId,
	ac.clientId,
	ac.expirationDate,
	u.email,
	u.username,
	u.registerDate userRegisterDate,
	ac.expirationDate < NOW() as expired,
	GROUP_CONCAT(g.groupId) groupId,
	GROUP_CONCAT(g.name) groupName
from accessTokens ac
	inner join users u
		on ac.userId = u.userId
/*
	inner join clients c
		on ac.clientId = c.clientId
*/

	left join userGroup ug
		on ac.userId = ug.userId
	left join groups g
		on ug.groupId = g.groupId


where
	ac.token = ?
	and u.deactivated is null


group by
	ac.userId,
	ac.clientId,
	ac.expirationDate,
	u.email,
	u.username,
	u.registerDate;
`;

query.addGroup = `call spAddGroup(?, ?)`;

query.removeGroup = `
delete
from userGroup
where userId = ?
	and groupId = (select groupId from groups where name = ?);
`;

query.getUserInfo = `
select userId, username, email
from users 
where userId in (?);
`;

query.getClientInfo = `
select 
	clientId, 
--	clientSecret, 
--	clientKey, 
	registerDate, 
	data 
from clients 
where clientId in (?);
`;

query.getUsersWhere = 'NOT( (email like "test@%" OR email like "a@%") ) AND deactivated is NULL';

query.getUsersGroupsList = `
SELECT name 
FROM userGroup ug
LEFT JOIN groups g ON g.groupId = ug.groupId
WHERE ug.userId in (?)
GROUP BY ug.userId
ORDER BY name;
`;

query.getNumUsers = `
SELECT 
    COUNT(userId) as numUsers 
FROM users
where ` + query.getUsersWhere + `
order by username;
`;

query.getUsersList = `
SELECT 
    userId, username, email, registerDate
FROM users
where ` + query.getUsersWhere + `
order by username;
`;

query.getNetworksList = `
SELECT 
    networkId, network, name, host, port, l0_tcp_port, peer, description 
FROM teonet.networks
order by name;
`;

//query.insertNetwork = 'INSERT INTO teonet.networks SET ?';
query.insertNetwork = `
INSERT INTO teonet.networks 
    (networkId,name,network,host,port,l0_tcp_port,peer,description) 
    VALUES("",?,?,?,?,?,?,?);
`;

query.updateNetwork = `
UPDATE teonet.networks 
    SET name = ?, network = ?, host = ?, port = ?, l0_tcp_port = ?, peer = ?, description = ? 
    where networkId = ?;    
`;

query.deleteNetwork = 'DELETE FROM teonet.networks where networkId = ?;';

module.exports.checkUser = function (accessToken, done) {
    sqlPool.execute(query.checkUser, [accessToken], function (err, rows) {
        if (err) {
            done(err);
            return;
        }

        if (rows.length === 0) {
            done(null, null);
            return;
        }

        done(null, rows[0]);
    });
};

module.exports.addGroup = function (userId, group, done) {
    sqlPool.execute(query.addGroup, [userId, group], done);
};

module.exports.removeGroup = function (userId, group, done) {
    sqlPool.execute(query.removeGroup, [userId, group], done);
};

module.exports.getUserInfo = function (userIds, done) {
    sqlPool.execute(query.getUserInfo, [userIds], function (err, rows) {
        if (err) {
            done(err);
            return;
        }

        if (rows.length === 0) {
            done(null, null);
            return;
        }

        done(null, rows[0]);
    });
};


module.exports.getClientInfo = function (clientIds, done) {
    sqlPool.execute(query.getClientInfo, [clientIds], function (err, rows) {
        if (err) {
            done(err);
            return;
        }

        if (rows.length === 0) {
            done(null, null);
            return;
        }

        done(null, {
            clientId: rows[0].clientId,
            // clientSecret: rows[0].clientSecret,
            // clientKey: rows[0].clientKey,
            registerDate: rows[0].registerDate,
            data: JSON.parse(rows[0].data)
        });
    });
};

module.exports.getNumUsers = function (params, done) {
    sqlPool.execute(query.getNumUsers, [params], function (err, rows) {
        
        //console.log('getNumUsers', err, rows);
        if (err) {
            done(err);
            return;
        }

        if (rows.length === 0) {
            done(null, null);
            return;
        }

        done(null, {
            numUsers: rows[0].numUsers
        });
    });
};

module.exports.getUsersList = function (params, done) {
    sqlPool.execute(query.getUsersList, [params], done);
};

module.exports.getUsersGroupsList = function (params, done) {
    sqlPool.execute(query.getUsersGroupsList, [params], done);
};

module.exports.getNetworksList = function (params, done) {
    sqlPool.execute(query.getNetworksList, [params], done);
};

module.exports.insertNetwork = function (name, network, host, port, l0_tcp_port, peer,description, done) {
    //console.log("insertNetwork", name, network, host, port, l0_tcp_port, peer, description);
    sqlPool.execute(query.insertNetwork, [name, network, host, port, l0_tcp_port, peer, description], done);
};

module.exports.updateNetwork = function (name, network, host, port, l0_tcp_port, peer, description, networkId, done) {
    //console.log("updateNetwork", name, network, host, port, l0_tcp_port, peer, description);
    sqlPool.execute(query.updateNetwork, [name, network, host, port, l0_tcp_port, peer, description, networkId], done);
};

module.exports.deleteNetwork = function (networkId, done) {
    //console.log("updateNetwork", name, network, host, port, l0_tcp_port, peer, description);
    sqlPool.execute(query.deleteNetwork, [networkId], done);
};

//// test:
//module.exports.checkUser('1e6d312074bf7650d2ee013e174d02333d8ba9f6c3c7f483639e041aec8200f5', function(err, data) {
//    console.log(JSON.stringify(data));
//});