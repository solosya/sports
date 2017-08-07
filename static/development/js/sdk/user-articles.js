(function ($) {
    
    $.urlParam = function (name) {
        var url = window.location.href;
        var urlArr = url.split('/');
        return urlArr[urlArr.length - 2];
    };
    
    /*
     *  Load Users Article on view user profile and user post
     */
 
    $.fn.Ajax_LoadMoreUserArticles = function (options) {
        var defaults = {
            container: '#userArticleContainer',
            onSuccess: function () {},
            onError: function () {},
            beforeSend: function () {},
            onComplete: function () {}
        };

        var opts = $.extend({}, defaults, options);

        var username = decodeURIComponent($.urlParam());
        var totalPosts = parseInt($(opts.container).data('total-count'));
        var offset = parseInt($(opts.container).data('offset'));
        if(username === '' || typeof username === 'undefined'){
            return;
        }
        if(isNaN(totalPosts) || isNaN(offset)){
            return;
        }
        
        offset = offset + _appJsConfig.articleOffset; //Declared in _javascripts.php
        if(offset > totalPosts){
            return;
        }
        $(opts.container).data('offset', offset);
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        
        $.ajax({
                type: 'POST',
                url: _appJsConfig.baseHttpPath + '/profile/' + username + '/posts',
                dataType: 'json',
                data: {offset: offset, _csrf: csrfToken},
                success: function(data, textStatus, jqXHR) {
                    if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                        opts.onSuccess(data);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown){
                    if (opts.onError && typeof opts.onError === 'function') {
                        opts.onError(jqXHR.responseText);
                    }
                },
                beforeSend: function(jqXHR, settings) { 
                    if (opts.beforeSend && typeof opts.beforeSend === 'function') {
                        opts.beforeSend();
                    }
                },
                complete: function(jqXHR, textStatus) {
                    if (opts.onComplete && typeof opts.onComplete === 'function') {
                        opts.onComplete();
                    }
                }
            }); 
    };
    
    /**
     * My News Page Load More Articles
     */
    $.fn.Ajax_LoadMoreMyArticles = function (options) {
        var defaults = {
            containerClass: 'LoadMyArticles',
            onSuccess: function () {},
            onError: function () {},
            beforeSend: function () {},
            onComplete: function () {}
        };

        var opts = $.extend({}, defaults, options);

        var page = parseInt($('.' + opts.containerClass).data('page'));
        if (isNaN(page) || page < 0) {
           page = 1;
        }

        $('.' + opts.containerClass).data('page', (page + 1));
        var csrfToken = $('meta[name="csrf-token"]').attr("content");

        $.ajax({
            type: 'post',
            url: _appJsConfig.baseHttpPath + '/user/load-articles',
            dataType: 'json',
            data: {page: page, limit: _appJsConfig.articleOffset, _csrf: csrfToken},
            success: function (data, textStatus, jqXHR) {
                if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                    opts.onSuccess(data, textStatus, jqXHR);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

                if (opts.onError && typeof opts.onError === 'function') {
                    opts.onError(jqXHR, textStatus, errorThrown);
                }
            },
            beforeSend: function (jqXHR, settings) {
                if (opts.beforeSend && typeof opts.beforeSend === 'function') {
                    opts.beforeSend(jqXHR, settings);
                }
            },
            complete: function (jqXHR, textStatus) {
                if (opts.onComplete && typeof opts.onComplete === 'function') {
                    opts.onComplete(jqXHR, textStatus);
                }
            }
        });
    };
}(jQuery));