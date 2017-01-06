var allAnswers = [];
var wrongAnswerCount = 0;
var currentRound = null;

function setupUI() {
  $("#title").text(cardSet.text);

  $(document).on("click", "#answers:not(.disabled) li", function() {
    $("#answers").addClass("disabled");

    currentRound.total++;

    if($(this).text() == currentAnswer) {
      currentRound.correct++;
      $(this).addClass("correct");
    }
    else {
      $(this).addClass("incorrect");
    }

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
}

function nextQuestion() {
  currentQuestion = currentRound.questions.shift();

  if(currentQuestion == null) {
    completeRound();
    return;
  }

  $("#question").text(currentQuestion.text);
  currentAnswer = currentQuestion.answer;

  var answers = _.chain(allAnswers).without(currentAnswer).shuffle().first(wrongAnswerCount).value();
  answers.push(currentAnswer);

  $("#answers").empty();
  _.each(_.shuffle(answers), function(answer) {
    var li = $("<li>");
    li.addClass("btn");
    li.addClass("btn-primary");
    li.text(answer);
    $("#answers").append(li);
  });
}

function startRound() {
  currentRound = {
    questions: _.shuffle(cardSet.cards),
    currentQuestion: null,
    currentAnswer: null,
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
  $("#results").text("Done, " + currentRound.correct + " correct of " + currentRound.total + " questions.");
}

$(function() {
  allAnswers = _.map(cardSet.cards, function(question) {
    return question.answer;
  });
  allAnswers = _.uniq(allAnswers);

  wrongAnswerCount = (allAnswers.length > 3 ? 3 : (allAnswers.length - 1));

  setupUI();
});