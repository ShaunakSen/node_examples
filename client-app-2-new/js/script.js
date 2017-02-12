var myApp = angular.module('clientApp', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

myApp.controller('MainController', ['$scope', 'mainFactory', '$http', function ($scope, mainFactory, $http) {

    $scope.apiResponse = [];
    $scope.noOfUsers = 0;
    $scope.importantAnalysyis = [];

    $scope.getResponses = function () {
        $http.get("http://localhost:3000/responses_new").then(function (response) {
            $scope.apiResponse = response.data;
            console.log($scope.apiResponse);
            $scope.noOfUsers = $scope.apiResponse.length;

            $scope.analyzeResponseForLinks();

        }, function (err) {
            console.log(err);
        });
    };


    // get the response from API
    $scope.getResponses();


    $scope.filterResponses = function () {

        // ================================================
        // For each question apply:
        // score = (time spent * 2 (if correct relationship))/3000 * thoughtProvoking * 2

        // $scope.apiResponse: collection of all response data from all users
        // userResponse: response of single user for all questions
        // questionResponse: response of single user for single question
        // ================================================

        // TODO: overall score: do we need it?

        $scope.apiResponse.forEach(function (userResponse) {
            var mcqResponses = userResponse.mcqResponse;
            mcqResponses.forEach(function (questionResponse) {
                var timeSpent = questionResponse.timeSpent;
                var thoughtProvoking = questionResponse.thoughtProvoking;
                var score = 0;
                if (questionResponse.hasOwnProperty("correct")) {
                    if (questionResponse.correct) {
                        score = (timeSpent * 2) / (3000 * thoughtProvoking * 2);
                        questionResponse.score = score;
                    } else {
                        score = (timeSpent) / (3000 * thoughtProvoking * 2);
                        questionResponse.score = score;
                    }
                } else {
                    score = (timeSpent) / (3000 * thoughtProvoking);
                    questionResponse.score = score;
                }
            })
        });
        console.log("Scored responses", $scope.apiResponse);
    };

    $scope.analyzeResponseForLinks = function () {

        for (var i = 0; i < $scope.noOfUsers; ++i) {
            // iterate over all question reviews by current user
            var user_no = i;
            $scope.apiResponse[i].mcqResponse.forEach(function (questionResponse) {
                if (questionResponse.hasOwnProperty("correct") && questionResponse.correct == false) {
                    var thisQuestionNo = questionResponse.questionNo;
                    var thisQuestionTitle = questionResponse.title;
                    var thisResponse = questionResponse.response;
                    var relatedQuestionNo = questionResponse.relatedTo[0].questionNo;
                    var relatedHow = questionResponse.relatedTo[0].relatedHow;
                    var relatedQuestionResponse = $scope.apiResponse[i].mcqResponse[relatedQuestionNo - 1].response;
                    var thisQuestionText = questionResponse.responseText;
                    var relatedQuestionTitle = $scope.apiResponse[i].mcqResponse[relatedQuestionNo - 1].title;
                    var relatedQuestionText = $scope.apiResponse[i].mcqResponse[relatedQuestionNo - 1].responseText;

                    var text = "User responded with '" + thisQuestionText + "' on question no: " + thisQuestionNo +
                        " but responded with '" + relatedQuestionText + "' on question no: " + relatedQuestionNo +
                        " and the relationship was " + relatedHow;

                    $scope.importantAnalysyis.push(
                        {
                            user_no: user_no,
                            question_no: thisQuestionNo,
                            question_title: thisQuestionTitle,
                            question_response: thisResponse,
                            question_text: thisQuestionText,
                            related_question_no: relatedQuestionNo,
                            related_question_title: relatedQuestionTitle,
                            related_how: relatedHow,
                            related_question_response: relatedQuestionResponse,
                            related_question_text: relatedQuestionText,
                            text: text
                        }
                    );
                }
            })
        }

        console.log("Important Analysis Data:", $scope.importantAnalysyis);

    };


}]);



















