$(function() {
  cardSet.allAnswers = _.chain(cardSet.cards).map(function(question) {
    return question.answer;
  }).uniq().value();

  cardSet.wrongAnswerCount = (cardSet.allAnswers.length > 3 ? 3 : (cardSet.allAnswers.length - 1));

  var state = null;

  function nextQuestion() {
    var card = state.cards.shift();
    if(card) showCard(card);
    else completeRound();
  }

  function showCard(card) {
    $("#question").text(card.text);

    var answers = _.chain(cardSet.allAnswers).without(card.answer).shuffle().first(cardSet.wrongAnswerCount).
      value();
    answers.push(card.answer);

    $("#answers").empty();
    _.each(_.shuffle(answers), function(answer) {
      var li = $("<li>");
      li.addClass("btn btn-primary");
      li.text(answer);

      if(answer == card.answer) li.addClass("correct");
      $("#answers").append(li);
    });
  }

  function startRound() {
    state = {
      cards: _.shuffle(cardSet.cards),
      correct: 0,
      total: 0
    };

    nextQuestion();
    $("#card").show();
    $("#stop").show();
    $("#start").hide();
  }

  function completeRound() {
    $("#card").hide();
    $("#stop").hide();
    $("#start").show();
    $("#results").text("Done, " + state.correct + " correct of " + state.total + " questions.");
  }

  $("#title").text(cardSet.text);

  $(document).on("click", "#answers:not(.disabled) li", function() {
    $("#answers").addClass("disabled");

    state.total++;
    $(this).addClass("selected");
    if($(this).hasClass("correct")) state.correct++;

    setTimeout(function() {
      $("#answers").removeClass("disabled");
      nextQuestion();
    }, 1000);
  });

  $("#stop").click(function(event) {
    event.preventDefault();
    completeRound();
  });

  $("#start").click(function(event) {
    event.preventDefault();
    startRound();
  });
});