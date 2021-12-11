// ========== Messages ========== //

const MessageType = {
    info: 'info',
    success: 'success',
    danger: 'danger',
    warning: 'warning'
}

function showSystemMessage(message, type = MessageType.info) {
    $('#messagesContainer').append(`
        <div class="jumbotron message bg-${type} py-3 px-4 m-0 mt-2 text-nowrap" style="display: none">
            <p class="text-${type} m-0">${message}</p>
        </div>
    `)
    $('#messagesContainer .message').show(500).delay(5000).fadeOut(1000, function() {
        $(this).remove()
    })
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

    $('#sidebar').on('mouseleave', () => {
        $('#sidebar').addClass('minimized')
        $('#overlay').fadeOut(500)
    })

    $('#sidebar').on('mouseenter', () => {
        $('#sidebar').removeClass('minimized')
        $('#overlay').fadeIn(500)
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

        if(!window[`${formName}Data`]) {
            console.log(`${formName}Data is missing !`)
            return
        }

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

    // ========== Messages ========== //

    $('#messagesContainer .message').show(500).delay(5000).fadeOut(1000, function() {
        $(this).remove()
    })

})
