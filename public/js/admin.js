function loadAdminPageSuccess(data) {
    data.users.forEach(user => {
        $('#adminUserList tbody').append(`
            <tr>
                <td class="d-none">${user.id}</td>
                <td>${user.email}</td>
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td>${user.status}</td>
                <td>
                    <button type="button" class="btn btn-outline-primary btn-sm" title="See user" onclick=""><i class="far fa-eye"></i></i></button>
                    <button type="button" class="btn btn-outline-warning btn-sm" title="Block from selling" onclick=""><i class="fas fa-ban"></i></button>
                    <button type="button" class="btn btn-outline-danger btn-sm" title="Delete user" onclick=""><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `)
    })
}

// ========== Page ready ========== //

$(document).ready(function() {

    $.ajax({

        url: '/api/user/all',
        type: 'POST',
        dataType: 'JSON',

        success: data => loadAdminPageSuccess(data.result),

        error: error => console.log(error)

    })

})
