$().ready(function() {
    // Documentation of Select 2: https://select2.org/
    $("#eventNameVal").select2();
    $("#eventNameVal").data('select2').$container.addClass('optAttr');
    $("#managerNameVal").select2();
    $("#managerNameVal").data('select2').$container.addClass('optAttr');
    $("#creatorNameVal").select2();
    $("#creatorNameVal").data('select2').$container.addClass('optAttr');

    let optAttrs = $(".optAttr");
    for (let i = 0; i < optAttrs.length; i++) {
        $(optAttrs[i]).attr('style', 'display: none;');
    }
    $("#eventNameCheck").on('change', function() {
        if ($(this).prop('checked')) {
            $("#eventNameVal").data('select2').$container.attr('style', 'display: inline-block;');
        }
        else {
            $("#eventNameVal").data('select2').$container.attr('style', 'display: none;');
        }
    });
    $("#eventStatusCheck").on('change', function() {
        if ($(this).prop('checked')) {
            $("#eventStatusVal").attr('style', 'display: inline-block;');
        }
        else {
            $("#eventStatusVal").attr('style', 'display: none;');
        }
    });
    $("#eventTypeCheck").on('change', function() {
        if ($(this).prop('checked')) {
            $("#eventTypeVal").attr('style', 'display: inline-block;');
        }
        else {
            $("#eventTypeVal").attr('style', 'display: none;');
        }
    });
    $("#managerNameCheck").on('change', function() {
        if ($(this).prop('checked')) {
            $("#managerNameVal").data('select2').$container.attr('style', 'display: inline-block;');
        }
        else {
            $("#managerNameVal").data('select2').$container.attr('style', 'display: none;');
        }
    });
    $("#creatorNameCheck").on('change', function() {
        if ($(this).prop('checked')) {
            $("#creatorNameVal").data('select2').$container.attr('style', 'display: inline-block;');
        }
        else {
            $("#creatorNameVal").data('select2').$container.attr('style', 'display: none;');
        }
    });
});