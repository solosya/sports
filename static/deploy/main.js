var AuthController = (function ($) {
    return {
        loginOrSignup: function () {
            AuthController.LoginOrSignup.init();
        },
        socialSingup: function () {
            AuthController.SocialSignup.init();
        },
        forgotPassword: function () {
            AuthController.ForgotPassword.init();
        },
        resetPassword: function () {
            AuthController.ResetPassword.init();
        }
    };
}(jQuery));

AuthController.LoginOrSignup = (function ($) {

    var attachEvents = function () {
        $("#loginForm").validateLoginForm();
        $("#signupForm").validateSignupForm();
        
        $('.signupBtn').on('click', function () {
            $('.loginTab, #Login').removeClass('active');
            $('.signupTab, #SignUp').addClass('active');
        });
        $('.loginBtn').on('click',function () {
            $('.loginTab, #Login').addClass('active');
            $('.signupTab, #SignUp').removeClass('active');
        });
    };

    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));
AuthController.SocialSignup = (function ($) {

    var attachEvents = function () {
        $("#signupForm").validateSoicalSignupForm();
    };

    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));

AuthController.ForgotPassword = (function ($) {

    var attachEvents = function () {
        $("#forgotPasswordForm").validate({
            rules: {
                email: {
                    required: true
                }
            },
            messages: {
                email: "Email or username cannot be blank."
            }
        });

    };

    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));

AuthController.ResetPassword = (function ($) {

    var attachEvents = function () {
        $("#resetPasswordForm").validate({
            rules: {
                password: {
                    required: true,
                    minlength: 6
                },
                verifypassword: {
                    required: true,
                    minlength: 5,
                    equalTo: "#password"
                }
            },
            messages: {
                password: {
                    required: "Password cannot be blank.",
                    minlength: "Password should contain at least 6 characters."
                },
                verifypassword: {
                    required: "Verify password cannot be blank.",
                    minlength: "Verify Password should contain at least 6 characters.",
                    equalTo: "Verify Password should exactly match Password"
                }
            }
        });
    };

    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));
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
(function ($) {
    $( document ).ready(function() {
        $(".search-icon").on('click', function () {
            $("#menu-item-search ul").toggleClass('active');
        });

        if($(".hero-banner").length > 0) {
            $('body').addClass('hasHero');
        }

        $('.navbar-toggler').on('click', function() {
            $('#menu-primary-menu').toggleClass('active');
            $('.site-header').toggleClass('activeNav');
        })
    });

    // $('.video-player').videoPlayer();
    
    // $("img.lazyload").lazyload({
    //     effect : "fadeIn"
    // });
    
    // $(window).resize(function() {
    //     if ($('.side-navigation').is(':visible')) {
    //         var currentWidth = $('.side-navigation').width();
    //         var windowWidth = $(window).width();
    //         if (currentWidth > windowWidth && windowWidth > 300) {
    //             var newWidth = windowWidth - 20;
    //             $('.side-navigation').css('width', newWidth + 'px');
    //         }
    //     }
    // });
  
    // $('.forceLoginModal').loginModal({
    //     onLoad: function () {
    //         $("#loginForm").validateLoginForm();
    //         $("#signupForm").validateSignupForm();
    //     }
    // });
    

    /************************************************************************************
     *              FOLLOW AND UNFOLLOW ARTICLE PAGE JS
     ************************************************************************************/
    // $('.followArticleBtn').followBlog({
    //     onSuccess: function (data, obj) {
    //        ($(obj).data('status') === 'follow') ? $(obj).html("Follow +") : $(obj).html("Following -");
    //         var message = ($(obj).data('status') === 'follow') ? 'Unfollow' : 'Follow';
    //         $.fn.General_ShowNotification({message: message + " blog successfully."});                 
    //     },
    //     beforeSend: function (obj) {
    //         $(obj).html('please wait...');
    //     },
    //     onError: function (obj, errorMessage) {
    //         $().General_ShowErrorMessage({message: errorMessage});
    //     }
    // });
    
    /************************************************************************************
     *              FOLLOW AND UNFOLLOW USER PROFILE PAGE JS
     ************************************************************************************/
    
    // $('.FollowProfileBlog').followBlog({
    //     onSuccess: function (data, obj) {
    //         var status = $(obj).data('status');
    //         if($(obj).hasClass('hasStar')) {
    //             (status == 'unfollow') ? $(obj).addClass('selected') : $(obj).removeClass('selected');
    //         }  
    //     },
    //     beforeSend: function (obj) {
    //         $(obj).find('.fa').addClass('fa-spin fa-spinner');
    //     },
    //     onError: function (obj, errorMessage) {
    //         $().General_ShowErrorMessage({message: errorMessage});
    //     },
    //     onComplete: function (obj) {
    //         $(obj).find('.fa').removeClass('fa-spin fa-spinner');
    //     }
    // });
    
    
    // $("#owl-thumbnails").owlCarousel({
    //     items: 2,
    //     itemsDesktop: [1199, 2],
    //     itemsDesktopSmall: [980, 1],
    //     itemsTablet: [768, 1],
    //     itemsMobile: [600, 1],
    //     pagination: true,
    //     navigation: true,
    //     loop: true,
    //     autoplay: true,
    //     autoplayTimeout: 1000,
    //     navigationText: [
    //         "<i class='fa fa-angle-left fa-2x'></i>",
    //         "<i class='fa fa-angle-right fa-2x'></i>"
    //     ]
    // });     
    
    // $('.shareIcons').SocialShare({
    //     onLoad: function (obj) {
    //         var title = obj.parents('div.article').find('.card__news-category').text();
    //         var url = obj.parents('div.article').find('a').attr('href');
    //         var content = obj.parents('div.article').find('.card__news-description').text();
    //         $('.rrssb-buttons').rrssb({
    //             title: title,
    //             url: url,
    //             description: content
    //         });
    //         setTimeout(function () {
    //             rrssbInit();
    //         }, 10);
    //     }
    // });
    
    //Contact form validation
    // $('#contactForm').validate({
    //     rules: {
    //         name: "required",
    //         email: "required",
    //         message: "required"
    //     },
    //     errorElement: "span",
    //     messages: {
    //         name: "Name cannot be blank.",
    //         email: "Email cannot be blank.",
    //         message: "Message cannot be blank."
    //     }
    // });
    
    /************************************************************************************
     *                  USER EDIT PROFILE PAGE JS
     ************************************************************************************/
    
    // $('.uploadFileBtn').uploadFile({
    //        onSuccess: function(data, obj){
    //             var resultJsonStr = JSON.stringify(data);
                
    //             var imgClass = $(obj).data('imgcls');
    //             $('.' + imgClass).css('background-image', 'url(' + data.url + ')');
                
    //             var fieldId = $(obj).data('id');
    //             $('#' + fieldId).val(resultJsonStr);
                
    //             $().General_ShowNotification({message: 'Image added successfully' });
    //         }
    // });
    
     /**
     * Update Social Post From Listing
     */
    // $('.editSocialPost').on('click', function (e) {
    //     e.preventDefault();
    //     var elem = $(this);
    //     var url = elem.data('url');
    //     var popup = window.open(url, '_blank', 'toolbar=no,scrollbars=yes,resizable=false,width=360,height=450');
    //     popup.focus();

    //     var intervalId = setInterval(function () {
    //         if (popup.closed) {
    //             clearInterval(intervalId);
    //             var socialId = elem.parents('a').data('id');
    //             if($('#updateSocial'+socialId).data('update') == '1') {
    //                 $().General_ShowNotification({message: 'Social Post(s) updated successfully.'});
    //             }  
    //         }
    //     }, 50);

    //     return;
    // });
    
}(jQuery));


    



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
$('document').ready(function() {

    var isMenuBroken, isMobile;
    var sbCustomMenuBreakPoint = 992;
    var mobileView = 620;
    var desktopView = 1119;
    var pageWindow = $(window);
    var scrollMetric = [pageWindow.scrollTop()];
    var menuContainer = $("#mainHeader");
    var masthead = $('#masthead');

    $('.video-player').videoPlayer();
    
    $("img.lazyload").lazyload({
        effect : "fadeIn"
    });



    // var isMobile = function(){
    //     if (window.innerWidth < mobileView) {
    //         return true;
    //     }
    //     return false;
    // };

    // var isDesktop = function(){
    //     if (window.innerWidth > desktopView) {
    //         return true;
    //     }
    //     return false;
    // };


    // var isScolledPast = function(position){
    //     if (scrollMetric[0] >= position) {
    //         return true;
    //     }
    //     return false;
    // };


    // var scrollUpMenu = function() {
    //     if ( scrollMetric[1] === 'up' && isScolledPast(70)){
    //         menuContainer.addClass('showOnScroll');
    //     } 
    //     else if ( scrollMetric[1] === 'down' && isScolledPast(70)) {
    //         menuContainer.addClass('fixHeader');
    //         menuContainer.removeClass('showOnScroll');

    //     }
    //     else {
    //         menuContainer.removeClass('fixHeader');
    //         menuContainer.removeClass('showOnScroll');
    //     }
    // }

    var removeMobileMenuStyles = function() {
        var menu = $('#sb-custom-menu');

        if (pageWindow.width() > 620 ) {
            masthead.removeClass('mobile-menu-active')
                    .removeClass('fixHeader');
        } else if (pageWindow.width() < 620 && menu.hasClass('open')) {
            masthead.addClass('mobile-menu-active')
                    .addClass('fixHeader'); 
        }
    }


    // Onload and resize events
    pageWindow.on("resize", function () {
        // stickHeader();
        removeMobileMenuStyles();
        // scrollUpMenu();
    }).resize();

    //On Scroll
    // pageWindow.scroll(function() {
    //     console.log('scrolling');
    //     var direction = 'down';
    //     var scroll = pageWindow.scrollTop();
    //     if (scroll < scrollMetric[0]) {
    //         direction = 'up';
    //     }
    //     scrollMetric = [scroll, direction];
    //     scrollUpMenu();
    // });




    // $("#menu-foldaway").on("click", function (e) {
    //     menu_top_foldaway.toggleClass('hide');
    //     menu_bottom_foldaway.toggleClass('hide');
    // });

    $("#menu-mobile").on("click", function (e) {
        var thisMenuElem = $( $(this).parent('.sb-custom-menu') );
        $(this).toggleClass("active");
        thisMenuElem
        thisMenuElem.find('.menuContainer').toggleClass("show-on-tablet");
        thisMenuElem.toggleClass('open');
        if (pageWindow.width() < 620) {
            masthead.toggleClass('mobile-menu-active')
                    .toggleClass('fixHeader');
        }
        e.preventDefault();
    });


    // $("li.menu-item-search").bind("mouseenter focus mouseleave",function () {
    //     if (window.innerWidth > sbCustomMenuBreakPoint) {
    //         $("input#header-search").focus();
    //         return false;
    //     }
    // });


    $(".sb-custom-menu > .menuContainer > ul > li").hover(function (e) {

    // $(".sb-custom-menu > .menuContainer > ul > li").bind("mouseenter", function (e) {
        if (pageWindow.width() > sbCustomMenuBreakPoint) {
            $(this).children("ul").stop(true, false).slideToggle(0);
            $(this).toggleClass('now-active');
            e.preventDefault();
        }
    });


    $(".sb-custom-menu > .menuContainer > ul > li > span").on("click", function(e) {
        e.preventDefault();

        var elem = $(this);

        if (elem.hasClass('selected')) {
            elem.removeClass('selected');
            elem.parent().children('ul.sub-menu').stop(true,true).slideUp('fast');
            return;
        }

        var listItems = $('ul.menu.mobile > li');
        listItems.find('span').removeClass('selected');
        elem.addClass('selected');

        listItems.each(function(i) {
            var item = $(this);
            if ( !item.find('span').hasClass('selected') ) {
                item.children('ul.sub-menu').stop(true,true).slideUp('fast');
            }
        });
        

        if (elem.hasClass('selected')) {
            elem.parent().children('ul').stop(true,true).slideDown('fast');
        }

    });



    var cardHolder = '';
    clearTimeout(cardHolder);
    cardHolder = setTimeout((function() {
        $('.card .content > p, .card h2').dotdotdot({
            watch: true
        });
    }), 750);


    // $('#submitlivestreamform').on('click', function(e) {
    //     e.preventDefault();
    //     var email = $('#submitlivestreamformemail').val();
    //     var name = $('#submitlivestreamformname').val();
    //     var lastname = $('#submitlivestreamformlastname').val();
    //     var wantsmail = $('#submitlivestreamformgetmail').is(":checked");

    //     if (email !== '' && name !== '' && lastname !== ''){
    //         $.get( 'http://submit.pagemasters.com.au/wobi/submit.php?email='+encodeURI(email)+'&name='+encodeURI(name)+'&lastname='+encodeURI(lastname)+'&wantsemail='+encodeURI(wantsmail) );

    //         $('#streamform').html(
    //             "<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe width='640' height='360' src='https://secure.metacdn.com/r/j/bekzoqlva/wbfs/embed' frameborder='0' allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen </iframe></div>"
    //         );

    //         $('#streamformfooter').html(
    //             "<h2>Thanks</h2>"
    //         );
           

    //     } else {
    //         alert ("Please fill out all fields.");
    //     }

    // });


});

var SearchController = (function ($) {
    return {
        listing: function () {
            SearchController.Listing.init();
        }
    };
}(jQuery));

SearchController.Listing = (function ($) {

    var attachEvents = function () {
        
        $('.loadMoreArticles').on('click', function(e){
            e.preventDefault();
            var btnObj = $(this);
            $.fn.Ajax_LoadSearchArticles({
                'search': $('input.header__search-text').val(),
                onSuccess: function(data, textStatus, jqXHR){
                      if (data.success == 1) {
                        for (var i in data.articles) {
                            data.articles[i]['containerClass'] = 'col-quarter';
                            
                            data.articles[i]['promotedClass'] = (data.articles[i].isPromoted == 1)? 'ad_icon' : '';
                            data.articles[i]['hasArticleMediaClass'] = (data.articles[i].hasMedia == 1)? 'withImage__content' : 'without__image';
                            
                            data.articles[i]['blogClass']= '';
                            if(data.articles[i].blog['id'] !== null) {
                               data.articles[i]['blogClass']= 'card--blog_'+data.articles[i].blog['id'];
                            } 
                            
                            var ImageUrl = $.image({media:data.articles[i]['featuredMedia'], mediaOptions:{width: 500 ,height:350, crop: 'limit'} });
                            data.articles[i]['imageUrl'] = ImageUrl;
                           
                            var articleTemplate = Handlebars.compile(systemCardTemplate);

                            var article = articleTemplate(data.articles[i]);
                            $('.ajaxArticles').append(article);
                        }
                        if(data.articles.length < 20) {
                            $(btnObj).css('display', 'none');
                        }

                        bindSocialShareArticle();
                        $(".card p, .card h1").dotdotdot();
                        
                         //Lazyload implement
                        $("div.lazyload").lazyload({
                            effect: "fadeIn"
                        });
                    }
                
                   
                },
                beforeSend: function(jqXHR, settings){
                    $(btnObj).html("Please wait...");
                },
                onComplete: function(jqXHR, textStatus){
                    $(btnObj).html("Load More");
                }
            });
        });
        
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

    };
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));
var UserArticlesController = (function ($) {
    return {
        load: function () {
            UserArticlesController.Load.init();
        }
    };
}(jQuery));

UserArticlesController.Load = (function ($) {

    var attachEvents = function () {
      
        /*
         * Load More Articles on My Post Page
         */
        $('.loadMoreMyArticles').on('click', function (e) {
            e.preventDefault();
            var btnObj = $(this);

            $.fn.Ajax_LoadMoreMyArticles({
                onSuccess: function (data, textStatus, jqXHR) {
                    if (data.success == 1) {
                        if (data.articles.length < 20) {
                            $(btnObj).css('display', 'none');
                        }
                        for (var i in data.articles) {
                            data.articles[i]['containerClass'] = 'col-quarter';
                            data.articles[i]['cardClass'] = 'card__news card--local';
                            
                            data.articles[i]['blogClass']= '';
                            if(data.articles[i].blog['id'] !== null) {
                               data.articles[i]['blogClass']= 'card--blog_'+data.articles[i].blog['id'];
                            } 
                            
                            var ImageUrl = $.image({media:data.articles[i]['featuredMedia'], mediaOptions:{width: 500 ,height:350, crop: 'limit'} });
                            data.articles[i]['imageUrl'] = ImageUrl;
                            var articleTemplate = Handlebars.compile(systemCardTemplate);
                            var article = articleTemplate(data.articles[i]);
                            $('.LoadMyArticles').append(article);
                        }
                        $(".card p, .card h1").dotdotdot();
                         //Lazyload implement
                        $("div.lazyload").lazyload({
                            effect: "fadeIn"
                        });
                    }
                },
                beforeSend: function (jqXHR, settings) {
                    $(btnObj).html("Please wait...");
                },
                onComplete: function (jqXHR, textStatus) {
                    $(btnObj).html("Load More");
                }
            });
        });
        
        /**
         *  See User Post Articles
         */

        var totalPosts = parseInt($('div#userArticleContainer').data('total-count'));
        
        if (totalPosts > _appJsConfig.articleOffset) {
            var waypoint = new Waypoint({
                element: $('#LoadMoreArticles'),
                offset: '80%',
                handler: function (direction) {
                    if (direction == 'down') {
                        $.fn.Ajax_LoadMoreUserArticles({
                            onSuccess: function (data, textStatus, jqXHR) {
                                if (data.userArticles.length > 0) {

                                    for (var i in data.userArticles) {
                                        data.userArticles[i]['containerClass'] = 'col-third';
                                        data.userArticles[i]['cardClass'] = 'card__news card--local';
                                        
                                        data.articles[i]['blogClass']= '';
                                        if(data.userArticles[i].blog['id'] !== null) {
                                           data.userArticles[i]['blogClass']= 'card--blog_'+data.userArticles[i].blog['id'];
                                        } 
                                        
                                        var ImageUrl = $.image({media:data.userArticles[i]['featuredMedia'], mediaOptions:{width: 500 ,height:350, crop: 'limit'} });
                                        data.userArticles[i]['imageUrl'] = ImageUrl;
                                        data.userArticles[i]['placeholder'] = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Loading&w=450&h=250';
                                        var articleTemplate = Handlebars.compile(systemCardTemplate);
                                        var article = articleTemplate(data.userArticles[i]);
                                        $('#userArticleContainer').append(article);
                                    }

                                    if (data.userArticles.length < _appJsConfig.articleOffset) {
                                        waypoint.destroy();
                                    } else {
                                        Waypoint.refreshAll();
                                    }
                                    $(".card p, .card h1").dotdotdot();
                                     //Lazyload implement
                                    $("div.lazyload").lazyload({
                                        effect: "fadeIn"
                                    });
                                }
                            },
                            beforeSend: function (jqXHR, settings) {
                                $('div.loader').removeClass('hide');
                            },
                            onComplete: function (jqXHR, textStatus) {
                                $('div.loader').addClass('hide');
                            }
                        });
                    }
                }
            });
        }
    };
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));



(function ($) {
    
    /**
     * Follow Unfollow blog on profile page
     */
    $('.FollowUnfollowBlog').followBlog({
        onSuccess: function (data, obj) {
            var status = $(obj).data('status');
            if($(obj).hasClass('hasStar')) {
                (status == 'unfollow') ? $(obj).addClass('selected') : $(obj).removeClass('selected');
            }  
        },
        beforeSend: function (obj) {
            $(obj).find('.fa').addClass('fa-spin fa-spinner');
        },
        onError: function (obj, errorMessage) {
            $().General_ShowErrorMessage({message: errorMessage});
        },
        onComplete: function (obj) {
            $(obj).find('.fa').removeClass('fa-spin fa-spinner');
        }
    });
    
    
    /**
     * Follow Profile User on Profile Page
     */
    $('.FollowProfileUser').followUser({
        onSuccess: function (data, obj) {
            var status = $(obj).data('status');
            $(obj).get(0).lastChild.nodeValue = " " + status.substr(0,1).toUpperCase()+status.substr(1);
            var message = ($(obj).data('status') === 'follow') ? 'Unfollow' : 'Follow';
            $.fn.General_ShowNotification({message: message + " user successfully."});   
        },
        beforeSend: function (obj) {
            $(obj).find('.fa').addClass('fa-spin fa-spinner');
        },
        onError: function (obj, errorMessage) {
            $().General_ShowErrorMessage({message: errorMessage});
        },
        onComplete: function (obj) {
            $(obj).find('.fa').removeClass('fa-spin fa-spinner');
        }
    });
    
  
    /**
     * Follow Unfollow Writer on profile page
     */
    $('.FollowUnfollowWriter').followUser({
        onSuccess: function (data, obj) {
            var status = $(obj).data('status');
            if($(obj).hasClass('hasStar')) {
                (status == 'unfollow') ? $(obj).addClass('selected') : $(obj).removeClass('selected');
            }
        },
        onError: function (obj, errorMessage) {
            $().General_ShowErrorMessage({message: errorMessage});
        },
        beforeSend: function (obj) {
            $(obj).find('.fa').addClass('fa-spin fa-spinner');
        },
        onComplete: function (obj) {
            $(obj).find('.fa').removeClass('fa-spin fa-spinner');
        }
    });
    
    /**
     * Follow Unfollow User On Profile page
     */
    $('.FollowUnfollowUser').followUser({
        onSuccess: function (data, obj) {
            var status = $(obj).data('status');
            if($(obj).hasClass('hasStar')) {
                (status == 'unfollow') ? $(obj).addClass('selected') : $(obj).removeClass('selected');
            }
        },
        onError: function (obj, errorMessage) {
            $().General_ShowErrorMessage({message: errorMessage});
        },
        beforeSend: function (obj) {
            $(obj).find('.fa').addClass('fa-spin fa-spinner');
        },
        onComplete: function (obj) {
            $(obj).find('.fa').removeClass('fa-spin fa-spinner');
        }
    });
    

}(jQuery));


    



/**
 * Handlebar Article templates for listing
 */
var screenArticles_1 = 
'<div class="row half-height top-row">\
    {¡{content:1-2}¡}\
</div>\
<div class="row half-height bottom-row">\
    {¡{content:3-5}¡}\
</div>\
';

var systemCardTemplate = 
'<div class="{{containerClass}} "> \
    <a  itemprop="url" \
        href="{{url}}" \
        class="card swap" \
        data-id="{{articleId}}" \
        data-position="{{position}}" \
        data-social="0" \
        data-article-image="{{{imageUrl}}}" \
        data-article-text="{{title}}"> \
        \
        <article class="">\
            {{#if hasMedia}}\
                <figure>\
                    <img class="img-responsive lazyload" data-original="{{imageUrl}}" src="{{imageUrl}}" style="background-image:url("{{placeholder}}"")>\
                </figure>\
            {{/if}} \
        \
            <div class="content">\
                    <div class="category">{{label}}</div>\
                    <h2>{{{ title }}}</h2>\
                    <p>{{{ excerpt }}}</p>\
                    <div class="author">\
                        <img src="{{profileImg}}" class="img-circle">\
                        <p>{{ createdBy.displayName }}</p>\
                    </div>\
            </div>\
        </article>'+
        
        '{{#if userHasBlogAccess}}'+
            '<div class="btn_overlay articleMenu">'+
                '<button title="Hide" data-guid="{{guid}}" class="btnhide social-tooltip HideBlogArticle" type="button" data-social="0">'+
                    '<i class="fa fa-eye-slash"></i><span class="hide">Hide</span>'+
                '</button>'+
                '<button onclick="window.location=\'{{{editUrl}}}\'; return false;" title="Edit" class="btnhide social-tooltip" type="button">'+
                    '<i class="fa fa-edit"></i><span class="hide">Edit</span>'+
                '</button>'+
                '<button data-position="{{position}}" data-social="0" data-id="{{articleId}}" title="{{pinTitle}}" class="btnhide social-tooltip PinArticleBtn" type="button" data-status="{{isPinned}}">'+
                    '<i class="fa fa-thumb-tack"></i><span class="hide">{{pinText}}</span>'+
                '</button>'+
            '</div>'+
        "{{/if}}"+
    '</a>'+
'</div>';
                                                
var socialCardTemplate =  '<div class="{{containerClass}}">' +
                                '<a href="{{social.url}}"\
                                    target="_blank"\
                                    class="card swap social {{social.source}} {{#if social.hasMedia}} withImage__content {{else }} without__image {{/if}} {{videoClass}}"\
                                    data-id="{{socialId}}"\
                                    data-position="{{position}}"\
                                    data-social="1"\
                                    data-article-image="{{{social.media.path}}}"\
                                    data-article-text="{{social.content}}">\
                                    <article class="">\
                                        {{#if social.hasMedia}}\
                                            <figure class="{{videoClass}}">\
                                                <img class="img-responsive" src="{{social.media.path}}" style="background-image:url(https://placeholdit.imgix.net/~text?txtsize=33&txt=Loading&w=450&h=250)">\
                                            </figure>\
                                        {{/if}}\
                                        \
                                        <div class="content">\
                                            <div class="category {{social.source}}">{{social.source}}</div>\
                                            <p id="updateSocial{{article.socialId}}" data-update="0">{{{social.content}}}</p>\
                                            <time datetime="2016-11-16"></time>\
                                            <div class="author">\
                                                <p class="">{{ social.user.name }}</p>\
                                            </div>\
                                        </div>'+


                                        '{{#if userHasBlogAccess}}\
                                            <div class="btn_overlay articleMenu">\
                                                <button title="Hide" data-guid="{{social.guid}}" class="btnhide social-tooltip HideBlogArticle" type="button" data-social="1">\
                                                    <i class="fa fa-eye-slash"></i><span class="hide">Hide</span>\
                                                </button>\
                                                <button title="Edit" class="btnhide social-tooltip editSocialPost" type="button" data-url="/admin/social-funnel/update-social?guid={{blog.guid}}&socialguid={{social.guid}}">\
                                                <i class="fa fa-edit"></i><span class="hide">Edit</span>\
                                                </button>\
                                                <button data-position="{{position}}" data-social="1" data-id="{{socialId}}" title="{{pinTitle}}" class="btnhide social-tooltip PinArticleBtn" type="button" data-status="{{isPinned}}">\
                                                    <i class="fa fa-thumb-tack"></i><span class="hide">{{pinText}}</span>\
                                                </button>\
                                            </div>\
                                        {{/if}}\
                                    </article>\
                                </a>\
                            </div>';


var socialPostPopupTemplate = 
'<div class="modal-content">'+
'<button type="button" class="close close__lg-modal" data-dismiss="modal" aria-label="Close">'+
        '<span aria-hidden="true">'+
            '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">'+
                    '<title>Close</title>'+
                    '<g stroke-width="3" fill-rule="evenodd" stroke-linecap="round">'+
                            '<path d="M17.803 2L2 17.803M2.08 2.08l15.803 15.803"/>'+
                    '</g>'+
            '</svg>'+
            '<div class="close__text">esc</div>'+
        '</span>'+
    '</button>'+
    '<button type="button" class="close close__sm-modal" data-dismiss="modal" aria-label="Close">'+
        '<span aria-hidden="true">'+
                '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Close</title><g stroke="#FFF" stroke-width="3" fill="none" fill-rule="evenodd" stroke-linecap="round"><path d="M17.803 2L2 17.803M2.08 2.08l15.803 15.803"/></g></svg>'+
        '</span>'+
    '</button>'+

    '<div class="social-modal__content {{blog.title}} {{#unless hasMedia}} no_image {{/unless}}">'+
                    '<div class="social-modal__channel social-modal__channel--technology ">{{blog.title}}</div>'+
                    '<div class="social-modal__overflow">'+

    '{{#if hasMedia}}'+
                        '<div class="social-modal__image_container">'+
                                '<div class="social-modal__image_wrap">'+
                                        '{{#if hasMediaVideo}}'+
                                                '<div class="social-modal__video-wrap">'+
                                                        '<iframe style="min-height:360px;width:100%;" src="{{media.videoUrl}}" frameborder="0" allowfullscreen></iframe>'+
                                                '</div>'+
                                        '{{else}}'+
                                                '<div class="social-modal__image" style="background-image: url(\'{{media.path}}\');" >'+
                                                        '<img class="social-modal__image_image" src="{{media.path}}" alt="" />'+
                                                '</div>'+
                                        '{{/if}}'+
                                '</div>'+
                        '</div>'+
    '{{/if}}'+

                    '<a href="{{url}}" target="_blank"><div class="social-modal__text"><br>{{{content}}}</div></a>'+
                    '</div>'+
                    '<div class="social-user">'+
                        '<span class="social-user__image" style="background-image: url(\'{{user.media.path}}\'); height: 56px; width: 56px; background-size: cover; display: inline-block; border-radius: 50%;"></span>'+
                        '<div class="social-user__author-wrap">'+
                            '<span class="social-user__author">@{{user.name}}</span>'+
                            '<div class="social-user__button-wrap">'+
                                ' <div class="button button-sm button__share button__share--borderless header_actions header_actions__share">'+
                                    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'+
                                    '<svg width="13px" height="14px" viewBox="0 0 13 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
                                        '<title>Shape</title>'+
                                        '<desc>Created with Sketch.</desc>'+
                                        '<defs></defs>'+
                                        '<g id="Desktop" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
                                            '<g id="Theme-3-Article---desktop" transform="translate(-1113.000000, -793.000000)" fill="#C0C2CA">'+
                                                '<g id="Article" transform="translate(215.000000, 216.000000)">'+
                                                    '<g id="Comments-Share" transform="translate(735.000000, 568.000000)">'+
                                                        '<g id="Share-button" transform="translate(151.000000, 0.000000)">'+
                                                            '<path d="M22.0625,18.3333333 C21.5305808,18.3333333 21.0420077,18.5150222 20.650499,18.8174222 L16.6106375,16.3818889 C16.6309173,16.2572889 16.6442308,16.1302 16.6442308,16 C16.6442308,15.8694889 16.6309173,15.7427111 16.6106375,15.6179556 L20.650499,13.1824222 C21.0420077,13.4851333 21.5305808,13.6666667 22.0625,13.6666667 C23.3447721,13.6666667 24.3846154,12.6218 24.3846154,11.3333333 C24.3846154,10.0448667 23.3447721,9 22.0625,9 C20.7802279,9 19.7403846,10.0448667 19.7403846,11.3333333 C19.7403846,11.4635333 19.7536981,11.5906222 19.7742875,11.7152222 L15.734426,14.1507556 C15.3429173,13.8483556 14.8543442,13.6666667 14.3221154,13.6666667 C13.0398433,13.6666667 12,14.7115333 12,16 C12,17.2884667 13.0398433,18.3333333 14.3221154,18.3333333 C14.8543442,18.3333333 15.3429173,18.1518 15.734426,17.8490889 L19.7742875,20.2846222 C19.7536981,20.4093778 19.7403846,20.5361556 19.7403846,20.6666667 C19.7403846,21.9551333 20.7802279,23 22.0625,23 C23.3447721,23 24.3846154,21.9551333 24.3846154,20.6666667 C24.3846154,19.3782 23.3447721,18.3333333 22.0625,18.3333333 L22.0625,18.3333333 Z" id="Shape"></path>'+
                                                        '</g>'+
                                                    '</g>'+
                                                '</g>'+
                                            '</g>'+
                                        '</g>'+
                                    '</svg>'+
                                    ' Share'+
                                    '<div class="share-popup" style="right: -166px;">'+
                                        '<input type="text" name="share-link" value="{{url}}" readonly class="share-popup__share-link share-link">'+
                                        '<div class="share-popup__social-wrap">'+
                                            '<div class="social-icon_wrap--colored">'+
                                                '<a href="https://plus.google.com/share?url={{url}}" target="_blank"><i class="fa fa-google-plus"></i></a>'+
                                                '<a href="http://www.facebook.com/sharer/sharer.php?u={{url}}" target="_blank" ><i class="fa fa-facebook"></i></a>'+
                                                '<a href="http://twitter.com/intent/tweet?status={{url}}" target="_blank"><i class="fa fa-twitter"></i></a>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
    '</div>'+
 '</div>'   ;   
//# sourceMappingURL=main.js.map
