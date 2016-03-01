Modules.module("browser", function(api) {
    var userAgent = navigator.userAgent;

    var Browser = {
        platform: {name: (navigator.platform.match(/mac|win|linux/i) || ["unknown"])[0].toLowerCase()},
        features: {xpath: !!(document.evaluate), air: !!(window.runtime)},

        isFirefox: function() {
            return userAgent.match(/Firefox/i);
        },

        ie: typeof(window.addEventListener) == "undefined",

        isIE: function() {
            return userAgent.indexOf("MSIE") > 0 || !!userAgent.match(/Trident\//)
        },

        isChrome: function() {
            return userAgent.toLowerCase().match(/chrome/i);
        },
        isSafari: function() {
            return !this.isChrome() && userAgent.toLowerCase().match(/safari/i);
        },

        isMobile: {
            Android: function() {
                return userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return userAgent.match(/Windows Phone OS|Windows CE|Windows Mobile|IEMobile|Windows Phone OS 7|Windows Phone/i);
            },
            it: function() {
                return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
            }
        }
    };

    return this.publicateAPI("browser", Browser);
});