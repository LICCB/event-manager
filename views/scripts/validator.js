jQuery.validator.addClassRules({
    volunteer: {
        required: true,
    },
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
    },
    eContactName: {
        required: true,
        testEContactName: true
    }
});

jQuery.validator.addMethod("testpName", function(value, element) {
    // Grab registrant information as you will always be checking against that
    let regFName = $("#regfirstname").val().toUpperCase().replace(/\s/g,'');
    let regLName = $("#reglastname").val().toUpperCase().replace(/\s/g,'');
    // Grab current participant id from element
    let currPartId = $(`#${element.id}`).attr('partId');
    let currPartFName = $(`.part${currPartId}`)[0].value.toUpperCase().replace(/\s/g,'');
    let currPartLName = value.toUpperCase().replace(/\s/g,'');
    console.log('Registrant', regFName+regLName);
    console.log('Current Participant', currPartFName+currPartLName);
    // If the current participant shares name with registrant, invalid
    if ((currPartFName + currPartLName) == (regFName + regLName)) {
        return false;
    }
    else {
        let firstNames = $(".partFName");
        let lastNames = $(".partLName");
        for (let i = 0; i < firstNames.length; i++) {
            // Participant id starts at 1
            if (i+1 != currPartId) {
                let newPartFName = firstNames[i].value.toUpperCase().replace(/\s/g,'');
                let newPartLName = lastNames[i].value.toUpperCase().replace(/\s/g,'');
                console.log('Other Participant', newPartFName+newPartLName);
                // If current participant shares name with another participant, invalid
                if ((currPartFName + currPartLName) == (newPartFName + newPartLName)) {
                    return false;
                }
            }
        }
        return true;
    }
}, 'Participant full name must be unique.');

jQuery.validator.addMethod("testEContactName", function(value, element) {
    // First grab registrant information, as you will always test against it
    let regFName = $("#regfirstname").val().toUpperCase().replace(/\s/g,'');
    let regLName = $("#reglastname").val().toUpperCase().replace(/\s/g,'');
    console.log('Registrant', regFName+regLName);
    // If the current element is the registrant emergency contact, check that against registrant name
    // If they match, invalid
    if ((element.id == 'regename') && (element.value.toUpperCase().replace(/\s/g,'') == (regFName + regLName))) {
        return false;
    }
    let currEContactName = value.toUpperCase().replace(/\s/g,'');
    console.log('Current Participant', currEContactName);
    // If current emergency contact name equals registrant name, invalid
    if ((regFName + regLName) == currEContactName) {
        return false;
    }
    else {
        let firstNames = $(".partFName");
        let lastNames = $(".partLName");
        for (let i = 0; i < firstNames.length; i++) {
            let newPartFName = firstNames[i].value.toUpperCase().replace(/\s/g,'');
            let newPartLName = lastNames[i].value.toUpperCase().replace(/\s/g,'');
            console.log('Other Participant', newPartFName+newPartLName);
            // If current emergency contact name equals a party member's name, invalid
            if (currEContactName == (newPartFName + newPartLName)) {
                return false;
            }
        }
        return true;
    }
}, 'Emergency contact cannot be in your party.');

$("#eventSignupForm").validate({
    errorClass: "validationError"
});

// https://jqueryvalidation.org/jQuery.validator.addMethod/
// http://regexlib.com/DisplayPatterns.aspx?cattabindex=3&categoryId=4 