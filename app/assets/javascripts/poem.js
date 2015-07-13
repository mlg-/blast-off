function randomWordGenerator(){
  var randomNum = Math.floor((Math.random() * 5) + 1);

  var flarfFlag = flarfMode.getFlarf();
  if (flarfFlag == true){
    flarf = true;
  } else {
    flarf = false;
  }

  if (randomNum == 1){
    var requestStr = "/api/v1/words?part_of_speech=verb&flarf=" + flarf;
  } else if(randomNum == 2){
    var requestStr = "/api/v1/words?part_of_speech=adjective&flarf=" + flarf;
  } else if(randomNum == 3){
    var requestStr = "/api/v1/words?part_of_speech=noun&flarf=" + flarf;
  } else if(randomNum == 4){
    // flarf is forced to false for articles & prepositions
    var requestStr = "/api/v1/words?part_of_speech=article&flarf=false";
  } else {
    var requestStr = "/api/v1/words?part_of_speech=preposition&flarf=false";
  };

  $.ajax({
    type: "GET",
    dataType: 'json',
    url: requestStr,
    success: function(data){
      randomWordComplete(data);
    }
  });
}

var magnetCounter = (function(){
   var magNumber = 0;
   return function increaseCounter(){
     return magNumber++;
   }
})()

function randomWordComplete(data) {
  var word = data[0].word;
  var idNo = data[0].id;
  var magNumber = magnetCounter();
  $('#words-container').prepend('<span class="magnet" id="magnet' + magNumber + '" data="' + idNo + '">' + word + '</span>');
  $('#magnet'+magNumber).draggable({ containment: "words-container" });
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
  $('#words-container').empty();
  if (( $('.poem-id').attr('id') != undefined )){
    $('.poem-id').removeAttr('id');
  }
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

function collectPoemWords(){
  var words = $('#words-container').children();
  word_collection = [];
  words.each(function( index, value ) {
    var top = $(value).offset(top);
    var left = $(value).offset(left);
    var word_id = value.getAttribute('data');
    var word_properties = {top: top, left: left, word_id: word_id};
    word_collection.push(word_properties);
  });
  return word_collection
}

function savePoem(){
  if ( $('#poem-title') == undefined ){
    var title = " ";
  } else {
    var title = $('#poem-title').text();
  }

  var word_collection = collectPoemWords();

  if ( $('.poem-id').attr('id') == undefined ){
    var method = "POST";
    var requestStr = "/api/v1/poems";
  } else {
    var poemId = $('.poem-id').attr('id')
    var method = "PATCH";
    var requestStr = "/api/v1/poems/" + poemId;
  }

  $.ajax({
      type: method,
      data: { title: title, words: word_collection },
      url: requestStr,
      success: function(data){
        $('.poem-id').attr("id", data.id);
      }
    });
}

function placeExistingWordMagnet(word){
  var wordText = word.word;
  var idNo = word.id;
  var magNumber = magnetCounter();
  $('#words-container').prepend('<span class="magnet" id="magnet' + magNumber +
                                 '" data="' + idNo + '">' + wordText + '</span>');
  $('#magnet'+magNumber).draggable({ containment: "words-container" });
  $('#magnet'+magNumber).offset({ top: word.y_position, left: word.x_position});
}

// {"words":[{"word":{"id":3224,"word":"outta","part_of_speech":"preposition","flarf":false},"id":3224,"x_position"
// :176,"y_position":164},{"word":{"id":3231,"word":"a","part_of_speech":"article","flarf":false},"id":3231
// ,"x_position":141,"y_position":22},{"word":{"id":1414,"word":"remanded","part_of_speech":"verb","flarf"
// :false},"id":1414,"x_position":143,"y_position":66}]}

function loadPoemsForShowPage(){
  if ($('.poem-id').text() == "Show Page"){
    var poemId = $('.poem-id').attr('id')
    $.ajax({
      type: "GET",
      url: "/api/v1/poems/" + poemId,
      success: function(data){
        if (data.words.length > 0){
          var words_array = data.words;
          for(i = 0; i < words_array.length; i++){
            placeExistingWordMagnet(words_array[i]);
          }
        }
      }
    });
  }
}



loadPoemsForShowPage();
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
