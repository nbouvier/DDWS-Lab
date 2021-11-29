// ========== Page loading ========== //

function loadAdminPageSuccess(data) {
    data.users.forEach(user => userTableAddRow(user))
}

// ========== User table ========== //

function userTableAddRow(user) {
    $('#adminUserList tbody').append(`
        <tr user-id=${user.id} user-first-name=${user.first_name} user-last-name=${user.last_name}>
            <td>${user.email}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.status}</td>
            <td>
                <button type="button" class="btn btn-outline-primary btn-sm" title="See user" onclick="seeUser(this)"><i class="far fa-eye"></i></i></button>
                <button type="button" class="btn btn-outline-warning btn-sm" title="Block from selling" onclick="showBlockUserModal(this)"><i class="fas fa-ban"></i></button>
                <button type="button" class="btn btn-outline-danger btn-sm" title="Delete user" onclick="showDeleteUserModal(this)"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `)
}

function seeUser(el) {
    userID = $(el).parents('tr').first().attr('user-id')
    window.location.href = `/system?user-id=${user}`
}

function showBlockUserModal(el) {
    $('#blockUserID').val($(el).parents('tr').first().attr('user-id'))
    $('#blockUserFirstName').html($(el).parents('tr').first().attr('user-first-name'))
    $('#blockUserLastName').html($(el).parents('tr').first().attr('user-last-name'))
    $('#blockUserModal').modal('show')
}

function showDeleteUserModal(el) {
    $('#deleteUserID').val($(el).parents('tr').first().attr('user-id'))
    $('#deleteUserFirstName').html($(el).parents('tr').first().attr('user-first-name'))
    $('#deleteUserLastName').html($(el).parents('tr').first().attr('user-last-name'))
    $('#deleteUserModal').modal('show')
}

// ========== Block user form ========== //

function blockUserFormData() {
    return {
        user_id: $('#blockUserID').val(),
        time: $('#blockUserTime').val(),
        time_unit: $('#blockUserTimeUnit').val()
    }
}

function blockUserFormSuccess(data) {
    $('#blockUserModal').modal('hide')
    showSystemMessage(data.message, MessageType.success)
}

// ========== Delete user form ========== //

function deleteUserFormData() {
    return {
        user_id: $('#deleteUserID').val()
    }
}

function deeteUserFormSuccess(data) {
    $('#deleteUserModal').modal('hide')
    showSystemMessage(data.message, MessageType.success)
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
