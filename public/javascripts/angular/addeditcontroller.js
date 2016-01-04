/**
 * Created by barte_000 on 2016-01-03.
 */
ngapp.controller('aectrl', ['$scope', '$window','$http',function($scope, $window, $http){


    $scope.links = [];
    $scope.isSolved = false;

    $http.get('/edit/getissue/'+$scope.issue_id).success(function(data){
        $scope.formData = data;
    }).error(function(data){
        console.log(data);
    });

    $scope.addlink = function(){
        $scope.links.push($scope.newItem);
        $scope.newItem = '';
    };

    $scope.removelink = function(index){
        if($scope.links.length > 0) {
            $scope.links.splice(index, 1);
        }
    };

    $scope.submit = function(){

        $scope.formData.links = $scope.links;
        if($scope.isSolved)
            $scope.formData.solveDate = new Date();
        else
            $scope.formData.solveDate = null;

        $http({
            url: "/addupdate",
            data: $scope.formData,
            method: "POST",
            headers: {'Content-Type': 'application/json'}
        }).success(function(data){
            $window.location.href = '/'
            //$scope.$apply();
        });

        //$http.post('/addupdate', $scope.formData);

        //$http.post('/addupdate', $scope.formData);
    };
}]);