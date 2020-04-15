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
    },
    eContactPhone: {
        required: true,
        testEContactPhone: true
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

// Validates whether all emergency contacts aren't also party members or the registrant
// e.g. Bob Smith cannot be the registrant's emergency contact and Party member 1
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

// Validates whether all emergency contact phone numbers aren't also a party member's phone number
// e.g. Bob Smith's registrant phone number is not also Party member 1's emergency contact phone number
jQuery.validator.addMethod("testEContactPhone", function(value, element) {
    // First grab registrant information, as you will always test against it
    let regPhone = $("#regphone").val().toUpperCase().replace(/\s/g,'');
    console.log('Registrant', regPhone);
    // If the current element is the registrant emergency contact, check that against registrant name
    // If they match, invalid
    if ((element.id == 'regephone') && (element.value.toUpperCase().replace(/\s/g,'') == regPhone)) {
        return false;
    }
    let currEContactPhone = value.toUpperCase().replace(/\s/g,'');
    console.log('Current Participant', currEContactPhone);
    // If current emergency contact name equals registrant name, invalid
    if (regPhone == currEContactPhone) {
        return false;
    }
    else {
        let phoneNumbers = $(".pphone");
        for (let i = 0; i < phoneNumbers.length; i++) {
            let newPartPhone = phoneNumbers[i].value.toUpperCase().replace(/\s/g,'');
            console.log('Other Participant', newPartPhone);
            // If current emergency contact number equals a party member's number, invalid
            if (currEContactPhone == newPartPhone) {
                return false;
            }
        }
        return true;
    }
}, 'Cannot be a party member\'s number.');

// Config file with list of regex to test various fields against 
// http://regexlib.com/DisplayPatterns.aspx?cattabindex=3&categoryId=4 

$("#eventSignupForm").validate({
    errorClass: "validationError"
});