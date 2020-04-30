// List of blacklisted regexs to test against
regexs = {
    phone: [new RegExp(/(800){1}\d{7}/), new RegExp(/(555){1}\d{7}/)],
    email: [new RegExp(/.*(@hotmail)[.](com)/)]
}

// Tests whether the input field has a value matching a regular expression defined above
// To use:
// 1) add new key/value pair to the 'regexs' object
// 2) add checkRegex: regexs[key] to a class rule below, with the key matching the key in 'regexs' object
jQuery.validator.addMethod("checkRegex", function(value, element, params) {
    for (let i = 0; i < params.length; i++) {
        if (params[i].test(value)) {
            return false;
        }
    }
    return true;
}, "Invalid input.");

// https://jqueryvalidation.org/rules/
// https://jqueryvalidation.org/jQuery.validator.addClassRules/
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
        email: true,
        checkRegex: regexs['email']
    },
    pemail: {
        email: true,
        checkRegex: regexs['email']
    },
    phone: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
        checkRegex: regexs['phone']
    },
    pphone: {
        digits: true,
        minlength: 10,
        maxlength: 10,
        checkRegex: regexs['phone']
    },
    zip: {
        digits: true,
        minlength: 5,
        maxlength: 5
    },
    select: {
        required: true
    },
    eContactName: {
        required: true,
        testEContactName: true,
    },
    eContactPhone: {
        required: true,
        digits: true,
        minlength: 10,
        maxlength: 10,
        testEContactPhone: true,
        checkRegex: regexs['phone']
    },
    relation: {
        required: true
    }
});

// Custom validation methods
// https://jqueryvalidation.org/jQuery.validator.addMethod/

// Validates whether all party member names are unique, 
// e.g. Bob Smith cannot be the registrant and Party member 1
jQuery.validator.addMethod("testpName", function(value, element) {
    // Grab registrant information as you will always be checking against that
    let regFName = $("#regfirstname").val().toUpperCase().replace(/\s/g,'');
    let regLName = $("#reglastname").val().toUpperCase().replace(/\s/g,'');
    // Grab current participant id from element
    let currPartId = $(`#${element.id}`).attr('partId');
    let currPartFName = $(`#part${currPartId}fname`)[0].value.toUpperCase().replace(/\s/g,'');
    let currPartLName = value.toUpperCase().replace(/\s/g,'');
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
                // If current participant shares name with another participant, invalid
                if ((currPartFName + currPartLName) == (newPartFName + newPartLName)) {
                    return false;
                }
            }
        }
        return true;
    }
}, 'Participant name must be unique.');

// Validates whether all emergency contacts aren't also party members or the registrant
// e.g. Bob Smith cannot be the registrant's emergency contact and Party member 1
jQuery.validator.addMethod("testEContactName", function(value, element) {
    // First grab registrant information, as you will always test against it
    let regFName = $("#regfirstname").val().toUpperCase().replace(/\s/g,'');
    let regLName = $("#reglastname").val().toUpperCase().replace(/\s/g,'');
    // If the current element is the registrant emergency contact, check that against registrant name
    // If they match, invalid
    if ((element.id == 'regename') && (element.value.toUpperCase().replace(/\s/g,'') == (regFName + regLName))) {
        return false;
    }
    let currEContactName = value.toUpperCase().replace(/\s/g,'');
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
            // If current emergency contact name equals a party member's name, invalid
            if (currEContactName == (newPartFName + newPartLName)) {
                return false;
            }
        }
        return true;
    }
}, 'Emergency contact cannot be in your party.');

// Validates whether all emergency contact phone numbers aren't also a party member's phone number
// e.g. Bob Smith's registrant phone number is not also Party member 1's emergency contact phone number
jQuery.validator.addMethod("testEContactPhone", function(value, element) {
    // First grab registrant information, as you will always test against it
    let regPhone = $("#regphone").val().toUpperCase().replace(/\s/g,'');
    // If the current element is the registrant emergency contact, check that against registrant name
    // If they match, invalid
    if ((element.id == 'regephone') && (element.value.toUpperCase().replace(/\s/g,'') == regPhone)) {
        return false;
    }
    let currEContactPhone = value.toUpperCase().replace(/\s/g,'');
    // If current emergency contact name equals registrant name, invalid
    if (regPhone == currEContactPhone) {
        return false;
    }
    else {
        let phoneNumbers = $(".pphone");
        for (let i = 0; i < phoneNumbers.length; i++) {
            let newPartPhone = phoneNumbers[i].value.toUpperCase().replace(/\s/g,'');
            // If current emergency contact number equals a party member's number, invalid
            if (currEContactPhone == newPartPhone) {
                return false;
            }
        }
        return true;
    }
}, 'Cannot be a party member\'s number.');

// Applies custom class to the errors generated by the plugin
$("#eventSignupForm").validate({
    errorClass: "validationError"
});
