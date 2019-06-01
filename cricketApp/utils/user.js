const db = require('../database');

const getUsersData = async (ids) => {
    let userData = ids.map(id => db.User.findByPk(id, { include: [{ all: true, nested: true }] }))
    return data = await Promise.all(userData);
}

module.exports.getUsersData = getUsersData
