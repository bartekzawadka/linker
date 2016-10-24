/**
 * Created by barte_000 on 2015-12-31.
 */
var ngapp = angular.module('linkerapp', ['ngMaterial', 'ngMdIcons', 'ngRoute', 'ngMessages', 'kendo.directives']);

ngapp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
   $routeProvider.when('/',{templateUrl: 'issues', controller: IssuesCtrl}).when('/issue',{
        controller: AddEditCtrl, templateUrl: 'issue'
   }).when('/issue/:id', {controller: AddEditCtrl, templateUrl: 'issue'}).
       when('/login', {templateUrl: 'login', controller: LoginCtrl}).
       when('/logout', {templateUrl: 'issues',controller: LogoutCtrl})
       .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);

}]);

ngapp.controller('MainController', ['$scope', '$window', '$location', function($scope, $window, $location){
    $scope.reloadHome = function(){
        $window.location.reload();
        $location.url('/');
    };
}]);
