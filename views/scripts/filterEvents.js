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

$(document).ready( function() {
  $('#eventsTable').DataTable({
    'order': [7, 'asc'],
    'columnDefs': [
      {'targets': [0,1,2,3,6,11,14], "orderable": false, "searchable": false},
      {'targets': [9,12,13], "orderable": false}
    ]
  });
})