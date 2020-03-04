$('#regStatus').click(function(){
    if($(this).prop("checked") == true){
      $('.Registered').show();
    } else if($(this).prop("checked") == false){
      $('.Registered').hide();
    }
});

$('#isAdult').click(function(){
  if($(this).prop("checked") == true){
    $('.adult').show();
  } else if($(this).prop("checked") == false){
    $('.adult').hide();
  }
});


$('#canSwim').click(function(){
  if($(this).prop("checked") == true){
    $('.canSwim').show();
  } else if($(this).prop("checked") == false){
    $('.canSwim').hide();
  }
});

// $('#hasCPRCert').click(function(){
//   if($(this).prop("checked") == true){
//     $('.hasCPRCert').show();
//   } else if($(this).prop("checked") == false){
//     $('.hasCPRCert').hide();
//   }
// });