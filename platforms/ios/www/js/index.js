

var gallery = (function($) {

  var model = {
    gallery : ko.observableArray([])
  };

  var methods = {
    open: function() {
      density.pages.open($(this).index() + 1);
      density.menu.close();
    },
    get: function(callback) {
      $.ajax({
        url : 'http://www.heartgallerynorthflorida.org/api/core/get_posts/?post_type=portfolio&count=1000',
        type : 'GET',
        dataType : 'JSON',
        success: function(data) {
          for(var i = 0; i < data.posts.length; ++i) {
            if(data.posts[i].thumbnail_images.full) {
              data.posts[i].image = data.posts[i].thumbnail_images.full.url;
            } else if(data.posts[i].thumbnail_images.large) {
              data.posts[i].image = data.posts[i].thumbnail_images.large.url;
            } else if(data.posts[i].thumbnail_images.medium) {
              data.posts[i].image = data.posts[i].thumbnail_images.medium.url;
            } else if(data.posts[i].thumbnail_images.thumbnail) {
              data.posts[i].image = data.posts[i].thumbnail_images.thumbnail.url;
            } else if(data.posts[i].thumbnail) {
              data.posts[i].image = data.posts[i].thumbnail;
            } else {
              data.posts[i].image = 'img/heart-gallery-nf-logo.png';
            }
          }
          model.gallery(data.posts);
          setTimeout(function() {
            $('p').each(function(index, item) {
              if($.trim($(item).text()) === "") {
                $(item).remove();
              }
            });
          }, 50);
          callback();
        },
        error: function(err) {
          methods.get(callback);
        }
      });
    },
    camera: {
      open: function() {
        if(window.cordova) {
          window.cordova.exec(methods.camera.success, methods.camera.camera_error, "ScanditSDK", "scan", ["LNi5+iy2EeSSQIKJYvpIaNRcynoZ89nM9FFXkaUsz7c", {} ]);
        }
      },
      success: function(results) {
        var index = core.get_index_from_url(results[0]);
        if(index === -1) {
          core.alert('Failed to decode QR code.');
        } else {
          $('#gallery-container')[0].selected = index + 1;
        }
        var index = -1;
        for(var i = 0; i < model.gallery.length; ++i) {
          if(model.gallery[i].replace('http:', '').replace(/\//g, '') === results[0].replace('http:', '').replace(/\//g, '')) {
            index = i;
          }
        }
        if(index === -1) {
          navigator.notification.alert('Failed to scan QR code.', function() {}, 'Heart Gallery North Florida', 'OK');
        } else {
          density.pages.open(index + 1);
        }
      },
      error: function(err) {
        if(err !== "Canceled") {
          navigator.notification.alert(err, function() {}, 'Heart Gallery North Florida', 'OK');
        }
      }
    }
  };

  function bind() {
    $('#menu-open-button').on((window.cordova ? 'tap' : 'click'), density.menu.open);
    $('#camera-open-button').on((window.cordova ? 'tap' : 'click'), methods.camera.open);
    $('#gallery-list-home').on((window.cordova ? 'tap' : 'click'), function() { density.pages.open(0); density.menu.close(); });
    $('#gallery-list').on((window.cordova ? 'tap' : 'click'), '.menu-option', methods.open);
  };

  return {
    init: function() {
      methods.get(function() {
        density.init({ 'pageDir' : 'btot' });
        ko.applyBindings(model);
        bind();
        setTimeout(function() {
          navigator.splashscreen.hide();
        }, 1000);
      });
    }
  };
}(jQuery));
