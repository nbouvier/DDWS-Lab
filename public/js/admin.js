// ========== Page loading ========== //

function loadAdminPage() {
    $.ajax({
        url: '/api/user/all',
        type: 'POST',
        dataType: 'JSON',

        success: data => {
            if(data.error) {
                showSystemMessage(data.error, MessageType.danger)
                reject(data.error)
                return
            }

            data.result.users.forEach(async user => {
                house = user.type != 'admin' ? await loadHouse(user.house_id) : null
                userTableAddRow(user, house)
            })
        },

        error: error => console.log(error)
    })
}

// ========== House ========== //

function loadHouse(houseID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/house/one',
            type: 'POST',
            dataType: 'JSON',
            data: { id: houseID },

            success: data => {
                if(data.error) {
                    showSystemMessage(data.error, MessageType.danger)
                    reject(data.error)
                    return
                }

                resolve(data.result.house)
            },

            error: error => reject(error)
        })
    })
}

// ========== User table ========== //

function userTableAddRow(user, house = null) {
    blackout = house ? house.blackout : 0
    rowBackground = blackout > 0 ? blackout < 100 ? 'bg-warning' : 'bg-danger' : ''
    textColor = blackout > 0 ? blackout < 100 ? 'text-warning' : 'text-danger' : ''

    $('#adminUserList tbody').append(`
        <tr data-user-id=${user.id} data-user-first-name=${user.first_name} data-user-last-name=${user.last_name} class="${rowBackground} ${textColor} ${blackout ? 'font-weight-bold' : ''}">
            <td class="pr-0">
                ${blackout ? `
                    <i class="fas fa-bolt"></i>
                    <small class="font-weight-bold">${100 - blackout} %</small>
                ` : ''}
            </td>
            <td>${user.email}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.status}</td>
            <td class="pl-0">
                <button type="button" class="btn btn-outline-primary btn-sm seeUser" title="See user"><i class="far fa-eye"></i></i></button>
                <button type="button" class="btn btn-outline-warning btn-sm blockUser" title="Block from selling"><i class="fas fa-ban"></i></button>
                <button type="button" class="btn btn-outline-danger btn-sm deleteUser" title="Delete user""><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `)
}

function seeUser() {console.log(this)
    userID = $(this).parents('tr').first().attr('data-user-id')
    window.location.href = `/profile/${userID}`
}

function showBlockUserModal() {
    $('#blockUserID').val($(this).parents('tr').first().attr('data-user-id'))
    $('#blockUserFirstName').html($(this).parents('tr').first().attr('data-user-first-name'))
    $('#blockUserLastName').html($(this).parents('tr').first().attr('data-user-last-name'))
    $('#blockUserModal').modal('show')
}

function showDeleteUserModal() {
    $('#deleteUserID').val($(this).parents('tr').first().attr('data-user-id'))
    $('#deleteUserFirstName').html($(this).parents('tr').first().attr('data-user-first-name'))
    $('#deleteUserLastName').html($(this).parents('tr').first().attr('data-user-last-name'))
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
    showSystemMessage(data.message, MessageType.success)
    $('#blockUserModal').modal('hide')
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

    loadAdminPage()

    $('#adminUserList').on('click', '.seeUser', seeUser)
    $('#adminUserList').on('click', '.blockUser', showBlockUserModal)
    $('#adminUserList').on('click', '.deleteUser', showDeleteUserModal)

})
