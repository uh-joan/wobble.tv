'use strict';

/**
 * @ngdoc service
 * @name apiCakeApp.voteService
 * @description
 * # voteService
 * Service in the wobbleApp.
 */
angular.module('wobbleApp')
  .service('voteService', ['$http', '$q', 'domain', function ($http, $q, domain) {
    var vm = this;

    var _round = function(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.floor(value * multiplier) / multiplier;
    };

    vm.createVote = function(vote){
      var deferred = $q.defer();
      $http.post('/votes', {vote: vote}).then(function(response){
        deferred.resolve(response.data);
      }, function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

    vm.query = function(videoId, time, time_step){
      var deferred = $q.defer();

      $http.get('/amount/'+videoId+'/'+time_step+'/'+_round(time,0)).then(function(response){
        deferred.resolve(response.data);
      }, function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };
  //  all_amount/:video_id/:time_step/:total_time
    vm.query_all = function(videoId){
      var deferred = $q.defer();

      $http.get('/all_amount/'+videoId).then(function(response){
        deferred.resolve(response.data);
      }, function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

  }]
);
