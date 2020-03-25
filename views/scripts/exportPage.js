$().ready(function() {
    let optAttrs = $(".optAttr");
    for (let i = 0; i < optAttrs.length; i++) {
        $(optAttrs[i]).attr('style', 'display: none;');
    }
    $("#eventNameCheck").on('change', function() {
        if ($(this).prop('checked')) {
            $("#eventNameVal").attr('style', 'display: inline-block;');
        }
        else {
            $("#eventNameVal").attr('style', 'display: none;');
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
            $("#managerNameVal").attr('style', 'display: inline-block;');
        }
        else {
            $("#managerNameVal").attr('style', 'display: none;');
        }
    });
    $("#creatorNameCheck").on('change', function() {
        if ($(this).prop('checked')) {
            $("#creatorNameVal").attr('style', 'display: inline-block;');
        }
        else {
            $("#creatorNameVal").attr('style', 'display: none;');
        }
    });
});