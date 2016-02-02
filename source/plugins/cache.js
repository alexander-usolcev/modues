Modules.module("cache", function(api) {

    var cached = {};

    /**
     * Модуль кэширования данных. К примеру с fetch запросов
     * @example
     *  api.cache('my-req-url').get();
     *  api.cache('my-req-url').set('res');
     * @param key {String}
     * @return {Cache}
     * @constructor
     */
	var Cache = function(key){
		this.key = key;

        return this;
	};


	/**
	 * Метод получения кэшированного значения
	 * @example api.cache('my-req-url').get();
	 * @return {*}
	 */
	Cache.prototype.get = function(){
		return cached[this.key];
	};

	/**
	 * Метод установки кэшированного значения
	 * @param value
	 * @example api.cache('my-req-url').set('res');
	 * @return {Cache}
	 */
	Cache.prototype.set = function(value){
        cached[this.key] = value;

		return this;
	};

	/**
	 * Метод удаления кэшированного значения
	 * @example api.cache('my-req-url').remove();
	 * @return {Cache}
	 */
	Cache.prototype.remove = function(){
		delete cached[this.key];

		return this;
	};


    /**
     * Функция, которая создает объект типа {Cache}
     * @param key
     * @example api.cache('my-key');
     * @return {Cache}
     */
    var cache = function(key){
        return new Cache(key);
    };

    /**
     * Статичный метод получения всех кэшированных данных
     * @static
     * @example api.cache.getAll();
     * @return {{}}
     */
    cache.getAll = function(){
        return cached;
    };

    /**
     * Статичный метод удаления всех кэшированных данных
     * @example api.cache.removeAll();
     * @static
     * @return {{}}
     */
    cache.removeAll = function(){
        return cached = {};
    };

    return this.publicateAPI("cache", cache);
});