function Export2Doc(element, filename = '') {
  //  _html_ will be replace with custom html
  var meta = "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>";
  //  _styles_ will be replaced with custome css
  var head = "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n";
  // Get the input element
  var inputElement = document.getElementById('inputHtml');

  // Check if a file is selected
  if (inputElement.files.length > 0) {
    var file = inputElement.files[0];
    var reader = new FileReader();

    // Define a function to handle file reading
    reader.onload = function (event) {
      var html = event.target.result;

      // You now have the HTML content from the selected file in the 'html' variable
      var meta = "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>";
      var head = "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n";

      var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
      });

      var css = (
        `<style></style>`
      );

      //  Image Area %%%%
      var options = { maxWidth: 624 };
      var images = Array();
      var img = $("#" + element).find("img");
      for (var i = 0; i < img.length; i++) {
        // Calculate dimensions of output image
        var w = Math.min(img[i].width, options.maxWidth);
        var h = img[i].height * (w / img[i].width);
        // Create canvas for converting image to data URL
        var canvas = document.createElement("CANVAS");
        canvas.width = w;
        canvas.height = h;
        // Draw image to canvas
        var context = canvas.getContext('2d');
        context.drawImage(img[i], 0, 0, w, h);
        // Get data URL encoding of image
        var uri = canvas.toDataURL("image/png");
        $(img[i]).attr("src", img[i].src);
        img[i].width = w;
        img[i].height = h;
        // Save encoded image to array
        images[i] = {
          type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
          encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
          location: $(img[i]).attr("src"),
          data: uri.substring(uri.indexOf(",") + 1)
        };
      }

      // Prepare bottom of mhtml file with image data
      var imgMetaData = "\n";
      for (var i = 0; i < images.length; i++) {
        imgMetaData += "--NEXT.ITEM-BOUNDARY\n";
        imgMetaData += "Content-Location: " + images[i].location + "\n";
        imgMetaData += "Content-Type: " + images[i].type + "\n";
        imgMetaData += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
        imgMetaData += images[i].data + "\n\n";

      }
      imgMetaData += "--NEXT.ITEM-BOUNDARY--";
      // end Image Area %%

      var output = meta.replace("_html_", head.replace("_styles_", css) + html) + imgMetaData;

      var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(output);


      filename = filename ? filename + '.doc' : 'document.doc';


      var downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {

        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.click();
      }

      document.body.removeChild(downloadLink);
    }
    // Read the selected file as text
    reader.readAsText(file);
  } else {
    console.error('No file selected.');
  }
}
// Call the Export2Doc function with the desired filename
Export2Doc('document');