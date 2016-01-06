/**
 * Created by barte_000 on 2016-01-06.
 */
function AddEditCtrl($scope, $http, $routeParams){

    if($routeParams.id) {
        editMode();
    } else {
        registrationMode();
    }

    function registrationMode(){
        $scope.form = {isSolved: false};
        $scope.links = [];

    }

    function editMode(){
        $http.get('/api/getissue/'+$routeParams.id).success(function(e){

            var formProcessed = e.form;
            formProcessed.isSolved = (e.form.solveDate && e.form.solveDate!=null);

            $scope.links = $.map(formProcessed.links, function(el){
               return el.link;
            });

            $scope.form = formProcessed;

        }).error(function(e){
            console.log(e);
        });
    }

    $scope.addlink = function(){
        $scope.links.push($scope.newItem);
        $scope.newItem = '';
    };

    $scope.removelink = function(index){
        if($scope.links.length > 0) {
            $scope.links.splice(index, 1);
        }
    };

    $scope.submitForm = function(){
        var form = $scope.form;
        form.links = $scope.links;
        $http.post('/api/updateissue', form).
            success(function(data){
                $location.path('/');
        });
    }
}