Modules.load("browser", "array").module("event", function(api) {

    var event = {
        addEvent: api.browser.ie ?
            function(element, event_name, listener) {
                var f = function(e) {
                    listener.call(element, event.wrap(e));
                };
                element.attachEvent("on" + event_name, f);
                addLeakedHook(element, "on" + event_name, f);
                return f;
            } :
            function(element, event_name, listener, capture) {
                element.addEventListener(event_name, listener, capture || false);
                return listener;
            },

        removeEvent: api.browser.ie ?
            function(element, event_name, listener) {
                var f = listener, index;

                api.array(IEcallbacks).forEach(function(e, i) {
                    if (e[0] === element && e[1] == ("on" + event_name)) {
                        // функция с контектом this
                        f = e[2];

                        index = i;
                    }
                });

                element.detachEvent("on" + event_name, f);

                try {
                    // удаляем из массива callback
                    IEcallbacks.splice(index, 1);
                } catch (e) {
                }

                return f;
            } :
            function(element, event_name, listener, capture) {
                element.removeEventListener(event_name, listener, capture || false);
                return listener;
            },

        wrap: api.browser.ie ?
            function(e) {
                e.target = e.srcElement;
                e.currentTarget = e.fromElement;
                e.stopPropagation = function() {
                    this.cancelBubble = true;
                };
                e.preventDefault = function() {
                    this.returnValue = false;
                };
                return e;
            } :
            function(e) {
                return e;
            },

        fireEvent: api.browser.ie ?
            function(element, event_type) {
                if (document.createEventObject) {   // IE before version 9
                    try {
                        var clickEvent = document.createEventObject(window.event);
                        clickEvent.button = 1;  // left click
                        clickEvent.clientX = 0;
                        element.fireEvent("on" + event_type, clickEvent);
                    } catch (e) {
                    }
                } else {
                    element.fireEvent("on" + event_type);
                }
            } :
            function(element, event_type) {
                var e = document.createEvent("MouseEvent");
                e.initMouseEvent(event_type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                element.dispatchEvent(e);
            },

        stopEvent: function(event) {
            this.wrap(event);
            event.stopPropagation();
            event.preventDefault();
            return false;
        }
    };

    // protect IE agains memory leaks
    var leakedHooks = [];

    // context function for IE on removeEvent
    var IEcallbacks = [];

    var addLeakedHook = function(element, event_type, listener) {
        IEcallbacks.push([element, event_type, listener]);

        var f = (function(element, event_type, listener) {
            return function() {
                element.detachEvent(event_type, listener);
                element.parentNode && element.parentNode.removeChild(element);
            };
        })(element, event_type, listener);
        leakedHooks.push(f);
    };

    var fixMemoryLeaks = function() {
        for (var i = 0; i < leakedHooks.length; i++) {
            leakedHooks[i]();
        }
    };

    if (api.browser.ie) {
        event.addEvent(window, "unload", fixMemoryLeaks);
    }

    return this.publicateAPI("event", event);
});
