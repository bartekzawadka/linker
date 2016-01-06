/**
 * Created by barte_000 on 2015-12-31.
 */
var ngapp = angular.module('linkerapp', ['ngMaterial', 'ngMdIcons', 'ngRoute', 'kendo.directives']);

ngapp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
   $routeProvider.when('/',{templateUrl: 'issues', controller: IssuesCtrl}).when('/issue',{
        controller: AddEditCtrl, templateUrl: 'issue'
   }).when('/issue/:id', {controller: AddEditCtrl, templateUrl: 'issue'}).otherwise({redirectTo: '/'});
    //$locationProvider.html5Mode({enabled: false, requireBase: false});
    $locationProvider.html5Mode(true);
}]);
