$('#regStatus').click(function(){
    if($(this).prop("checked") == true){
      // $('.Registered').hide();
      $('.Awaiting').hide();
      $('.Not').hide();
      $('.Standby').hide();
      $('.Canceled').hide();
      $('.Same').hide();
    } else if($(this).prop("checked") == false){
      // $('.Registered').show();
      $('.Awaiting').show();
      $('.Not').show();
      $('.Standby').show();
      $('.Canceled').show();
      $('.Same').hshowide();
    }
});

$('#regStatus').click(function(){
  // if($(this).prop("checked") == true){
  //   // $('.Registered').hide();
  //   $('.Awaiting').hide();
  //   $('.Not').hide();
  //   $('.Standby').hide();
  //   $('.Canceled').hide();
  //   $('.Same').hide();
  // } else if($(this).prop("checked") == false){
  //   // $('.Registered').show();
  //   $('.Awaiting').show();
  //   $('.Not').show();
  //   $('.Standby').show();
  //   $('.Canceled').show();
  //   $('.Same').hshowide();
  // }
});
$('#isAdult').click(function(){
  if($(this).prop("checked") == true){
    $('.child').hide();
  } else if($(this).prop("checked") == false){
    $('.child').show();
  }
});


$('#canSwim').click(function(){
  if($(this).prop("checked") == true){
    $('.cantSwim').hide();
  } else if($(this).prop("checked") == false){
    $('.cantSwim').show();
  }
});

$('#hasCPRCert').click(function(){
  if($(this).prop("checked") == true){
    $('.noCPR').hide();
  } else if($(this).prop("checked") == false){
    $('.noCPR').show();
  }
});

// function updateCheckbox(checkbox) {
//   console.log("UPDATING SOMETHING");
//   if($(checkbox).prop("checked") == true){
//     // $('.Registered').hide();
//     $('.Awaiting').hide();
//     $('.Not').hide();
//     $('.Standby').hide();
//     $('.Canceled').hide();
//     $('.Same').hide();
//   } else if($(checkbox).prop("checked") == false){
//     // $('.Registered').show();
//     $('.Awaiting').show();
//     $('.Not').show();
//     $('.Standby').show();
//     $('.Canceled').show();
//     $('.Same').hshowide();
//   }
}