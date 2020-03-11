jQuery.validator.addClassRules('name', {
    required: true,
    pattern: /^[A-Za-z]+[ ]{0,1}[-]{0,1}[']{0,1}[A-Za-z]*$/,
    messages: {
        required: "First name is required.",
        pattern: "Names must include only letters, hyphens, or spaces."
    }
});
jQuery.validator.addClassRules('email', {
    required: true,
    email: true,
    messages: {
        required: "First name is required.",
        email: "Emails must be in the format 'example@example.com'."
    }
});
jQuery.validator.addClassRules('phone', {
    required: true,
    pattern: /^\d{3}[-]{0,1}\d{3}[-]{0,1}\d{4}$/,
    messages: {
        required: "Phone number is required.",
        pattern: "Phone numbers must be in the format '123-456-7890' or '1234567890'."
    }
});
jQuery.validator.addClassRules('zip', {
    required: true,
    pattern: /^\d{5}$/,
    messages: {
        required: "Zip Code is required.",
        pattern: "Zip codes must be in the format '12345'."
    }
});

$("#publicSignupform").validate({});

// Checks all form input and if all pass, submit form
function validateInput() {
    let errorText = '';
    // First check required fields
    let allInputs = $('#publicSignupform').find('input, select');
    for (let i = 0; i < allInputs.length; i++) {
        if (allInputs[i].name == 'eventID' & allInputs[i].value == '') {
            errorText += "You must select an event to register for.\n";
            $(allInputs[i]).attr('class', 'form-control is-invalid');
        }
        else if (allInputs[i].name == 'zipcode' & allInputs[i].value == '') {
            errorText += "Zip Code is a required field.\n";
            currInput = $(allInputs[i]);
            currInput.attr('class', `${currInput.attr('class')} form-control is-invalid`);
        }
        else if (allInputs[i].required & allInputs[i].value == '') {
            prettyName = $(`label[for='${allInputs[i].name}']`)[0].innerText.replace(':','');
            errorText += `${prettyName} is a required field.\n`;
            currInput = $(allInputs[i]);
            currInput.attr('class', `${currInput.attr('class')} form-control is-invalid`);
        }
    }
    if (errorText != '') {
        $("#errorDiv").text(errorText);
        $("#errorDiv").attr('style', 'display: block;');
        return;
    }

    // Validate input
    let names = $(".name");
    if (names.length > 0) {
        // Allows names with letters, spaces(for emergency contact name), hyphens, and apostrophes
        nameRegex = /^[A-Za-z]+[ ]{0,1}[-]{0,1}[']{0,1}[A-Za-z]*$/;
        for (let i = 0; i < names.length; i++) {
            if(!nameRegex.test(names[i].value)){
                prettyName = $(`label[for='${names[i].name}']`)[0].innerText.replace(':','');
                if (names[i].value == '' & names[i].required) {
                    alert(`${prettyName} is a required field.`);
                }
                else {
                    alert(`${names[i].value} is invalid input for ${prettyName}.\nNames must contain only letters, hyphens, and apostrophes`);
                }
                return;
            }
        }
    }

    let emails = $(".email");
    if (emails.length > 0) {
        // Requires an @ symbol and a period, with letters before, between, and after each
        emailRegex = /^[A-Za-z]+[@][A-Za-z]+[.][A-Za-z]+$/;
        for (let i = 0; i < emails.length; i++) {
            if(!emailRegex.test(emails[i].value)){
                prettyName = $(`label[for='${emails[i].name}']`)[0].innerText.replace(':','');
                alert(`${emails[i].value} is invalid input for ${prettyName}.\nEmails must be in the form 'example@example.com'`);
                return;
            }
        }
    }

    let pNums = $(".phone");
    if (pNums.length > 0) {
        // Allows phone number in the form '123-456-7890' with the hyphens being optional
        phoneRegex = /^\d{3}[-]{0,1}\d{3}[-]{0,1}\d{4}$/;
        for (let i = 0; i < pNums.length; i++) {
            if(!phoneRegex.test(pNums[i].value)){
                prettyName = $(`label[for='${pNums[i].name}']`)[0].innerText.replace(':','');
                alert(`${pNums[i].value} is invalid input for ${prettyName}.\nPhone number must be in the format '123-456-7890' or '1234567890'`);
                return;
            }
        }
    }
      
    let zipCodes = $(".zip");
    if (zipCodes.length > 0) {
        // Allows zip codes in the form '12345' or '12345-6789'
        zipRegex = /^\d{5}[-]{0,1}\d{4}$|\d{5}$/;
        for (let i = 0; i < zipCodes.length; i++) {
            if(!zipRegex.test(zipCodes[i].value)){
                alert(`${zipCodes[i].value} is invalid input for Zip Code.\nZip code must be in the format '12345' or '12345-6789'`);
                return;
            }
        }
    }

    // If all validations passed, submit the form
    $("#submitForm").click();
}