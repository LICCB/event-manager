$().ready(function() {
  $("#regStatusPillbox").select2({
    placeholder: "apply filter",
    allowClear: true
  });
  $("#eventDiscoveryPillbox").select2({
    placeholder: "apply filter",
    allowClear: true
  });
});

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


function someFilterAppliedOrRemoved() {
  $("table").each(function(){
    // var data = [];
    $(this).find('tr').each(function (rowIndex, r) {
      item = ($(this).attr('class'));
      // console.log(item);
        if (item == undefined || item.length == 0) {
          console.log("item is undefined");
        } else {
          var participantAttributes = String(item).split(" ");
          console.log(participantAttributes);


          // process isAdult filter
          var regStatusFilterStatus = $(".regStatusPillbox").select2("val");
          var eventDiscoveryFilterStatus = $(".eventDiscoveryPillbox").select2("val");
          var isAdultFilterStatus = document.getElementById("isAdult").value;
          var canSwimFilterStatus = document.getElementById("canSwim").value;
          var hasCPRCertFilterStatus = document.getElementById("hasCPRCert").value;
          var boatExperienceFilterStatus = document.getElementById("boatExperience").value;
          var priorVolunteerFilterStatus = document.getElementById("priorVolunteer").value;
          var roleFamiliarityFilterStatus = document.getElementById("roleFamiliarity").value;
          var volunteerFilterStatus = document.getElementById("volunteer").value;

          $(this).show();

          console.log(regStatusFilterStatus);
          console.log(eventDiscoveryFilterStatus);

          // check regStatus stuff first
          if (regStatusFilterStatus.length > 0 || eventDiscoveryFilterStatus.length > 0) {
            $(this).hide();

            // just eventDiscovery
            if (regStatusFilterStatus.length == 0) {
              if (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook")) {
                $(this).show();
              }
              if (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend")) {
                $(this).show();
              }
              if (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email")) {
                $(this).show();
              }
            // just regStatus
            } else if (eventDiscoveryFilterStatus == 0) {
              if (regStatusFilterStatus.includes("Awaiting Confirmation") && participantAttributes.includes("awaitingConfirmation")) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Registered") && participantAttributes.includes("Registered")) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Not Confirmed") && participantAttributes.includes("notConfirmed")) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Not Selected") && participantAttributes.includes("notSelected")) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Standby") && participantAttributes.includes("Standby")) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Selected") && participantAttributes.includes("Selected")) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Cancelled") && participantAttributes.includes("Cancelled")) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Same Day Cancel") && participantAttributes.includes("sameDayCancel")) {
                $(this).show();
              }
            // handle both pillboxes used also
            } else {
              // if current row has something one of each filter
              if (regStatusFilterStatus.includes("Awaiting Confirmation") && participantAttributes.includes("awaitingConfirmation") && (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Registered") && participantAttributes.includes("Registered") && (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Not Confirmed") && participantAttributes.includes("notConfirmed") && (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Not Selected") && participantAttributes.includes("notSelected") && (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Standby") && participantAttributes.includes("Standby") && (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Selected") && participantAttributes.includes("Selected") && (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Cancelled") && participantAttributes.includes("Cancelled") && (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Same Day Cancel") && participantAttributes.includes("sameDayCancel") && (eventDiscoveryFilterStatus.includes("Facebook") && participantAttributes.includes("Facebook"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Awaiting Confirmation") && participantAttributes.includes("awaitingConfirmation") && (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Registered") && participantAttributes.includes("Registered") && (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Not Confirmed") && participantAttributes.includes("notConfirmed") && (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Not Selected") && participantAttributes.includes("notSelected") && (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Standby") && participantAttributes.includes("Standby") && (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Selected") && participantAttributes.includes("Selected") && (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Cancelled") && participantAttributes.includes("Cancelled") && (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Same Day Cancel") && participantAttributes.includes("sameDayCancel") && (eventDiscoveryFilterStatus.includes("Friend") && participantAttributes.includes("Friend"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Awaiting Confirmation") && participantAttributes.includes("awaitingConfirmation") && (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Registered") && participantAttributes.includes("Registered") && (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Not Confirmed") && participantAttributes.includes("notConfirmed") && (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Not Selected") && participantAttributes.includes("notSelected") && (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Standby") && participantAttributes.includes("Standby") && (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Selected") && participantAttributes.includes("Selected") && (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Cancelled") && participantAttributes.includes("Cancelled") && (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email"))) {
                $(this).show();
              }
              if (regStatusFilterStatus.includes("Same Day Cancel") && participantAttributes.includes("sameDayCancel") && (eventDiscoveryFilterStatus.includes("Email") && participantAttributes.includes("Email"))) {
                $(this).show();
              }
            }

          }
    
          // check other filters
          if (isAdultFilterStatus == "yes" && participantAttributes.includes("child")) {
            $(this).hide();
          }
          if (canSwimFilterStatus == "yes" && participantAttributes.includes("cantSwim")) {
            $(this).hide();
          }
          if (hasCPRCertFilterStatus == "yes" && participantAttributes.includes("noCPR")) {
            $(this).hide();
          }
          if (boatExperienceFilterStatus == "yes" && participantAttributes.includes("noBoat")) {
            $(this).hide();
          }
          if (priorVolunteerFilterStatus == "yes" && participantAttributes.includes("noPriorV")) {
            $(this).hide();
          }
          if (roleFamiliarityFilterStatus == "yes" && participantAttributes.includes("noFamiliar")) {
            $(this).hide();
          }
          if (volunteerFilterStatus == "yes" && participantAttributes.includes("noVolunteer")) {
            $(this).hide();
          }
          
          // uncheck all hidden checkboxes
          $(':checkbox:hidden').each(function() {
            this.checked = false;                        
          });

          // recheck all visible checkboxes
          $(':checkbox:visible:enabled').each(function() {
            this.checked = true;                        
          }); 

          
          $("#select-all").prop("checked", false);

 

          // console.log(regStatusFilterStatus);
          // console.log(isAdultFilterStatus);
          // console.log(canSwimFilterStatus);
          // console.log(hasCPRCertFilterStatus);
          // console.log(boatExperienceFilterStatus);
          // console.log(priorVolunteerFilterStatus);
          // console.log(roleFamiliarityFilterStatus);
          // console.log(volunteerFilterStatus);
        }
    });
  });
}



// statusArray = [];
// function applyRegStatusFilters() {

//   var rowCount = $('tr:visible').length-1;
//   var x = $(".regStatusPillbox").select2("val");
  
//   // console.log("current: " + x);
//   // console.log("previous: " + statusArray);
//   // reapply outsidefilter
//   if (code.includes("1") && x.length < statusArray.length) {
//     $('.awaitingConfirmation').show();
//     $('.Registered').show();
//     $('.notConfirmed').show();
//     $('.notSelected').show();
//     $('.Standby').show();
//     $('.Selected').show();
//     $('.Cancelled').show();
//     $('.sameDayCancel').show();
//     if (code.charAt(1) == "1") {
//       $('.child').hide();
//     }
//     if (code.charAt(2) == "1") {
//       $('.cantSwim').hide();
//     }
//     if (code.charAt(3) == "1") {
//       $('.noCPR').hide();
//     }
//     if (code.charAt(4) == "1") {
//       $('.noBoat').hide();
//     }
//     if (code.charAt(5) == "1") {
//       $('.noPriorV').hide();
//     }
//     if (code.charAt(6) == "1") {
//       $('.noFamiliar').hide();
//     }
//     if (code.charAt(7) == "1") {
//       $('.noVolunteer').hide();
//     }
//   } else {

//     if (x == undefined || x.length == 0) {
//       console.log("no values selected");
//       $('.awaitingConfirmation').show();
//       $('.Registered').show();
//       $('.notConfirmed').show();
//       $('.notSelected').show();
//       $('.Standby').show();
//       $('.Selected').show();
//       $('.Cancelled').show();
//       $('.sameDayCancel').show();
//     } else {
//       $('.awaitingConfirmation').hide();
//       $('.Registered').hide();
//       $('.notConfirmed').hide();
//       $('.notSelected').hide();
//       $('.Standby').hide();
//       $('.Selected').hide();
//       $('.Cancelled').hide();
//       $('.sameDayCancel').hide();
      
//       if (x.includes("Awaiting Confirmation")){
//         $('.awaitingConfirmation').show();
//       }
//       if (x.includes("Registered")){
//         $('.Registered').show();
//       }
//       if (x.includes("Not Confirmed")){
//         $('.notConfirmed').show();
//       }
//       if (x.includes("Not Selected")){
//         $('.notSelected').show();
//       }
//       if (x.includes("Standby")){
//         $('.Standby').show();
//       }
//       if (x.includes("Selected")){
//         $('.Selected').show();
//       }
//       if (x.includes("Cancelled")){
//         $('.Cancelled').show();
//       }
//       if (x.includes("Same Day Cancel")){
//         $('.sameDayCancel').show();
//       }
//     }
//   }

//   statusArray = x;

// }
// function isAdultFunction() {
//   var x = document.getElementById("isAdult").value;
//   if (x == "yes") {
//     value = "isAdultCheckedYes";
//   } else {
//     value = "isAdultCheckedNo";
//   }
//   updateCheckbox(value);
// }
// function canSwimFunction() {
//   var x = document.getElementById("canSwim").value;
//   if (x == "yes") {
//     value = "canSwimCheckedYes";
//   } else {
//     value = "canSwimCheckedNo";
//   }
//   updateCheckbox(value);
// }
// function hasCPRCertFunction() {
//   var x = document.getElementById("hasCPRCert").value;
//   if (x == "yes") {
//     value = "hasCPRCertCheckedYes";
//   } else {
//     value = "hasCPRCertCheckedNo";
//   }
//   updateCheckbox(value);
// }
// function boatExperienceFunction() {
//   var x = document.getElementById("boatExperience").value;
//   if (x == "yes") {
//     value = "boatExperienceCheckedYes";
//   } else {
//     value = "boatExperienceCheckedNo";
//   }
//   updateCheckbox(value);
// }
// function priorVolunteerFunction() {
//   var x = document.getElementById("priorVolunteer").value;
//   if (x == "yes") {
//     value = "priorVolunteerCheckedYes";
//   } else {
//     value = "priorVolunteerCheckedNo";
//   }
//   updateCheckbox(value);
// }
// function roleFamiliarityFunction() {
//   var x = document.getElementById("roleFamiliarity").value;
//   if (x == "yes") {
//     value = "roleFamiliarityCheckedYes";
//   } else {
//     value = "roleFamiliarityCheckedNo";
//   }
//   updateCheckbox(value);
// }
// function volunteerFunction() {
//   var x = document.getElementById("volunteer").value;
//   if (x == "yes") {
//     value = "volunteerCheckedYes";
//   } else {
//     value = "volunteerCheckedNo";
//   }
//   updateCheckbox(value);
// }


// // regStatus(deprecated), isAdult, canSwim, hasCPRCert, boatExperience, priorVolunteer, roleFamiliarity, volunteer
// var code = "0000000"
// function updateCheckbox(checkbox) {

//   // code builder
//   switch (checkbox) {
//     case "isAdultCheckedYes":
//       code = code.charAt(0) + "1" + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
//       break;
//     case "isAdultCheckedNo":
//       code = code.charAt(0) + "0" + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
//       break;
//     case "canSwimCheckedYes":
//       code = code.charAt(0) + code.charAt(1) + "1" + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
//       break;
//     case "canSwimCheckedNo":
//       code = code.charAt(0) + code.charAt(1) + "0" + code.charAt(3) + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
//       break;
//     case "hasCPRCertCheckedYes":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + "1" + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
//       break;
//     case "hasCPRCertCheckedNo":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + "0" + code.charAt(4) + code.charAt(5) + code.charAt(6) + code.charAt(7);
//       break;
//     case "boatExperienceCheckedYes":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + "1" + code.charAt(5) + code.charAt(6) + code.charAt(7);
//       break;
//     case "boatExperienceCheckedNo":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + "0" + code.charAt(5) + code.charAt(6) + code.charAt(7);
//       break;
//     case "priorVolunteerCheckedYes":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + "1" + code.charAt(6) + code.charAt(7);
//       break;
//     case "priorVolunteerCheckedNo":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + "0" + code.charAt(6) + code.charAt(7);
//       break;
//     case "roleFamiliarityCheckedYes":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + "1" + code.charAt(7);
//       break;
//     case "roleFamiliarityCheckedNo":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) + "0" + code.charAt(7);
//       break;
//     case "volunteerCheckedYes":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) +  code.charAt(6) + "1";
//       break;
//     case "volunteerCheckedNo":
//       code = code.charAt(0) + code.charAt(1) + code.charAt(2) + code.charAt(3) + code.charAt(4) + code.charAt(5) +  code.charAt(6) + "0";
//       break;
//     default:
//       console.log(checkbox)  
//   }
//   // console.log(code);  

//   // handle all filters 
//   if (code.charAt(1) == "0") {
//     $('.child').show();
//     applyRegStatusFilters();
//   }
//   if (code.charAt(2) == "0") {
//     $('.cantSwim').show();
//     applyRegStatusFilters();
//   }
//   if (code.charAt(3) == "0") {
//     $('.noCPR').show();
//     applyRegStatusFilters();
//   }
//   if (code.charAt(4) == "0") {
//     $('.noBoat').show();
//     applyRegStatusFilters();
//   }
//   if (code.charAt(5) == "0") {
//     $('.noPriorV').show();
//     applyRegStatusFilters();
//   }
//   if (code.charAt(6) == "0") {
//     $('.noFamiliar').show();
//     applyRegStatusFilters();
//   }
//   if (code.charAt(7) == "0") {
//     $('.noVolunteer').show();
//     applyRegStatusFilters();
//   }
//   if (code.charAt(1) == "1") {
//     $('.child').hide();
//   }
//   if (code.charAt(2) == "1") {
//     $('.cantSwim').hide();
//   }
//   if (code.charAt(3) == "1") {
//     $('.noCPR').hide();
//   }
//   if (code.charAt(4) == "1") {
//     $('.noBoat').hide();
//   }
//   if (code.charAt(5) == "1") {
//     $('.noPriorV').hide();
//   }
//   if (code.charAt(6) == "1") {
//     $('.noFamiliar').hide();
//   }
//   if (code.charAt(7) == "1") {
//     $('.noVolunteer').hide();
//   }


//   // uncheck all hidden checkboxes
//   $(':checkbox:hidden').each(function() {
//     this.checked = false;                        
//   });

//   // recheck all visible checkboxes
//   $(':checkbox:visible:enabled').each(function() {
//     this.checked = true;                        
//   }); 

  
//   $("#select-all").prop("checked", false);


// }