'use strict';

/**
 * @ngdoc directive
 * @name wobbleApp.directive:youtube
 * @description
 * # youtube
 */
angular.module('wobbleApp')
  .directive('youtube', function($window, YT_event) {
    return {
      restrict: "E",

      scope: {
        height: "@",
        width: "@",
        videoid: "@"
      },

      template: '<div></div>',

      link: function(scope, element, attrs, $rootScope) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player;

        $window.onYouTubeIframeAPIReady = function() {
          player = new YT.Player(element.children()[0], {
            playerVars: {
              autoplay: 1,
              html5: 1,
              theme: "light",
              modesbranding: 0,
              color: "white",
              iv_load_policy: 3,
              showinfo: 1,
              controls: 1
            },

            height: scope.height,
            width: scope.width,
            videoId: scope.videoid,

            events: {
              'onStateChange': function(event) {

                var message = {
                  event: YT_event.STATUS_CHANGE,
                  data: ""
                };

                switch(event.data) {
                  case YT.PlayerState.PLAYING:
                    message.data = "PLAYING";
                    break;
                  case YT.PlayerState.ENDED:
                    message.data = "ENDED";
                    break;
                  case YT.PlayerState.UNSTARTED:
                    message.data = "NOT PLAYING";
                    break;
                  case YT.PlayerState.PAUSED:
                    message.data = "PAUSED";
                    break;
                }

                //console.log('message: ' + message.data);
                scope.$apply(function() {
                  scope.$emit('update-message', {event: message.event, data: message.data});
                });
              }
            }
          });
          //scope.$emit('get-time', {event: 'get-time', time: player.getCurrentTime()});
        };

        scope.$watch('height + width', function(newValue, oldValue) {
          if (newValue == oldValue) {
            return;
          }

          player.setSize(scope.width, scope.height);
        });

        scope.$watch('videoid', function(newValue, oldValue) {
          if (newValue == oldValue) {
            return;
          }

          player.cueVideoById(scope.videoid);

        });

        scope.$on(YT_event.STOP, function () {
          player.seekTo(0);
          player.stopVideo();
        });

        scope.$on(YT_event.PLAY, function () {
          player.playVideo();
        });

        scope.$on(YT_event.PAUSE, function () {
          player.pauseVideo();
        });

        scope.$on(YT_event.VOTE_UP, function(){
          scope.$emit('update-vote', {event: 'vote', 'action':'up', time: player.getCurrentTime()});
        });

        scope.$on(YT_event.VOTE_DOWN, function(){
          scope.$emit('update-vote', {event: 'vote', 'action':'down', time: player.getCurrentTime()});
        });

        scope.$on(YT_event.GET_TIME, function(){
          scope.$emit('get-time', {event: 'get-time', time: player.getCurrentTime()});
        });

      }
    };
  });