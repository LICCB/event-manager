$("#addfield").click(function () {
    var lastField = $("#newfields div:last");
    var intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
    var fieldWrapper = $("<div class=\"fieldwrapper\" id=\"field" + intId + "\"/>");
    fieldWrapper.data("idx", intId);
    var fLabel = $("<label for=\"field" + intId + "\" >Field" + intId + ": </label>");
    var fName = $("<input type=\"text\" id=\"field" + intId + "\" name=\"field" + intId +
      "\" class=\"fieldname\" form=\"eventform\" />");
    var fType = $("<select class=\"fieldtype\" name=\"type" + intId +
      "\" form=\"eventform\"><option value=\"checkbox\">Checked</option><option value=\"textbox\">Text</option><option value=\"textarea\">Paragraph</option></select>"
    );
    var removeButton = $("<input type=\"button\" class=\"remove\" value=\"-\" />");
    removeButton.click(function () {
      $(this).parent().remove();
    });
    fieldWrapper.append(fLabel);
    fieldWrapper.append(fName);
    fieldWrapper.append(fType);
    fieldWrapper.append(removeButton);
    $("#newfields").append(fieldWrapper);
  });