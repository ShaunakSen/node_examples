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
    $scope.linkedMessage = [];


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
        $scope.createUnifiedObject($scope.questions, $scope.responseData);
    };

    $scope.createUnifiedObject = function (questions, responses) {
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

        $scope.analyzeResponses();
        $scope.analyzeResponseForLinks();

    };
    $scope.fetchResponseData();

    $scope.analyzeResponses = function () {
        for (var i = 0; i < $scope.timeAnalyzer.length; ++i) {
            var newObject = {};
            newObject.timeMessage = "Time spent on question: " + (i + 1) + " is " + $scope.timeAnalyzer[i].timeSpent;
            newObject.timeOk = $scope.timeAnalyzer[i].timeSpent >= 2000;
            $scope.messages.push(newObject);
            console.log("Messages:", $scope.messages);
        }
    };

    $scope.analyzeResponseForLinks = function () {
        var localArray = [];
        for (var i = 0; i < $scope.timeAnalyzer.length; ++i) {
            if ($scope.timeAnalyzer[i].relatedTo.length > 0) {
                var newObj = {};
                newObj.questionNo = $scope.timeAnalyzer[i].questionNo;
                newObj.relatedTo = $scope.timeAnalyzer[i].relatedTo;
                newObj.response = $scope.timeAnalyzer[i].response;
                localArray.push(newObj);
            }
        }

        console.log("Local array is:", localArray);

        // Now i have data of questions related to another question


        for (var x = 0; x < localArray.length; ++x) {
            var currentObject = localArray[x];
            var thisQuestionNo = currentObject.questionNo;
            var thisQuestionResponse = currentObject.response;
            var relatedQuestionNo = currentObject.relatedTo[0].questionNo;
            var relatedHow = currentObject.relatedTo[0].relatedHow;

            // find response that user gave on the related question

            var relatedQuestionResponse = $scope.timeAnalyzer[relatedQuestionNo - 1].response;
            $scope.checkIfResponseIsOk(thisQuestionNo, thisQuestionResponse, relatedQuestionNo, relatedQuestionResponse, relatedHow);
        }
    };

    $scope.checkIfResponseIsOk = function (thisQuestionNo, thisQuestionResponse, relatedQuestionNo, relatedQuestionResponse, relatedHow) {
        var newObj = {};
        var diff = thisQuestionResponse - relatedQuestionResponse;
        if (diff < 0) {
            diff = -diff;
        }
        newObj.questionNo = thisQuestionNo;
        newObj.relatedTo = relatedQuestionNo;
        newObj.relatedHow = relatedHow;
        newObj.thisResponse = thisQuestionResponse;
        newObj.relatedQuestionResponse = relatedQuestionResponse;
        newObj.message = "User response on question: " + thisQuestionNo + " is " + thisQuestionResponse;
        newObj.message += " User response on question: " + relatedQuestionNo + " was " + relatedQuestionResponse;
        newObj.message += " Relationship was " + relatedHow;
        if (relatedHow == "direct") {
            newObj.correct = diff <= 2;
        }
        else {
            newObj.correct = diff >= 2;
        }

        $scope.linkedMessage.push(newObj);

        console.log("Linked msg is:", $scope.linkedMessage);
    }

}]);