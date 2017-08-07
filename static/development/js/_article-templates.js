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