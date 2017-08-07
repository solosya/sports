(function ($) {
    
    $.image = function (options) {
        var defaults = {
            media : {},
            height: 500,
            width: 500,
            mediaOptions: {}
        };

        var opts = $.extend({}, defaults, options);
        
        var imageId = opts.media.id;
        var path = opts.media.path;
        var cloudName = opts.media.cloudName;
        if(typeof cloudName === 'undefined' || cloudName === '') {
            return;
        }
        
        $.cloudinary.config({cloud_name:cloudName});
        if(imageId === '' &&  path === '') {
            return;
        }
        
        var imageOptions = $.extend({},{height: opts.height, width: opts.width}, opts.mediaOptions);
        var url = $.cloudinary.url(imageId, imageOptions);
        
        return url;
    };
    
    $.video = function (options) {
        var defaults = {
            media : {},
            width: 700,
            height:400,
            mediaOptions: {}
        };

        var opts = $.extend({}, defaults, options);
        
        var videoId = opts.media.videoId;
        var path = opts.media.path;
        var cloudName = opts.media.cloudName;
        if(typeof cloudName === 'undefined' || cloudName === '') {
            return;
        }
        
        $.cloudinary.config({cloud_name:cloudName});
        if(videoId === '' &&  path === '') {
            return;
        }
        var videoOptions = $.extend({},{height: opts.height, width: opts.width}, opts.mediaOptions);
        var url = $.cloudinary.video(videoId, videoOptions);
        
        return url;
    };
}(jQuery));