$('.flash-message .close').on('click', (e) => {
    $(e.target).parent().fadeOut()
})

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