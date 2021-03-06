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

    // FILTER VARS

    $scope.allResponseData = [];


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
            newObject.timeOk = $scope.timeAnalyzer[i].timeSpent >= 3000;
            $scope.messages.push(newObject);

        }
        console.log("Messages:", $scope.messages);
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
    };


    // ==============================
    // FILTERING FUNCTIONS
    // ==============================

    $scope.prepareFiltering = function () {
        console.info("Inside prepareFiltering function");
        $http.get('http://localhost:3000/responses').then(
            function (response) {
                $scope.allResponseData = response.data;
                $scope.allResponseData.forEach(function (reviewResponse) {
                    for (var i = 0; i < reviewResponse.mcqResponse.length; ++i) {
                        var importance = $scope.questions[i].importance;
                        var thoughtProvoking = $scope.questions[i].thoughtProvoking;
                        var relatedTo = $scope.questions[i].relatedTo;

                        reviewResponse.mcqResponse[i].importance = importance;
                        reviewResponse.mcqResponse[i].thoughtProvoking = thoughtProvoking;
                        reviewResponse.mcqResponse[i].relatedTo = relatedTo;
                        reviewResponse.mcqResponse[i].score = 0;
                        reviewResponse.overallScore = 0;

                        // evaluate relationship
                        if (reviewResponse.mcqResponse[i].relatedTo.length > 0) {
                            var relatedQuestionNo = reviewResponse.mcqResponse[i].relatedTo[0].questionNo;
                            var relatedHow = reviewResponse.mcqResponse[i].relatedTo[0].relatedHow;
                            var thisQuestionResponse = reviewResponse.mcqResponse[i].response;
                            var relatedQuestionResponse = reviewResponse.mcqResponse[relatedQuestionNo - 1].response;

                            var diff = thisQuestionResponse - relatedQuestionResponse;
                            if (diff < 0) {
                                diff = -diff;
                            }

                            if (relatedHow == "direct") {
                                reviewResponse.mcqResponse[i].correct = diff <= 2;
                            } else {
                                reviewResponse.mcqResponse[i].correct = diff >= 2;
                            }
                        }
                    }
                });

                console.log("All response data is now ", $scope.allResponseData);

                $scope.filterData();
            },
            function (response) {
                console.log(response);
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        )
    };

    $scope.filterData = function () {

        // we have a set of reviews
        // for each review give them a score

        // score = (time spent * 2 (if correct relationship))/3000 * thoughtProvoking * 2

        $scope.allResponseData.forEach(function (reviewResponse) {
            var importanceList = [];
            var overallScore = 0;
            var mcqResponses = reviewResponse.mcqResponse;
            for (var i = 0; i < mcqResponses.length; ++i) {

                importanceList.push(mcqResponses[i].importance);
                // check if the response has correct property
                if (mcqResponses[i].hasOwnProperty("correct")) {
                    if (mcqResponses[i].correct === true) {
                        mcqResponses[i].score = (mcqResponses[i].timeSpent * 2) /
                            (3000 * mcqResponses[i].thoughtProvoking * 2);
                    } else {
                        mcqResponses[i].score = (mcqResponses[i].timeSpent) /
                            (3000 * mcqResponses[i].thoughtProvoking * 2);
                    }
                } else {
                    // response does not have correct property
                    mcqResponses[i].score = (mcqResponses[i].timeSpent) /
                        (3000 * mcqResponses[i].thoughtProvoking);
                }
            }

            // now that we have score for each question, evaluate overall score for the review

            var sumOfImportance = importanceList.reduce(function (prev, next) {
                return prev + next;
            }, 0);

            for (var x = 0; x < mcqResponses.length; ++x) {
                overallScore += (mcqResponses[x].score * mcqResponses[x].importance)/sumOfImportance;
            }

            reviewResponse.overallScore = overallScore;

        });


        console.info("Filtered data: ", $scope.allResponseData);

    };


}]);



















