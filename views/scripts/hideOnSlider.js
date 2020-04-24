// TODO
$('#myRange').click(function(){
    var temp = "Registered";
    console.log("Moved Slider");
    $('tr').find('td:eq(0):contains('+temp+')').show();
    $('RegStatus').show();
    
});