var myApp = angular.module('clientApp', []);

myApp.controller('MainController', ['$scope', 'mainFactory', function ($scope, mainFactory) {
    console.log("Inside MainController");
    $scope.noOfQuestions = 0;
    $scope.questions = [];
    mainFactory.getQuestions().then(
        function (response) {
            console.log(response);
            $scope.questions = response;
            $scope.useData($scope.questions);
        },
        function (response) {
            console.log(response);
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );
    $scope.useData = function (data) {
        console.log(data);
        $scope.noOfQuestions = data.data.mcq.length;
        console.log("No of questions:", $scope.noOfQuestions);
        $scope.questions = data.data.mcq;
        console.log("Questions are:", $scope.questions);
    }

}]);