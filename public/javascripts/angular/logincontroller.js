/**
 * Created by barte_000 on 2016-01-10.
 */
function LoginCtrl($scope, $http, $location, $route, $window){
    $scope.form = {};

    $scope.login = function(){
        $http.post('/login', $scope.form).success(function(e){
            $window.location.reload();
            $location.url('/');
        }).error(function(e){
            console.log(e);
        });
    }
}