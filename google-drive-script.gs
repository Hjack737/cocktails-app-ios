function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    // Bestimme den Dateinamen anhand des Typs (makelist oder backup)
    var fileName = requestData.type === "makelist" ? "hca_makelist_live.json" : "hca_backup.json";
    var payload = requestData.data;

    var files = DriveApp.getFilesByName(fileName);
    var file;
    
    if (files.hasNext()) {
      file = files.next();
      file.setContent(JSON.stringify(payload));
    } else {
      file = DriveApp.createFile(fileName, JSON.stringify(payload), MimeType.PLAIN_TEXT);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "success"}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    // Parameter aus der URL auslesen (?type=makelist oder ?type=backup)
    var type = e.parameter.type;
    var fileName = type === "makelist" ? "hca_makelist_live.json" : "hca_backup.json";
    
    var files = DriveApp.getFilesByName(fileName);
    
    if (files.hasNext()) {
      var file = files.next();
      var content = file.getBlob().getDataAsString();
      return ContentService.createTextOutput(JSON.stringify({status: "success", data: JSON.parse(content)}))
                           .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({notFound: true}))
                           .setMimeType(ContentService.MimeType.JSON);
    }
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
