function randomWordGenerator(){
    var randomNum = Math.floor((Math.random() * 5) + 1);

    var flarfFlag = flarfMode.getFlarf();
    if (flarfFlag == true){
      flarf = true;
    } else {
      flarf = false;
    }

    // verb
    if (randomNum == 1){
      var requestStr = "/api/v1/words?part_of_speech=verb&flarf=" + flarf;
      $.ajax({
          type: "GET",
          dataType: 'json',
          url: requestStr,
          success: function(data){
            randomWordComplete(data);
          }
        });
      }
    // adjective
    else if(randomNum == 2){
      var requestStr = "/api/v1/words?part_of_speech=adjective&flarf=" + flarf;
      $.ajax({
          type: "GET",
          dataType: 'json',
          url: requestStr,
          success: function(data){
            randomWordComplete(data);
          }
        });
      }
    // noun
    else if(randomNum == 3){
      var requestStr = "/api/v1/words?part_of_speech=noun&flarf=" + flarf;
      $.ajax({
          type: "GET",
          dataType: 'json',
          url: requestStr,
          success: function(data){
            randomWordComplete(data);
          }
        });
      }
    else if(randomNum == 4) {
    // flarf is forced to false for articles & prepositions
    var requestStr = "/api/v1/words?part_of_speech=article&flarf=false";
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: requestStr,
        success: function(data){
          randomWordComplete(data);
        }
      });
    }
    else {
    // flarf is forced to false for articles & prepositions
    var requestStr = "/api/v1/words?part_of_speech=preposition&flarf=false";
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: requestStr,
        success: function(data){
          randomWordComplete(data);
        }
      });
    }
}

var magnetCounter = (function(){
   var magNumber = 0;
   return function increaseCounter(){
     return magNumber++;
   }
})()

function randomWordComplete(data) {
  var word = data[0].word;
  var magNumber = magnetCounter();
  $('#words-container').prepend('<span class="magnet" id="magnet' + magNumber + '">' + word + '</span>');
  $('#magnet'+magNumber).draggable({ containment: "wrapper" });
}

function poemTitle(){
  $('#words-container').prepend('<input type="text" class="poem-title">');
  $('input.poem-title').focusout(poemTitleConversion);
}

function poemTitleConversion(title){
  var userPoemTitle = $('input.poem-title').val();
  $(this).replaceWith( '<span class="magnet" id="poem-title">' + userPoemTitle + '</span>' );
  $('#poem-title').draggable({
   containment: "wrapper" });
}

function startOver(){
  $('#words-container').html("");
}

function scrambleWords(){
  currentMagnetArray = $('.magnet').toArray();

  for (var i = 0; i < currentMagnetArray.length; i++) {
    var wordsContainer = $('#words-container');
    var width = wordsContainer[0].clientWidth;
    var height = wordsContainer[0].clientHeight;
    var x = parseInt(( Math.random() * width), 10);
    var y = parseInt(( Math.random() * height), 10);
    currentMagnetArray[i].style.left = parseInt(x)+'px';
    currentMagnetArray[i].style.top = parseInt(y)+'px';
  };
}

var flarfMode = (function(){
   var flarfFlag = false;
   return {
    toggleFlarf: function(){
     if (flarfFlag == true){
      flarfFlag = false;
      return flarfFlag;
     } else {
      flarfFlag = true;
      return flarfFlag;
     }
    },
    getFlarf: function() {
       return flarfFlag;
    }
   }
})()

// $(function() {
//   $( "#set div" ).draggable({
//     stack: "#set div",
//       stop: function(event, ui) {
//           var pos_x = ui.offset.left;
//           var pos_y = ui.offset.top;
//           var need = ui.helper.data("need");

//           //Do the ajax call to the server
//           $.ajax({
//               type: "POST",
//               url: "your_php_script.php",
//               data: { x: pos_x, y: pos_y, need_id: need}
//             }).done(function( msg ) {
//               alert( "Data Saved: " + msg );
//             });
//       }
//   });
// });

// function savePoem(){
  

// }

$('#random-word').click(randomWordGenerator);
$('#scramble').click(scrambleWords);
$('#start-over').click(startOver);
$('#title').click(poemTitle);
$('#flarf').click(function(){
  flarfMode.toggleFlarf()
});
$('#save-poem').click(function(e){
  e.preventDefault();
  savePoem();
})
