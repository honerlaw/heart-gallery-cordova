var density = (function($) {

    var settings = {
      navHeight : 50,
      navTopPadding: 0,
      navTop: true,
      menuWidth: 250,
      menuLeft: true,
      animationDelay: .3,
      pageDir: 'rtol',
      trackPreviousPages: true,
    };

    var nav = undefined;
    var menu = undefined;
    var content = undefined;
    var pages = undefined;

    function bind() {
      $(document).on((window.cordova ? 'touchend' : 'click'), function(event) {
        if(!$(event.target).closest('div[menu]').length) {
          if(density.menu.isOpen()) {
            density.menu.close();
          }
        }
      });
    };

    function build() {
      $("<style>")
      .prop("type", "text/css")
      .html('html, body {\
        height: 100%;\
        width: 100%;\
        margin: 0;\
        padding: 0;\
      }\
      .density-transition-all {\
        -webkit-transition : all ' + settings.animationDelay + 's linear;\
        -moz-transition : all ' + settings.animationDelay + 's linear;\
        -ms-transition : all ' + settings.animationDelay + 's linear;\
        -o-transition : all ' + settings.animationDelay + 's linear;\
        transition : all ' + settings.animationDelay + 's linear;\
      }\
      .density-zero-transform {\
        -webkit-transform : translate3d(0, 0, 0);\
        -moz-transform : translate3d(0, 0, 0);\
        -ms-transform : translate3d(0, 0, 0);\
        -o-transform : translate3d(0, 0, 0);\
        transform : translate3d(0, 0, 0);\
      }\
      .density-menu-nonzero-transform {\
        -webkit-transform : translate3d(-' + settings.menuWidth + 'px, 0, 0);\
        -moz-transform : translate3d(-' + settings.menuWidth + 'px, 0, 0);\
        -ms-transform : translate3d(-' + settings.menuWidth + 'px, 0, 0);\
        -o-transform : translate3d(-' + settings.menuWidth + 'px, 0, 0);\
        transform : translate3d(-' + settings.menuWidth + 'px, 0, 0);\
      }\
      .density-menu-initial-transform {\
        -webkit-transform : translate3d(-' + (settings.menuLeft ? settings.menuWidth : 0) + 'px, 0, 0);\
        -moz-transform : translate3d(-' + (settings.menuLeft ? settings.menuWidth : 0) + 'px, 0, 0);\
        -ms-transform : translate3d(-' + (settings.menuLeft ? settings.menuWidth : 0) + 'px, 0, 0);\
        -o-transform : translate3d(-' + (settings.menuLeft ? settings.menuWidth : 0) + 'px, 0, 0);\
        transform : translate3d(-' + (settings.menuLeft ? settings.menuWidth : 0) + 'px, 0, 0);\
      }\
      .density-page-transform-right {\
        -webkit-transform : translate3d(100%, 0, 0);\
        -moz-transform : translate3d(100%, 0, 0);\
        -ms-transform : translate3d(100%, 0, 0);\
        -o-transform : translate3d(100%, 0, 0);\
        transform : translate3d(100%, 0, 0);\
      }\
      .density-page-transform-left {\
        -webkit-transform : translate3d(-100%, 0, 0);\
        -moz-transform : translate3d(-100%, 0, 0);\
        -ms-transform : translate3d(-100%, 0, 0);\
        -o-transform : translate3d(-100%, 0, 0);\
        transform : translate3d(-100%, 0, 0);\
      }\
      .density-page-transform-bottom {\
        -webkit-transform : translate3d(0, 100%, 0);\
        -moz-transform : translate3d(0, 100%, 0);\
        -ms-transform : translate3d(0, 100%, 0);\
        -o-transform : translate3d(0, 100%, 0);\
        transform : translate3d(0, 100%, 0);\
      }\
      .density-page-transform-top {\
        -webkit-transform : translate3d(0, -100%, 0);\
        -moz-transform : translate3d(0, -100%, 0);\
        -ms-transform : translate3d(0, -100%, 0);\
        -o-transform : translate3d(0, -100%, 0);\
        transform : translate3d(0, -100%, 0);\
      }\
      .density-nav {\
        position: relative;\
        ' + (settings.navTop ? 'top' : 'bottom') + ' : 0px;\
        line-height: ' + settings.navHeight + 'px;\
        padding-top: ' + settings.navTopPadding + 'px;\
        left: 0px;\
        width: 100%;\
        height: ' + settings.navHeight + 'px;\
        z-index: 99;\
        overflow: hidden;\
      }\
      .density-menu {\
        position: absolute;\
        top: 0px;\
        left: ' + (settings.menuLeft ? '0px' : '100%') + ';\
        height: 100%;\
        width: ' + settings.menuWidth + 'px;\
        z-index: 100;\
        overflow: hidden;\
        overflow-y: scroll;\
      }\
      .density-content {\
        position: absolute;\
        top: ' + (settings.navTop ? (settings.navHeight + settings.navTopPadding) : 0) + 'px;\
        left: 0px;\
        width: 100%;\
        height: calc(100% - ' + (settings.navHeight + settings.navTopPadding) + 'px);\
        overflow: hidden;\
      }\
      .density-content-page {\
        position: absolute;\
        top: 0px;\
        left: 0px;\
        height: 100%;\
        width: 100%;\
        z-index: 0;\
        overflow: hidden;\
        overflow-y: scroll;\
      }').prependTo('head');
      nav.addClass('density-nav density-transition-all .density-zero-transform');
      menu.addClass('density-menu density-transition-all density-menu-initial-transform');
      content.addClass('density-content density-transition-all .density-zero-transform');
      pages.addClass('density-content-page density-transition-all density-zero-transform');
      setTimeout(function() {
        $('div[page]').each(function(i, e) {
          if(i !== 0) {
            $(e).css('display', 'none');
          }
        });
      }, 0);
    };

    return {
      init: function(options) {
        $.extend(settings, options);
        if(window.cordova && device && device.platform === 'iOS' && parseInt(device.version) >= 7) {
          settings.navTopPadding = 20;
        }
        nav = $('div[nav]');
        menu = $('div[menu]');
        content = $('div[content]');
        pages = $('div[page]');
        build();
        bind();
      },
      nav: {
        show: function() {
          nav.css({
            'height' : settings.navHeight + 'px',
            'padding-top' : settings.navTopPadding + 'px'
          });
          content.css({
            'top' : (settings.navTop ? (settings.navHeight + settings.navTopPadding) : 0) + 'px',
            'height' : 'calc(100% - ' + (settings.navHeight + settings.navTopPadding) + 'px)'
          });
        },
        hide: function() {
          nav.css({
            'height' : '0px',
            'padding' : '0px'
          });
          content.css({
            'top' : '0px',
            'height' : '100%'
          });
        }
      },
      menu: {
        open: function() {
          if(!settings.menuLeft) {
            menu.removeClass('density-zero-transform density-menu-initial-transform')
              .addClass('density-menu-nonzero-transform');
          } else {
            menu.removeClass('density-menu-nonzero-transform density-menu-initial-transform')
              .addClass('density-zero-transform');
          }
        },
        close: function() {
          if(!settings.menuLeft) {
            menu.removeClass('density-menu-nonzero-transform density-menu-initial-transform')
              .addClass('density-zero-transform');
          } else {
            menu.removeClass('density-zero-transform density-menu-initial-transform')
              .addClass('density-menu-nonzero-transform');
          }
        },
        toggle: function() {
          if(density.menu.isOpen()) {
            density.menu.close();
          } else {
            density.menu.open();
          }
        },
        isOpen: function() {
          var transform = menu.css('-webkit-transform');
          if(menu.css('-moz-transform')) transform = menu.css('-moz-transform');
          if(menu.css('-ms-transform')) transform = menu.css('-ms-transform');
          if(menu.css('-o-transform')) transform = menu.css('-o-transform');
          if(menu.css('transform')) transform = menu.css('transform');
          if(transform) {
            var pos = parseInt(transform.split(', ')[4]);
            if((settings.menuLeft ? (pos > -250) : (pos < 0))) {
                return true;
            }
          }
          return false;
        }
      },
      pages: {
        changing: false,
        current: 0,
        previous: [],
        prev: function(regularDir) {
          if(density.pages.previous.length > 1) {
            var anim = density.pages.previous.pop();
            var index = density.pages.previous.pop();
            var reverse = anim.charAt(anim.length - 1) + 'to' + anim.charAt(0);
            if(!regularDir) {
              density.pages.open(index, true, reverse);
            } else {
              density.pages.open(index, true);
            }
          }
        },
        open: function(index, previous, previousDir) {
          if(density.pages.changing || density.pages.current === index || index >= $('div[page]').length) {
            return;
          }
          //get the current and next element
          var cur = $('div[page]:eq('+density.pages.current+')');
          var next = $('div[page]:eq('+index+')');

          //remove transtions from the next so we can position it
          next.removeClass('density-transition-all');

          var dir = next.attr('pageDir') ? next.attr('pageDir') : settings.pageDir;
          if(previousDir) {
            dir = previousDir;
          }

          //position the element
          if(dir === 'ltor' || dir === 'rtol' || dir === 'ttob' || dir === 'btot') {
            var ltor = (dir === 'ltor');
            var rtol = (dir === 'rtol');
            var ttob = (dir === 'ttob');
            var btot = (dir === 'btot');
            var transform = 'left'
            density.pages.changing = true;
            var css = {
              'display' : 'block'
            };
            if(ltor || rtol) {
              transform = (ltor ? 'left' : 'right');
              $.extend(css, { 'left' : ltor ? '100%' : '-100%' });
            } else if(ttob || btot) {
              transform = (btot ? 'top' : 'bottom');
              $.extend(css, { 'top' : btot ? '100%' : '-100%' });
            }
            next.css(css);
            //execute this after all rendering is done
            //setTimeout pushes it to the end of the stack
            setTimeout(function() {
              //do the animations
              next.addClass('density-transition-all');
              cur.removeClass('density-zero-transform').addClass('density-page-transform-' + transform);
              next.removeClass('density-zero-transform').addClass('density-page-transform-' + transform);

              //after the animation completes reset everything
              next.on('webkitTransitionEnd transitionend oTransitionEnd', function() {
                $(this).off('webkitTransitionEnd transitionend oTransitionEnd');
                next.removeClass('density-transition-all density-page-transform-' + transform).addClass('density-zero-transform');
                next.css({ 'left' : '', 'top' : '' });
                cur.css('display', 'none');
                cur.removeClass('density-page-transform-' + transform + ' density-zero-transform');

                //need to wait for the render to finish
                //so push to end of stack
                setTimeout(function() {
                  next.addClass('density-transition-all');
                  density.pages.changing = false;
                }, 0);
              });

            }, 0);

          }

          if(settings.trackPreviousPages && (!previous && previous !== true)) {
            density.pages.previous.push(density.pages.current); //everytime we open a page add it to the index
            density.pages.previous.push(dir);
          }
          density.pages.current = index; //set the current to the newly opened page
        }
      }
    };

}(jQuery));
