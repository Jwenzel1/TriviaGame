$(document).ready(function(){
  var currentTime = 7;
  var timerId;
  var questions = ["Is the sky blue?", "Am I insane?", "Who are you?"];
  var choices = [
    ["yes", "no", "maybe", "probably"],
    ["yes", "no", "maybe", "probably"],
    ["yes", "no", "maybe", "probably"]
  ];
  var answers = ["maybe", "yes", "no"];
  var usedQuestions = [];
  var usedChoices = [];
  var usedAnswers = [];
  var userAnswer;
  var currentAnswer;
  var userScore = 0;
  var incorrectScore = 0;
  var postQuestion = false;

  function writeTime(){
    $("#time").text(currentTime);
  }

  function setTime(time){
    currentTime = time;
    writeTime();
  }

  function timer(){
    currentTime--;
    if(currentTime < 0 && postQuestion === false){
      writeTime();
      postQuestion = true;
      prepareForNextQuestion();
    }
    else if(currentTime < 0 && postQuestion === true){
      writeTime();
      postQuestion = false;
      setupTheNextQuestion();
    }
    else {
      writeTime();
    }
  }

  function getNextQuestion(){
    return questions[Math.floor(Math.random() * questions.length)];
  }

  function getChoices(question){
    return choices[questions.indexOf(question)];
  }

  function getAnswer(question){
    questionIndex = questions.indexOf(question);
    answer = answers[questionIndex];
    usedQuestions.push(questions[questionIndex]);
    usedChoices.push(choices[questionIndex]);
    usedAnswers.push(answers[questionIndex]);
    questions.splice(questionIndex, 1);
    choices.splice(questionIndex, 1);
    answers.splice(questionIndex, 1);
    return answer;
  }

  function writeQuestionAndAnswers(question, possibleAnswers){
    $("#question").text(question);
    for(var i = 0; i < possibleAnswers.length; i++){
      $("#answerChoices").append("<p class=\"text-center\">" + possibleAnswers[i] + "</p>");
    }
  }

  function clearQuestionAndAnswers(){
    $("#question").text("");
    $("#answerChoices p").remove();
  }

  function makeChoicesHighlight(){
    $("#answerChoices p").hover(function(){
      $(this).css("background-color", "green");
    }, function(){
      $(this).css("background-color", "#d1d1d1");
    });
  }

  function highlightCorrectChoice(){
    $("#answerChoices p").each(function(){
      if($(this).text() === currentAnswer){
        $(this).css("background-color", "blue");
      }
      else{
        $(this).css("background-color", "#d1d1d1");
      }
      $(this).off();
      if($("#info").text() == ""){
        updateInfo("OUT OF TIME!!!!")
      }
    });
  }

  function prepareForNextQuestion(answer){
    clearInterval(timerId);
    highlightCorrectChoice();
    setTime(3);
    timerId = setInterval(timer, 1000);
  }

  function updateInfo(message){
    var $info = $("#info");
    $info.text(message);
  }

  function createResults(){
    updateInfo("HERE'S YOUR RESULTS!!!!");
    var $info = $("#info");
    $info.append("<p>Correct: " + userScore + "</p>");
    $info.append("<p>Incorrect: " + incorrectScore + "</p>");
    $info.append("<p>Unanswered: " + (questions.length - (userScore + incorrectScore)) + "</p>");
  }

  function setupTheNextQuestion(){
    if(questions.length != 0){
      clearInterval(timerId);
      setTime(7);
      updateInfo("");
      clearQuestionAndAnswers();
      var currentQuestion = getNextQuestion();
      var currentChoices = getChoices(currentQuestion);
      currentAnswer = getAnswer(currentQuestion);
      writeQuestionAndAnswers(currentQuestion, currentChoices);
      timerId = setInterval(timer, 1000);
      makeChoicesHighlight()
      $("#answerChoices p").on("click", function(){
        $("#answerChoices p").off();
        postQuestion = true;
        if($(this).text() === currentAnswer){
          userScore++;
          updateInfo("CORRECT!!!!");
        }
        else{
          incorrectScore++;
          updateInfo("INCORRECT!!!!");
        }
        prepareForNextQuestion(currentAnswer);
      });
    }
    else{
      clearQuestionAndAnswers();
      clearInterval(timerId)
      setTime(0);
      $("button").toggle();
      questions = usedQuestions;
      answers = usedAnswers;
      choices = usedChoices;
      usedQuestions = [];
      usedAnswers = [];
      usedChoices = [];
      createResults();
      userScore = 0;
      incorrectScore = 0;
    }
  }

  $("button").on("click", function(){
    $("button").toggle();
    setupTheNextQuestion();
  });

}); //Closes Document Ready
