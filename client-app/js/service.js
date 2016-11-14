myApp.service('mainFactory', ['$http', function ($http) {
    this.getQuestions = function () {
        return $http.get('http://localhost:3000/reviews/');
    };
}]);