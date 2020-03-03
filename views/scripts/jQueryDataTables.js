// Directory of customizations: https://datatables.net/reference/option/
$(document).ready( function() {
    $('#eventsTable').DataTable({
      'order': [5, 'asc'],
      'columnDefs': [
        {'targets': [0], "orderable": false, "searchable": false},
        {'targets': [4], "searchable": false}
      ]
    });
    $('#participantsTable').DataTable({
      'order': [3, 'asc'],
      'columnDefs': [
        {'targets': [0], "orderable": false, "searchable": false},
        {'targets': [4,5,6,11,12,13,18], "orderable": false},
        {'targets': [7,8,9,10,15,16], "searchable": false}
      ]
    });
    $('#eventParticipantsTable').DataTable({
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [5,6,7,8,11,14], "orderable": false, "searchable": false},
        {'targets': [2,3,4,11,16], "orderable": false}
      ]
    });
    $('#singleEventTable').DataTable({
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [5,6,7,8,11,14,19], "orderable": false, "searchable": false},
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