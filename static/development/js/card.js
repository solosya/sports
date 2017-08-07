var CardController = function() {
    return new Card();
}

var Card = function() {
    this.events();
};

Card.prototype.renderScreenCards = function(options, data) 
{
    var self = this;

    var container = options.container;

    container.data('existing-nonpinned-count', data.existingNonPinnedCount);

    var html = "";
    for (var i in data.articles) {
        html += self.renderCard(data.articles[i], options.containerClass);
    }
    container.empty().append(html);

    // $('.two-card-logo').toggle();

    $(".card p, .card h1").dotdotdot();
            
    $('.video-player').videoPlayer();
    
    //Lazyload implement
    // $("div.lazyload").lazyload({
    //     effect: "fadeIn"
    // });
    // if (_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
    //     self.events();
    // }
};

Card.prototype.screen = function() 
{
    var self = this;

    var btn = $('.loadMoreArticles');
    var pageRefreshInterval = 60000 * 5;

    var currentScreen = 0;
    var articleCount = 0;

    var options = {
        'screens' : [
        {
            style: "screen-card card-lg-screen col-sm-12",
            limit: 1,
            logo: "large-logo"

        },

        {
            style: "screen-card card-sm-screen col-sm-6",
            limit: 2,
            logo: "small-logo"
        } 

        ],
        'container': $( '#'+btn.data('container') ),
        'currentScreen': currentScreen,
        'count': 20
    };

    var run = function() {
        console.log('running screen');

                            // 1 minute * amount of minutes
        var numberOfScreens = options.screens.length;
        currentScreen++;
        if (currentScreen > numberOfScreens) {
            currentScreen = 1;
        }
        var screenOption = currentScreen-1;
        options.currentScreen = currentScreen;

        // console.log('grigidig');
        options.limit = options.screens[screenOption].limit;
        options.containerClass = options.screens[screenOption].style;

        // articleCount = articleCount + options.limit;
        // console.log('Article Count: ', articleCount);
        if (articleCount >= options.count) {
            articleCount = 0;
        }

        options.offset = articleCount;
        options.nonpinned = articleCount;

        // console.log(options);
        $.fn.Ajax_LoadBlogArticles(options).done(function(data) {
            // console.log(data);
            if (data.articles.length == 0 ) {
                // console.log('setting article count to zero');
                articleCount = 0;
                return;
            }
            articleCount = articleCount + data.articles.length;

            if (data.success == 1) {
                self.renderScreenCards(options, data);
            }
        });
    }

    run();

    setInterval( run, 10000 ); 
    setInterval( function() {
        location.reload(false);
    } , pageRefreshInterval );
 
};

Card.prototype.renderCard = function(card, cardClass)
{
    var self = this;


    card['containerClass'] = cardClass;
    card['pinTitle'] = (card.isPinned == 1) ? 'Un-Pin Article' : 'Pin Article';
    card['pinText'] = (card.isPinned == 1) ? 'Un-Pin' : 'Pin';
    card['promotedClass'] = (card.isPromoted == 1)? 'ad_icon' : '';
    card['hasArticleMediaClass'] = (card.hasMedia == 1)? 'withImage__content' : 'without__image';
    card['readingTime']= self.renderReadingTime(card.readingTime);
    card['blogClass']= '';
    if(card.blog['id'] !== null) {
       card['blogClass']= 'card--blog_'+card.blog['id'];
    } 
    
                                
    var ImageUrl = $.image({media:card['featuredMedia'], mediaOptions:{width: 500 ,height:350, crop: 'limit'} });
    card['imageUrl'] = ImageUrl;
    var articleId = parseInt(card.articleId);
    var articleTemplate;
    if (isNaN(articleId) || articleId <= 0) {
        card['videoClass'] = '';
        if(card.social.media.type && card.social.media.type == 'video') {
            card['videoClass'] = 'video_card';
        }
        articleTemplate = Handlebars.compile(socialCardTemplate); 
    } else {
        articleTemplate = Handlebars.compile(systemCardTemplate);
    }
    return articleTemplate(card);
}

Card.prototype.bindPinUnpinArticle = function()
{

    $('button.PinArticleBtn').Ajax_pinUnpinArticle({
        onSuccess: function(data, obj){
            var status = $(obj).data('status');
            (status == 1) 
                ? $(obj).attr('title', 'Un-Pin Article') 
                : $(obj).attr('title', 'Pin Article');
            (status == 1) 
                ? $(obj).find('span').first().html('Un-Pin')
                : $(obj).find('span').first().html('Pin');        
        }
    });
};

Card.prototype.bindDeleteHideArticle = function()
{

    $('button.HideBlogArticle').Ajax_deleteArticle({
        onSuccess: function(data, obj){
            // var section = $(obj).closest('.section__content');
            // var sectionPostsCount = section.find('.card__news').length;
            // if(sectionPostsCount <= 1) {
            //     section.addClass('hide');
            // }
            $(obj).closest('.card').parent('div').remove();
            var postsCount = $('body').find('.card').length;
            if(postsCount <= 0) {
                $('.NoArticlesMsg').removeClass('hide');
            }
        }
    });
};

Card.prototype.bindSocialUpdatePost = function () 
{
    $('.editSocialPost').on('click', function (e) {
        e.preventDefault();
        var elem = $(this);
        var url = elem.data('url');
        var popup = window.open(url, '_blank', 'toolbar=no,scrollbars=yes,resizable=false,width=360,height=450');
        popup.focus();

        var intervalId = setInterval(function () {
            if (popup.closed) {
                clearInterval(intervalId);
                var socialId = elem.parents('a').data('id');
                if ($('#updateSocial' + socialId).data('update') == '1') {
                    $().General_ShowNotification({message: 'Social Post(s) updated successfully.'});
                }
            }
        }, 50);

        return;
    });
};

Card.prototype.bindSocialShareArticle = function () 
{
    $('.shareIcons').SocialShare({
        onLoad: function (obj) {
            var title = obj.parents('div.article').find('.card__news-category').text();
            var url = obj.parents('div.article').find('a').attr('href');
            var content = obj.parents('div.article').find('.card__news-description').text();
            $('.rrssb-buttons').rrssb({
                title: title,
                url: url,
                description: content
            });
            setTimeout(function () {
                rrssbInit();
            }, 10);
        }
    });
};

Card.prototype.renderReadingTime = function (time) 
{
    if (time <= '59') {
        return ((time <= 0) ? 1 : time) + ' min read';
    } else {
        var hr = Math.round(parseInt(time) / 100);
        return hr + ' hour read';
    }
};

Card.prototype.bindSocialPostPopup = function()
{
    var isRequestSent = false;
    $(document).on('click', 'article.lightbox', function (e) {
        e.preventDefault();
        // e.stopPropogation();

        console.log('lightbox clicked');

        var csrfToken = $('meta[name="csrf-token"]').attr("content");

        var isSocial = $(this).parent().data('social');
        if (isSocial) {
            var url = '/api/social/get-social-post';
            var blogGuid = $(this).parent().data('blog-guid');
            var postGuid = $(this).parent().data('guid');
            var payload = {blog_guid: blogGuid, guid: postGuid, _csrf: csrfToken}
        } else {
            var url = '/api/article/get-article';
            var articleId = $(this).parent().data('id');
            var payload = {articleId: articleId, _csrf: csrfToken}
        }

        console.log(payload);

        if (!isRequestSent) {

            $.ajax({
                type: 'POST',
                url: _appJsConfig.appHostName + url,
                dataType: 'json',
                data: payload,
                success: function (data, textStatus, jqXHR) {
                    data.hasMediaVideo = false;
                    if (data.media['type'] === 'video') {
                        data.hasMediaVideo = true;
                    }1
                    
                    if (data.source == 'youtube') {
                        var watch = data.media.videoUrl.split("=");
                        data.media.videoUrl = "https://www.youtube.com/embed/" + watch[1];
                    }
                    
                    data.templatePath = _appJsConfig.templatePath;

                    var articleTemplate = Handlebars.compile(socialPostPopupTemplate);
                    var article = articleTemplate(data);
                    $('.modal').html(article);
                    //$('body').modalmanager('loading');
                    setTimeout(function () {
                        $('.modal').modal('show');
                    }, 500);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    isRequestSent = false;
                },
                beforeSend: function (jqXHR, settings) {
                    isRequestSent = true;
                },
                complete: function (jqXHR, textStatus) {
                    isRequestSent = false;
                }
            });
        }
    });
};

Card.prototype.initDraggable = function()
{
    $('.swap').draggable({
        helper: 'clone',
        revert: true,
        zIndex: 100,
        scroll: true,
        scrollSensitivity: 100,
        cursorAt: { left: 150, top: 50 },
        appendTo:'body',
        drag: function( event, ui ) {
            console.log(event);
            console.log('h');
        },

        start: function( event, ui ) {
            console.log('dragging');
            ui.helper.attr('class', '');
            var postImage = $(ui.helper).data('article-image');
            var postText = $(ui.helper).data('article-text');
            if(postImage !== "") {
                $('div.SwappingHelper img.article-image').attr('src', postImage);
            }
            else {
                $('div.SwappingHelper img.article-image').attr('src', 'http://www.placehold.it/100x100/EFEFEF/AAAAAA&amp;text=no+image');
            }
            $('div.SwappingHelper p.article-text').html(postText);
            $(ui.helper).html($('div.SwappingHelper').html());    
        }
    });
}

Card.prototype.initDroppable = function()
{
    var self = this;

    $('.swap').droppable({
        hoverClass: "ui-state-hover",
        drop: function(event, ui) {
            
            function getElementAtPosition(elem, pos) {
                return elem.find('a.card').eq(pos);
            }

            var sourceObj       = $(ui.draggable);
            var destObject      = $(this);
            var sourceProxy     = null;
            var destProxy       = null;


            if (typeof sourceObj.data('proxyfor') !== 'undefined') {
                sourceProxy = sourceObj;
                sourceObj   = getElementAtPosition($( '.' + sourceProxy.data('proxyfor')), sourceProxy.data('position') -1);
                sourceObj.attr('data-position', destObject.data('position'));

            }
            if (typeof destObject.data('proxyfor') !== 'undefined') {
                destProxy = destObject;
                destObject = getElementAtPosition($( '.' + destObject.data('proxyfor')), destObject.data('position') -1);
                destObject.attr('data-position', sourceObj.data('position'));
            }



            //get positions
            var sourcePosition      = sourceObj.data('position');
            var sourcePostId        = parseInt(sourceObj.data('id'));
            var sourceIsSocial      = parseInt(sourceObj.data('social'));
            var destinationPosition = destObject.data('position');
            var destinationPostId   = parseInt(destObject.data('id'));
            var destinationIsSocial = parseInt(destObject.data('social'));

            var swappedDestinationElement = sourceObj.clone().removeAttr('style').insertAfter( destObject );
            var swappedSourceElement = destObject.clone().insertAfter( sourceObj );
            

            if (sourceProxy) {
                sourceProxy.find('h2').text(destObject.find('h2').text());
                swappedDestinationElement.addClass('swap');
                swappedSourceElement.removeClass('swap');
                sourceProxy.attr('data-article-text', destObject.data('article-text'));
                sourceProxy.attr('data-article-image', destObject.data('article-image'));
            }

            if (destProxy) {
                if (sourceIsSocial) {
                    destProxy.find('h2').text( sourceObj.find('p').text() );
                } else {
                    destProxy.find('h2').text( sourceObj.find('h2').text() );
                }
                swappedSourceElement.addClass('swap');
                swappedDestinationElement.removeClass('swap');
                destProxy.attr('data-article-text', sourceObj.data('article-text'));
                destProxy.attr('data-article-image', sourceObj.data('article-image'));
            }
            
            swappedSourceElement.data('position', sourcePosition);
            swappedDestinationElement.data('position', destinationPosition);
            swappedSourceElement.find('.PinArticleBtn').data('position', sourcePosition);
            swappedDestinationElement.find('.PinArticleBtn').data('position', destinationPosition);


            $(ui.helper).remove(); //destroy clone
            sourceObj.remove();
            destObject.remove();
            
            var csrfToken = $('meta[name="csrf-token"]').attr("content");
            var postData = {
                sourcePosition: sourcePosition,
                sourceArticleId: sourcePostId,
                sourceIsSocial: sourceIsSocial,
                
                destinationPosition: destinationPosition,
                destinationArticleId: destinationPostId,
                destinationIsSocial: destinationIsSocial,
                
                _csrf: csrfToken
            };

            $.ajax({
                url: _appJsConfig.baseHttpPath + '/home/swap-article',
                type: 'post',
                data: postData,
                dataType: 'json',
                success: function(data){

                    if(data.success) {
                        $.fn.General_ShowNotification({message: "Articles swapped successfully"});
                    }
                    
                    $(".card p, .card h2").dotdotdot();
                    self.events();
                },
            });

        }
    }); 
}

Card.prototype.events = function() 
{
    console.log('events');
    var self = this;

    if(_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
        initSwap();
    }

    function initSwap() {
        self.initDroppable();
        self.initDraggable();
        
        //Bind pin/unpin article event
        self.bindPinUnpinArticle();

        //Bind delete social article & hide system article
        self.bindDeleteHideArticle();
        
        //Bind update social article
        self.bindSocialUpdatePost();
        
        //Following will called on page load and also on load more articles
        $(".articleMenu, .socialMenu").delay(2000).fadeIn(500);
    }  

    self.bindSocialPostPopup();

    $('.loadMoreArticles').on('click', function(e){
        e.preventDefault();
        var btn = $(e.target);
        console.log('loading more cards');
        btn.html("Please wait...");
        
        var container = $('#'+btn.data('container'));

        var options = {
            'offset': container.data('offset'),
            'containerClass': container.data('containerclass'),
            'container': container,
            'nonpinned' : container.data('offset'),
            'blog_guid' : container.data('blogid')
        };

        if ( container.data('loadtype')) {
            options.loadtype = container.data('loadtype');
        }

        console.log(options);

        $.fn.Ajax_LoadBlogArticles(options).done(function(data) {

            if (data.success == 1) {

                if (data.articles.length < 20) {
                    btn.css('display', 'none');
                }
                var container = options.container;
                container.data('existing-nonpinned-count', data.existingNonPinnedCount);
                var cardClass = container.data('containerclass');

                var html = "";
                for (var i in data.articles) {
                    html += self.renderCard(data.articles[i], cardClass);
                }
                container.append(html);

                $(".card .content > p, .card h2").dotdotdot();
                
                self.bindSocialShareArticle();
                
                $('.video-player').videoPlayer();
                
                //Lazyload implement
                $("div.lazyload").lazyload({
                    effect: "fadeIn"
                });
                if (_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
                    self.events();
                }

                btn.html("Load more");
            }
        });
    });
};