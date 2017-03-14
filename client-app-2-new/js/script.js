var myApp = angular.module('clientApp2', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});


myApp.controller('AdminController', ['$scope', '$window', '$http', function ($scope, $window, $http) {
    $scope.departments = ['IT', 'CSE', 'ECE', 'BT', 'CE', 'CHE', 'ME', 'MME'];


    $scope.questions = [
        {
            "questionNo": 1,
            "title": "",
            "importance": 10,
            "thoughtProvoking": 2,
            "displayEmotion": true,
            "relatedTo": [],
            "optionTitles": [
                "Very poor",
                "Poor",
                "Ok",
                "Good",
                "Very Good"
            ],
            "optionValues": [
                0,
                1,
                2,
                3,
                4
            ]
        }
    ];


    // On click of add question button push the element to $scope.questions

    $scope.checkSelected = function (questionNo) {

        if (document.getElementById('relationship-exists-' + questionNo).checked) {
            document.getElementById('related-fields-div-' + questionNo).style.display = 'block'
        } else {
            document.getElementById('related-fields-div-' + questionNo).style.display = 'none'
        }

    };


    $scope.saveQuestion = function (questionNo) {

        // Get the data
        var optionTitles = [];
        var displayEmotion = true;
        var optionValues = [0, 1, 2, 3, 4];
        var questionNumber = questionNo;
        var title = document.getElementById('question-title-' + questionNo).value;
        for (var i = 0; i < 5; ++i) {
            var optionText = document.getElementById('question-option-' + questionNo + '-' + i).value;
            optionTitles.push(optionText);
        }
        var importance = parseInt(document.getElementById('importance-' + questionNo).value);
        var thoughtProvoking = parseInt(document.getElementById('thought-provoking-' + questionNo).value);

        // get related data if exists
        if (document.getElementById('relationship-exists-' + questionNo).checked) {
            var relatedQuestion = parseInt(document.getElementById('related-question-no-' + questionNo).value);
            var dropdown = document.getElementById('related-dropdown-' + questionNo);
            var relatedHow = dropdown.options[dropdown.selectedIndex].value;
            // console.log(relatedQuestion, relatedHow);
        }


        // TODO: VALIDATE THE DATA

        // Data is now ready
        // Create a clean object

        var questionData = {};

        questionData.questionNo = questionNumber;
        questionData.title = title;
        questionData.importance = importance;
        questionData.thoughtProvoking = thoughtProvoking;
        questionData.displayEmotion = displayEmotion;
        questionData.relatedTo = [{questionNo: null, relatedHow: null}];
        if (document.getElementById('relationship-exists-' + questionNo).checked) {
            questionData.relatedTo[0].questionNo = relatedQuestion;
            questionData.relatedTo[0].relatedHow = relatedHow;
        } else {
            questionData.relatedTo = [];
        }
        questionData.optionTitles = optionTitles;
        questionData.optionValues = optionValues;
        console.log(questionData);

        if (questionNo === 1) {
            // First question submitted
            $scope.questions[0] = questionData;
        } else {
            $scope.questions[questionNo - 1] = questionData;
        }
    };

    $scope.editQuestion = function (questionNo) {

    }


}]);