// Directory of customizations: https://datatables.net/reference/option/
$(document).ready( function() {
    $('#eventsTable').DataTable({
      'order': [7, 'asc'],
      'columnDefs': [
        {'targets': [0,1,2,3,6,11,14], "orderable": false, "searchable": false},
        {'targets': [9,12,13], "orderable": false}
      ]
    });
    $('#participantsTable').DataTable({
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [5,6,7,8,11,14], "orderable": false, "searchable": false},
        {'targets': [2,3,4,11,16], "orderable": false}
      ]
    });
    $('#eventParticipantsTable').DataTable({
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [5,6,7,8,11,14], "orderable": false, "searchable": false},
        {'targets': [2,3,4,11,16], "orderable": false}
      ]
    });
    $('#checkinTable').DataTable({
      'paging': false,
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [2,3], "searchable": false}
      ]
    });
  });