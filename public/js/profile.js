// ========== Page loading ========== //

function loadProfilPage() {
    $.ajax({
        url: '/api/user/one',
        type: 'POST',
        dataType: 'JSON',
        data: { id: $('#userID').html() },

        success: data => {
            if(data.error) {
                showSystemMessage(data.error, MessageType.danger)
                return
            }

            loadProfilPageSuccess(data.result)
        },

        error: error => console.log(error)
    })
}

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

        success: data => {
            if(data.error) {
                showSystemMessage(data.error, MessageType.danger)
                return
            }

            showSystemMessage(data.message, MessageType.success)
        },

        error: error => console.log(error)
    })
}

// ========== Page ready ========== //

$(document).ready(function() {

    loadProfilPage()

    $('#changePassword').on('click', onClickChangePassword)
    $('#seeElectricityManagment').on('click', () => window.location.href = `/electricity-managment/${$('#userID').html()}`)

})
