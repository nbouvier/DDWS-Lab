// ========== Page loading ========== //

function loadProfilPageSuccess(data) {
    let user = data.user

    $('#profileFirstName').val(user.first_name)
    $('#profileLastName').val(user.last_name)
    $('#profileAddress').val(user.address)
    $('#profileAdditionalAddress').val(user.additional_address)
    $('#profileCity').val(user.city)
    $('#profileZipCode').val(user.zip_code)

    $('#securityEmail').val(user.email)
}

// ========== Profile form ========== //

function profileFormData() {
    return {
        name: $('#profileFirstName').val(),
        forename: $('#profileLastName').val(),
        address: $('#profileAddress').val(),
        additional_address: $('#profileAdditionalAddress').val(),
        city: $('#profileCity').val(),
        zip_code: $('#profileZipCode').val()
    }
}

// ========== Security form ========== //

function securityFormData() {
    return {
        email: $('#securityEmail').val()
    }
}

function onClickChangePassword() {
    $.ajax({

        url: '/api/auth/init-reset-password',
        type: 'POST',
        dataType: 'JSON',
        data: {
            email: $('#securityEmail').val()
        },

        success: data => showSystemMessage(data.message, MessageType.success),

        error: error => console.log(error)

    })
}

// ========== Page ready ========== //

$(document).ready(function() {

    $.ajax({

        url: '/api/user/get',
        type: 'POST',
        dataType: 'JSON',

        success: data => loadProfilPageSuccess(data.result),

        error: error => console.log(error)

    })

    $('#changePassword').on('click', onClickChangePassword)

})
