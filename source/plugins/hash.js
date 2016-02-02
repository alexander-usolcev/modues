Modules.module("hash", function (api) {

	var iterate = function (hash, f)  {
		for(var i in hash) {
			f(hash[i], i, hash);
		}
	};

    var length = function(obj) {
        if(obj.length){
            return obj.length;
        }

        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }

        return size;
    };

	/**
	 * Модуль работы с объектами
	 * @param hash
	 * @return {{forEach: Function, map: Function, filter: Function, reduce: Function}}
	 * @constructor
	 */
	var Hash = function (hash) {
		return {
            /**
             * Метод forEach() выполняет указанную функцию один раз для каждого элемента в объекте
             * @param {Function} f - Функция, вызываемая для каждого элемента объекта
             */
			forEach: function (f) {
				iterate(hash, function () { f.apply(this, arguments); });
			},

            /**
             * Метод map() создаёт новый массив с результатом вызова указанной функции для каждого элемента массива
             * @param {Function} f - Функция, создающая элемент в новом объекте
             * @return {{}}
             */
			map: function (f) {
				var h = {};
				iterate(hash, function (item, i, hash) { h[i] = f.call(this, item, i, hash); });
				return h;
			},

			filter: function (f) {
				var h = {};
				iterate(hash, function (item, i, hash) { var r = f.call(this, item, i, hash); r && (h[i] = item); });
				return h;
			},

			reduce: function (f, initial) {
				var r = initial || undefined;
				iterate(hash, function (item, i, hash) { r = f(r, item, i, hash); });
				return r;
			}
		}
	};

    /**
     * Метод "склеивания" 2-х объектов
     * @static
     * @param dst
     * @param src
     * @example
     *  api.hash.merge({a: 'a'}, {b: 'b'}); // Object {a: "a", b: "b"}
     *  api.hash.merge({'a': 'a'}, {a: 'aa'}); // Object {a: "aa"}
     *  api.hash.merge({b: {c: 'c'}, a: 1}, {b: {c: 'cc', d: 'dd'}, a: [1,2,3]}); // Object {b: {c: "cc", d: "dd"}, a: [1,2,3]}
     * @return {*}
     */
	Hash.merge = function (dst, src) {
		iterate(src, function (item, i) {
            if(typeof dst[i] == "object" && typeof item == "object" && length(item) > 0){
                dst[i] = Hash.merge(dst[i], item);
            } else {
                dst[i] = item;
            }
        });
		return dst;
	};

	Hash.copy = function (src) {
		return Hash.merge({}, src);
	};

	/**
	 * Создание объекта с масива
	 * @param {Array} array - Массив, с которого нужно создать объект
	 * @param {Function} f - Функция, которая должна возвращать ключ в объекте
	 * @example
	 *  api.hash.fromArray(['1', '2', 'aaa']); // Object {0: "1", 1: "2", 2: "aaa"}
	 *  api.hash.fromArray([{id: '1', a: 'a'}, {id: '2', a: 'b'}], function(e, i){ return e.id; }); // Object {"1":{"id":"1","a":"a"},"2":{"id":"2","a":"b"}}
	 * @return {{}}
	 */
	Hash.fromArray = function (array, f) {
		var h = {}, makeKey = f || function(e, i){ return i; };
		array.forEach(function(e, i){ h[makeKey(e, i)] = e; });
		return h;
	};

	return Hash;
});