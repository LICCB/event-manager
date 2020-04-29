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
      'order': [5, 'asc'],
      'columnDefs': [
        {'targets': [0,1,2], "orderable": false, "searchable": false},
        {'targets': [15, 20], "orderable": false},
        {'targets': [9,10,11,12,18], "searchable": false}
      ]
    });
    $('#tieParticipantsTable').DataTable({
      'order': [3, 'asc'],
      'columnDefs': [
        {'targets': [0], "orderable": false, "searchable": false},
        {'targets': [13, 18], "orderable": false},
        {'targets': [7,8,9,10,16], "searchable": false}
      ]
    });
    $('#singleParticipantTable').DataTable({
      'order': [2, 'asc'],
      'columnDefs': [
        {'targets': [12,17], "orderable": false},
        {'targets': [6,7,8,9,15], "searchable": false}
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
      'order': [3, 'asc'],
      'columnDefs': [
        {'targets': [0,1,20], "orderable": false, "searchable": false},
        {'targets': [15], "orderable": false},
        {'targets': [9,10,11,12,18], "searchable": false}
      ]
    });
    $('#checkinTable').DataTable({
      'paging': false,
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [2,3], "searchable": false}
      ]
    });
    $('#usersTable').DataTable({
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [0], "orderable": false, "searchable": false}
      ]
    });
    $('#eventTypesTable').DataTable({
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [0], "orderable": false, "searchable": false},
        {'targets': [2], "orderable": false}
      ]
    });
    $('#rolesTable').DataTable({
      'order': [1, 'asc'],
      'columnDefs': [
        {'targets': [0], "orderable": false, "searchable": false}
      ]
    });
  });