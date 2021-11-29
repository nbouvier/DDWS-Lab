// ========== Messages ========== //

const MessageType = {
    info: 'info',
    success: 'success',
    danger: 'danger',
    warning: 'warning'
}

function showSystemMessage(message, type = MessageType.info) {
    $('body').append(`
        <div class="system-message system-${type}">
            ${message}
        </div>
    `)
}

// ========== Forms ========== //

function formValidation() {
    console.log('No data validation, please implement one.')
    return true
}

function formSuccess(formName, data) {
    if(data.error) {
        showSystemMessage(data.error, MessageType.alert)
    } else if(data.message) {
        if(window[`${formName}Success`]) {
            window[`${formName}Success`](data)
        } else {
            showSystemMessage(data.message, MessageType.success)
        }
    }
}

// ========== Page ready ========== //

$(document).ready(function() {

    // ========== SideBar ========== //

    $('#sidebar .dismiss, #overlay').on('click', () => {
        $('#sidebar').addClass('minimized')
        $('#overlay').removeClass('active')
    })

    $('#sidebar-header').on('click', () => {
        $('#sidebar').removeClass('minimized')
        $('#overlay').addClass('active')
    })

    $('.logout').on('click', e => {
        e.preventDefault()

        $.ajax({
            url: '/api/auth/logout',
            type: 'POST',

            success: () => window.location.href = '/login'
        })
    })

    // ========== Forms ========== //

    $('form button').on('click', function(e) {
        e.preventDefault()
    })

    $('form button[type=submit]').on('click', function(e) {
        form = $(this).parents('form').first()
        formName = form.attr('id')
        if(window[`${formName}Validation`] ? window[`${formName}Validation`]() : formValidation()) {
            $.ajax({
                url: form.attr('action'),
                type: form.attr('method'),
                data: window[`${formName}Data`](),
                dataType: 'JSON',

                success: data => formSuccess(formName, data),

                error: error => window[`${formName}Error`] ? window[`${formName}Error`](error) : console.log(error)
            })
        }
    })

})
