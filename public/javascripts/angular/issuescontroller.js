/**
 * Created by barte_000 on 2016-01-06.
 */

function IssuesCtrl($scope, $location, $mdDialog, $http, $route, $window){
    $mdDialog.hide();

    $scope.mainGridOptions = {
        dataSource: {
            pageSize: 20,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            transport: {
                read: '/api/getissues',
                dataType: 'jsonp'
            },
            schema: {
                data: "rows",
                total: "count",
                model: {
                    id: "id",
                    fields: {
                        title: {type: 'string'},
                        description: {type: 'string'},
                        createdAt:{type: 'date'},
                        updateAt:{type:'date'},
                        solveDate: {type: 'date'}
                    }
                }
            }
        },
        detailTemplate: kendo.template($("#dettemplate").html()),
        detailInit: detInit,
        scrollable: false,
        filterable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 10
        },
        dataBound: function(){
            $("#grid").data("kendoGrid").hideColumn(7);

            $http.get('/api/isauthenticated').success(function(e){
               if(e.isauthenticated){
                   $("#grid").data("kendoGrid").showColumn(7);
               }

            });
        },
        columns: [
            {
                template: function(dataItem){
                    if(dataItem.solveDate)
                        return "<img src='../images/green-icon.png' alt='' width='16' title='Rozwiązane'/>";
                    else
                        return "";
                }
            },{
                field: "title",
                title: "Tytuł"
            },{
                field: "description",
                title: "Opis",
                sortable: true
            },{
                field: "createdAt",
                title: "Data rejestracji",
                format: "{0:yyyy-MM-dd}"
            },{
                field: "updateAt",
                title: "Data modyfikacji",
                format: "{0:yyyy-MM-dd}"
            }, {
                field: "solveDate",
                title: "Data rozwiązania",
                format: "{0:yyyy-MM-dd}"
            }, {
                command:{
                    text: "EDYTUJ",
                    click: editItem
                }
            },{
                command:{
                    text: "USUŃ",
                    click: deleteItem
                }
            }]
    };

    $scope.reloadHome = function(){
        $window.location.reload();
        $location.url('/');
    };

    $scope.showItemDeleteConfirmation = function(data){
        var confirm = $mdDialog.confirm()
            .title('Nieodrwacalnie usuwasz wpis')
            .content('Czy na pewno chcesz usunąć ten rekord?')
            .ok('TAK')
            .cancel('NIE');
        $mdDialog.show(confirm).then(function(){
            $http.delete('/api/issue/'+data._id).success(function(){
                $route.reload();
            });
        });
    };

    function detInit(e){
        var detailRow = e.detailRow;

        var links = null;
        if(e.data.links && e.data.links.length > 0){
            links = [];
            for(var i = 0;i<e.data.links.length;i++){
                if(e.data.links.hasOwnProperty(i))
                    links.push({link: e.data.links[i]});
            }
        }

        detailRow.find(".detail").kendoGrid({
            dataSource:{
                data: links,
                schema: {
                    model: {
                        fields: {
                            link: {type: 'string'}
                        }
                    }
                }
            },
            scrollable: false,
            sortable: true,
            columns: [{
                field: "link",
                title: "Odnośnik",
                template: "<a href='#= link #' target='_blank'>#= link #</a>"
            }]
        });
    }


    function editItem(e){
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $location.path('/issue/'+dataItem._id);
    }

    function deleteItem(e){
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        $scope.showItemDeleteConfirmation(dataItem);
    }
}