;(function (win, $) {
    var variableGlobal = 'global variable'

    // sample1
    var sample = (function () {
        var variable = 'sample loaded';
        return {
            init: function () {
                console.log(variable)
                console.log(variableGlobal)
            }
        }
    })();

    // sample2
    var sample2 = (function () {
        var variable = 'sample2 loaded';
        return {
            init: function () {
                console.log(variable)
            }
        }
    })();

    // sample3
    var sample3 = (function () {
        var variable = 'sample3 loaded';

        var init = function () {
            console.log(variable)
        }
        return {
            init: init
        }
    })();

    // sample4
    var sample4 = function () {
        var variable = 'sample4 loaded';

        console.log(variable)
    }

    // sample5
    function sample5() {
        var variable = 'sample5 loaded';

        console.log(variable)
    }

    // sample6
    $.fn.sample6 = function (options) {
        var settings = {
            var1: 'var1',
            var2: 650
        };
        var opts = $.extend({}, settings, options);

        return this.each(function () {
            var obj = $(this),
                testText = 'sample6 loaded',
                var1 = opts.var1,
                var2 = opts.var2;

            var test = {
                init: function () {
                    test.bindEvent();
                },
                bindEvent: function () {
                    console.log(testText, var1, var2)
                }
            };
            test.init();
        });
    };


    $(function () {
        sample2.init();
        sample3.init();
    });

    $(win).on('load', function () {
        sample.init();
        sample4();
        sample5();
        $('body').sample6();
    });
})(window, window.jQuery);