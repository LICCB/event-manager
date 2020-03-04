$(function() {
    $("form[id = 'publicSignupform'").validate({
        rules: {
            fname: {
                required: true,
            },
            lname: {
                required: true,
            },
            email: {
                email: true
            },
            phone: {
                phone: true
            },
            zip: {
                required: true,
                length: 5
            }
        },
        messages: {
            email: "Please enter a valid email address",
            phone: "Please enter a valid phone number",
            zip: {
                required: "Please enter your zip code",
                length:"Please enter a valid 5 digit zip code"
            }
        },
        submitHandler: function(form) {
            form.submit();
        }
    })
})