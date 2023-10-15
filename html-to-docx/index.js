function Export2Doc(element, filename = '') {
    //  _html_ will be replace with custom html
    var meta = "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>";
    //  _styles_ will be replaced with custome css
    var head = "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n";

    var html = document.getElementById(element).innerHTML;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    var css = (
        `<style>
        .ed_title {
          font-weight: 300 !important;
        }
    
        .ed_fs__italic {
          font-style: italic;
        }
    
        .no_page_break {
          page-break-before: avoid;
        }
    
        .align_right {
          text-align: right;
        }
    
        .align_left {
          text-align: left;
        }
    
        .wrapper {
          font-family: "Source Sans Pro", Arial, Tahoma;
          font-size: 12px;
        }
    
        .wrapper>*+* {
          margin-top: 0.75em;
        }
    
        .wrapper>p {
          white-space: pre-line;
        }
    
        .wrapper ul,
        .wrapper ol {
          padding: 0 1rem;
        }
    
        .wrapper h1,
        .wrapper h2,
        .wrapper h3,
        .wrapper h4,
        .wrapper h5,
        .wrapper h6 {
          line-height: 1.1;
          padding-bottom: 0.5rem;
        }
    
        .wrapper h3 {
          color: #004e89;
          border-bottom: 1.5px solid #004e89;
        }
    
        .wrapper code {
          background-color: rgba(97, 97, 97, 0.1);
          color: #616161;
        }
    
        .wrapper pre {
          color: #262626;
          font-family: "Source Sans Pro", Arial, Tahoma;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
        }
    
        .wrapper pre code {
          color: inherit;
          padding: 0;
          background: none;
          font-size: 0.8rem;
        }
    
        .wrapper pre .wrapper img {
          max-width: 100%;
          height: auto;
        }
    
        .wrapper blockquote {
          padding-left: 1rem;
          border-left: 2px solid rgba(13, 13, 13, 0.1);
        }
    
        .wrapper hr {
          border: none;
          border-top: 2px solid rgba(13, 13, 13, 0.1);
          margin: 2rem 0;
        }
    
        .wrapper img {
          width: 70%;
        }
    
        /* Table specific styling */
        .wrapper table {
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
          border-collapse: collapse;
          white-space: normal;
        }
    
        .wrapper table td,
        .wrapper table th {
          min-width: 1em;
          padding: 8px 4px;
          box-sizing: border-box;
          position: relative;
          border: 2px solid gray;
          background-clip: padding-box;
          white-space: normal;
        }
            color: #023b66 !important;
            font-weight: bold;
            content: 'formatting test';
          }
    
          @footnote {
            white-space: nowrap;
            border-top: 1px solid black;
            margin-left: -1.25rem !important;
            margin-right: -1.25rem !important;
          }
        }
    
        .footnote {
          float: footnote;
          margin-bottom: 2mm;
          -prince-float-reference: page;
          footnote-display: inline;
          color: black;
        }
    
        ::footnote-call {
          vertical-align: super;
          font-size: 70%;
        }
    
        ::footnote-marker {
          margin-left: 5px;
        }
    
        .pdf_header__logo {
          position: running(logo);
          text-align: left !important;
        }
    
        @page: first {
          font-size: 0.8rem !important;
          font-family: 'Source Sans Pro', Arial, Tahoma !important;
    
          @top-right {
            margin-top: 3.125rem;
            content: 'October 13, 2023';
          }
    
          @top-left {
            margin-top: 50px;
            content: element(logo);
            width: 50%;
          }
        }
    
        #watermark {
          position: fixed;
          bottom: 50%;
          left: 10%;
          z-index: 10000;
          font: 'Source Sans Pro', Arial, Tahoma !important;
          font-size: 100px;
          font-style: bold;
          letter-spacing: 1.1rem;
          color: grey;
          transform: rotate(-30deg);
          opacity: 0.2;
        }
      </style>`
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