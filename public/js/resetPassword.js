function resetPasswordFormData() {
    return {
        hash: $('#resetPasswordHash').val(),
        password: $('#resetPasswordPassword').val(),
        password_confirmation: $('#resetPasswordPasswordConfirmation').val()
    }
}

function resetPasswordFormSuccess(data) {
    showSystemMessage(data.message, MessageType.success)
    setTimeout(() => window.location.href = `/`, 2000)
}
