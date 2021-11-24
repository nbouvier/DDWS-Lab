function registerFormValidation() {
    console.log("register form validation")
    return true
}

function registerFormData() {
    return {
        first_name: $('#registerFirstName').val(),
        last_name: $('#registerLastName').val(),
        email: $('#registerEmail').val(),
        password: $('#registerPassword').val()
    }
}

function registerFormSuccess(user) {
    console.log(user)
}
