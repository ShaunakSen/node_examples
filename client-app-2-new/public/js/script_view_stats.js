var myApp = angular.module('clientApp', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

myApp.controller('MainController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.apiResponse = [];
    $scope.noOfUsers = 0;
    $scope.importantAnalysyis = [];
    $scope.noOfQuestions = 0;
    $scope.questionNos = [];
    $scope.selectedQuestionNo = 1;
    $scope.selectedQuestionNo2 = 1;

    $scope.reviewId = $window.reviewId;
    $scope.adminInfo = $window.adminInfo;

    // store question wise score
    $scope.questionScores = [];


    $scope.getResponses = function () {
        $http.get("http://localhost:3000/responses_new/reviewId/" + $scope.reviewId).then(function (response) {
            $scope.apiResponse = response.data;
            console.log("api response:", $scope.apiResponse);
            $scope.noOfUsers = $scope.apiResponse.length;
            $scope.noOfQuestions = $scope.apiResponse[0].mcqResponse.length;
            for (var i = 0; i < $scope.noOfQuestions; ++i) {
                $scope.questionNos.push(i + 1);
            }

            $scope.analyzeResponseForLinks();
            $scope.prepareChartData($scope.selectedQuestionNo);
            $scope.prepareChartData2($scope.selectedQuestionNo2);

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


        // Calculate Overall Score


        $scope.apiResponse.forEach(function (userResponse) {
            userResponse.overallScore = 0;
            var mcqResponse = userResponse.mcqResponse;
            var totalScore = 0;
            mcqResponse.forEach(function (questionResponse) {
                totalScore += questionResponse.score;
            });
            userResponse.overallScore = totalScore / mcqResponse.length;
        });

        console.log("Scored responses", $scope.apiResponse);


        // Calculate question wise scores


        $scope.apiResponse.forEach(function (userResponse) {
            var mcqResponse = userResponse.mcqResponse;
            mcqResponse.forEach(function (questionResponse) {
                if ($scope.questionScores.length < questionResponse.questionNo) {
                    // first time
                    // create new object
                    var newObject = {
                        questionNo: 1,
                        scores: [],
                        averageScore: 1,
                        ratings: [],
                        averageRating: 1
                    };
                    newObject.questionNo = questionResponse.questionNo;
                    newObject.scores.push(questionResponse.score);
                    newObject.ratings.push(questionResponse.response);
                    // push new object
                    $scope.questionScores.push(newObject);
                } else {
                    // not first time
                    // simply edit the appropriate object
                    var requiredObject = $scope.questionScores[questionResponse.questionNo - 1];
                    requiredObject.scores.push(questionResponse.score);
                    requiredObject.ratings.push(questionResponse.response);
                }
            });
        });
        console.log("Question wise data:", $scope.questionScores);

        // calculate average rating and average scores
        $scope.questionScores.forEach(function (questionData) {
            questionData.averageRating = averageInArray(questionData.ratings);
            questionData.averageScore = averageInArray(questionData.scores);
        });

        console.log("Question wise data:", $scope.questionScores);

    };

    $scope.analyzeResponseForLinks = function () {

        for (var i = 0; i < $scope.noOfUsers; ++i) {
            // iterate over all question reviews by current user
            var user_no = i;
            var postedBy = {
                email: "",
                full_name: "",
                roll_number: "",
                username: ""
            };

            if ($scope.apiResponse[i].hasOwnProperty("postedBy")) {
                postedBy = $scope.apiResponse[i].postedBy;
            }


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
                            text: text,
                            postedBy: postedBy
                        }
                    );
                }
            })
        }
        console.log("Important Analysis Data:", $scope.importantAnalysyis);
    };

    $scope.flagUser = function (username) {
        if (username == "") {
            return;
        }
        console.log("Flagging user with username: " + username);

        // Trigger API PUT Request

        $http({
            method: "PUT",
            url: "http://localhost:3000/users/" + username + "/flags",
            data: {},
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            console.log("Flagged User:", response);
        }, function (response) {
            console.log("Could not Flag User:", response);
        })
    };


    function isInArray(val, arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (val === arr[i]) {
                return i;
            }
        }
        return -1;
    }

    function averageInArray(arr) {
        var length = arr.length;
        var total = 0;
        for(var i=0; i<length; ++i){
            total += arr[i];
        }
        return total/length;
    }

    $scope.prepareChartData = function (questionNo) {

        // This function generates the necessary data structures: labels and data for chart generation

        // We need 2 arrays: labels and data

        // labels: 0, 1, 2, 3, 4
        // data: responses corresponding to labels
        var labels = ["", "", "", "", ""];
        var data = [0, 0, 0, 0, 0];

        console.log("here");

        $scope.apiResponse.forEach(function (userResponse) {
            var requiredQuestion = userResponse.mcqResponse[questionNo - 1];
            var response = requiredQuestion.response;
            labels[response] = requiredQuestion.responseText;
            data[response] += 1;
            /*if (isInArray(response, labels)) {
             //increase data value for the response
             data[response] += 1;

             } else {
             // initialize data value for that response
             data[response] = 1;

             // initialize label value
             labels[response] = response;
             }*/


        });

        console.log(labels, data);

        $scope.generateChart(labels, data);
    };


    $scope.generateChart = function (labels, data) {
        // 1st 2 lines are redundant but necessary for cleaning up DOM for chartjs to work properly
        document.getElementById('chart-container').innerHTML = "";
        document.getElementById('chart-container').innerHTML = '<canvas id="myChart" width="400" height="400"></canvas>';
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Reviews',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    };

    $scope.generateChart2 = function (labels, data) {
        // 1st 2 lines are redundant but necessary for cleaning up DOM for chartjs to work properly
        document.getElementById('chart-container-2').innerHTML = "";
        document.getElementById('chart-container-2').innerHTML = '<canvas id="myChart2" width="400" height="400"></canvas>';
        var ctx = document.getElementById("myChart2");
        var data_new = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        "#36A2EB",
                        "#FFCE56",
                        "#FF6384"
                    ],
                    hoverBackgroundColor: [
                        "#36A2EB",
                        "#FFCE56",
                        "#FF6384"
                    ]
                }]
        };
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data_new

        });
    };


    $scope.prepareChartData2 = function (questionNo) {

        // We need 2 arrays: labels and data

        // labels: Good poor Decent
        // data: responses corresponding to labels

        var labels = ["Good", "Decent", "Poor"];
        var data = [0, 0, 0];


        $scope.apiResponse.forEach(function (userResponse) {
            var requiredQuestion = userResponse.mcqResponse[questionNo - 1];
            var response = requiredQuestion.response;
            var responseIndex;
            if (response < 2) {
                responseIndex = 2
            } else if (response == 2) {
                responseIndex = 1;
            } else {
                responseIndex = 0;
            }
            data[responseIndex] += 1;

        });
        console.log(data);
        $scope.generateChart2(labels, data);
    };


}]);

/*
 [
 ["Very Good": 4],
 ["Good": 4],
 ["Very Good": 4],
 ]
 */
















