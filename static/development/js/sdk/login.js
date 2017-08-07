(function ($) {

    $.fn.loginModal = function (options) {

        var defaults = {
            class: '',
            minWidth : '',
            maxWidth: '',
            referUrl: window.location.href,
            onLoad: function () {}
        };
        var opts = $.extend({}, defaults, options);

        return this.each(function () {
            var elem = $(this);
            $(elem).click(function (e) {
                e.preventDefault();
                var $modal;
                $modal = document.createElement("div");
                $modal.id = "forceLogin-Modal";
                $modal.className = "modal fade" + opts.class;
                $modal.style.minWidth = opts.minWidth + "px";
                $modal.style.maxWidth = opts.maxWidth + "px";
                $modal.tabIndex = -1;
                $modal.setAttribute("role", "dialog");
                $modal.setAttribute("aria-labelledby", "myModalLabel");
                
                document.body.appendChild($modal);

                $('body').modalmanager('loading');
                setTimeout(function () {
                    $('#forceLogin-Modal').load(_appJsConfig.baseHttpPath + '/auth/login-modal?ref=' + escape(opts.referUrl), '', function () {
                        $('#forceLogin-Modal').modal();
                        if (opts.onLoad && typeof opts.onLoad === 'function') {
                            opts.onLoad();
                        }
                    });
                }, 500);
            });
        });  
    };
    
    $.fn.validateLoginForm = function (options) {

        var defaults = {};
        var opts = $.extend({}, defaults, options);
        return this.each(function () {
            var elem = $(this);
            $(elem).validate({
                rules: {
                    username: "required",
                    password: {
                        required: true,
                        minlength: 6
                    }
                },
                messages: {
                    username: "Username cannot be blank.",
                    password: {
                        required: "Password cannot be blank.",
                        minlength: "Your password must be at least 6 characters"
                    }
                }
            });
        });
    };
    
    $.fn.validateSignupForm = function (options) {

        var defaults = {};
        var opts = $.extend({}, defaults, options);

        return this.each(function () {
            var elem = $(this);
            $(elem).validate({
                rules: {
                    firstname: "required",
                    lastname: "required",
                    username: "required",
                    captcha: "required",
                    email: {
                        required: true,
                        email: true
                    },
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
                    firstname: "First name cannot be blank.",
                    lastname: "Last name cannot be blank.",
                    username: "Username cannot be blank.",
                    captcha: "Captcha cannot be blank.",
                    email: "Email cannot be blank.",
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
        });
    };
    
    $.fn.validateSocialSignupForm = function (options) {

        var defaults = {};
        var opts = $.extend({}, defaults, options);

        return this.each(function () {
            var elem = $(this);
            $(elem).validate({
                rules: {
                    firstname: "required",
                    lastname: "required",
                    username: "required",
                    terms: "required",
                    email: {
                        required: true,
                        email: true
                    },
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
                errorElement: "span",
                messages: {
                    firstname: "First name cannot be blank.",
                    lastname: "Last name cannot be blank.",
                    username: "Username cannot be blank.",
                    email: "Email cannot be blank.",
                    terms: "",
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
        });
    };
}(jQuery));