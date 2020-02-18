$('#archived').click(function(){
    if($(this).prop("checked") == true){
      $('.Archived').show();
    } else if($(this).prop("checked") == false){
      $('.Archived').hide();
    }
  });
$('#cancelled').click(function(){
    if($(this).prop("checked") == true){
        $('.Cancelled').show();
    } else if($(this).prop("checked") == false){
        $('.Cancelled').hide();
    }
});