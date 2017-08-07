(function ($) {

    $.fn.Ajax_LoadBlogArticles = function(options){
        
        var defaults = {
            'limit': 20,
            'containerClass': 'ajaxArticles',
            'onSuccess' : function(){},
            'onError' : function(){},
            'beforeSend' : function(){},
            'onComplete' : function(){}
        };
        
        var opts = $.extend( {}, defaults, options );

        var loadtype = 'home';

        if (opts.loadtype) {
            loadtype = opts.loadtype;
        }

        if (opts.container) {
            var container = opts.container;
        } else {
            var container = $('#'+opts.containerClass);
        }
        var offset = parseInt(options.offset);

        if(isNaN(offset) || offset < 0) {
            offset = opts.limit;
        }
        
        // var existingNonPinnedCount = parseInt(container.data('existing-nonpinned-count'));
        var existingNonPinnedCount = options.nonpinned;
        
        if(isNaN(existingNonPinnedCount)) {
            existingNonPinnedCount = -1;
        }
        
        container.data('offset', (offset + opts.limit));
        
        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        
        var dateFormat = 'SHORT';
        // console.log({offset: offset, limit: opts.limit, existingNonPinnedCount: existingNonPinnedCount, _csrf: csrfToken, dateFormat: dateFormat});
        
        var requestData = { 
            offset: offset, 
            limit: opts.limit, 
            existingNonPinnedCount: existingNonPinnedCount, 
            _csrf: csrfToken, 
            dateFormat: dateFormat
        };
        if (options.blog_guid) {
            requestData['blog_guid'] = options.blogid;
        }

        // console.log(requestData);

        return $.ajax({
            type: 'post',
            url: _appJsConfig.baseHttpPath + '/'+loadtype+'/load-articles',
            dataType: 'json',
            data: requestData,
            success: function (data, textStatus, jqXHR) {
                // console.log(data);
                if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                    opts.onSuccess(data, textStatus, jqXHR);
                }                
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // console.log(textStatus);
                // console.log(jqXHR.responseText);
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