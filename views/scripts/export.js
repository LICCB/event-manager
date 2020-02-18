function checkDownload() {
    console.log(info);
    fileName = $("#downloadInfo").attr("fileName");
    fileData = $("#downloadInfo").attr("fileData");
    console.log(fileName);
    console.log(fileData);
}

// Modify for real use
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}