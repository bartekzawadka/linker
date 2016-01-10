/**
 * Created by barte_000 on 2016-01-10.
 */
function LogoutCtrl($scope, $http, $location, $route, $window){
    $http.get('/logout').success(function(e){
        $window.location.reload();
        $location.url('/');
    })
}