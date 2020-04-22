$("#addpart").click(function () {
    var intId = $("#partymembers div").length + 1;
    var partWrapper = $(`<div style="text-align:right; padding-right:25%;" class="partwrapper" id="part${intId}"/>`);
    partWrapper.data("idx", intId);

    var pLabel = $(`<h2>Party Member ${intId}</h2>`);
    var pFNameLabel = $(`<label for="part${intId}fname">Participant ${intId} First Name: </label>`);
    var pFName = $(`<input   type="text" id="part${intId}fname" name="part${intId}fname" class="name part${intId} partFName" partId=${intId} placeholder="Party Member First Name Here"><br>`);
    var pLNameLabel = $(`<label for="part${intId}lname" >Participant ${intId} Last Name: </label>`);
    var pLName = $(`<input   type="text" id="part${intId}lname" name="part${intId}lname" class="pname part${intId} partLName lname" partId=${intId} placeholder="Party Member Last Name Here"><br>`);
    var pAgeLabel = $(`<label for="part${intId}age" >Over 18? </label>`);
    var pAge = $(`<select   name= "part${intId}age" class="select"><option selected disabled hidden style="display: none" value=""></option><option value=0>No</option><option value=1>Yes</option></select><br>`);
    var pSwimLabel = $(`<label for="part${intId}swim" >Can they swim? </label>`);
    var pSwim = $(`<select   name="part${intId}swim" class="select"><option selected disabled hidden style="display: none" value=""></option><option value=0>No</option><option value=1>Yes</option></select><br>`);
    var pBoatLabel = $(`<label for="part${intId}boat" >Prior boating experience? </label>`);
    var pBoat = $(`<select   name="part${intId}boat" class="select"><option selected disabled hidden style="display: none" value=""></option><option value=0>No</option><option value=1>Yes</option></select><br>`);
    var pCPRLabel = $(`<label for="part${intId}cpr" >Do they know CPR? </label>`);
    var pCPR = $(`<select   name="part${intId}cpr" class="select"><option selected disabled hidden style="display: none" value=""></option><option value="false">No</option><option value="true">Yes</option></select><br>`);
    var pEmailLabel = $(`<label for="part${intId}email" >Participant ${intId} Email: </label>`);
    var pEmail = $(`<input type="text" id="part${intId}email" name="part${intId}email" class="pemail" placeholder="Party Member Email Here"/><br>`);
    var pPhoneLabel = $(`<label for="part${intId}phone" >Participant ${intId} Phone Number: </label>`);
    var pPhone = $(`<input type="text" id="part${intId}phone" name="part${intId}phone" class="pphone" placeholder="Party Member Phone Number Here"/><br>`);
    var pENameLabel = $(`<label for="part${intId}ename" >Participant ${intId} Emergency Contact Name: </label>`);
    var pEName = $(`<input   type="text" id="part${intId}ename" name="part${intId}ename" class="eContactName" placeholder="Party Member Emergency Contact Name Here"/><br>`);
    var pEPhoneLabel = $(`<label for="part${intId}ephone" >Participant ${intId} Emergency Contact Phone Number: </label>`);
    var pEPhone = $(`<input   type="text" id="part${intId}ephone" name="part${intId}ephone" class="eContactPhone" placeholder="Party Member Emergency Contact Phone Number Here"/><br>`);



    partWrapper.append(pLabel);
    partWrapper.append(pFNameLabel);
    partWrapper.append(pFName);
    partWrapper.append(pLNameLabel);
    partWrapper.append(pLName);
    partWrapper.append(pEmailLabel);
    partWrapper.append(pEmail);
    partWrapper.append(pPhoneLabel);
    partWrapper.append(pPhone);
    partWrapper.append(pENameLabel);
    partWrapper.append(pEName);
    partWrapper.append(pEPhoneLabel);
    partWrapper.append(pEPhone);
    partWrapper.append(pAgeLabel);
    partWrapper.append(pAge);
    partWrapper.append(pSwimLabel);
    partWrapper.append(pSwim);
    partWrapper.append(pBoatLabel);
    partWrapper.append(pBoat);
    partWrapper.append(pCPRLabel);
    partWrapper.append(pCPR);
    $("#partymembers").append(partWrapper);
});

$("#remove").click(function () {
    $('div:last-child', '#partymembers').remove();
});
