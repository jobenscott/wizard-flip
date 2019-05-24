var current_loaded_wizard = 1234;

function updateWizardValue(form) {
  var value = form.wizard_value.value;
  current_loaded_wizard = parseInt(value) - 1;
}
jQuery(function($) {
  // Dimensions of the whole book
  var BOOK_WIDTH = window.innerWidth;
  var BOOK_HEIGHT = BOOK_WIDTH * 0.31325301204;

  // Dimensions of one page in the book
  var PAGE_WIDTH = BOOK_WIDTH * 0.48192771084;
  var PAGE_HEIGHT = PAGE_WIDTH * 0.625;

  // Vertical spacing between the top edge of the book and the papers
  var PAGE_Y = (BOOK_HEIGHT - PAGE_HEIGHT) / 2;

  // The canvas size equals to the book dimensions + this padding
  var CANVAS_PADDING = BOOK_WIDTH * 0.07228915662;

  $(window).on("resize", function() {
    BOOK_WIDTH = window.innerWidth;
    BOOK_HEIGHT = BOOK_WIDTH * 0.31325301204;

    // Dimensions of one page in the book
    PAGE_WIDTH = BOOK_WIDTH * 0.48192771084;
    PAGE_HEIGHT = PAGE_WIDTH * 0.625;

    // Vertical spacing between the top edge of the book and the papers
    PAGE_Y = (BOOK_HEIGHT - PAGE_HEIGHT) / 2;

    // The canvas size equals to the book dimensions + this padding
    CANVAS_PADDING = BOOK_WIDTH * 0.07228915662;
  });

  var page = 0;

  $("#wizard-submit").val(1234);
  var wizard_img_url =
    "https://storage.googleapis.com/cheeze-wizards-production/0xec2203e38116f09e21bc27443e063b623b01345a/";

  var canvas = document.getElementById("pageflip-canvas");
  var context = canvas.getContext("2d");

  var mouse = { x: 0, y: 0 };

  var flips = [];

  var book = document.getElementById("book");

  // List of all the page elements in the DOM
  var pages = book.getElementsByTagName("section");

  var link_rect;

  var link_hover;
  var href;

  // Organize the depth of our pages and create the flip definitions
  for (var i = 0, len = pages.length; i < len; i++) {
    pages[i].style.zIndex = len - i;

    flips.push({
      // Current progress of the flip (left -1 to right +1)
      progress: 1,
      // The target value towards which progress is always moving
      target: 1,
      // The page DOM element related to this flip
      page: pages[i],
      // True while the page is being dragged
      dragging: false
    });
  }

  // Resize the canvas to match the book size
  canvas.width = BOOK_WIDTH + CANVAS_PADDING * 2;
  canvas.height = BOOK_HEIGHT + CANVAS_PADDING * 2;

  // Offset the canvas so that it's padding is evenly spread around the book
  canvas.style.top = -CANVAS_PADDING + "px";
  canvas.style.left = -CANVAS_PADDING + "px";

  // Render the page flip 60 times a second
  setInterval(render, 1000 / 60);

  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("mousedown", mouseDownHandler, false);
  document.addEventListener("mouseup", mouseUpHandler, false);
  canvas.addEventListener("touchmove", mouseDownHandler, false);
  canvas.addEventListener("touchend", mouseUpHandler, false);

  function mouseMoveHandler(event) {
    if (
      event.target.id.toString() !== "wizard-input" &&
      event.target.id.toString() !== "wizard-input-id" &&
      event.target.id.toString() !== "wizard-input-submit" &&
      event.target.id.toString() !== "flip-left" &&
      event.target.id.toString() !== "flip-right"
    ) {
      $("#wizard-input-id").blur();
      // Offset mouse position so that the top of the spine is 0,0
      mouse.x = event.clientX - book.offsetLeft - BOOK_WIDTH / 2;
      mouse.y = event.clientY - book.offsetTop;

      if (link_rect) {
        // link_rect = $(document).find('#pages section.page-'+page+' div.page-'+page+' div a')[0].getBoundingClientRect();
        link_rect = $(document)
          .find(".wizard.page-" + (page - 1) + " div")[0]
          .getBoundingClientRect();
        var img = $(document).find(".wizard.page-" + (page - 1) + " img");
        var tag = $(document).find(".wizard.page-" + (page - 1) + " div");
        href = $(tag).data("url");

        var horizontal_limit = link_rect.left + link_rect.width;
        var vertical_limit = link_rect.top + link_rect.height;

        if (
          event.clientX > link_rect.left &&
          event.clientX < horizontal_limit &&
          event.clientY > link_rect.top &&
          event.clientY < vertical_limit
        ) {
          $("html,body").css("cursor", "pointer");
          $(tag).css("color", "green");
          link_hover = true;
        } else {
          $("html,body").css("cursor", "default");
          $(tag).css("color", "black");
          link_hover = false;
        }
      }
    }
  }

  // function ajaxPass(page_minus_one) {
  // 	// var passed = false;
  // 	$.ajax({
  // 	    url: wizard_img_url+(current_loaded_wizard + 1)+'.svg',
  // 	    // crossOrigin: true,
  // 	    // type: 'HEAD',
  // 	    // data: { url: },
  // 	    error:function (xhr, ajaxOptions, thrownError){
  // 		    if(xhr.status==404) {
  // 		    	alert('No More Wizards At The Moment');
  // 		    }
  // 		    console.log('other error');
  // 		},
  // 	    success:function(data) {
  // 	    	console.log(data);
  // 	    	if(page_minus_one) {
  // 	    		flips[page - 1].dragging = true;
  // 				newSection(flips.length + 1);
  // 	    	} else {
  // 	    		flips[page].dragging = true;
  // 				newSection(flips.length + 1);
  // 	    	}
  // 	    }
  //   	});

  //  //  	if(passed) {
  // 	// 	return passed;
  // 	// }
  // }
  // function imageExists(image_url){

  //     var http = new XMLHttpRequest();

  //     http.open('HEAD', image_url, false);
  //     http.send();

  //     if( http.status != 404) {
  //     	console.log('success');
  //     } else {
  //     	console.log('nope');
  //     }

  // }

  function newSection(i) {
    var section = '<section class="page-' + page + '"></section>';
    $("#pages").append(section);

    current_loaded_wizard = current_loaded_wizard + 1;

    var div = '<div class="wizard page-' + page + '"></div>';
    $("#pages section.page-" + page).append(div);

    var wizard_img =
      '<img class="wizard-shadow" src="' + wizard_img_url + current_loaded_wizard + '.svg" >';
    var wizard_id =
      '<div class="wizard-url" data-url="https://www.cheezewizards.com/wizard/' +
      current_loaded_wizard +
      '">' +
      current_loaded_wizard +
      "</div>";
    $("#pages section.page-" + page + " div.page-" + page).append(wizard_img);
    $("#pages section.page-" + page + " div.page-" + page).append(wizard_id);

    link_rect = $(
      "#pages section.page-" + page + " div.page-" + page + " div"
    )[0].getBoundingClientRect();
    // reinstantiate pages
    pages = $(document).find("section");

    for (var i = 0, len = pages.length; i < len; i++) {
      pages[i].style.zIndex = len - i;

      if (!flips[i]) {
        flips.push({
          // Current progress of the flip (left -1 to right +1)
          progress: 1,
          // The target value towards which progress is always moving
          target: 1,
          // The page DOM element related to this flip
          page: pages[i],
          // True while the page is being dragged
          dragging: false
        });
      }
    }
  }

  function mouseDownHandler(event) {
    if (
      event.target.id !== "wizard-input" &&
      event.target.id !== "wizard-input-id" &&
      event.target.id.toString() !== "wizard-input-submit" &&
      event.target.id.toString() !== "flip-left" &&
      event.target.id.toString() !== "flip-right"
    ) {
      $("#wizard-input-id").blur();
      if (!link_hover) {
        if (Math.abs(mouse.x) < PAGE_WIDTH) {
          if (mouse.x < 0 && page - 1 >= 0) {
            if (page == flips.length) {
              flips[page - 1].dragging = true;
              newSection(flips.length + 1);
            } else {
              flips[page].dragging = true;
              newSection(flips.length + 1);
              console.log("1");
            }
          } else if (mouse.x > 0 && page + 1 < flips.length) {
            if (page == flips.length) {
              console.log("2");
              flips[page].dragging = true;
              newSection(flips.length + 1);
            } else {
              console.log("3");
              flips[page].dragging = true;
            }
          } else {
            if (page >= flips.length) {
              console.log("4");
              flips[page - 1].dragging = true;
              newSection(flips.length + 1);
            } else {
              console.log("5");
              flips[page].dragging = true;
              newSection(flips.length + 1);
            }
          }
        }
      } else {
        window.open(href, "_blank");
      }
    } else {
      if (
        event.target.id === "wizard-input" ||
        event.target.id === "wizard-input-id" ||
        event.target.id.toString() === "wizard-input-submit"
      ) {
        $("#wizard-input-id").focus();
      } else if (event.target.id.toString() === "flip-left") {
        flips[page].dragging = true;
        flips[page].target = -1;
        console.log(page);
      } else if (event.target.id.toString() === "flip-right") {
        console.log(page);
        flips[page - 1].dragging = true;
        flips[page - 1].target = 1;
      }
    }

    // Prevents the text selection cursor from appearing when dragging
    event.preventDefault();
  }

  //   function etherScanTest() {
  //     var url =
  //       "https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=7780273&toBlock=latest&address=0x2f4bdafb22bd92aa7b7552d270376de8edccbc1e&topic0=0x7c0fbd69c04ea8ef6f62724eebd9c311d984e86457a801d81c0cb52ec9039170&apikey=6D4EI1DM4TZN4YM13E2HB3WGIS4RH7RSMN";

  //     $.ajax({
  //       url: url,
  //       success: function(data) {
  //         console.log(data);
  //       }
  //     });
  //   }

  function mouseUpHandler(event) {
    for (var i = 0; i < flips.length; i++) {
      // If this flip was being dragged we animate to its destination
      if (flips[i].dragging) {
        // Figure out which page we should go to next depending on the flip direction
        if (mouse.x < 0) {
          flips[i].target = -1;
          page = Math.min(page + 1, flips.length);
        } else {
          flips[i].target = 1;
          page = Math.max(page - 1, 0);
        }
      }

      flips[i].dragging = false;
    }
  }

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < flips.length; i++) {
      var flip = flips[i];

      if (flip.dragging) {
        flip.target = Math.max(Math.min(mouse.x / PAGE_WIDTH, 1), -1);
      }

      flip.progress += (flip.target - flip.progress) * 0.2;

      // If the flip is being dragged or is somewhere in the middle of the book, render it
      if (flip.dragging || Math.abs(flip.progress) < 0.997) {
        drawFlip(flip);
      }
    }
  }

  function drawFlip(flip) {
    // Strength of the fold is strongest in the middle of the book
    var strength = 1 - Math.abs(flip.progress);

    // Width of the folded paper
    var foldWidth = PAGE_WIDTH * 0.5 * (1 - flip.progress);

    // X position of the folded paper
    var foldX = PAGE_WIDTH * flip.progress + foldWidth;

    // How far the page should outdent vertically due to perspective
    var verticalOutdent = 20 * strength;

    // The maximum width of the left and right side shadows
    var paperShadowWidth =
      PAGE_WIDTH * 0.5 * Math.max(Math.min(1 - flip.progress, 0.5), 0);
    var rightShadowWidth =
      PAGE_WIDTH * 0.5 * Math.max(Math.min(strength, 0.5), 0);
    var leftShadowWidth =
      PAGE_WIDTH * 0.5 * Math.max(Math.min(strength, 0.5), 0);

    // Change page element width to match the x position of the fold
    flip.page.style.width = Math.max(foldX, 0) + "px";

    context.save();
    context.translate(CANVAS_PADDING + BOOK_WIDTH / 2, PAGE_Y + CANVAS_PADDING);

    // Draw a sharp shadow on the left side of the page
    context.strokeStyle = "rgba(0,0,0," + 0.05 * strength + ")";
    context.lineWidth = 30 * strength;
    context.beginPath();
    context.moveTo(foldX - foldWidth, -verticalOutdent * 0.5);
    context.lineTo(foldX - foldWidth, PAGE_HEIGHT + verticalOutdent * 0.5);
    context.stroke();

    // Right side drop shadow
    var rightShadowGradient = context.createLinearGradient(
      foldX,
      0,
      foldX + rightShadowWidth,
      0
    );
    rightShadowGradient.addColorStop(0, "rgba(0,0,0," + strength * 0.2 + ")");
    rightShadowGradient.addColorStop(0.8, "rgba(0,0,0,0.0)");

    context.fillStyle = rightShadowGradient;
    context.beginPath();
    context.moveTo(foldX, 0);
    context.lineTo(foldX + rightShadowWidth, 0);
    context.lineTo(foldX + rightShadowWidth, PAGE_HEIGHT);
    context.lineTo(foldX, PAGE_HEIGHT);
    context.fill();

    // Left side drop shadow
    var leftShadowGradient = context.createLinearGradient(
      foldX - foldWidth - leftShadowWidth,
      0,
      foldX - foldWidth,
      0
    );
    leftShadowGradient.addColorStop(0, "rgba(0,0,0,0.0)");
    leftShadowGradient.addColorStop(1, "rgba(0,0,0," + strength * 0.15 + ")");

    context.fillStyle = leftShadowGradient;
    context.beginPath();
    context.moveTo(foldX - foldWidth - leftShadowWidth, 0);
    context.lineTo(foldX - foldWidth, 0);
    context.lineTo(foldX - foldWidth, PAGE_HEIGHT);
    context.lineTo(foldX - foldWidth - leftShadowWidth, PAGE_HEIGHT);
    context.fill();

    // Gradient applied to the folded paper (highlights & shadows)
    var foldGradient = context.createLinearGradient(
      foldX - paperShadowWidth,
      0,
      foldX,
      0
    );
    foldGradient.addColorStop(0.35, "#fafafa");
    foldGradient.addColorStop(0.73, "#eeeeee");
    foldGradient.addColorStop(0.9, "#fafafa");
    foldGradient.addColorStop(1.0, "#e2e2e2");

    context.fillStyle = foldGradient;
    context.strokeStyle = "rgba(0,0,0,0.06)";
    context.lineWidth = 0.5;

    // Draw the folded piece of paper
    context.beginPath();
    context.moveTo(foldX, 0);
    context.lineTo(foldX, PAGE_HEIGHT);
    context.quadraticCurveTo(
      foldX,
      PAGE_HEIGHT + verticalOutdent * 2,
      foldX - foldWidth,
      PAGE_HEIGHT + verticalOutdent
    );
    context.lineTo(foldX - foldWidth, -verticalOutdent);
    context.quadraticCurveTo(foldX, -verticalOutdent * 2, foldX, 0);

    context.fill();
    context.stroke();

    context.restore();
  }
});
