var play = false;

function display(element) {
  var armies = $("#armies input[type=checkbox]:checked").length;
  var bombs = $("#bombs input[type=checkbox]:checked").length;

  if (armies >= 5) {
    $("#armies input[type=checkbox]").attr('disabled','disabled');
  }

  if (bombs >= 5) {
    $("#bombs input[type=checkbox]").attr('disabled','disabled');
  }

  if (armies >= 5 && bombs >= 5) {
    if (!play) {
      play = true;
      $('#start').removeAttr('disabled');
      $('#start').click(function(event){
        event.preventDefault();
        getArmies();
      });
      return;
    }
  }

  $('#armies .count').text(armies);
  $('#bombs .count').text(bombs);

  var boxCoord = getCoords(element);

  console.log(boxCoord);
};

function getCoords(element){
  return $(element).attr('coords');
};

function start(form) {
  var total = 0;
  var play = false;
  for (var i = 1; i <= 100; ++i) {
    form.elements[i].checked = false;
  }
};

function makeInputs(element){
  for (var i = 0; i < 10; ++i) {
    for (var j = 0; j < 10; ++j) {
      var html = '<input type="checkbox" onClick="display(this)" coords="'+i+','+j+'">';
      $('#' + element + ' .inputs').append(html);
    }
    $('#' + element + ' .inputs').append('<br>');
  }
};

$(document).ready(function(){
  makeInputs('armies');
  makeInputs('bombs');
});


