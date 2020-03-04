$('#regStatus').click(function(){
    var temp = "Registered";
    if($(this).prop("checked") == true){
      console.log("CLICKED1");
      $('tr').find('td:eq(0):contains('+temp+')').show();
      $('RegStatus').show();
    } else if($(this).prop("checked") == false){
      console.log("CLICKED2");
      $('tr').find('td:eq(0):contains('+temp+')').hide();
      $('RegStatus').hide();
    }
});


// $('#isAdult').click(function(){
//   if($(this).prop("checked") == true){
//     $('.isAdult').show();
//   } else if($(this).prop("checked") == false){
//     $('.isAdult').hide();
//   }
// });

// $('#canSwim').click(function(){
//   if($(this).prop("checked") == true){
//     $('.canSwim').show();
//   } else if($(this).prop("checked") == false){
//     $('.canSwim').hide();
//   }
// });

// $('#hasCPRCert').click(function(){
//   if($(this).prop("checked") == true){
//     $('.hasCPRCert').show();
//   } else if($(this).prop("checked") == false){
//     $('.hasCPRCert').hide();
//   }
// });