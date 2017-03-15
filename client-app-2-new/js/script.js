var myApp = angular.module('clientApp2', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});


myApp.controller('AdminController', ['$scope', '$window', '$http', function ($scope, $window, $http) {
    
    
    // SETTING UP INITIAL VARS
    
    $scope.departments = ['IT', 'CSE', 'ECE', 'BT', 'CE', 'CHE', 'ME', 'MME'];
    $scope.selectedDepartments = [];


    $scope.dummyQuestion = {
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
    };
    $scope.questions = [$scope.dummyQuestion];


    $scope.selectAllDepartments = function (select) {
        if (select) {
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).checked = true;
            });
        } else {
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).checked = false;
            });
        }
    };
    
    $scope.departmentSelectionDone = function (done) {
        if(done){
            // get the values of selected depts
            // push it into $scope.selectedDepartments

            $scope.departments.forEach(function (department) {
                if(document.getElementById('department-' + department).checked){
                    $scope.selectedDepartments.push(document.getElementById('department-' + department).value);
                }
            });

            // now disable the inputs
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).disabled = true;
            });

        } else {
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).disabled = false;
            });
        }

        console.log("Department data:", $scope.selectedDepartments);
    };



    $scope.checkSelected = function (questionNo) {

        if (document.getElementById('relationship-exists-' + questionNo).checked) {
            document.getElementById('related-fields-div-' + questionNo).style.display = 'block'
        } else {
            document.getElementById('related-fields-div-' + questionNo).style.display = 'none'
        }

    };

    $scope.disableInputs = function (questionNo, disable) {
        var arrayOfIds = ['question-title-' + questionNo, 'question-option-' + questionNo + '-0',
            'question-option-' + questionNo + '-1', 'question-option-' + questionNo + '-2',
            'question-option-' + questionNo + '-3', 'question-option-' + questionNo + '-4',
            'importance-' + questionNo, 'thought-provoking-' + questionNo, 'relationship-exists-' + questionNo];

        if (document.getElementById('relationship-exists-' + questionNo).checked) {
            arrayOfIds.push('related-dropdown-' + questionNo);
            arrayOfIds.push('related-question-no-' + questionNo);
        }
        if (disable) {
            arrayOfIds.forEach(function (id) {
                document.getElementById(id).disabled = true;
            });
        } else {
            arrayOfIds.forEach(function (id) {
                document.getElementById(id).disabled = false;
            });
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

        // disable the inputs for that question
        $scope.disableInputs(questionNo, true);

        console.log("$scope.questions:", $scope.questions);
    };

    $scope.editQuestion = function (questionNo) {
        // enable the inputs for that question
        $scope.disableInputs(questionNo, false);
    };


    $scope.addQuestion = function () {
        console.log("here");
        $scope.questions.push($scope.dummyQuestion);

        console.log($scope.questions);
    }


}]);