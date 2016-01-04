/**
 * Created by barte_000 on 2015-12-30.
 */
$(document).ready(function(){
   //var issuesData = getData();

   $('#grid').kendoGrid({
       dataSource: {
           pageSize: 20,
           serverPaging: true,
           serverFiltering: true,
           serverSorting: true,
           transport: {
               read: '/getissues',
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
       detailInit: detailInit,
       scrollable: false,
       filterable: true,
       sortable: true,
       pageable: true,
       columns: [
           {
             template: function(dataItem){
                 if(dataItem.solveDate)
                    return "<img src='/images/green-icon.png' alt='' width='16' title='Rozwiązane'/>";
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
                       click: deleteItem
                   }
               }]
           //}, {
           //    command:{
           //        text: "edytuj",
           //        click: editItem
           //    }
           //},{
           //    command:{
           //        text: "usuń",
           //        click: deleteItem
           //    }
           //}]
   });
});

function editItem(e){
    e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
    window.location.href='/edit/'+dataItem.id;
}
function deleteItem(e){

}

function detailInit(e){
    var detailRow = e.detailRow;

    detailRow.find(".detail").kendoGrid({
       dataSource:{
           transport:{
               read: '/getlinks/'+ e.data.id,
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
    },{
            field: "createdAt",
            title: "Data utworzenia",
            format: "{0:yyyy-MM-dd}"
        },{
            field: "updatedAt",
            title: "Data modyfikacji",
            format: "{0:yyyy-MM-dd}"
    }]
    });
}