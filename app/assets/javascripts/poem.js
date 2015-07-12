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
    var top = value.offsetTop;
    var left = value.offsetLeft;
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
