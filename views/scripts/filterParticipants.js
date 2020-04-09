$('#regStatus').click(function(){
  var value = "";
  if ($(this).prop("checked") == true) {
    value = "regStatusCheckedYes";
  } else {
    value = "regStatusCheckedNo";
  }
  updateCheckbox(value);
});
function isAdultFunction() {
  var x = document.getElementById("isAdult").value;
  if (x == "yes") {
    value = "isAdultCheckedYes";
  } else {
    value = "isAdultCheckedNo";
  }
  updateCheckbox(value);
}
function canSwimFunction() {
  var x = document.getElementById("canSwim").value;
  if (x == "yes") {
    value = "canSwimCheckedYes";
  } else {
    value = "canSwimCheckedNo";
  }
  updateCheckbox(value);
}
function hasCPRCertFunction() {
  var x = document.getElementById("hasCPRCert").value;
  if (x == "yes") {
    value = "hasCPRCertCheckedYes";
  } else {
    value = "hasCPRCertCheckedNo";
  }
  updateCheckbox(value);
}
function boatExperienceFunction() {
  var x = document.getElementById("boatExperience").value;
  if (x == "yes") {
    value = "boatExperienceCheckedYes";
  } else {
    value = "boatExperienceCheckedNo";
  }
  updateCheckbox(value);
}
function priorVolunteerFunction() {
  var x = document.getElementById("priorVolunteer").value;
  if (x == "yes") {
    value = "priorVolunteerCheckedYes";
  } else {
    value = "priorVolunteerCheckedNo";
  }
  updateCheckbox(value);
}
function roleFamiliarityFunction() {
  var x = document.getElementById("roleFamiliarity").value;
  if (x == "yes") {
    value = "roleFamiliarityCheckedYes";
  } else {
    value = "roleFamiliarityCheckedNo";
  }
  updateCheckbox(value);
}
function volunteerFunction() {
  var x = document.getElementById("volunteer").value;
  if (x == "yes") {
    value = "volunteerCheckedYes";
  } else {
    value = "volunteerCheckedNo";
  }
  updateCheckbox(value);
}
// $('#isAdult').click(function(){
//   var value = "";
//   if ($(this).prop("checked") == true) {
//     value = "isAdultCheckedYes";
//   } else {
//     value = "isAdultCheckedNo";
//   }
//   updateCheckbox(value);
// });
// $('#canSwim').click(function(){
//   var value = "";
//   if ($(this).prop("checked") == true) {
//     value = "canSwimCheckedYes";
//   } else {
//     value = "canSwimCheckedNo";
//   }
//   updateCheckbox(value);
// });
// $('#hasCPRCert').click(function(){
//   var value = "";
//   if ($(this).prop("checked") == true) {
//     value = "hasCPRCertCheckedYes";
//   } else {
//     value = "hasCPRCertCheckedNo";
//   }
//   updateCheckbox(value);
// });
// $('#boatExperience').click(function(){
//   var value = "";
//   if ($(this).prop("checked") == true) {
//     value = "boatExperienceCheckedYes";
//   } else {
//     value = "boatExperienceCheckedNo";
//   }
//   updateCheckbox(value);
// });
// $('#priorVolunteer').click(function(){
//   var value = "";
//   if ($(this).prop("checked") == true) {
//     value = "priorVolunteerCheckedYes";
//   } else {
//     value = "priorVolunteerCheckedNo";
//   }
//   updateCheckbox(value);
// });
// $('#roleFamiliarity').click(function(){
//   var value = "";
//   if ($(this).prop("checked") == true) {
//     value = "roleFamiliarityCheckedYes";
//   } else {
//     value = "roleFamiliarityCheckedNo";
//   }
//   updateCheckbox(value);
// });$('#volunteer').click(function(){
//   var value = "";
//   if ($(this).prop("checked") == true) {
//     value = "volunteerCheckedYes";
//   } else {
//     value = "volunteerCheckedNo";
//   }
//   updateCheckbox(value);
// });

// regStatus, isAdult, canSwim, hasCPRCert, boatExperience, priorVolunteer, roleFamiliarity, volunteer
var code = "00000000"
function updateCheckbox(checkbox) {
  // code builder
  switch (checkbox) {
   case "regStatusCheckedYes":
      code = "1" + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "regStatusCheckedNo":
      code = "0" + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "isAdultCheckedYes":
      code = code.charAt(0) + "1" + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "isAdultCheckedNo":
      code = code.charAt(0) + "0" + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "canSwimCheckedYes":
      code = code.charAt(0) + code.charAt(1) + "1" + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "canSwimCheckedNo":
      code = code.charAt(0) + code.charAt(1) + "0" + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "hasCPRCertCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + "1" + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "hasCPRCertCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + "0" + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "boatExperienceCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + "1" + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "boatExperienceCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + "0" + code.charAt(5) + code.charAt(6) + code.charAt(7);
      break;
    case "priorVolunteerCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + "1" + code.charAt(6) + code.charAt(7);
      break;
    case "priorVolunteerCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + "0" + code.charAt(6) + code.charAt(7);
      break;
    case "roleFamiliarityCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + "1" + code.charAt(7);
      break;
    case "roleFamiliarityCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + "0" + code.charAt(7);
      break;
    case "volunteerCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) +  code.charAt(6) + "1";
      break;
    case "volunteerCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) +  code.charAt(6) + "0";
      break;
    default:
      console.log(checkbox)  
  }
  // console.log(code);  

  // bring everything back
  if (code.charAt(0) == "0") {
    $('.Awaiting').show();
    $('.Not').show();
    $('.Standby').show();
    $('.Canceled').show();
    $('.Same').show();
    $('.Selected').show();
  }
  if (code.charAt(1) == "0") {
    $('.child').show();
  }
  if (code.charAt(2) == "0") {
    $('.cantSwim').show();
  }
  if (code.charAt(3) == "0") {
    $('.noCPR').show();
  }
  if (code.charAt(4) == "0") {
    $('.noBoat').show();
  }
  if (code.charAt(5) == "0") {
    $('.noPriorV').show();
  }
  if (code.charAt(6) == "0") {
    $('.noFamiliar').show();
  }
  if (code.charAt(7) == "0") {
    $('.noVolunteer').show();
  }

  // hide after bringing everything back
  if (code.charAt(0) == "1") {
    $('.Awaiting').hide();
    $('.Not').hide();
    $('.Standby').hide();
    $('.Canceled').hide();
    $('.Same').hide();
    $('.Selected').hide();
  }
  if (code.charAt(1) == "1") {
    $('.child').hide();
  }
  if (code.charAt(2) == "1") {
    $('.cantSwim').hide();
  }
  if (code.charAt(3) == "1") {
    $('.noCPR').hide();
  }
  if (code.charAt(4) == "1") {
    $('.noBoat').hide();
  }
  if (code.charAt(5) == "1") {
    $('.noPriorV').hide();
  }
  if (code.charAt(6) == "1") {
    $('.noFamiliar').hide();
  }
  if (code.charAt(7) == "1") {
    $('.noVolunteer').hide();
  }
}