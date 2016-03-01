Modules.module("memoize", function(api) {

    var args = function(a) {
        var r = [];
        for (var i = 0; i < a.length; i++) {
            r[i] = a[i];
        }
        return r;
    };

    var clone = function() {
        var Memoize = function(f) {
            var results = {};
            return function() {
                var a = args(arguments).join(",");
                return results[a] || (results[a] = f.apply(this, arguments));
            };
        };
        return Memoize;
    };

    return clone;
});