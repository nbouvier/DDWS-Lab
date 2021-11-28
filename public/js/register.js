function registerFormData() {
    return {
        first_name: $('#registerFirstName').val(),
        last_name: $('#registerLastName').val(),
        email: $('#registerEmail').val(),
        password: $('#registerPassword').val()
    }
}
