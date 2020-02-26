
$('#regStatus').click(function(){
  if($(this).prop("checked") == true){
    $('.regStatus').show();
  } else if($(this).prop("checked") == false){
    $('.regStatus').hide();
  }
});

$('#isAdult').click(function(){
  if($(this).prop("checked") == true){
    $('.isAdult').show();
  } else if($(this).prop("checked") == false){
    $('.isAdult').hide();
  }
});

$('#canSwim').click(function(){
  if($(this).prop("checked") == true){
    $('.canSwim').show();
  } else if($(this).prop("checked") == false){
    $('.canSwim').hide();
  }
});

$('#hasCPRCert').click(function(){
  if($(this).prop("checked") == true){
    $('.hasCPRCert').show();
  } else if($(this).prop("checked") == false){
    $('.hasCPRCert').hide();
  }
});