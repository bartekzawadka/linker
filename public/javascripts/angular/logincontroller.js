/**
 * Created by barte_000 on 2016-01-10.
 */
function LoginCtrl($scope, $http, $location, $window, $mdDialog){
    $scope.form = {};

    $scope.login = function(isvalid){

        if(!isvalid){
            $scope.showLoginFailureInfo('Dane logowania', 'Proszę wypełnić wymagane pola');
            return;
        }

        $http.post('/login', $scope.form).success(function(e){
            $window.location.reload();
            $location.url('/');
        }).error(function(e){
            if(e == 'Unauthorized'){
                $scope.showLoginFailureInfo('Brak dostępu', 'Dane logowania są nieprawidłowe');
            }
        });
    };

    $scope.showLoginFailureInfo = function(title, message){
        $mdDialog.show(
          $mdDialog.alert()
              .clickOutsideToClose(true)
              .title(title)
              .textContent(message)
              .ok('OK')
        );
    }
}