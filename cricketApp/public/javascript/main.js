$('.flash-message .close').on('click', (e) => {
    $(e.target).parent().fadeOut()
})
function follow(id) {
    $.post('/follow/addFollowing', { f_id: id }, function (data, status) {
        if (status == 'success') {
            $('#follow').html('following')
        }
    })
}
function sendInvitation(teamId, id, fn) {
    $.get('/team/invite/' + teamId + "/" + id, function (data, status) {
        fn(status);
    });
}

function removeFromDom(e) {
    $(e).fadeOut().remove();
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

function getNotifications(fn) {
    $.get('/users/notifications', fn);
}

function notifications(data) {
    console.log(data);
}

function joinNotificationMarkUp(data) {
    return `<div class="py-2 px-3 border-1 join-notification" data-team-id="${data.id}">
        <p>You are invited to join ${data.name} team</p>
        <a  class="btn btn-success mr-1" onClick="join(this)">Join</a>
        <a class="btn btn-danger" onClick="reject(this)">Decline</a>
    </div>`
}

function append(selector, data) {
    $(selector).append(data);
    return data
}

append = R.curry(append);

var renderNotification = (data, status) => {
    R.compose(console.log, R.map(append('#notifications-menu')), R.map(joinNotificationMarkUp), R.prop("joinTeamNotification"))(data);
}

var dataOrError = R.ifElse(
    (data, status) => status == 'success',
    renderNotification,
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