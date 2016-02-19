#Modules
Modules - модульный фреймворк для работы с js файлами (модулями) инкапсулирующий их "видимость" (scope).

#Использование
Подключаем modules.js на странице

    <script type="text/javascript" src="path-to-modulesjs/modules.js"></script>

Теперь создадим новый модуль 

    Modules.module("projectname.sum", function (api) {
     
        var sum = function (a, b) {
            return a + b;
        };
  
        return sum;
    });

Где то в коде можно использовать созданный модуль:

    Modules.load("projectname.sum").run(function (api) {
        alert(api.projectname.sum(100, 230));
    });
        
        
#API

##.load(<modules>) -> Code object
Загружает указанные модули, включая требуемые зависимости. Модули загружаются согласно путям, установленным ранее через addPath, addPackage.

    // загрузим три модуля
    Modules.load("com.example.foo", "com.example.bar", "com.example.zoo").run(function(api){
        ...
    });
 
    // версия для ленивых. полезна для пачки модулей с одним префиксом:
    Modules.load("com.example.(foo|bar|zoo)").run(function(api){
      ...
    });
    
##.module(name, constructor) -> void
Декларирует модуль name и вызывает constructor для инициализации модуля. 
Обычно, constructor возвращает что-то (объект, функция, значение), что будет использоваться пользовательским кодом позже.
Перед декларацией модуля можно указать список зависимостей, использовав Modules.load().

    Modules.module("com.example.foo", function () {
        return "foo";
    });
     
    Modules.load("com.example.foo").module("com.example.bar", function (api) {
       return function () {
          return [api.com.example.foo, "BAR"];
       }
    });
     
    Modules.load("com.example.bar").module("com.example.zoo", function (api) {
        var push = function (array, value) {
            return (array.push(value), array);
        };
     
        return push(api.com.example.bar(), "Zoo");
    });
     
    Modules.load("com.example.zoo").run(function (api) {
      alert(api.com.example.zoo.join(":"); // "foo:BAR:Zoo"
    });
    
Единственным аргументом (в примере выше - api), передаваемым в constructor является хэш, содержащий точки входа задекларированных в load() зависимостей. 
Вложенные зависимости отсутствуют в api:

    Modules.load("com.example.zoo").run(function (api) {
      alert(api.com.example.zoo.join(":")); // "foo:BAR:Zoo"
      alert(api.com.example.bar) // undefined
    });
    
##.publicateAPI(name, {object|string|number....}) -> {object|string|number....}
Используется в декларации модуля, когда нужно не просто вернуть что-то, а добавить это что-то в window.Modules контекст.

    Modules.module("cache", function(api) {
        var cache = function(key){
            // something...
            
            return 'cache module';
        }
        
        return this.publicateAPI("cache", cache);
    });
    
    Modules.cache(); // 'cache module';
 
#Использование global name
Вместо global переменной `Modules` можно использовать свою (к примеру название проекта)

До подключения скрипта создаем свой namespace

    <script type="text/javascript">
        (Modules = window.Modules || {}).name = 'MyNamespace';
    </script>
    <script type="text/javascript" src="path-to-modulesjs/modules.js"></script>
        
И далее можно использовать как `Modules.` так и `MyNamespace.`

    MyNamespace.module("mymodule", function (api) {  
        return 'mymodule';
    });
    
    MyNamespace.load("mymodule").run(function (api) {
        alert(api.mymodule); // "mymodule"
    });
        
        