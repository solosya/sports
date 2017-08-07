(function ($) {

    $.fn.Disqus = function (options) {
        var defaults = {
            params: '',
            //updateCountClass: $('.disqusComment').find('.total')
        };

        var opts = $.extend({}, defaults, options);

        var disqus_identifier = opts.params.articleId;
        var disqus_shortname = opts.params.shortName;
        
         disqus_config = function () { 
            var token = opts.params.token;
            var apiKey = opts.params.apiKey;
            var networkName = opts.params.networkName;
            var userId = opts.params.userId;
            var currentUrl = opts.params.url;
            this.page.identifier = disqus_identifier;
            this.page.remote_auth_s3 = token;
            this.page.api_key = apiKey;
            this.sso = {
                name: networkName,
                url: _appJsConfig.baseHttpPath + '/auth/login',
                logout: _appJsConfig.baseHttpPath + '/auth/logoff'
            };
            this.callbacks.onNewComment = [function (comment) {  //alert();
                    var text = comment.text;
                    var post_url = currentUrl;
                    var authorId = userId;
                    var articleId = opts.params.articleId;
                    $.ajax({
                        url: _appJsConfig.baseHttpPath + '/article/disqus-comment',
                        type: 'post',
                        data: {articleId: articleId, authorId: authorId, text: text, post_url: post_url, _csrf: yii.getCsrfToken()},
                        dataType: 'json',
                        success: function (data) {
                            if(data.success == '1') {
                            }
                        }
                    });
                }];
        };


        (function () {
            var dsq = document.createElement('script');
            dsq.type = 'text/javascript';
            dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        }());

        (function () {
            var s = document.createElement('script');
            s.async = true;
            s.type = 'text/javascript';
            s.id = 'dsq-count-scr';
            s.src = '//' + disqus_shortname + '.disqus.com/count.js';
            (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
        }());

    };
}(jQuery));