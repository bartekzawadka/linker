/**
 * Created by barte_000 on 2016-01-04.
 */
function IndexCtrl($scope, $http) {
    $http.get('/api/getissues').
    success(function(data, status, headers, config) {
        $scope.posts = data.posts;
    });
}

function AddController($scope, $http, $location){
    $scope.form={};

    $scope.registerIssue = function(){

        //todo: add data modification before post
        $http.post('/api/addissue', $scope.form).success(function(data){
            $location.path('/');
        })
    };
    //$http.get('/api/getissue/'+$routeParams).success(function(data){
    //   $scope.form = data;
    //});
}