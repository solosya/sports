(function($) {

    $.fn.Ajax_pinUnpinArticle = function(options){

        var defaults = {
            'onSuccess' : function(){},
            'onError' : function(){},
            'beforeSend' : function(){},
            'onComplete' : function(){}
        };
        var opts = $.extend( {}, defaults, options );

        return this.each (function(){
            var elem  = $(this);
            $(elem).off('click');
            $(elem).on('click', function(e){
                e.preventDefault();

                var articleId = parseInt($(elem).data('id'));
                var position = parseInt($(elem).data('position'));
                var existingStatus = $(elem).data('status');
                var isSocial = $(elem).data('social');
                
                if(isNaN(articleId) || articleId <= 0 || isNaN(position) || position <= 0) {
                    return;
                }

                var csrfToken = $('meta[name="csrf-token"]').attr("content");
                $.ajax({
                    type: 'POST',
                    url: _appJsConfig.baseHttpPath + '/home/pin-article',
                    dataType: 'json',
                    data: {id: articleId, status: existingStatus, social: isSocial, position: position, _csrf: csrfToken},
                    success: function(data, textStatus, jqXHR) {
                        $(elem).data('status', ((existingStatus == 1) ? 0 : 1));
                        var msg = (existingStatus == 1) ? "Article un-pinned successfully" : "Article pinned successfully";
                        (existingStatus == 1) ? $(elem).removeClass('selected') : $(elem).addClass('selected');
                        $.fn.General_ShowNotification({message: msg});
                        if (opts.onSuccess && typeof opts.onSuccess === 'function') {
                            opts.onSuccess(data, elem);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        if (opts.onError && typeof opts.onError === 'function') {
                            opts.onError(elem, jqXHR.responseText);
                        }
                    },
                    beforeSend: function(jqXHR, settings) { 
                        if (opts.beforeSend && typeof opts.beforeSend === 'function') {
                            opts.beforeSend(elem);
                        }
                    },
                    complete: function(jqXHR, textStatus) {
                        if (opts.onComplete && typeof opts.onComplete === 'function') {
                            opts.onComplete(elem);
                        }
                    }
                });

                

            });
        });
    };
    
    
 var deleteArticle = function (articleGuid, isSocial, elem, onSuccess) {

        if (typeof articleGuid === 'undefined' || articleGuid === "") {
            return;
        }

        var csrfToken = $('meta[name="csrf-token"]').attr("content");
        $.ajax({
            type: 'POST',
            url: _appJsConfig.baseHttpPath + '/home/delete-article',
            dataType: 'json',
            data: {guid: articleGuid, social: isSocial, _csrf: csrfToken},
            success: function (data, textStatus, jqXHR) {
                var msg = (isSocial == 1) ? "Article deleted successfully" : "Article hidden successfully";
                $.fn.General_ShowNotification({message: msg});
                if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess(data, elem);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $.fn.General_ShowErrorMessage({message: jqXHR.responseText});
            },
            beforeSend: function (jqXHR, settings) {
            },
            complete: function (jqXHR, textStatus) {
            }
        });
    };
    
    
    $.fn.Ajax_deleteArticle = function(options){

        var defaults = {
            'onSuccess' : function(){},
            'onError' : function(){},
            'beforeSend' : function(){},
            'onComplete' : function(){}
        };
        var opts = $.extend( {}, defaults, options );

        return this.each (function(){
            var elem  = $(this);
            $(elem).off('click');
            $(elem).on('click', function(e){
                e.preventDefault();
             
                var isSocial = $(elem).data('social');
                var msgStr = (isSocial == 1) ? "Do you really want to delete this article?" : "Do you really want to hide this article?";
                var articleGuid = $(elem).data('guid');
                
                if (typeof bootbox === 'undefined') {
                    var result = confirm(msgStr);
                    if (result === true) {
                        deleteArticle(articleGuid, isSocial, elem, opts.onSuccess);
                    }
                } else {
                    bootbox.confirm({
                        title: "Confirm",
                        message: msgStr,
                        callback: function (result) {
                            if (result === true) {
                                deleteArticle(articleGuid, isSocial, elem, opts.onSuccess);
                            }
                        }
                    });
                }


            });
        });
    };    



}(jQuery));