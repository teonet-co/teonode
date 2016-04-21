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
select userId, username
from users 
where userId in (?);
`;

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


//// test:
//module.exports.checkUser('1e6d312074bf7650d2ee013e174d02333d8ba9f6c3c7f483639e041aec8200f5', function(err, data) {
//    console.log(JSON.stringify(data));
//});