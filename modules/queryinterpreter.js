/**
 * Created by barte_000 on 2016-10-24.
 */
function QueryInterpreter(){
    var translations = require('./query-interpreter-config');

    this.resolveFilter = function(filter){
        if(!filter || !filter.logic || !filter.filters)
            return null;

        if(filter.filters && filter.filters.length == 0)
            return null;

        var where = {};
        var logic = '$'+filter.logic;
        where[logic] = [];

        for(var i=0;i<filter.filters.length;i++){
            if(filter.filters[i].logic){
                var a = this.resolveFilter(filter.filters[i]);
                if(!a)
                    continue;

                where[logic].push(a);
            } else {
                where[logic].push(addSimpleCondition(filter.filters[i]));
            }
        }

        return where;
    };

    function addSimpleCondition(filter){
        var item = translateFieldCondition(filter);

        var toInsert = {};
        if(item.name == ''){
            toInsert[filter.field] = item.value;
        }else {
            toInsert[filter.field] = {};
            toInsert[filter.field][item.name] = item.value;
        }

        return toInsert;
    }

    function translateFieldCondition(filter){
        var item = {};
        item.name = translations[filter.operator];

        var value = filter.value;
        if(filter.operator == 'isnull'||filter.operator == 'isnotnull') {
            value = null;
        }else if(filter.operator == 'eq'){
            if(filter.value) {
                try{
                    if(isNumber(filter.value)){
                        value = filter.value;
                    }else{
                        var date = new Date(filter.value);
                        if(date == 'Invalid Date'){
                            value = {"$regex": new RegExp(filter.value, "i")};
                        }else {
                            value = {"$gte": date, "$lt": date.addDays(1)};
                        }
                    }
                }catch(Exception){
                    value = {"$regex": new RegExp(filter.value, "i")};
                }
            }
        }else if(filter.operator == 'neq'){
            if(filter.value) {
                try{
                    if(isNumber(filter.value)){
                        item.name = '$ne';
                        value = filter.value;
                    }else{
                        var date = new Date(filter.value);
                        if(date == 'Invalid Date'){
                            value = new RegExp(filter.value, "i");
                        }else {
                            //item.name = '$ne';
                            value = {"$gte": date, "$lt": date.addDays(1)};
                        }
                    }
                }catch (Exception){
                    value = new RegExp(filter.value, "i");
                }
            }
        } else if(filter.operator == 'isempty' || filter.operator == 'isnotempty'){
            value = '';
        }else if(filter.operator == 'contains'){
            value = {"$regex": '.*'+filter.value+'.*', "$options":"i"};
        } else if(filter.operator == 'doesnotcontain'){
            value = {"$regex": '^((?!'+filter.value+').)*$', "$options":"i"};
        }else if(filter.operator == 'startswith') {
            value = {"$regex": '^'+filter.value, "$options":"i"};
        }else if(filter.operator == 'endswith'){
            value = {"$regex": filter.value+'$', "$options":"i"};
        }

        item.value = value;
        return item;
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    Date.prototype.addDays = function(days)
    {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }
}

module.exports = QueryInterpreter;
