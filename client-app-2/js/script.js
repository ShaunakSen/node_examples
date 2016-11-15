var myApp = angular.module('clientApp', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

myApp.controller('MainController', ['$scope', 'mainFactory', '$http', function ($scope, mainFactory, $http) {
    console.log("Inside MainController");
    $scope.noOfQuestions = 0;
    $scope.questions = [];
    $scope.reviewId = "";
    $scope.responseData = [];
    $scope.messages = [];
    $scope.visualFeedback = [];
    $scope.timeAnalyzer = [];



    mainFactory.getQuestions().then(
        function (response) {
            console.log(response);
            // $scope.questions = response;
            $scope.noOfQuestions = response.data[0].mcq.length;
            $scope.useData(response);
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
        $scope.questions = data.data[0].mcq;
        $scope.reviewId = data.data[0]._id;
        console.log("The id is", $scope.reviewId);
        console.log("Questions are:", $scope.questions);
    };


    $scope.fetchResponseData = function () {
        $http.get('http://localhost:3000/responses').then(
            function (response) {
                // console.log("Response data:", response.data);
                // last one will be the most recent response
                var lastResponse = response.data[response.data.length - 1];
                $scope.useResponseData(lastResponse);
            },
            function (response) {
                console.log(response);
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        )
    };


    $scope.useResponseData = function (responseData) {

        $scope.responseData = responseData.mcqResponse;
        $scope.analyzeResponseForTime($scope.questions, $scope.responseData);
    };

    $scope.analyzeResponseForTime = function (questions, responses) {
        console.log("Questions were:", questions);
        console.log("The response is:", responses);
        for (var i = 0; i < responses.length; ++i) {
            $scope.timeAnalyzer.push(responses[i]);
        }
        for (var x = 0; x < questions.length; ++x) {
            $scope.timeAnalyzer[x].relatedTo = questions[x].relatedTo;
            $scope.timeAnalyzer[x].title = questions[x].title;
            $scope.timeAnalyzer[x].thoughtProvoking = questions[x].thoughtProvoking;
        }

        console.info("Unified data is", $scope.timeAnalyzer);

        

    };
    $scope.fetchResponseData();
}]);