(function ($) {

    //Follow/Unfollow a Blog
    $.fn.followBlog = function (options) {

        var defaults = {
            channel : 0,
            onSuccess: function () {},
            onError: function () {},
            beforeSend: function () {},
            onComplete: function () {}
        };
        var opts = $.extend({}, defaults, options);

        return this.each(function () {
            var elem = $(this);
            $(elem).click(function (e) {
                e.preventDefault();
                var obj = $(this);
                var blogGuid = $(this).data('guid');
                var status = $(this).data('status');
                
                if(typeof blogGuid === 'undefined' || blogGuid === '') {
                    return false;
                }
                if(typeof status === 'undefined' || status === '') {
                    return false;
                }
                
                var state = (status === 'unfollow') ? 'follow' : 'unfollow';
                var csrfToken = $('meta[name="csrf-token"]').attr("content");
                $.ajax({
                    type: 'POST',
                    url: _appJsConfig.baseHttpPath + '/user/follow-blog',
                    dataType: 'json',
                    data: {guid: blogGuid,  _csrf: csrfToken},
                    success: function (data, textStatus, jqXHR) {
                        $(obj).data('status', state);
                        $().General_ShowNotification({message: 'Follow blog successfully'});
                        if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                            opts.onSuccess(data, obj);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (opts.onError && typeof opts.onError === 'function') {
                            opts.onError(obj, jqXHR.responseText);
                        }
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (opts.beforeSend && typeof opts.beforeSend === 'function') {
                            opts.beforeSend(obj);
                        }
                    },
                    complete: function (jqXHR, textStatus) {
                        if (opts.onComplete && typeof opts.onComplete === 'function') {
                            opts.onComplete(obj);
                        }
                    }
                });
            });
        });
    };
    
     

    //Follow/Unfollow a user or writer
    $.fn.followUser = function (options) {

        var defaults = {
            'onSuccess': function () {},
            'onError': function () {},
            'beforeSend': function () {},
            'onComplete': function () {}
        };
        var opts = $.extend({}, defaults, options);

        return this.each(function () {
            var elem = $(this);
            $(elem).click(function (e) {
                e.preventDefault();

                var userGuid = $(this).data('guid');
                var status = $(this).data('status');
                var obj = $(this);
                
                if(typeof userGuid === 'undefined' || userGuid === '') {
                    return false;
                }
                if(typeof status === 'undefined' || status === '') {
                    return false;
                }

                var state = (status === 'unfollow') ? 'follow' : 'unfollow';
                var csrfToken = $('meta[name="csrf-token"]').attr("content");
                
                $.ajax({
                    type: 'POST',
                    url: _appJsConfig.baseHttpPath + '/user/follow-user',
                    dataType: 'json',
                    data: {guid: userGuid, _csrf: csrfToken},
                    success: function (data, textStatus, jqXHR) {
                        $(obj).data('status', state);
                        $().General_ShowNotification({message: 'Follow user successfully'});
                        if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                            opts.onSuccess(data, obj);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (opts.onError && typeof opts.onError === 'function') {
                            opts.onError(obj, jqXHR.responseText);
                        }
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (opts.beforeSend && typeof opts.beforeSend === 'function') {
                            opts.beforeSend(obj);
                        }
                    },
                    complete: function (jqXHR, textStatus) {
                        if (opts.onComplete && typeof opts.onComplete === 'function') {
                            opts.onComplete(obj);
                        }
                    }
                });

            });
        });
    };


    //Follow/Unfollow a Article
    $.fn.followArticle = function (options) {

        var defaults = {
            'onSuccess': function () {},
            'onError': function () {},
            'beforeSend': function () {},
            'onComplete': function () {}
        };
        var opts = $.extend({}, defaults, options);

        return this.each(function () {
            var elem = $(this);
            $(elem).click(function (e) {
                e.preventDefault();

                var guid = $(this).data('guid');
                var status = $(this).data('status');
                var obj = $(this);

                if(typeof guid === 'undefined' || guid === '') {
                    return false;
                }
                if(typeof status === 'undefined' || status === '') {
                    return false;
                }
                
                var state = (status === 'unfollow') ? 'follow' : 'unfollow';
                var csrfToken = $('meta[name="csrf-token"]').attr("content");
                $.ajax({
                    type: 'POST',
                    url: _appJsConfig.baseHttpPath + '/user/follow-article',
                    dataType: 'json',
                    data: {guid: guid, _csrf: csrfToken},
                    success: function (data, textStatus, jqXHR) {
                        $(obj).data('status', state);
                        $().General_ShowNotification({message: 'Follow article successfully'});
                        if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                            opts.onSuccess(data, obj);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if (opts.onError && typeof opts.onError === 'function') {
                            opts.onError(obj, jqXHR.responseText);
                        }
                    },
                    beforeSend: function (jqXHR, settings) {
                        if (opts.beforeSend && typeof opts.beforeSend === 'function') {
                            opts.beforeSend(obj);
                        }
                    },
                    complete: function (jqXHR, textStatus) {
                        if (opts.onComplete && typeof opts.onComplete === 'function') {
                            opts.onComplete(obj);
                        }
                    }
                });
            });
        });
    };

}(jQuery));