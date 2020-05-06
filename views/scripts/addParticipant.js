$("#addpart").click(add_function);
//function that will add an extra participant div containing all the questions needed for an extra party member
function add_function(event) {
    var intId = $("#partymembers div").length + 1; //checks div of parent page that contains the extra party members for how many extra party members there are
    if(intId < $(this).attr("maxSize")) { //checks to make sure that the new participant added will not exceed the max party size for the event
        var partWrapper = $(`<div style="text-align:right; padding-right:25%;" class="partwrapper" id="part${intId}"/>`);
        partWrapper.data("idx", intId);
        //declares the labels and fields for the new div
        var pLabel = $(`<h2>Party Member ${intId + 1}</h2>`);
        var pFNameLabel = $(`<label for="part${intId}fname">Participant ${intId + 1} First Name: </label>`);
        var pFName = $(`<input required type="text" id="part${intId}fname" name="part${intId}fname" class="partFName name" placeholder="Party Member First Name Here"><br>`);
        var pLNameLabel = $(`<label for="part${intId}lname" >Participant ${intId + 1} Last Name: </label>`);
        var pLName = $(`<input required type="text" id="part${intId}lname" partId=${intId} name="part${intId}lname" class="partLName pname" placeholder="Party Member Last Name Here"><br>`);
        var pAgeLabel = $(`<label for="part${intId}age" >Over 18? </label>`);
        var pAge = $(`<select required name= "part${intId}age" class="select"><option selected disabled hidden style="display: none" value=""></option><option value=0>No</option><option value=1>Yes</option></select><br>`);
        var pSwimLabel = $(`<label for="part${intId}swim" >Can they swim? </label>`);
        var pSwim = $(`<select required name="part${intId}swim" class="select"><option selected disabled hidden style="display: none" value=""></option><option value=0>No</option><option value=1>Yes</option></select><br>`);
        var pBoatLabel = $(`<label for="part${intId}boat" >Prior boating experience? </label>`);
        var pBoat = $(`<select required name="part${intId}boat" class="select"><option selected disabled hidden style="display: none" value=""></option><option value=0>No</option><option value=1>Yes</option></select><br>`);
        var pCPRLabel = $(`<label for="part${intId}cpr" >Do they know CPR? </label>`);
        var pCPR = $(`<select required name="part${intId}cpr" class="select"><option selected disabled hidden style="display: none" value=""></option><option value="false">No</option><option value="true">Yes</option></select><br>`);
        var pEmailLabel = $(`<label for="part${intId}email" >Participant ${intId + 1} Email: </label>`);
        var pEmail = $(`<input type="text" id="part${intId}email" name="part${intId}email" class="pemail" placeholder="Party Member Email Here"/><br>`);
        var pPhoneLabel = $(`<label for="part${intId}phone" >Participant ${intId + 1} Phone Number: </label>`);
        var pPhone = $(`<input type="text" id="part${intId}phone" name="part${intId}phone" class="pphone" placeholder="Party Member Phone Number Here"/><br>`);
        var pENameLabel = $(`<label for="part${intId}ename" >Participant ${intId + 1} Emergency Contact Name: </label>`);
        var pEName = $(`<input required type="text" id="part${intId}ename" name="part${intId}ename" class="eContactName" placeholder="Party Member Emergency Contact Name Here"/><br>`);
        var pERelationLabel = $(`<label for="part${intId}erelation" >Participant ${intId + 1} Emergency Contact Relationship: </label>`);
        var pERelation = $(`<input type="text" id="part${intId}erelation" name="part${intId}erelation" class = "relation" required><br>`);
        var pEPhoneLabel = $(`<label for="part${intId}ephone" >Participant ${intId + 1} Emergency Contact Phone Number: </label>`);
        var pEPhone = $(`<input required type="text" id="part${intId}ephone" name="part${intId}ephone" class="eContactPhone" placeholder="Party Member Emergency Contact Phone Number Here"/><br>`);
        //appends the lables and field names in order of appearance for the form onto the new div to be added
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
        partWrapper.append(pERelationLabel);
        partWrapper.append(pERelation);
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
        $("#partymembers").append(partWrapper); //appends newly created div to the form
    } else { //sends alert message to screen that the max party size has been reached for the event
        alert("Max Party Size Reached");
    }
}

$("#remove").click(function () { //remove the last div(last new partymember) in the partymembers div
    $('div:last-child', '#partymembers').remove();
});
