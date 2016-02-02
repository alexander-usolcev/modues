Modules.module("date", function() {

    var assign = function(dst, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                dst[key] = src[key];
            }
        }

        return dst;
    };
    /**
     * Модуль работы со временем
     * @namespace Modules.date
     *
     */
    var date = {};

    date.absolute = function() {
        var value = new Date(0);

        return {
            day: function(d) {
                return (value.setDate(d), this);
            },

            month: function(m) {
                return (value.setMonth(m - 1), this);
            },

            year: function(y) {
                return (value.setFullYear(y), this);
            },

            getTime: function() {
                return value.getTime();
            },

            getUTC: function() {
                return value.toUTCString();
            }
        };
    };

    date.unixtime = function(d) {
        return ~~((d || new Date()).getTime() / 1000);
    };

    /**
     * Метод toLocaleString() возвращает строку с языко-зависимым представлением даты.
     * @param unixtime
     * @param locales
     * @param options
     * @example
     *  api.date.toLocaleString(1450263128); // "16 дек. 2015 г."
     *  api.date.toLocaleString(1450263128, "en-US", {
          era: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          timezone: 'UTC',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        }); // "Wednesday, December 16, 2015 Anno Domini, 11:52:08 AM"
     * @return {string}
     */
    date.toLocaleString = function(unixtime, locales, options) {
        var d = new Date((unixtime || date.unixtime()) * 1000);

        options = assign({
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }, options || {});

        return d.toLocaleString(locales || "ru", options);
    };

    /**
     * Метод возращающий время в формате "Часы:минуты"
     * @example api.date.H_M(1449242709); // "16:25"
     * @return {string}
     */
    date.H_M = function(unixtime) {
        var d = new Date(unixtime * 1000);
        var hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        //var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
        return (hours + ":" + minutes /*+ ":" + seconds*/);
    };

    return this.publicateAPI("date", date);
});