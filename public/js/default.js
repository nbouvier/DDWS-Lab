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

    $('.logout').on('click', () => {
        $.ajax({
            url: '/api/auth/logout',
            type: 'POST',

            success: () => location.reload()
        });
    })

    // ========== Forms ========== //

    $('form').submit(function(e) {
        e.preventDefault()

        form = $(this).attr('id')
        if(window[`${form}Validation`]()) {
            $.ajax({
                url: $(this).attr('action'),
                type: $(this).attr('method'),
                data: window[`${form}Data`](),
                dataType: 'JSON',

                success: data => window[`${form}Success`](data)
            });
        }
    })

})
