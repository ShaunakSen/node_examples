var myApp = angular.module('clientApp', []);

myApp.controller('MainController', ['$scope', 'mainFactory', function ($scope, mainFactory) {
    console.log("Inside MainController");
    $scope.noOfQuestions = 0;
    $scope.questions = [];
    $scope.responses = [];
    $scope.nextButtonDisabled = true;
    $scope.recordedTimes = [];
    $scope.startTime = [];
    $scope.finishTime = [];


    // CLOCK FUNCTIONS

    $scope.startClock = function (questionNo) {
        console.info("Starting clock for question", questionNo);
        var questionIndex = questionNo - 1;
        $scope.startTime[questionIndex] = Date.now();
        console.log("Start times:", $scope.startTime);
    };

    $scope.stopClock = function (questionNo) {
        console.info("Stopping clock for question", questionNo);
        var questionIndex = questionNo - 1;
        $scope.finishTime[questionIndex] = Date.now();
        console.log("Finish times:", $scope.finishTime);
        var duration = $scope.finishTime[questionIndex] - $scope.startTime[questionIndex];
        $scope.recordedTimes[questionIndex] += duration;
        console.log("Duration computted for question no:", questionNo, "is", $scope.recordedTimes[questionIndex]);
    };

    mainFactory.getQuestions().then(
        function (response) {
            console.log(response);
            $scope.questions = response;
            $scope.noOfQuestions = response.data.mcq.length;
            for (var i = 0; i < $scope.noOfQuestions; ++i) {
                $scope.recordedTimes.push(0);
                $scope.startTime.push(0);
                $scope.finishTime.push(0);
            }
            $scope.useData($scope.questions);
            // start clock for 1st question
            $scope.startClock(1)
        },
        function (response) {
            console.log(response);
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
    $scope.useData = function (data) {
        console.log(data);
        // $scope.noOfQuestions = data.data.mcq.length;
        console.log("No of questions:", $scope.noOfQuestions);
        $scope.questions = data.data.mcq;
        console.log("Questions are:", $scope.questions);
    };

    $scope.getIdsOfRadioButtons = function (questionNo) {
        var ids = [];
        for (var i = 0; i < $scope.noOfQuestions; ++i) {
            ids.push('option-' + questionNo + i);
        }
        return ids
    };

    $scope.radioButtonClicked = function () {
        // change disabled state of next button now
        $scope.nextButtonDisabled = false;
    };

    $scope.storeResponse = function (questionNo) {
        // stop clock for this question
        $scope.stopClock(questionNo);
        // Get array of possible ids of radio buttons based on that question no
        var ids = $scope.getIdsOfRadioButtons(questionNo);
        console.log(ids);
        // check if any one of them is selected
        for (var i = 0; i < ids.length; ++i) {
            if (document.getElementById(ids[i]).checked) {
                var selectedRadioButton = document.getElementById(ids[i]);
                // console.log("Value: ", selectedRadioButton.value, "Text:", selectedRadioButton.getAttribute('data-text'));
            }
        }
        // store that damn result
        $scope.storeResult(selectedRadioButton.value, questionNo);


        // change to next slide
        $("#carousel-example-generic").carousel("next");
        // disable the next button again
        $scope.nextButtonDisabled = true;
        $scope.startClock(questionNo + 1);
    };

    $scope.storeResult = function (response, questionNo) {
        console.log(response, questionNo);
        console.log($scope.questions);
        var responseObject = {};
        responseObject.questionNo = questionNo;
        responseObject.response = parseInt(response);
        for (var i = 0; i < $scope.questions.length; ++i) {
            if ($scope.questions[i].questionNo === questionNo) {
                responseObject.responseText = $scope.questions[i].optionTitles[parseInt(response)];
            }
        }
        console.log(responseObject);
        $scope.pushIntoResponses(responseObject);
        console.log("Finally", $scope.responses);

    };

    $scope.pushIntoResponses = function (responseObject) {
        for (var i = 0; i < $scope.responses.length; ++i) {
            // check if response for that question no already exists
            if ($scope.responses[i].questionNo === responseObject.questionNo) {
                // Update and return
                $scope.responses[i] = responseObject;
                return;
            }
        }
        // New response.. So push
        $scope.responses.push(responseObject);
    };

    $scope.previousButtonClicked = function (questionNo) {
        // when prev button is clicked for say ques 2 we want to stop clock for ques 2 and start again for ques 1

        $scope.stopClock(questionNo);
        $scope.startClock(questionNo - 1);

        // change slide
        $("#carousel-example-generic").carousel("prev");

    };


}]);