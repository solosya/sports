(function ($) {

    $.fn.SocialShare = function (options) {
        var defaults = {
            onLoad: function () {}
        };
        var opts = $.extend({}, defaults, options);

        return this.each(function () {
            var elem = $(this);
            $(elem).click(function (e) {
                var elem = $(this);
                $('body').modalmanager('loading');
                setTimeout(function () {
                    $('#socialShare-Modal').modal();
                    if (opts.onLoad && typeof opts.onLoad === 'function') {
                        opts.onLoad(elem);
                    }
                }, 500);
                return false;
            });
        });  
    };
}(jQuery));