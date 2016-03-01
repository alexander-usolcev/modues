Modules.module("string", function(api) {
    var trim = function(str, chars) {
        return ltrim(rtrim(str, chars), chars);
    };

    var ltrim = function (str, chars) {
        chars = chars || "\\s";
        return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    };

    var rtrim = function (str, chars) {
        chars = chars || "\\s";
        return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    };

    var hasTrim = function(str, chars)	{
        chars = chars || "\\s";
        var regL = new RegExp("^[" + chars + "]+", "g");
        var regR = new RegExp("[" + chars + "]+$", "g");

        return (!(regL.test(str) || regR.test(str)));
    };

    var escapeHTML = function(str){
        return str.replace(/&/gm,'&amp;').replace(/</gm,'&lt;').replace(/>/gm,'&gt;').replace(/\'/gm,'&apos;').replace(/"/gm,'&quot;');
    };

    var QueryString = function (query) {
        this.pairs = (query || "").replace(/^(\?|#)/, "").split("&");
    };

    QueryString.prototype.find = function (name) {
        for(var i = 0; i < this.pairs.length; i++) {
            if(this.pairs[i].indexOf(name + "=") == 0) {
                return this.pairs[i].substr((name + "=").length);
            }
        }
        return false;
    };

    var Q = function (value) {
        return new QueryString(value);
    };

    var String = {
        trim: trim,
        hasTrim: hasTrim,
        escapeHTML: escapeHTML,
        QueryString: Q
    };

    return this.publicateAPI("string", String);
});

