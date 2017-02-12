var myApp = angular.module('clientApp', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

myApp.controller('MainController', ['$scope', 'mainFactory', '$http', function ($scope, mainFactory, $http) {

    $scope.apiResponse = [];
    $scope.noOfUsers = 0;

    $scope.getResponses = function () {
        $http.get("http://localhost:3000/responses_new").then(function (response) {
            $scope.apiResponse = response.data;
            console.log($scope.apiResponse);
            $scope.noOfUsers = $scope.apiResponse.length;
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

        $scope.apiResponse.forEach(function (userResponse) {
            var mcqResponses = userResponse.mcqResponse;
            mcqResponses.forEach(function (questionResponse) {
                console.log(questionResponse);
                var timeSpent = questionResponse.timeSpent;
                var thoughtProvoking = questionResponse.thoughtProvoking;
                var score = 0;
                if(questionResponse.hasOwnProperty("correct")){
                    if(questionResponse.correct){
                        score = (timeSpent * 2)/(3000 * thoughtProvoking * 2);
                        questionResponse.score = score;
                    } else {
                        score = (timeSpent)/(3000 * thoughtProvoking * 2);
                        questionResponse.score = score;
                    }
                } else {
                    score = (timeSpent)/(3000 * thoughtProvoking);
                    questionResponse.score = score;
                }
            })
        });
        console.log("Scored responses", $scope.apiResponse);
    };
    // score = (time spent * 2 (if correct relationship))/3000 * thoughtProvoking * 2


}]);



















