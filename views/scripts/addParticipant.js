$("#addpart").click(function () {
    var lastMemeber = $("#partymembers div:last");
    var intId = (lastMemeber && lastMemeber.length && lastMemeber.data("idx") + 1) || 1;
    var partWrapper = $(`<div class="partwrapper" id="part${intId}"/>`);
    partWrapper.data("idx", intId);

    var pLabel = $(`<h2>Party Member ${intId}</h2>`);
    var pFNameLabel = $(`<label for="part${intId}fname" >Participant ${intId} First Name:</label>`);
    var pFName = $(`<input required type="text" id="part${intId}fname" name="part${intId}fname" class="fname" placeholder="Party Member First Name Here">`);
    var pLNameLabel = $(`<label for="part${intId}lname" >Participant ${intId} Last Name:</label>`);
    var pLName = $(`<input required type="text" id="part${intId}lname" name="part${intId}lname" class="lname" placeholder="Party Member Last Name Here">`);
    var pAgeLabel = $(`<label for="part${intId}age" >Over 18?</label>`);
    var pAge = $(`<select required name= "part${intId}age"><option selected disabled hidden style="display: none" value=""></option><option value="false">No</option><option value="true">Yes</option></select>`);
    var pSwimLabel = $(`<label for="part${intId}swim" >Can they swim?</label>`);
    var pSwim = $(`<select required name="part${intId}swim"><option selected disabled hidden style="display: none" value=""></option><option value="false">No</option><option value="true">Yes</option></select>`);
    var pBoatLabel = $(`<label for="part${intId}boat" >Prior boating experience?</label>`);
    var pBoat = $(`<select required name="part${intId}boat"><option selected disabled hidden style="display: none" value=""></option><option value="false">No</option><option value="true">Yes</option></select>`);
    var pCPRLabel = $(`<label for="part${intId}cpr" >Do they know CPR?</label>`);
    var pCPR = $(`<select required name="part${intId}cpr"><option selected disabled hidden style="display: none" value=""></option><option value="false">No</option><option value="true">Yes</option></select>`);
    var pEmailLabel = $(`<label for="part${intId}email" >Participant ${intId} Email:</label>`);
    var pEmail = $(`<input type="text" id="part${intId}email" name="part${intId}email" class="email" placeholder="Party Member Email Here"/>`);
    var pPhoneLabel = $(`<label for="part${intId}phone" >Participant ${intId} Phone Number:</label>`);
    var pPhone = $(`<input type="text" id="part${intId}phone" name="part${intId}phone" class="phone" placeholder="Party Member Phone Number Here"/>`);
    var pENameLabel = $(`<label for="part${intId}ename" >Participant ${intId} Emergencey Contact Name:</label>`);
    var pEName = $(`<input required type="text" id="part${intId}ename" name="part${intId}ename" class="name" placeholder="Party Member Emergency Contact Name Here"/>`);
    var pEPhoneLabel = $(`<label for="part${intId}ephone" >Participant ${intId} Emergency Contact Phone Number:</label>`);
    var pEPhone = $(`<input required type="text" id="part${intId}ephone" name="part${intId}ephone" class="phone" placeholder="Party Member Emergency Contact Phone Number Here"/>`);

    partWrapper.append(pLabel);
    partWrapper.append(pFNameLabel);
    partWrapper.append(pFName);
    partWrapper.append(pLNameLabel);
    partWrapper.append(pLName);
    partWrapper.append(pAgeLabel);
    partWrapper.append(pAge);
    partWrapper.append(pSwimLabel);
    partWrapper.append(pSwim);
    partWrapper.append(pBoatLabel);
    partWrapper.append(pBoat);
    partWrapper.append(pCPRLabel);
    partWrapper.append(pCPR);
    partWrapper.append(pEmailLabel);
    partWrapper.append(pEmail);
    partWrapper.append(pPhoneLabel);
    partWrapper.append(pPhone);
    partWrapper.append(pENameLabel);
    partWrapper.append(pEName);
    partWrapper.append(pEPhoneLabel);
    partWrapper.append(pEPhone);
    $("#partymembers").append(partWrapper);
});

$("#remove").click(function () {
    $('div:last-child', '#partymembers').remove();
});