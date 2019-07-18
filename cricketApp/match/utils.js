const db = require('../database');

module.exports.createMatch = async (teamA, teamB) => {
    const match = await db.Match.create({
        teamA: teamA,
        teamB: teamB,
        status: 0,
        statusTeamA: 0,
        statusTeamB: 0,
    });
    if (!match) {
        return false
    }
    return true
}