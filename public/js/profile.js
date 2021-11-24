function profileFormValidation() {
    console.log("login form validation")
}

function profileFormSuccess(user) {
    console.log(user)
}

$(document).ready(function() {

    $.ajax({

        url: `/api/user/${$('#user-id').html()}`,
        type: 'POST',
        dataType: 'JSON',

        success: data => profileFormSuccess(data.user),

        error: () => console.error('Failed to load user\'s details.')

    })

})
