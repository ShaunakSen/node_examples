var myApp = angular.module('clientApp2', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});


myApp.controller('AdminController', ['$scope', '$window', '$http', function ($scope, $window, $http) {


    // SETTING UP INITIAL VARS

    $scope.departments = ['IT', 'CSE', 'ECE', 'BT', 'CE', 'CHE', 'ME', 'MME'];
    $scope.selectedDepartments = [];
    $scope.allSelected = false;

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

    $scope.dummyTextQuestion = {
        questionNo: "",
        title: ""
    };
    $scope.questions = [$scope.dummyQuestion];
    $scope.textQuestions = [];

    $scope.finalObject = {
        "targetedUsers": [],
        "mcq": [],
        "postedBy": {
            username: "",
            department: "",
            email: "",
            full_name: ""
        },
        "text": []
    };


    $scope.inArray = function (array, value) {
        for (var i = 0; i < array.length; ++i) {
            if (array[i] == value) {
                return i;
            }
        }
        return -1;
    };


    $scope.selectAllDepartments = function (select) {
        if (select) {
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).checked = true;
                $scope.allSelected = true;
            });
        } else {
            $scope.departments.forEach(function (department) {
                document.getElementById('department-' + department).checked = false;
                $scope.allSelected = false;
            });
        }
    };

    $scope.departmentSelectionDone = function (done) {
        if (done) {
            // get the values of selected depts
            // push it into $scope.selectedDepartments

            $scope.departments.forEach(function (department) {
                var inputElement = document.getElementById('department-' + department);
                if (inputElement.checked) {
                    // if already not in array push


                    if ($scope.inArray($scope.selectedDepartments, inputElement.value) == -1) {
                        $scope.selectedDepartments.push(inputElement.value);
                    }
                } else {
                    // not checked means u need to remove
                    if ($scope.inArray($scope.selectedDepartments, inputElement.value) != -1) {
                        var foundIndex = $scope.inArray($scope.selectedDepartments, inputElement.value);
                        $scope.selectedDepartments.splice(foundIndex, 1);
                    }
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


        $scope.questions[questionNo - 1] = questionData;


        // disable the inputs for that question
        $scope.disableInputs(questionNo, true);

        console.log("$scope.questions:", $scope.questions);
    };

    $scope.editQuestion = function (questionNo) {
        // enable the inputs for that question
        $scope.disableInputs(questionNo, false);
    };


    $scope.saveTextQuestion = function (questionNo) {
        var title = document.getElementById('text-question-title-' + questionNo).value;
        // var realQuestionNo = $scope.questions.length + questionNo;


        $scope.textQuestions[questionNo - 1] = {
            title: title
        };
        console.log($scope.textQuestions);

        document.getElementById('text-question-title-' + questionNo).disabled = true;
    };

    $scope.editTextQuestion = function (questionNo) {
        document.getElementById('text-question-title-' + questionNo).disabled = false;
    };


    $scope.addQuestion = function () {
        $scope.questions.push($scope.dummyQuestion);
        console.log($scope.questions);
    };

    $scope.addTextQuestion = function () {
        $scope.textQuestions.push($scope.dummyTextQuestion);
    };

    $scope.displaySuccessModal = function () {
        // display success modal here
        $("#submitted-form-modal").modal();
    };


    $scope.submitForm = function () {

        console.log("here");
        // click all Done buttons
        $scope.departmentSelectionDone(true);

        for (var i = 0; i < $scope.questions.length; ++i) {
            $scope.saveQuestion(i + 1)
        }

        // build up finalObject

        $scope.finalObject.targetedUsers = $scope.selectedDepartments;
        $scope.finalObject.mcq = $scope.questions;
        $scope.finalObject.text = $scope.textQuestions;
        $scope.finalObject.postedBy.username = $window.userInfo.username;
        $scope.finalObject.postedBy.department = $window.userInfo.department;
        $scope.finalObject.postedBy.email = $window.userInfo.email;
        $scope.finalObject.postedBy.full_name = $window.userInfo.full_name;

        console.log("Final object to PUSH is", $scope.finalObject);

        // POST the data

        // TODO: postedBy field



        var postReq = {
            method: 'POST',
            url: 'http://localhost:3000/reviews/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.finalObject
        };

        $http(postReq).then(
            function (response) {
                console.log("Ok..", response);

                // TODO: created_reviews

                $http({
                    method : "PUT",
                    url : 'http://localhost:8000/admins/' + $window.userInfo._id + '/created_forms',
                    data : {review_id: response.data._id},
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }).then( function (response) {
                    console.log("ok...", response);

                    $scope.displaySuccessModal();
                    $("#submitted-form-modal").on('hidden.bs.modal', function () {
                        window.location = "http://localhost:8000";
                    });
                    
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