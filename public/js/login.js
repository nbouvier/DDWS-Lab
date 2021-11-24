function loginFormValidation() {
    console.log("login form validation")
    return true
}

function loginFormData() {
    return {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
    }
}

function loginFormSuccess(user) {
    console.log(user)
}
