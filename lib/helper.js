var _ = require('underscore');

var helper = {};

helper.inflate = function(array){
    // Returns array with aternate versions of hyphenated words.
    _.each(array,function(param){
        if(param.match(/\-/)){
            array.push(param.replace("-",""));
            array.push(param.replace("-","_"));
            array.push(param.replace("-"," "));
        }
    });
    array.sort();
    return array;
}

helper.prepare = function(object, array){
    if(typeof object == "object"){
        // Will choose between array of string which object value to retrieve
        var keys = _.keys(object);
        var lc_keys = function(){
            var lc_keys = [];
            _.each(keys, function(value){
                var push = value.toLowerCase();
                lc_keys.push(push);
            });
            return lc_keys;
        }();
        var reference = _.object(lc_keys, keys);
        var array = helper.inflate(array);
        var intersection = _.intersection(lc_keys, array);
        return (intersection.length > 0) ? object[reference[intersection[0]]] : false;
    }else{
        return false;
    }
};

module.exports = helper;
