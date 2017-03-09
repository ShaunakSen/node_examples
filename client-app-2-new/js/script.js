var myApp = angular.module('clientApp2', []);
myApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});


myApp.controller('AdminController', ['$scope', '$window', '$http', function ($scope, $window, $http) {
    $scope.departments = ['IT', 'CSE', 'ECE', 'BT', 'CE', 'CHE', 'ME', 'MME'];
    


}]);