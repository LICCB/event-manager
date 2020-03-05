$('#regStatus').click(function(){
  var value = "";
  if ($(this).prop("checked") == true) {
    value = "regStatusCheckedYes";
  } else {
    value = "regStatusCheckedNo";
  }
  updateCheckbox(value);
});
$('#isAdult').click(function(){
  var value = "";
  if ($(this).prop("checked") == true) {
    value = "isAdultCheckedYes";
  } else {
    value = "isAdultCheckedNo";
  }
  updateCheckbox(value);
});
$('#canSwim').click(function(){
  var value = "";
  if ($(this).prop("checked") == true) {
    value = "canSwimCheckedYes";
  } else {
    value = "canSwimCheckedNo";
  }
  updateCheckbox(value);
});
$('#hasCPRCert').click(function(){
  var value = "";
  if ($(this).prop("checked") == true) {
    value = "hasCPRCertCheckedYes";
  } else {
    value = "hasCPRCertCheckedNo";
  }
  updateCheckbox(value);
});

// regStatus, isAdult, canSwim, hasCPRCert
var code = "0000"
function updateCheckbox(checkbox) {
  // code builder
  switch (checkbox) {
   case "regStatusCheckedYes":
      code = "1" + code.slice(-3);
      break;
    case "regStatusCheckedNo":
      code = "0" + code.slice(-3);
      break;
    case "isAdultCheckedYes":
      code = code.charAt(0) + "1" + code.charAt(2) + code.charAt(3);
      break;
    case "isAdultCheckedNo":
      code = code.charAt(0) + "0" + code.charAt(2) + code.charAt(3);
      break;
    case "canSwimCheckedYes":
      code = code.charAt(0) + code.charAt(1) + "1" + code.charAt(3);
      break;
    case "canSwimCheckedNo":
      code = code.charAt(0) + code.charAt(1) + "0" + code.charAt(3);
      break;
    case "hasCPRCertCheckedYes":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + "1";
      break;
    case "hasCPRCertCheckedNo":
      code = code.charAt(0) + code.charAt(1) + code.charAt(2) + "0";
      break;
    default:
      console.log(checkbox)  
  }
  console.log(code);  
  if (code.charAt(0) == "0") {
    $('.Awaiting').show();
    $('.Not').show();
    $('.Standby').show();
    $('.Canceled').show();
    $('.Same').hshowide();
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
  if (code.charAt(0) == "1") {
    $('.Awaiting').hide();
    $('.Not').hide();
    $('.Standby').hide();
    $('.Canceled').hide();
    $('.Same').hide();
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
}