function loginFormData() {
    return {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
    }
}

function loginFormSuccess(user) {
    window.location.href = '/';
}
