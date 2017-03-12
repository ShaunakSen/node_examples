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
            "title": "How was the coverage of the syllabus?",
            "importance": 10,
            "thoughtProvoking": 2,
            "displayEmotion": true,
            "relatedTo": [

            ],
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
    


}]);