'use strict';

/**
 * @ngdoc function
 * @name wobbleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wobbleApp
 */
angular.module('wobbleApp')
  .controller('mainCtrl', [ '$scope', 'YT_event', 'voteService', '$timeout',function ($scope, YT_event, voteService, $timeout) {
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

    vm.data = [{votes:0, time:'00:00:00'}];
    //vm.tempData = [];
    vm.yt = {
      width: 480,
      height: 320,
      videoid: "L9dJWg4TtAY",
      playerStatus: "PLAYING",
      voteStatus : {},
      time: 0,
      votes: 0
    };

    vm.YT_event = YT_event;

    vm.sendControlEvent = function (ctrlEvent) {
      $scope.$broadcast(ctrlEvent);
    };

    $scope.$on('update-message', function(event, data) {
      //console.log('data: ' + JSON.stringify(data));
      vm.yt.playerStatus = data.data;
    });

    //voteService.query(vm.yt.videoid, vm.yt.time).then(function(response){
    //  console.log('votes ' + response.data);
    //  vm.yt.time = vm.yt.time + vm.yt.time_step;
    //});
    //vm.sendControlEvent(vm.YT_event.GET_TIME);
    vm.startInterval = function(){
      vm.intervalId = setInterval(function(){
        //console.log(' tick');
        vm.sendControlEvent(vm.YT_event.GET_TIME);
      },3000);
    };

    $scope.$on('get-time', function(event, data){
      //console.log('scope on get time ' + data.time);
      vm.yt.time = data.time;
      $scope.$apply(vm.yt.time);
    });

    $scope.$watch(function(){return vm.yt.time;}, function(newVal, oldVal){
      //console.log('time has changed');
    if(newVal!=oldVal){
    //  console.log('time: ' + newVal);
      voteService.query(vm.yt.videoid, newVal).then(function(response){
        vm.yt.votes = response.data;
          vm.data.push({votes: vm.yt.votes.up-vm.yt.votes.down, time: vm.toHHMMSS(newVal+3)});
        //console.log('data in watch: ' + JSON.stringify(vm.data));
        //console.log('at interval ' + newVal + 'sec. to ' + (newVal+3) + 'sec., votes ' + response.data);
        //vm.yt.time = vm.yt.time + vm.yt.time_step;
      });
    }
    }, true);

    $scope.$on('stop-video', function(event){
      clearInterval(vm.intervalId);
    });

    $scope.$on('play-video', function(event){
      vm.startInterval();
    });

    $scope.$on('pause-video', function(event){
      clearInterval(vm.intervalId);
    });

    $scope.$on('update-vote', function(event, data) {
      vm.yt.voteStatus = data;
    //  Vote {{vm.yt.voteStatus.action}} at {{vm.yt.voteStatus.time}}
      voteService.createVote({video_id: vm.yt.videoid, vote_stamp: vm.yt.voteStatus.time, action: vm.yt.voteStatus.action})
        .then(function(response){
        console.log(JSON.stringify(response));
      }, function(e){
        console.log(JSON.stringify(e));
      });
    });


  }
  ]);
