// Directory of customizations: https://datatables.net/reference/option/
$(document).ready( function() {
    $('#eventsTable').DataTable({
      'order': [7, 'asc'],
      'columnDefs': [
        {'targets': [0,1,2,3,6,11,14], "orderable": false, "searchable": false},
        {'targets': [9,12,13], "orderable": false}
      ]
    });
  });