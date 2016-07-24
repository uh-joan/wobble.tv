'use strict';

/**
 * @ngdoc function
 * @name wobbleApp.controller:initCtrl
 * @description
 * # initCtrl
 * Controller of the wobbleApp
 */
angular.module('wobbleApp')
  .controller('initCtrl', [ '$scope', '$state', 'videos', '$http', 'voteService',
    function ($scope, $state, videos, $http, voteService) {
      var vm = this;

      vm.toHHMMSS = function (sec_num) {
        //var sec_num = parseInt(this, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
      };
      vm.videos = videos;

      var videos_length = vm.videos.length;
      angular.forEach(vm.videos, function(video){
        var url = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBUvDNDd8KTf1KH9kLabpSUFgR_Cvl3XT0&part=snippet&id='+video.youtube_id;
        //console.log(JSON.stringify(video) + ' url: ' + url);
        var index = vm.videos.map(function(v) { return v.youtube_id; }).indexOf(video.youtube_id);

        $http.get(url).then(function(response){
          //console.log(JSON.stringify(response));
          //console.log('video_id: ' + video.youtube_id + ' title: ' + response.data.title);
          vm.videos[index].title=response.data.items[0].snippet.title;
        }, function(e){
          console.log(e);
        });

        voteService.query_all(video.youtube_id).then(function(res){
          var data = [];
          angular.forEach(res.data.intervals, function(v){
            data.push({votes: v.votes, time: vm.toHHMMSS(v.time), time_sec: v.time});
          });
          vm.videos[index].data=data;
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