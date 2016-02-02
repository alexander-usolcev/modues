Modules.load("random").module("utils", function (api) {
    var win = window, self = this;

	/**
	 * @namespace api.utils
	 * @type {{createGlobalCallback: Function, removeGlobalCallback: Function, plural: Function}}
	 */
    var utils = {
        /**
         * Function witch create in glogal (window) scope public function
         * @param {Function} f - function callback (self_callback)
         * @param {Number} script_ttl - time to waiting create and call callback
         * @param {Function} f_timeout - function callback witch will be call if self_callback not called
         */
        createGlobalCallback: function (f, script_ttl, f_timeout) {
            var attachCallback = function (name) {
                var timeout = function () {
                    win[name] = function () {
                        try { win[name] = undefined; delete win[name]; } catch (e) {};
                    };
                    f_timeout && f_timeout();
                };

                //var t_id = setTimeout(timeout, script_ttl || 5000);
                win[name] = function () {
                    //clearTimeout(t_id);
                    //try { win[name] = undefined; delete win[name]; } catch (e) {};
                    f.call(win, arguments[0]);
                };
                return name;
            };

            var i = 0;
            while(i++ < 10) {
                var name = "_" + api.random.randomString();
                if(typeof(win[name]) == "undefined") {
                    return attachCallback(name);
                }
            }
            throw new Error("createGlobalCallback: cannot create unique name for callback");
        },

		/**
		 * Удалить глобальную функцию по имени
		 * @param name
		 */
		removeGlobalCallback: function(name){
			try { win[name] = undefined; delete win[name]; } catch (e) {}
		},

        /**
         * Склонение существительных после числительных
         * @param {Number} number
         * @param {Array} titles
         * @param {Boolean} with_number
         * @example Modules.utils.plural(2, ["секунда", "секунды", "секунд"]); // "секунды"
         * @example Modules.utils.plural(5, ["секунда", "секунды", "секунд"], true); // "5 секунд"
         * @return {*}
         */
        plural: function(number, titles, with_number){
            var cases = [2, 0, 1, 1, 1, 2];
            return (with_number ? number + ' ' : '') + titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
        }

    };


    return this.publicateAPI("utils", utils);
});