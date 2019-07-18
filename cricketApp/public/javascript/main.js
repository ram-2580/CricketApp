function getData(url, fn) {
    $.get(url, fn);
}

getData = R.curry(getData);

function removeFromDom(e) {
    $(e).fadeOut().remove();
}

function appendToDOM(selector, data) {
    $(selector).append(data);
    return data
}

appendToDOM = R.curry(appendToDOM);

function trace(x) {
    console.log(x);
    return x
}

$('.flash-message .close').on('click', (e) => {
    $(e.target).parent().fadeOut()
})
function follow(id) {
    $.post('/follow/addFollowing', { f_id: id }, function (data, status) {
        if (status == 'success') {
            $('#follows').html('following')
        }
    })
}
function unfollow(id) {
    $.post('/follow/removeFollowing', { f_id: id }, function (data, status) {
        if (status == 'success') {
            $('#unfollow').html('follow')
        }
    })
}
function sendInvitation(teamId, id, fn) {
    $.get('/team/invite/' + teamId + "/" + id, function (data, status) {
        fn(status);
    });
}

$('.invite-button').on('click', e => {
    let id = $(e.target).attr('data-id');
    let teamId = $(e.target).attr('data-team-id');

    sendInvitation(teamId, id, (s) => {
        if (s == 'success') {
            removeFromDom(e.target.closest('.card'));
        } else {
            console.log('failed');
        }
    });
});

// Notifications
var getNotifications = getData('/users/notifications')


function joinNotificationMarkUp(data) {
    return `<div class="py-2 px-3 border-1 join-notification dropdown-item" data-team-id="${data.id}">
        <p>Invited to join ${data.name} team</p>
        <a  class="btn btn-success mr-1" onClick="join(this)">Join</a>
        <a class="btn btn-danger" onClick="reject(this)">Decline</a>
    </div>`
}

function matchMakingNotificationMarkUp(data) {
    return `<div class="py-2 px-3 border-1 dropdown-item" data-match-id="${data.id}">
                <p>Invited by ${data.team} to play match</p>
                <a class="btn btn-success mr-1" onClick="acceptMatch(this)">Accept<a>
                <a class="btn btn-danger" onClick="rejectMatch(this)">Decline</a>
            </div>
        `
}

function acceptMatch(e) {
    let matchId = R.compose(getAttr('data-match-id'), parent)(e);
    getData(`match/accept/${matchId}`, (data, status) => {
        console.log(data, status);
        if (status == 'success') {
            removeFromDom(parent(e));
        }
    });
}

function rejectMatch(e) {
    let matchId = R.compose(getAttr('data-match-id'), parent)(e);
    getData(`match/reject/${matchId}`, (data, status) => {
        console.log(data, status);
        if (status == 'success') {
            removeFromDom(parent(e));
        }
    });
}

var renderNotificationToDOM = (data, status) => {
    R.compose(R.map(appendToDOM('#notifications-menu')), R.map(joinNotificationMarkUp), R.prop("joinTeamNotification"))(data);
    R.compose(R.map(appendToDOM('#notifications-menu')), R.map(matchMakingNotificationMarkUp), R.prop("matchMakingNotification"))(data);
}

var dataOrError = R.ifElse(
    (data, status) => status == 'success',
    renderNotificationToDOM,
    (data, status) => console.log("error")
);

getNotifications(dataOrError);


function parent(e) {
    return $(e).parent()
}

function getAttr(att, e) {
    return $(e).attr(att);
}

getAttr = R.curry(getAttr);

let sendJoinRequest = (fn, teamId) => {
    $.get("/team/invite/" + teamId + "/join", fn);
}

let sendRejectRequest = (fn, teamId) => {
    $.get("/team/invite/" + teamId + "/reject", (data, status) => {
        if (status == 'success') {
            fn(true, teamId);
        }
        else {
            fn(false, teamId);
        }
    })
}

sendJoinRequest = R.curry(sendJoinRequest);
sendRejectRequest = R.curry(sendRejectRequest);

function removeAllJoinNotifications() {
    removeFromDom('.join-notification');
}

function removeJoinNotification(status, teamId) {
    removeFromDom("[data-team-id=" + teamId + "]");
}

var handleJoinResponse = R.ifElse((data, status) => status == "success", removeAllJoinNotifications, (d, s) => console.log(s))
var handleRejectResponse = R.ifElse(
    (status, teamId) => status,
    removeJoinNotification,
    (status, teamId) => console.log('Unable to process request.'))

var join = R.compose(sendJoinRequest(handleJoinResponse), getAttr('data-team-id'), parent);
var reject = R.compose(sendRejectRequest(handleRejectResponse), getAttr('data-team-id'), parent);

// Invite to play match
function renderTeam(team) {
    return `
        <a href="#" class="list-group-item list-group-item-action" style="border-radius: 0";>
            <div>
                <h2>${team.name} <button onClick="inviteTeamToPlay(${team.id})" class="btn btn-primary float-right text-white">Invite</button>
                </h2>
            </div>
        </a>
    `
}

var renderTeams = R.compose(appendToDOM('#teams-to-invite'), R.map(renderTeam), trace);

function getTeamForMatching() {
    var getTeams = getData('/team/getTeamsToPlay');
    getTeams(renderTeams);
}

function inviteTeamToPlay(id) {
    var inviteTeam = getData('/team/inviteTeam/' + id);
    inviteTeam(console.log);
}

// Selecting players
let selection = {
    matchId: -1,
    setectedPlayers: []
}

var formData = new FormData;

formData.append('players', selectPlayer);

function selectPlayer(playerElement) {
    let player = getAttr('data-tab-playerId', playerElement)

    if (selection.setectedPlayers.includes(player)) {
        $(playerElement).removeClass("selected")
        selection.setectedPlayers = selection.setectedPlayers.filter(p => p != player);
    } else {
        $(playerElement).addClass("selected")
        selection.setectedPlayers.push(player);
    }

    console.log(selection.setectedPlayers);
}

function subitSelectionRequest() {
    let matchId = getAttr('data-tab-match', $('#playerSelectionTable'));
    selection.matchId = matchId;
    console.log(selection);

    $.post('/match/select/team', { data: JSON.stringify(selection) }, (res) => {
        console.log(res);
    });
}