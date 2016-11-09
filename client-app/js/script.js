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
    };

    $scope.getIdsOfRadioButtons = function (questionNo) {
        var ids = [];
        for(var i=0; i<$scope.noOfQuestions; ++i){
            ids.push('option-'+questionNo+i);
        }
        return ids
    };

    $scope.storeResponse = function (questionNo) {
        console.log(questionNo);
        // Get array of possible ids of radio buttons based on that question no
        var ids = $scope.getIdsOfRadioButtons(questionNo);
        console.log(ids);
        // check if any one of them is selected
        for(var i=0; i<ids.length; ++i ){
            if(document.getElementById(ids[i]).checked){
                var selectedRadioButton = document.getElementById(ids[i]);
                console.log("Value: ", selectedRadioButton.value, "Text:", selectedRadioButton.getAttribute('data-text'));
            }
        }
        // store that damn result
    };


}]);