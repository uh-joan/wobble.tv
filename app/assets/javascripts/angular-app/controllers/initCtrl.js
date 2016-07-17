'use strict';

/**
 * @ngdoc function
 * @name wobbleApp.controller:initCtrl
 * @description
 * # initCtrl
 * Controller of the wobbleApp
 */
angular.module('wobbleApp')
  .controller('initCtrl', [ '$scope', '$state', 'videos', '$http',
    function ($scope, $state, videos, $http) {
      var vm = this;

      vm.videos = videos;

      var videos_length = vm.videos.length;
      angular.forEach(vm.videos, function(video){
        var url = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBUvDNDd8KTf1KH9kLabpSUFgR_Cvl3XT0&part=snippet&id='+video.youtube_id;
        //console.log(JSON.stringify(video) + ' url: ' + url);
        $http.get(url).then(function(response){
          //console.log(JSON.stringify(response));
          //console.log('video_id: ' + video.youtube_id + ' title: ' + response.data.title);
          var index = vm.videos.map(function(v) { return v.youtube_id; }).indexOf(video.youtube_id);
          vm.videos[index].title=response.data.items[0].snippet.title;
        }, function(e){
          console.log(e);
        });

      });

      // get info from
      // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyB4TAcqv-gIz54s70eM1Q6HtY48jDjJtbs&part=snippet&id=EO_nBlAT19Y


      vm.goToVideo = function(video){
        //console.log(JSON.stringify(video));
        $scope.$broadcast('load-new-video', {video_id: video.youtube_id});
      };

        $state.go('init.main');
    }
  ]);