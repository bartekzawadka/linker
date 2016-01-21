/**
 * Created by barte_000 on 2016-01-06.
 */

function IssuesCtrl($scope, $location, $http){

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
                        updatedAt:{type:'date'},
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
        pageable: true,
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
                field: "updatedAt",
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
                    click: deleteItem,
                    name: "dello"
                }
            }]
    };

    function detInit(e){
        var detailRow = e.detailRow;

        detailRow.find(".detail").kendoGrid({
            dataSource:{
                transport:{
                    read: '/api/getlinks/'+ e.data.id,
                    dataType: 'jsonp'
                },
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            link: {type: 'string'},
                            createdAt:{type: 'date'},
                            updatedAt:{type:'date'}
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
        $location.path('/issue/'+dataItem.id);
    }

    function deleteItem(e){

    }
}