$("#addfield").click(function () {
    var lastField = $("#newfields div:last");
    var intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
    var fieldWrapper = $(`<div class="fieldwrapper" id="field${intId}" />`);
    fieldWrapper.data("idx", intId);
    var fLabel = $(`<label for="field${intId}">Field:</label>`);
    var fName = $(`<input type="text" id="field${intId}" name="field${intId}" class="fieldname" />`);
    var fType = $(`<select class="fieldtype" name="type${intId}" ><option value="checkbox">Checked</option><option value="textbox">Text</option></select>`);
    var removeButton = $(`<input type="button" class="remove" value="X" />`);
    removeButton.click(function () {
        $(this).parent().remove();
    });
    fieldWrapper.append(fLabel);
    fieldWrapper.append(fName);
    fieldWrapper.append(fType);
    fieldWrapper.append(removeButton);
    $("#newfields").append(fieldWrapper);
});