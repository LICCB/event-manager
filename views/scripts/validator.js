jQuery.validator.addClassRules({
    name: {
        required: true,
    },
    email: {
        required: true,
        email: true
    },
    phone: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10
    },
    zip: {
        required: true,
        digits: true,
        minlength: 5,
        maxlength: 5
    },
    select: {
        required: true
    }
});

$("#publicSignupform").validate();