// Listen for click on toggle checkbox
$('#select-all').click(function(event) {   
  if(this.checked) {
      // Iterate each checkbox
      $(':checkbox:visible:enabled').each(function() {
          this.checked = true;                        
      });
  } else {
      $(':checkbox:visible:enabled').each(function() {
          this.checked = false;                       
      });
  }
});
function regStatusFunction() {
  var x = document.getElementById("regStatus").value;
  if (x == "Registered") {
    value = "regStatusCheckedYes";
  } else {
    value = "regStatusCheckedNo";
  }
  updateCheckbox(value);
}
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
$('#regStatus').click(function(){
  var value = "";
  if ($(this).prop("checked") == true) {
    value = "regStatusCheckedYes";
  } else {
    value = "regStatusCheckedNo";
  }
  updateCheckbox(value);
});
$('#regStatusStandby').click(function(){
  var value = "";
  if ($(this).prop("checked") == true) {
    value = "regStatusStandbyCheckedYes";
  } else {
    value = "regStatusStandbyCheckedNo";
  }
  updateCheckbox(value);
});
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
var code = "000000000"
function updateCheckbox(checkbox) {
  // code builder
  switch (checkbox) {
    case "regStatusStandbyCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + "1";
      break;
    case "regStatusStandbyCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + "0";
      break;
   case "regStatusCheckedYes":
      code = "1" + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "regStatusCheckedNo":
      code = "0" + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "isAdultCheckedYes":
      code = code.charAt(0) + "1" + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "isAdultCheckedNo":
      code = code.charAt(0) + "0" + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "canSwimCheckedYes":
      code = code.charAt(0) + code.charAt(1) + "1" + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "canSwimCheckedNo":
      code = code.charAt(0) + code.charAt(1) + "0" + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "hasCPRCertCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + "1" + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "hasCPRCertCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + "0" + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "boatExperienceCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + "1" + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "boatExperienceCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + "0" + code.charAt(5) + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "priorVolunteerCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + "1" + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "priorVolunteerCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + "0" + code.charAt(6) + code.charAt(7) + code.charAt(8);
      break;
    case "roleFamiliarityCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + "1" + code.charAt(7) + code.charAt(8);
      break;
    case "roleFamiliarityCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + "0" + code.charAt(7) + code.charAt(8);
      break;
    case "volunteerCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) +  code.charAt(6) + "1" + code.charAt(8);
      break;
    case "volunteerCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) +  code.charAt(6) + "0" + code.charAt(8);
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
    $('.Cancel').show();
    $('.Same').show();
    $('.Selected').show();
    $('.Registered').show();
  }
  if (code.charAt(8) == "0") {
    $('.Awaiting').show();
    $('.Not').show();
    $('.Standby').show();
    $('.Cancel').show();
    $('.Same').show();
    $('.Selected').show();
    $('.Registered').show();
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
  if (code.charAt(0) == "1" || code.charAt(8) == "1") {
    $('.Awaiting').hide();
    $('.Not').hide();
    $('.Standby').hide();
    $('.Cancel').hide();
    $('.Same').hide();
    $('.Selected').hide();
    $('.Registered').hide();
  }
  // registered
  if (code.charAt(0) == "1") {
    $('.Registered').show();
  }
  // standby
  if (code.charAt(8) == "1") {
    $('.Standby').show();
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

  // uncheck all hidden checkboxes
  $(':checkbox:hidden').each(function() {
    this.checked = false;                        
  });

  
  $("#select-all").prop("checked", false);


}