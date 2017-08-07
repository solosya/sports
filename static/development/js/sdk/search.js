    $.fn.Ajax_LoadSearchArticles = function(options){
        var defaults = {
            search: '',
            limit: 20,
            containerClass: 'ajaxArticles',
            onSuccess : function(){},
            onError : function(){},
            beforeSend : function(){},
            onComplete : function(){}
        };
        
        var opts = $.extend( {}, defaults, options );
        
        var offset = parseInt($('.'+opts.containerClass).data('offset'));
        if(isNaN(offset) || offset < 0) {
            offset = opts.limit;
        }
        
        $('.'+opts.containerClass).data('offset', (offset + opts.limit));
        
         var csrfToken = $('meta[name="csrf-token"]').attr("content");
        
        $.ajax({
            type: 'POST',
            url: _appJsConfig.baseHttpPath + '/search/load-articles',
            dataType: 'JSON',
            data: {offset: offset, limit: opts.limit, search: opts.search, _csrf: csrfToken},
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