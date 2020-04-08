jQuery.validator.addClassRules({
    name: {
        required: true,
    },
    pname: {
        required: true,
        testpName: true,
    },
    email: {
        required: true,
        email: true
    },
    pemail: {
        email: true
    },
    phone: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10
    },
    pphone: {
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

jQuery.validator.addMethod("testpName", function(value, element) {
    // console.log(value, element);
    let regFName = $("#regfirstname").val().toUpperCase();
    let regLName = $("#reglastname").val().toUpperCase();
    let partId = $(`#${element.id}`).attr('partId');
    let partFName = $(`.part${partId}`)[0].value.toUpperCase();
    let partLName = value.toUpperCase();
    // console.log(partFName+partLName);
    return this.optional(element) || (partFName + partLName) != (regFName + regLName);
}, 'Participant name cannot equal registrant name.');

$("#eventSignupForm").validate({
    errorClass: "validationError"
});

// https://jqueryvalidation.org/jQuery.validator.addMethod/