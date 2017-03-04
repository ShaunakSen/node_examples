var myApp = angular.module('clientApp', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

myApp.controller('MainController', ['$scope', '$window', 'mainFactory', '$http', function ($scope, $window, mainFactory, $http) {
    console.log("Inside MainController");
    $scope.noOfQuestions = 0;
    $scope.questions = [];
    $scope.responses = [];
    $scope.nextButtonDisabled = true;
    $scope.recordedTimes = [];
    $scope.startTime = [];
    $scope.finishTime = [];
    $scope.reviewId = "";
    $scope.responseData = [];
    $scope.messages = [];
    $scope.visualFeedback = [];
    $scope.timeAnalyzer = [];


    $scope.userInfo = $window.userInfo;
    console.log($scope.userInfo);

    // CLOCK FUNCTIONS -> CHANGE TO FACTORY LATER MAYBE?

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
        console.log("Duration computed for question no:", questionNo, "is", $scope.recordedTimes[questionIndex]);
    };
    mainFactory.getQuestions().then(
        function (response) {
            // $scope.questions = response;
            console.log(response);
            $scope.noOfQuestions = response.data[0].mcq.length;
            for (var i = 0; i < $scope.noOfQuestions; ++i) {
                $scope.recordedTimes.push(0);
                $scope.startTime.push(0);
                $scope.finishTime.push(0);
            }
            $scope.useData(response);
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
        $scope.questions = data.data[0].mcq;
        $scope.reviewId = data.data[0]._id;
        console.log("The id is", $scope.reviewId);
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


    // happens every time next button is clicked
    $scope.storeResponse = function (questionNo) {
        // stop clock for this question
        $scope.stopClock(questionNo);
        // Get array of possible ids of radio buttons based on that question no
        var ids = $scope.getIdsOfRadioButtons(questionNo);
        console.log("ids of radio buttons are", ids);
        // check if any one of them is selected
        for (var i = 0; i < ids.length; ++i) {
            // console.log(document.getElementById(ids[i]).checked);
            if (document.getElementById(ids[i]).checked) {
                var selectedRadioButton = document.getElementById(ids[i]);
                // console.log("Value: ", selectedRadioButton.value, "Text:", selectedRadioButton.getAttribute('data-text'));
            }
        }
        // store that result
        $scope.storeResult(selectedRadioButton.value, questionNo);


        if (questionNo != $scope.questions.length) {
            // change to next slide
            $("#carousel-example-generic").carousel("next");
            // disable the next button again
            $scope.nextButtonDisabled = true;
            $scope.startClock(questionNo + 1);
        }

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

        responseObject = $scope.addAdditionalData(responseObject, questionNo);
        console.log("Response object: " + responseObject);
        $scope.pushIntoResponses(responseObject);
    };


    $scope.addAdditionalData = function (responseObject, questionNo) {
        for(var i=0; i<$scope.questions.length; ++i){
            if($scope.questions[i].questionNo === questionNo){
                var importance = $scope.questions[i].importance;
                var thoughtProvoking = $scope.questions[i].thoughtProvoking;
                var title = $scope.questions[i].title;
                var relatedTo = $scope.questions[i].relatedTo;
            }
        }
        responseObject.importance = importance;
        responseObject.thoughtProvoking = thoughtProvoking;
        responseObject.title = title;
        responseObject.relatedTo = relatedTo;

        return responseObject;
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


    $scope.submitButtonClicked = function () {

        // store the last response
        $scope.storeResponse($scope.questions.length);

        console.log("Data we have...");
        console.log($scope.responses);
        console.log($scope.recordedTimes);

        // add the recorded times data to main responses data

        for (var i = 0; i < $scope.recordedTimes.length; ++i) {
            $scope.responses[i].timeSpent = $scope.recordedTimes[i];
        }
        console.log($scope.responses);
        var responseData = {
            reviewId: $scope.reviewId,
            mcqResponse: [],
            postedBy: {}
        };

        // EVALUATE RELATIONSHIP

        for(var k=0; k<$scope.responses.length; ++k){
            if ($scope.responses[k].relatedTo.length > 0) {
                var relatedQuestionNo = $scope.responses[k].relatedTo[0].questionNo;
                var relatedHow = $scope.responses[k].relatedTo[0].relatedHow;
                var thisQuestionResponse = $scope.responses[k].response;
                var relatedQuestionResponse = $scope.responses[relatedQuestionNo - 1].response;

                var diff = thisQuestionResponse - relatedQuestionResponse;
                if (diff < 0) {
                    diff = -diff;
                }

                if (relatedHow == "direct") {
                    $scope.responses[k].correct = diff <= 2;
                } else {
                    $scope.responses[k].correct = diff >= 2;
                }
            }
        }

        // EVALUATE RELATIONSHIP ENDS

        console.log("After evaluating relationships:", $scope.responses);

        for (var x = 0; x < $scope.responses.length; ++x) {
            responseData.mcqResponse.push($scope.responses[x]);
        }
        console.log(responseData);

        // Fill in user data

        responseData.postedBy.full_name = $scope.userInfo.full_name;
        responseData.postedBy.roll_number = $scope.userInfo.roll_number;
        responseData.postedBy.username = $scope.userInfo.username;
        responseData.postedBy.email = $scope.userInfo.email;

        // POST the response

        var postReq = {
            method: 'POST',
            url: 'http://localhost:3000/responses_new/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: responseData
        };

        $http(postReq).then(
            function (response) {
                console.log("Ok..", response);

                // user has posted the response..we have user info and id of form he filled
                // store the filled form id in users collection so that he can no longer fill it again

                $http({
                    method : "PUT",
                    url : 'http://localhost:8000/users/' + $scope.userInfo._id + '/filled_forms',
                    data : angular.toJson($scope.reviewId),
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }).then( function (response) {
                    console.log("ok...", response)
                }, function (response) {
                    console.log("not ok...", response)
                } );


            },
            function (response) {
                console.log("Not Ok..", response);
            }
        );
    };




}]);