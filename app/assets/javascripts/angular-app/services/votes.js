'use strict';

/**
 * @ngdoc service
 * @name apiCakeApp.apiService
 * @description
 * # apiService
 * Service in the apiCakeApp.
 */
angular.module('wobbleApp')
  .service('voteService', ['$http', '$q', 'domain', function ($http, $q, domain) {
    var vm = this;

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

      $http.get('/amount/'+videoId+'/'+time_step+'/'+time).then(function(response){
        deferred.resolve(response.data);
      }, function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

  }]
);
