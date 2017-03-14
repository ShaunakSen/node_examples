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
        
        if (document.getElementById('relationship-exists-' + questionNo).checked){
            document.getElementById('related-fields-div-' + questionNo).style.display = 'block'
        } else {
            document.getElementById('related-fields-div-' + questionNo).style.display = 'none'
        }

    };


    $scope.saveQuestion = function (questionNo) {

        // Get the data
        var optionTitles = [];
        var optionValues = [0, 1, 2, 3, 4];
        var questionNumber = questionNo;
        var title = document.getElementById('question-title' + questionNo).value;
        for (var i = 0; i < 5; ++i) {
            var optionText = document.getElementById('question-option-' + questionNo + '-' + i);
            optionTitles.push(optionText);
        }
        var importance = document.getElementById('importance-' + questionNo);
        var thoughtProvoking = document.getElementById('thought-provoking-' + questionNo);


        if (questionNo === 1) {
            // First question submitted


        }
    };

    $scope.editQuestion = function (questionNo) {

    }


}]);