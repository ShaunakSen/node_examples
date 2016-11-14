myApp.service('mainFactory', ['$http', function ($http) {
    this.getQuestions = function () {
        return $http.get('data.json');
    };
}]);