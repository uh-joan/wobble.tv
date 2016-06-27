'use strict';

/**
 * @ngdoc service
 * @name apiCakeApp.apiService
 * @description
 * # apiService
 * Service in the apiCakeApp.
 */
angular.module('wobbleApp')
  .service('voteService', ['$http', '$q', function ($http, $q) {
    var vm = this;

    vm.createVote = function(vote){
      var deferred = $q.defer();
      $http.post('http://localhost:3000/votes', {vote: vote}).then(function(response){
        deferred.resolve(response.data);
      }, function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

    vm.query = function(videoId, time){
      var deferred = $q.defer();

      $http.get('http://localhost:3000/amount/'+videoId+'/'+time).then(function(response){
        deferred.resolve(response.data);
      }, function(e){
        deferred.reject(e);
      });
      return deferred.promise;
    };

  }]
);
