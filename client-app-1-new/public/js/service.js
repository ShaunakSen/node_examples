myApp.service('mainFactory', ['$http', '$window', function ($http, $window) {
    this.getQuestions = function () {
        // console.log($window.feedbackFormId);
        return $http.get('http://localhost:3000/reviews/' + $window.feedbackFormId);
    };
}]);