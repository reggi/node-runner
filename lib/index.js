var _ = require("underscore");
var helper = require("./helper.js");
var dotty = require("dotty");
var path = require("path");

var Runner = function(r){
    if(typeof r == "string" || typeof r == "object"){
        this.r = r;
    }else{
        this.error = "need request options";
    }
    return this;
}

Runner.prototype.values = function(){
    this.r = _.values(this.r);
    return this;
}

Runner.prototype.flatten = function(){
    this.r = _.flatten(this.r);
    return this;
}

Runner.prototype.ensure = function(type){
    var value, key;
    var set = [];
    _.each(this.r,function(value,key){
        if(type == "objects") if(_.isObject(value)) set.push(value);
        if(type == "arrays") if(_.isArray(value)) set.push(value);
        if(type == "number") if(_.isNumber(value)) set.push(value);
        if(type == "boolean") if(_.isBoolean(value)) set.push(value);
    });
    this.r = set;
    return this;
}

Runner.prototype.extend = function(){
    this.r = _.extend.apply(undefined,this.r);
    return this;
}

Runner.prototype.map = function(standard){
    var value, key;
    var refit = {};
    var a = this.r;
    _.each(standard,function(value, key){
        var forsight = helper.prepare(a,value);
        if(forsight){
            refit[key] = forsight;
        }
    });
    this.r = refit;
    return this;
}

Runner.prototype.manditory = function(manditory){
    var vals = [];
    var a = this.r;
    _.each(manditory, function(value){
        vals.push(dotty.exists(a,value));
    });
    var error = _.without(vals, true).length > 0;
    if(error) this.error = true;
    return this;
}

Runner.prototype.defaults = function(defaults, override){
    if(!_.isEmpty(this.r) || (typeof override !== "undefined" && override)){
        this.r = _.defaults(this.r,defaults);
    }
    return this;
}

Runner.prototype.cut = function(callback){
    callback(this);
    return this;
}

Runner.prototype.morph = function(mark){
    // If arg is string make it into object value [mark](path)
    this.mark = mark;
    if(typeof(this.r) === "string"){
        var string = this.r;
        this.r = {};
        this.r[this.mark] = string;
    }
    this.r["raw"+this.mark] = this.r[this.mark];
    return this;
}

Runner.prototype.clean = function(){
    // cleans the variable made above [path];
    var mark = this.mark;
    this.r[mark] = function(original){
        if(dotty.exists(original,mark)){
            var clean = original[mark];
            clean = (clean.match(/^\//)) ? clean.substring(1,clean.length) : clean;
            clean = (clean.match(/^admin/)) ? clean : "admin/" + clean;
            clean = (clean.match(".json")) ? clean : (path.extname(clean) == ".json") ? clean : clean + ".json";
            return clean;
        }else{
            return "";
        }
    }(this.r);
    return this;
}

Runner.prototype.prepend = function(item, string, nitem){
    this.r[nitem] = string+this.r[item];
    return this;
}

Runner.prototype.finish = function(){
    if(_.isEmpty(this.r) || this.error){
        return false;
    }else{
        return this.r;    
    }
}

module.exports = Runner;