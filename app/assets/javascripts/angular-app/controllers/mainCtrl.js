'use strict';

/**
 * @ngdoc function
 * @name wobbleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the wobbleApp
 */
angular.module('wobbleApp')
  .controller('mainCtrl', [ '$scope', 'YT_event', 'voteService', '$timeout', 'time_step',
    function ($scope, YT_event, voteService, $timeout, time_step) {
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
      videoid: "EO_nBlAT19Y",
      playerStatus: "PLAYING",
      voteStatus : {},
      time: 0,
      votes: 0,
      duration: 0
    };
      vm.total_votes=[];

    vm.YT_event = YT_event;

    vm.sendControlEvent = function (ctrlEvent) {
      //console.log('sending: ' + ctrlEvent);
      $scope.$broadcast(ctrlEvent);
    };

      $scope.$on('update-message', function(event, data) {
      //console.log('data: ' + JSON.stringify(data));
      vm.yt.playerStatus = data.data;
    });

    vm.startInterval = function(){
      vm.intervalId = setInterval(function(){
        //console.log(' tick');
        vm.sendControlEvent(vm.YT_event.GET_TIME);
      },parseFloat(time_step)*1000);
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
        voteService.query(vm.yt.videoid, newVal.toString(), time_step).then(function(response){
          vm.yt.votes = response.data;
          var v = {votes: vm.yt.votes.up-vm.yt.votes.down, time: vm.toHHMMSS(newVal+parseFloat(time_step))};
          //console.log(JSON.stringify(v));
            //vm.data.push(v);
            vm.circle = v;
          //console.log('data in watch: ' + JSON.stringify(vm.data));
          //console.log('at interval ' + newVal + 'sec. to ' + (newVal+3) + 'sec., votes ' + response.data);
          //vm.yt.time = vm.yt.time + vm.yt.time_step;
        });
      }
    });



      //$scope.$watch(function(){return vm.yt.duration;}, function(newVal, oldVal){
      //  if(newVal!=oldVal){
      //    console.log('duration: ' + newVal);
      //  }
      //});

    $scope.$on('get-duration', function(event, data){
      vm.yt.duration = data.time;
      //console.log('duration: ' + data.time);

      //vm.total_votes= [{"votes":1,"time":"00:00:06"},{"votes":0,"time":"00:00:09"},{"votes":1,"time":"00:00:12"},{"votes":1,"time":"00:00:15"},{"votes":0,"time":"00:00:18"},{"votes":1,"time":"00:00:21"},{"votes":3,"time":"00:00:24"},{"votes":0,"time":"00:00:27"},{"votes":2,"time":"00:00:30"},{"votes":6,"time":"00:00:33"},{"votes":10,"time":"00:00:36"},{"votes":10,"time":"00:00:39"},{"votes":10,"time":"00:00:42"},{"votes":10,"time":"00:00:45"},{"votes":11,"time":"00:00:48"},{"votes":7,"time":"00:00:51"},{"votes":2,"time":"00:00:54"},{"votes":1,"time":"00:00:57"},{"votes":1,"time":"00:01:00"},{"votes":0,"time":"00:01:03"},{"votes":0,"time":"00:01:06"},{"votes":0,"time":"00:01:09"},{"votes":0,"time":"00:01:12"},{"votes":0,"time":"00:01:15"},{"votes":0,"time":"00:01:18"},{"votes":0,"time":"00:01:21"},{"votes":0,"time":"00:01:24"},{"votes":0,"time":"00:01:27"},{"votes":0,"time":"00:01:30"},{"votes":0,"time":"00:01:33"},{"votes":0,"time":"00:01:36"},{"votes":0,"time":"00:01:39"},{"votes":0,"time":"00:01:42"},{"votes":0,"time":"00:01:45"},{"votes":0,"time":"00:01:48"},{"votes":0,"time":"00:01:51"},{"votes":0,"time":"00:01:54"},{"votes":0,"time":"00:01:57"},{"votes":0,"time":"00:02:00"},{"votes":0,"time":"00:02:03"},{"votes":0,"time":"00:02:06"},{"votes":0,"time":"00:02:09"},{"votes":0,"time":"00:02:12"},{"votes":0,"time":"00:02:15"},{"votes":0,"time":"00:02:18"},{"votes":0,"time":"00:02:21"},{"votes":0,"time":"00:02:24"},{"votes":0,"time":"00:02:27"},{"votes":0,"time":"00:02:30"},{"votes":0,"time":"00:02:33"},{"votes":0,"time":"00:02:36"},{"votes":0,"time":"00:02:39"},{"votes":0,"time":"00:02:42"},{"votes":0,"time":"00:02:45"},{"votes":0,"time":"00:02:48"},{"votes":0,"time":"00:02:51"},{"votes":0,"time":"00:02:54"},{"votes":0,"time":"00:02:57"},{"votes":0,"time":"00:03:00"}]
      //vm.sendControlEvent(vm.YT_event.PLAY);

      voteService.query_all(vm.yt.videoid, vm.yt.duration.toString(), time_step).then(function(response){
          vm.sendControlEvent(vm.YT_event.PLAY);
        var vote;
        angular.forEach(response.data.intervals, function(v){
          vm.total_votes.push({votes: v.votes, time: vm.toHHMMSS(v.time)});
        });
        //console.log('total votes: ' + JSON.stringify(vm.total_votes));
      });

    });

    $scope.$on('stop-video', function(event){
      clearInterval(vm.intervalId);
    });

    $scope.$on('play-video', function(event){
      if (vm.yt.playerStatus !== 'PLAYING') {
        vm.startInterval();
      }
    });

    $scope.$on('pause-video', function(event){
      clearInterval(vm.intervalId);
    });

    $scope.$on('update-vote', function(event, data) {
      vm.yt.voteStatus = data;
    //  Vote {{vm.yt.voteStatus.action}} at {{vm.yt.voteStatus.time}}
      voteService.createVote({video_id: vm.yt.videoid, vote_stamp: vm.yt.voteStatus.time, action: vm.yt.voteStatus.action})
        .then(function(response){
        //console.log(JSON.stringify(response));
      }, function(e){
        //console.log(JSON.stringify(e));
      });
    });


  }
  ]);
