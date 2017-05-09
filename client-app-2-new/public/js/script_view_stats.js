var myApp = angular.module('clientApp', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});

myApp.controller('MainController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.apiResponse = [];
    $scope.questions = [];
    $scope.usersData = [];
    $scope.noOfUsers = 0;
    $scope.importantAnalysyis = [];
    $scope.importantTextQuestionAnalysis = [];
    $scope.noOfQuestions = 0;
    $scope.questionNos = [];
    $scope.selectedQuestionNo = 1;
    $scope.selectedQuestionNo2 = 1;
    $scope.selectedQuestionBarScored = 1;
    $scope.timesSpent = [{questionNo: 1, title: "", timeSpent: 0}];

    $scope.displayTime1 = 0;

    $scope.reviewId = $window.reviewId;
    $scope.adminInfo = $window.adminInfo;

    // store question wise score
    $scope.questionScores = [];
    $scope.filteredQuestionData = [];

    $scope.currentView = 'raw';
    $scope.alreadyFiltered = false;
    $scope.minScore = 0;
    $scope.userCredibility = 'high';

    $scope.modalMessage = ""

    // Background and border colors to be used by all charts

    $scope.backgroundColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ];

    $scope.borderColors = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];


    $scope.generatedSuggestionMessages = [];


    $scope.getResponses = function () {
        $http.get("http://localhost:3000/responses_new/reviewId/" + $scope.reviewId).then(function (response) {
            $scope.apiResponse = response.data;
            $scope.apiResponse[0].mcqResponse.forEach(function (userResponse) {
                $scope.questions.push(userResponse.title);
            });
            console.log("api response:", $scope.apiResponse);
            $scope.noOfUsers = $scope.apiResponse.length;
            $scope.noOfQuestions = $scope.apiResponse[0].mcqResponse.length;
            for (var i = 0; i < $scope.noOfQuestions; ++i) {
                $scope.questionNos.push(i + 1);
            }

            // Time Spent on each question
            $scope.apiResponse.forEach(function (userResponse) {

                var mcqResponse = userResponse.mcqResponse;
                mcqResponse.forEach(function (singleResponse) {
                    var timeSpent = singleResponse.timeSpent;
                    var questionNo = singleResponse.questionNo;
                    var updated = false;

                    $scope.timesSpent.forEach(function (timeSpentData) {
                        if (timeSpentData.questionNo === questionNo) {
                            // Update
                            timeSpentData.timeSpent += timeSpent;
                            updated = true;
                            timeSpentData.title = singleResponse.title;
                        }
                    });
                    if (!updated) {
                        // new
                        $scope.timesSpent.push({
                            questionNo: questionNo,
                            timeSpent: timeSpent
                        });
                    }
                });
            });

            $scope.timesSpent.forEach(function (timeSpentData) {
                timeSpentData.timeSpent = timeSpentData.timeSpent / $scope.noOfUsers;
            });

            console.log("Time Spent data:", $scope.timesSpent);


            $scope.analyzeResponseForLinks();
            $scope.getFlagData();
            $scope.prepareChartData($scope.selectedQuestionNo);
            $scope.prepareChartData2($scope.selectedQuestionNo2);

            $scope.displayTime1 = Math.round($scope.displayTime(1) / 1000);

        }, function (err) {
            console.log(err);
        });
    };


    // get the response from API
    $scope.getResponses();

    // Display average time for a question

    $scope.displayTime = function (questionNo) {
        return $scope.timesSpent[questionNo - 1].timeSpent;
    };


    $scope.getFlagData = function () {
        $http.get("http://localhost:3000/users").then(function (response) {
            console.log("Users Data:", response);
            $scope.usersData = response.data;
            $scope.apiResponse.forEach(function (userResponse) {
                var username = userResponse.postedBy.username;
                $scope.usersData.forEach(function (userData) {
                    if (userData.username === username) {
                        userResponse.postedBy.flags = userData.flags;
                        userResponse.postedBy.filled_forms = userData.filled_forms;
                    }
                })
            });
            console.log("Api Response with flags:", $scope.apiResponse);
        }, function (err) {
            console.log(err);
        });
    };

    $scope.changeView = function (view) {
        if (view == 'scored') {
            $scope.currentView = 'scored';
            $scope.filterResponses();
        } else {
            $scope.currentView = 'raw';
            $scope.prepareChartData(1);
            $scope.prepareChartData2(1);
        }
    };


    $scope.filterResponses = function () {

        // ================================================
        // For each question apply:
        // score = (time spent * 2 (if correct relationship))/3000 * thoughtProvoking * 2

        // $scope.apiResponse: collection of all response data from all users
        // userResponse: response of single user for all questions
        // questionResponse: response of single user for single question
        // ================================================


        if (!$scope.alreadyFiltered) {
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

            // calculate average rating and average scores
            $scope.questionScores.forEach(function (questionData) {
                questionData.averageRating = averageInArray(questionData.ratings);
                questionData.averageScore = averageInArray(questionData.scores);
            });
            console.log("Question wise data:", $scope.questionScores);

            $scope.alreadyFiltered = true;
            // display modal

            $scope.modalMessage = "Successfully filtered data!";
            $('#success-modal').modal();
        }



        $scope.prepareRadarChartData();
        $scope.prepareBarChartDataScored(1);

        
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
                            postedBy: postedBy,
                            textResponse: []
                        }
                    );
                }
            });

            if($scope.apiResponse[i].hasOwnProperty('textResponse')){
                if($scope.apiResponse[i].textResponse.length > 0){
                    $scope.apiResponse[i].textResponse.forEach(function (textResponse) {
                        if(textResponse.correct == false){
                            $scope.importantTextQuestionAnalysis.push({
                                question_title: textResponse.title,
                                postedBy: postedBy,
                                response: textResponse.response
                            })
                        }
                    })
                }
            }



        }
        console.log("Important Analysis Data:", $scope.importantAnalysyis);
        console.log("Important Text Analysis Data:", $scope.importantTextQuestionAnalysis);
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

            // show success modal
            $scope.modalMessage = "Successfully Flagged User"
            $('#success-modal').modal();

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
        for (var i = 0; i < length; ++i) {
            total += arr[i];
        }
        return total / length;
    }

    $scope.filterBasedOnFlags = function (userCredibility) {

        $scope.currentView = 'flagged';
        $scope.filteredDataOnFlags = angular.copy($scope.apiResponse);
        var highFlagRatio = 10;
        var lowFlagRatio = 4;

        var indexesToRemove = [];

        $scope.filteredDataOnFlags.forEach(function (userResponse, index) {
            // if(userResponse.postedBy.flags === 0 || userResponse.postedBy.filled_forms.length === 0){
            //     console.log("Not filtering...");
            // } else if(userResponse.postedBy.filled_forms/userResponse.postedBy.flags > -1){
            //     console.log("Needs filtering at " + index + " ratio= " + userResponse.postedBy.filled_forms/userResponse.postedBy.flags);
            // }


            if (userResponse.postedBy.flags === 0 || userResponse.postedBy.filled_forms.length === 0) {
                console.log("No filtering required");
            } else if (userResponse.postedBy.filled_forms.length / userResponse.postedBy.flags > 0) {
                console.log("Needs filtering");
                console.log("Ratio", userResponse.postedBy.filled_forms.length / userResponse.postedBy.flags);
                indexesToRemove.push(index);
                $scope.filteredDataOnFlags[index] = "";
            }
        });
        console.log(indexesToRemove);

        $scope.filteredDataOnFlags = $scope.filteredDataOnFlags.filter(function (data, index) {
            return data !== "";
        });


        console.log($scope.apiResponse, $scope.filteredDataOnFlags);

        $scope.prepareCharDataFlagged(1);

    };


    $scope.filterResponsesBasedOnScore = function (questionNo, minScore, maxScore) {


        // *************WE NEED A DEEP COPY HERE NOT A SHALLOW COPY***************

        console.log(questionNo, minScore, maxScore);
        $scope.filteredQuestionData = angular.copy($scope.questionScores);
        var scores = $scope.filteredQuestionData[questionNo - 1].scores;
        var ratings = $scope.filteredQuestionData[questionNo - 1].ratings;
        var indexesToRemove = [];
        for (var i = 0; i < scores.length; ++i) {
            if (scores[i] < minScore || scores[i] > maxScore) {
                indexesToRemove.push(i);
            }
        }
        console.log("Indexes to remove:", indexesToRemove);
        var newScores = scores.filter(function (score, index) {
            return (score < maxScore && score > minScore)
        });

        console.log(newScores);
        for (var x = 0; x < indexesToRemove.length; ++x) {
            ratings[indexesToRemove[x]] = "";
        }
        console.log(ratings);

        var newRatings = ratings.filter(function (rating, index) {
            return rating !== "";
        });

        console.log(newRatings);

        $scope.filteredQuestionData[questionNo - 1].ratings = newRatings;
        $scope.filteredQuestionData[questionNo - 1].scores = newScores;


        // Re calculate averages
        $scope.filteredQuestionData[questionNo - 1].averageRating = averageInArray($scope.filteredQuestionData[questionNo - 1].ratings);
        $scope.filteredQuestionData[questionNo - 1].averageScore = averageInArray($scope.filteredQuestionData[questionNo - 1].scores);


        console.log($scope.filteredQuestionData);

        $scope.prepareBarChartDataFiltered(questionNo);
    };


    $scope.prepareChartData = function (questionNo) {

        // This function generates the necessary data structures: labels and data for chart generation

        // We need 2 arrays: labels and data

        // labels: 0, 1, 2, 3, 4
        // data: responses corresponding to labels

        // set display time
        $scope.displayTime1 = Math.round($scope.displayTime(questionNo) / 1000);


        var labels = ["", "", "", "", ""];
        var data = [0, 0, 0, 0, 0];
        $scope.apiResponse.forEach(function (userResponse) {
            var requiredQuestion = userResponse.mcqResponse[questionNo - 1];
            var response = requiredQuestion.response;
            labels[response] = requiredQuestion.responseText;
            data[response] += 1;
        });


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

        // set display time
        $scope.displayTime1 = Math.round($scope.displayTime(questionNo) / 1000);


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
        $scope.generateChart2(labels, data);
    };

    $scope.prepareRadarChartData = function () {
        var labels = ["Very Low", "Low", "Ok", "High", "Very High", "Overall Rating", "Scaled Credibility Score"];
        var data = [];


        var backgroundColors = ["rgba(179,181,198,0.2)", "rgba(255,99,132,0.2)", "rgba(59, 44, 198, 0.2)",
            "rgba(35, 198, 39, 0.2)", "rgba(198, 116, 43, 0.2)"];
        var borderColors = ["rgba(179,181,198,1)", "rgba(255,99,132,1)", "rgba(59, 44, 198, 1)",
            "rgba(35, 198, 39, 1)", "rgba(198, 116, 43, 1)"];
        $scope.questionScores.forEach(function (questionData) {
            // TODO: This array needs to be dynamic
            var questionRatings = [0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < questionData.ratings.length; ++i) {
                questionRatings[questionData.ratings[i]]++;
            }
            questionRatings[questionRatings.length - 2] = questionData.averageRating;
            questionRatings[questionRatings.length - 1] = questionData.averageScore * 10;
            data.push(questionRatings);
        });
        $scope.generateRadarChart(labels, data, backgroundColors, borderColors);
    };

    $scope.generateRadarChart = function (labels, myData, backgroundColors, borderColors) {
        // 1st 2 lines are redundant but necessary for cleaning up DOM for chartjs to work properly
        document.getElementById('chart-container-3').innerHTML = "";
        document.getElementById('chart-container-3').innerHTML = '<canvas id="myChart3" width="400" height="400"></canvas>';
        var ctx = document.getElementById("myChart3");

        var data = {
            labels: labels,
            datasets: []
        };

        for (var i = 0; i < myData.length; ++i) {
            var datasetObject = {
                label: "Question No " + (i + 1),
                backgroundColor: backgroundColors[i],
                borderColor: borderColors[i],
                pointBackgroundColor: borderColors[i],
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: borderColors[i],
                data: myData[i]
            };
            data.datasets.push(datasetObject);
        }
        var myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: data
        });
    };


    $scope.prepareBarChartDataScored = function (questionNo) {
        var labels = ["", "", "", "", "", ""];
        var data = [0, 0, 0, 0, 0, 0];

        // set display time
        $scope.displayTime1 = Math.round($scope.displayTime(questionNo) / 1000);
        $scope.apiResponse.forEach(function (userResponse) {
            var requiredQuestion = userResponse.mcqResponse[questionNo - 1];
            var response = requiredQuestion.response;
            labels[response] = requiredQuestion.responseText;
            data[response] += 1;
        });
        data[data.length - 1] = $scope.questionScores[questionNo - 1].averageScore * 10;
        labels[labels.length - 1] = "Scaled Credibility Score";
        $scope.generateBarChartScored(labels, data, 'chart-container-4', 'myChart4');
    };

    $scope.generateBarChartScored = function (labels, data, containerId, chartId) {
        // 1st 2 lines are redundant but necessary for cleaning up DOM for chartjs to work properly
        document.getElementById(containerId).innerHTML = "";
        document.getElementById(containerId).innerHTML = '<canvas id=' + chartId + ' width="400" height="400"></canvas>';
        var ctx = document.getElementById(chartId);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Reviews',
                    data: data,
                    backgroundColor: $scope.backgroundColors,
                    borderColor: $scope.borderColors,
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

    $scope.prepareBarChartDataFiltered = function (questionNo) {
        var labels = ["", "", "", "", "", ""];
        var data = [0, 0, 0, 0, 0, 0];
        $scope.apiResponse.forEach(function (userResponse) {
            var requiredQuestion = userResponse.mcqResponse[questionNo - 1];
            var response = requiredQuestion.response;
            labels[response] = requiredQuestion.responseText;
        });
        labels[labels.length - 1] = "Scaled Credibility Score";
        data[data.length - 1] = $scope.filteredQuestionData[questionNo - 1].averageScore * 10;

        for (var i = 0; i < $scope.filteredQuestionData[questionNo - 1].ratings.length; ++i) {
            data[$scope.filteredQuestionData[questionNo - 1].ratings[i]]++;
        }

        console.log(data, labels);
        $scope.generateBarChartScored(labels, data, 'chart-container-4', 'myChart4');
    };

    $scope.prepareCharDataFlagged = function (questionNo) {
        var labels = ["", "", "", "", "", ""];
        var data = [0, 0, 0, 0, 0, 0];
        $scope.filteredDataOnFlags.forEach(function (userResponse) {
            var requiredQuestion = userResponse.mcqResponse[questionNo - 1];
            var response = requiredQuestion.response;
            labels[response] = requiredQuestion.responseText;
            data[response] += 1;
        });
        data[data.length - 1] = 1;
        labels[labels.length - 1] = "Flag Ratio";
        $scope.generateBarChartScored(labels, data, 'chart-container-5', 'myChart5');
    };


    $scope.generateSuggestion = function () {

        var dataSet = ["low", "low", "decent", "good", "good"];

        var message = "good response on question 1... On an average students have marked more than decent.. The average score of the students on this " +
            "question is relatively high";


        $scope.questionScores.forEach(function (questionData) {
            var averageRating = questionData.averageRating;
            var averageScore = questionData.averageScore;
            var questionNo = questionData.questionNo;
            var questionTitle = $scope.questions[questionNo - 1];
            var scoreText = "high";

            if (averageScore >= 0.4) {
                scoreText = "relatively high";
            } else {
                scoreText = "however relatively low";
            }

            var averageRatingRounded = Math.round(averageRating);
            var difference = averageRating - averageRatingRounded;

            var studentsOpinion = dataSet[averageRatingRounded];

            if (difference < 0) {
                // less than
                studentsOpinion = "less than " + studentsOpinion;
            } else {
                studentsOpinion = "more than " + studentsOpinion;
            }

            var generalResponse = averageRatingRounded >= 2 ? "Good" : "Poor";

            message = generalResponse + " response on question no: " + questionData.questionNo + "... On an average students have marked " + studentsOpinion
                + "... The average score of the students on this question is " + scoreText;

            if(generalResponse == "Good"){
                message += ". The quality of review titled: " + questionTitle + " is quite high.. So you should try to maintain the standard";
            } else {
                message += ". Review titled: " + questionTitle + " needs improvement";
            }


            if(generalResponse === "Poor"){
                message += "<span class='bold-text'> " + questionTitle + "</span> Needs improvement";
            }

            $scope.generatedSuggestionMessages.push(message);
        });


        console.log("Suggestions: ", $scope.generatedSuggestionMessages);

        $('#suggestion-modal').modal();

    }


}]);














