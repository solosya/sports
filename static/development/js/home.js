var HomeController = (function ($) {
    return {
        listing: function () {
            HomeController.Listing.init();
        },
        blog: function() {
            HomeController.Blog.init();
        }
    };
}(jQuery));

HomeController.Listing = (function ($) {


    var bindPinUnpinArticle = function(){

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
    
    var bindDeleteHideArticle = function(){

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
    
    var bindSocialUpdatePost = function () {
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
    
    var bindSocialShareArticle = function () {
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
    


    var renderReadingTime = function (time) {
        if (time <= '59') {
            return ((time <= 0) ? 1 : time) + ' min read';
        } else {
            var hr = Math.round(parseInt(time) / 100);
            return hr + ' hour read';
        }
    };




    var attachEvents = function () {
        if(_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
            initSwap();
        }

        var bindSocialPostPopup = function(){
            var isScialRequestSent = false;
            $(document).on('click', 'article.socialarticle', function (e) {
                e.preventDefault();
                var blogGuid = $(this).parent().data('blog-guid');
                var postGuid = $(this).parent().data('guid');

                if (!isScialRequestSent) {
                    var csrfToken = $('meta[name="csrf-token"]').attr("content");
                    $.ajax({
                        type: 'POST',
                        url: _appJsConfig.appHostName + '/api/social/get-social-post',
                        dataType: 'json',
                        data: {blog_guid: blogGuid, guid: postGuid, _csrf: csrfToken},
                        success: function (data, textStatus, jqXHR) {
                            data.hasMediaVideo = false;
                            if (data.media['type'] === 'video') {
                                data.hasMediaVideo = true;
                            }
                            
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
                            isScialRequestSent = false;
                        },
                        beforeSend: function (jqXHR, settings) {
                            isScialRequestSent = true;
                        },
                        complete: function (jqXHR, textStatus) {
                            isScialRequestSent = false;
                        }
                    });
                }
            });
        };
        


        function initSwap() {
            initDroppable();
            initDraggable();
            
            //Bind pin/unpin article event
            bindPinUnpinArticle();

            //Bind delete social article & hide system article
            bindDeleteHideArticle();
            
            //Bind update social article
            bindSocialUpdatePost();
            
            //Following will called on page load and also on load more articles
            $(".articleMenu, .socialMenu").delay(2000).fadeIn(500);
        }
        
        bindSocialPostPopup();


        function initDraggable() {
            $('.swap').draggable({
                helper: 'clone',
                revert: true,
                zIndex: 100,
                scroll: true,
                scrollSensitivity: 100,
                cursorAt: { left: 150, top: 50 },
                appendTo:'body',
                start: function( event, ui ) {
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

        function initDroppable() {

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
                            initSwap();
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            //$().General_ShowErrorMessage({message: jqXHR.responseText});
                        },
                        beforeSend: function(jqXHR, settings) { 
                        },
                        complete: function(jqXHR, textStatus) {
                        }
                    });

                }
            }); 
        }

        
        // $('.loadMoreArticles').on('click', function(e){
        //     e.preventDefault();

        //     var btnObj = $(this);
        //     var stij = '#'+ btnObj.data('container');

        //     var container = $(stij);



        //     $.fn.Ajax_LoadBlogArticles({
        //         onSuccess: function(data, textStatus, jqXHR){
        //             if (data.success == 1) {
        //                 // var container = $('.ajaxArticles');
        //                 container.data('existing-nonpinned-count', data.existingNonPinnedCount);
        //                 var templateClass = container.data('containerclass');

        //                 if (data.articles.length < 20) {
        //                     $(btnObj).css('display', 'none');
        //                 }

        //                 for (var i in data.articles) {
        //                     data.articles[i]['containerClass'] = templateClass;
        //                     data.articles[i]['pinTitle'] = (data.articles[i].isPinned == 1) ? 'Un-Pin Article' : 'Pin Article';
        //                     data.articles[i]['pinText'] = (data.articles[i].isPinned == 1) ? 'Un-Pin' : 'Pin';
        //                     data.articles[i]['promotedClass'] = (data.articles[i].isPromoted == 1)? 'ad_icon' : '';
        //                     data.articles[i]['hasArticleMediaClass'] = (data.articles[i].hasMedia == 1)? 'withImage__content' : 'without__image';
        //                     data.articles[i]['readingTime']= renderReadingTime(data.articles[i].readingTime);
        //                     data.articles[i]['blogClass']= '';
        //                     if(data.articles[i].blog['id'] !== null) {
        //                        data.articles[i]['blogClass']= 'card--blog_'+data.articles[i].blog['id'];
        //                     } 
                            
                                                        
        //                     var ImageUrl = $.image({media:data.articles[i]['featuredMedia'], mediaOptions:{width: 500 ,height:350, crop: 'limit'} });
        //                     data.articles[i]['imageUrl'] = ImageUrl;
        //                     var articleId = parseInt(data.articles[i].articleId);
        //                     var articleTemplate;
        //                     if (isNaN(articleId) || articleId <= 0) {
        //                         data.articles[i]['videoClass'] = '';
        //                         if(data.articles[i].social.media.type && data.articles[i].social.media.type == 'video') {
        //                             data.articles[i]['videoClass'] = 'video_card';
        //                         }
        //                         articleTemplate = Handlebars.compile(socialCardTemplate); 
        //                     } else {
        //                         articleTemplate = Handlebars.compile(systemCardTemplate);
        //                     }
        //                     var article = articleTemplate(data.articles[i]);
        //                     container.append(article);
        //                 }

        //                 $(".card p, .card h1").dotdotdot();
                        
        //                 bindSocialShareArticle();
                        
        //                 $('.video-player').videoPlayer();
                        
        //                 //Lazyload implement
        //                 $("img.lazyload").lazyload({
        //                     effect: "fadeIn"
        //                 });
        //                 if (_appJsConfig.isUserLoggedIn === 1 && _appJsConfig.userHasBlogAccess === 1) {
        //                     initSwap();
        //                 }
        //             }
                 
        //         },
        //         beforeSend: function(jqXHR, settings){
        //             $(btnObj).html("Please wait...");
        //         },
        //         onComplete: function(jqXHR, textStatus) {
        //             $(btnObj).html("Load more");
        //         }
        //     });
        // });
    };
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));

HomeController.Blog = (function ($) {
    var attachEvents = function () {

        //attach follow blog
        $('a.followBlog').followBlog({
            'onSuccess': function(data, obj){
                var message = ($(obj).data('status') === 'follow') ? 'Unfollow' : 'Follow';
                $.fn.General_ShowNotification({message: message + " blog(s) successfully."});   
            },
            'beforeSend': function(obj){
                $(obj).html("Please wait...");
            },
            'onComplete': function(obj){
                ($(obj).data('status') === 'follow') ? $(obj).html("Follow +") : $(obj).html("Following -");
            }
        });
        
        //attach follow user
        $('a.followUser').followUser({
            'onSuccess': function(data, obj){
                var message = ($(obj).data('status') === 'follow') ? 'Unfollow' : 'Follow';
                $.fn.General_ShowNotification({message: message + " user(s) successfully."});   
            },
            'beforeSend': function(obj){
                $(obj).html("Please wait...");
            },
            'onComplete': function(obj){
                ($(obj).data('status') === 'follow') ? $(obj).html("Follow +") : $(obj).html("Following -");
            }
        });
        
    };
    
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));