/**
 * Created by barte_000 on 2015-12-31.
 */
var ngapp = angular.module('linkerapp', ['ngMaterial', 'ngMdIcons', 'ngRoute']);

ngapp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
   $routeProvider.when('/',{templateUrl: 'issues'}).when('/addissue',{
        controller: 'addController', templateUrl: 'addissue'
   }).otherwise({redirectTo: "/"});
    $locationProvider.html5Mode({enabled: true});
}]);

var controllers = {};
controllers.issuesCtrl = function(){

};
controllers.addController = ['$scope', function($scope){
    $scope.form = {};
    console.log('im in!');
}];

ngapp.controller(controllers);
//
//    config(['$routeProvider', function($b) {
//        $b.when('/addissue', {
//           controller: 'AddController'}).otherwise({
//            redirectTo: '/'
//        });
//        //$locationProvider.html5Mode(true);
//}]).controller('AddController', ['$scope', '$http', '$location', function($scope, $http, $location){
//    $scope.form={};
//
//    $scope.registerIssue = function(){
//
//        //todo: add data modification before post
//        $http.post('/api/addissue', $scope.form).success(function(data){
//            $location.path('/');
//        })
//    };
//    //$http.get('/api/getissue/'+$routeParams).success(function(data){
//    //   $scope.form = data;
//    //});
//}]);