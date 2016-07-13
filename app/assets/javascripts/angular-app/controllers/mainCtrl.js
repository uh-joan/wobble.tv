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
    vm.disableVote=false;

      // even number please
      var window_size = 20;

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
      vm.total_votes_copy=[];

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
          var v = {
            votes: vm.yt.votes.up-vm.yt.votes.down,
            time: vm.toHHMMSS(newVal+parseFloat(time_step)),
            time_sec: newVal+time_step
          };
          //console.log(JSON.stringify(v));
            //vm.data.push(v);
            vm.circle = v;
          //console.log('data in watch: ' + JSON.stringify(vm.data));
          //console.log('at interval ' + newVal + 'sec. to ' + (newVal+3) + 'sec., votes ' + response.data);
          //vm.yt.time = vm.yt.time + vm.yt.time_step;

          trimTotalVotes(window_size, newVal+parseFloat(time_step));
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
        vm.total_votes=[];
        var vote;
        angular.forEach(response.data.intervals, function(v){
          vm.total_votes.push({votes: v.votes, time: vm.toHHMMSS(v.time), time_sec: v.time});
        });
        vm.total_votes_copy=vm.total_votes;
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
      vm.disableVote = true;
      setTimeout(function(){
        vm.disableVote=false;
      }, 1000);
      vm.yt.voteStatus = data;
      console.log(vm.total_votes.length);
      
      //console.log('Vote :' + vm.yt.voteStatus.action + ' at ' + vm.yt.voteStatus.time);
      voteService.createVote({video_id: vm.yt.videoid, vote_stamp: vm.yt.voteStatus.time-1, action: vm.yt.voteStatus.action})
        .then(function(response){
        //console.log(JSON.stringify(response));
      }, function(e){
        //console.log(JSON.stringify(e));
      });

      addVoteToTotalVotes(vm.yt.voteStatus.time, vm.yt.voteStatus.action);
    });

      var addVoteToTotalVotes = function(time, action){
        var value=(action=='up')? 1:-1;

        var index=getIntervalIndex(time);
        //console.log('index: '+index + ' value: ' +JSON.stringify(vm.total_votes_copy[index-2]));
        //
        var num_votes = vm.total_votes_copy[index-2].votes;
        //console.log('circle: ' + JSON.stringify(vm.circle));
        vm.total_votes_copy[index-2].votes=num_votes+value;
        vm.circle.votes=vm.circle.votes+value;
      };

      var getIntervalIndex=function(time){
        var initial_time = 0.0;
        var final_time, index=0, found=false;
        angular.forEach(vm.total_votes_copy, function(vote){
          if (found!== true){
            final_time=parseFloat(vote.time_sec);
            //console.log('from: ' + initial_time + ' to: '+final_time);
            if (time>initial_time && time<=final_time){
              found=true;
            }
            initial_time = final_time;
            final_time=final_time+final_time;
            index=index+1;
          }
        });
        return index;
      };

      var trimTotalVotes = function(sec, actual_time){
        //console.log('time: '+actual_time);

        // ************
        // Make the windown to show less of the future time with this line
        // ************
        // now shows sec times in the future
        var half_window = sec/2;
        var index = getIntervalIndex(actual_time)+half_window;
        //console.log('index: ' + index);
        //index = (index>2) ? index-2:index;
        var new_total_votes = [];
        var i=0;
        while(index>0){
          if (i>actual_time-half_window){
            new_total_votes.push(vm.total_votes_copy[i]);
          }
          index--;
          i++;
        }
        //console.log('new total votes: ' + JSON.stringify(new_total_votes));
        vm.total_votes = new_total_votes;
      };

      vm.min = function(data){
        return d3.min(data, function(d) { return d.votes; })
      };

      vm.max = function(data){
        return d3.max(data, function(d) { return d.votes; })
      };

  }
  ]);
