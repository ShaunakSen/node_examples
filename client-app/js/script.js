var myApp = angular.module('clientApp', []);

myApp.controller('MainController', ['$scope', 'mainFactory', function ($scope, mainFactory) {
    console.log("Inside MainController");
    $scope.noOfQuestions = 0;
    $scope.questions = [];
    $scope.response = [];
    $scope.nextButtonDisabled = true;
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

    $scope.storeResponse = function (questionNo) {
        // Get array of possible ids of radio buttons based on that question no
        var ids = $scope.getIdsOfRadioButtons(questionNo);
        console.log(ids);
        // check if any one of them is selected
        for (var i = 0; i < ids.length; ++i) {
            if (document.getElementById(ids[i]).checked) {
                var selectedRadioButton = document.getElementById(ids[i]);
                // console.log("Value: ", selectedRadioButton.value, "Text:", selectedRadioButton.getAttribute('data-text'));
            }
        }
        // store that damn result
        $scope.storeResult(questionNo, selectedRadioButton.value)


        // change to next slide
        $("#carousel-example-generic").carousel("next");
        // disable the next button again
        $scope.nextButtonDisabled = true;
    };

    $scope.storeResult = function (response, questionNo) {
        console.log(response, questionNo);
        console.log($scope.questions);
        var responseObject = {};
    };


}]);